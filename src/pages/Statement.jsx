import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { getAccountStatements } from "../api";
import { getUserId } from "../utils/helper/commonSelectors";

// ─── Constants (same as before) ───────────────────────────────────────────────
const LIMIT = 200;
const PAGE_SIZE = 10;
const FILTERS = ["All", "Deposit", "Withdraw"];

// ─── Helpers (same as before) ─────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, "0");

const getISTToday = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

const formatYYYYMMDD = (d) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);

const istDateToUTCZ = (dateStr, hour = 0, minute = 0, second = 0) => {
  if (!dateStr) return null;
  try {
    const iso = `${dateStr}T${pad(hour)}:${pad(minute)}:${pad(second)}+05:30`;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split(".")[0] + "Z";
  } catch {
    return null;
  }
};

const inr = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDate = (str) => {
  if (!str || str === "--") return "--";
  const dt = new Date(str);
  return (
    dt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      timeZone: "Asia/Kolkata",
    }) +
    " " +
    dt.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
  );
};

// ─── Reusable styled components ───────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <p
    style={{
      fontFamily: "'Rajdhani',sans-serif",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 2,
      color: "rgba(251,191,36,0.45)",
      marginBottom: 10,
    }}
  >
    {children}
  </p>
);

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "#fff",
  fontFamily: "'DM Sans',sans-serif",
  fontSize: 13,
  padding: "10px 14px",
  outline: "none",
  colorScheme: "dark",
  transition: "all 0.2s",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Statement({ sport, dataSource="Old Data" }) {
  const navigate = useNavigate();
  const loggedInUserId = useSelector(getUserId());

  const todayStr = getISTToday();
  const twoMonthsAgo = (() => {
    const d = new Date(todayStr + "T00:00:00");
    d.setMonth(d.getMonth() - 2);
    return formatYYYYMMDD(d);
  })();

  const [startDate, setStartDate] = useState(twoMonthsAgo);
  const [endDate, setEndDate] = useState(todayStr);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");

  const controllerRef = useRef(null);
  const latestRequestIdRef = useRef(0);
  const debounceTimerRef = useRef(null);
  const hasMountedRef = useRef(false);

  // ── dataSource date sync (same logic) ──────────────────────────────────────
  useEffect(() => {
    const today = getISTToday();
    if (dataSource === "Live Data") {
      setStartDate(today);
      setEndDate(today);
    } else if (dataSource === "Backup Data") {
      const d = new Date(today + "T00:00:00");
      d.setMonth(d.getMonth() - 3);
      setStartDate(formatYYYYMMDD(d));
      setEndDate(today);
    } else if (dataSource === "Old Data") {
      const d = new Date(today + "T00:00:00");
      d.setFullYear(d.getFullYear() - 1);
      setStartDate(formatYYYYMMDD(d));
      setEndDate(today);
    } else {
      const d = new Date(today + "T00:00:00");
      d.setMonth(d.getMonth() - 2);
      setStartDate(formatYYYYMMDD(d));
      setEndDate(today);
    }
  }, [dataSource]);

  // ── Fetch (same logic) ─────────────────────────────────────────────────────
  const getAccountSummary = useCallback(
    async (page = 1) => {
      const reqId = ++latestRequestIdRef.current;
      try {
        if (controllerRef.current) controllerRef.current.abort();
      } catch {}
      const controller = new AbortController();
      controllerRef.current = controller;
      setLoading(true);
      setError(null);
      try {
        const params = {
          filterby: "account",
          startDate: istDateToUTCZ(startDate, 0, 0, 0),
          endDate: istDateToUTCZ(endDate, 23, 59, 59),
          sport,
          page,
          limit: LIMIT,
        };
        const res = await getAccountStatements(params, {
          signal: controller.signal,
        });
        if (reqId !== latestRequestIdRef.current) return;
        const apiTx = res?.data?.transactions || res?.data || [];
        setTransactions(Array.isArray(apiTx) ? apiTx : []);
        const pagination = res?.data?.pagination || {};
        const total = pagination.total ?? apiTx.length ?? 0;
        setTotalEntries(total);
        setTotalPages(
          pagination.totalPages || Math.max(1, Math.ceil(total / PAGE_SIZE)),
        );
        setCurrentPage(pagination.page || page);
      } catch (err) {
        if (err?.name === "AbortError" || err?.message === "canceled") return;
        setError("Failed to fetch account statements.");
        setTransactions([]);
      } finally {
        if (reqId === latestRequestIdRef.current) setLoading(false);
        if (controllerRef.current === controller) controllerRef.current = null;
      }
    },
    [startDate, endDate, sport],
  );

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (dataSource === "") return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      setCurrentPage(1);
      getAccountSummary(1);
    }, 100);
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [startDate, endDate, sport, dataSource, getAccountSummary]);

  useEffect(() => {
    return () => {
      try {
        if (controllerRef.current) controllerRef.current.abort();
      } catch {}
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // ── Process (same logic) ───────────────────────────────────────────────────
  const processed = transactions.map((t) => {
    let deposit = 0,
      withdraw = 0,
      balance = "--",
      fromTo = "-";
    const dep = Number(t.deposit || 0);
    const wdr = Number(t.withdraw || 0);
    if (dep > 0) {
      if (loggedInUserId === t?.userId?._id) {
        withdraw = dep;
        balance = t.userBalance != null ? Number(t.userBalance) : null;
      } else {
        deposit = dep;
        balance = t.toUserBalance != null ? Number(t.toUserBalance) : null;
      }
    } else if (wdr > 0) {
      if (loggedInUserId === t?.userId?._id) {
        withdraw = wdr;
        balance = t.userBalance != null ? Number(t.userBalance) : null;
      } else {
        deposit = wdr;
        balance = t.toUserBalance != null ? Number(t.toUserBalance) : null;
      }
    }
    fromTo = `${t.userId?.userName || "Deleted"} → ${t.toUserId?.userName || "Deleted"}`;
    return {
      id: t._id || Math.random().toString(36).slice(2, 9),
      dateTime: t.createdAt || "--",
      deposit,
      withdraw,
      balance,
      remark: t.remark || "--",
      fromTo,
    };
  });

  const filtered = processed.filter((t) => {
    if (activeFilter === "Deposit") return t.deposit > 0;
    if (activeFilter === "Withdraw") return t.withdraw > 0;
    return true;
  });

  const clientTotalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, clientTotalPages);
  const pageSlice = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );
  const totalDep = filtered.reduce((s, t) => s + t.deposit, 0);
  const totalWdr = filtered.reduce((s, t) => s + t.withdraw, 0);
  const net = totalDep - totalWdr;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen px-4 pt-5 pb-32"
      style={{
        background: "linear-gradient(160deg,#0f0c03,#1a1505 50%,#0d0d0d)",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white/50 transition-colors"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
          }}
        >
          <IoArrowBack size={17} />
        </button>
        <span
          style={{
            fontFamily: "'Rajdhani',sans-serif",
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 2,
            color: "rgba(255,255,255,0.75)",
          }}
        >
          ACCOUNT STATEMENT
        </span>
        <div className="w-[34px]" />
      </div>

      {/* DATE FILTERS */}
      <div
        className="rounded-[16px] p-4 mb-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
        }}
      >
        <SectionLabel>DATE RANGE</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p
              style={{
                fontSize: 10,
                fontFamily: "'Rajdhani',sans-serif",
                fontWeight: 700,
                letterSpacing: 1,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 5,
              }}
            >
              FROM
            </p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <p
              style={{
                fontSize: 10,
                fontFamily: "'Rajdhani',sans-serif",
                fontWeight: 700,
                letterSpacing: 1,
                color: "rgba(255,255,255,0.35)",
                marginBottom: 5,
              }}
            >
              TO
            </p>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          {
            label: "Total Deposit",
            value: inr(totalDep),
            color: "#4ade80",
            bg: "rgba(34,197,94,0.08)",
            border: "rgba(34,197,94,0.2)",
          },
          {
            label: "Total Withdraw",
            value: inr(totalWdr),
            color: "#f87171",
            bg: "rgba(239,68,68,0.08)",
            border: "rgba(239,68,68,0.2)",
          },
          {
            label: "Net Balance",
            value: inr(Math.abs(net)),
            color: net >= 0 ? "#4ade80" : "#f87171",
            bg: "rgba(255,255,255,0.03)",
            border: "rgba(255,255,255,0.08)",
          },
          {
            label: "Transactions",
            value: filtered.length,
            color: "#fbbf24",
            bg: "rgba(251,191,36,0.06)",
            border: "rgba(251,191,36,0.2)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] p-3"
            style={{ background: s.bg, border: `0.5px solid ${s.border}` }}
          >
            <p
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: 4,
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontFamily: "'Rajdhani',sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: s.color,
              }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setActiveFilter(f);
              setCurrentPage(1);
            }}
            style={{
              fontFamily: "'Rajdhani',sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              padding: "6px 16px",
              borderRadius: 999,
              cursor: "pointer",
              transition: "all 0.15s",
              border: "none",
              background:
                activeFilter === f
                  ? "rgba(251,191,36,0.12)"
                  : "rgba(255,255,255,0.04)",
              border:
                activeFilter === f
                  ? "0.5px solid rgba(251,191,36,0.35)"
                  : "0.5px solid rgba(255,255,255,0.1)",
              color: activeFilter === f ? "#fbbf24" : "rgba(255,255,255,0.4)",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center py-10 gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{
              borderColor: "rgba(251,191,36,0.15)",
              borderTopColor: "#fbbf24",
            }}
          />
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Loading statements...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="flex flex-col items-center py-8 gap-2">
          <p
            style={{
              fontSize: 13,
              color: "#f87171",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {error}
          </p>
          <button
            onClick={() => getAccountSummary(1)}
            style={{
              fontFamily: "'Rajdhani',sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              color: "#fbbf24",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            RETRY
          </button>
        </div>
      )}

      {/* TABLE */}
      {!loading && !error && (
        <div
          className="rounded-[16px] overflow-hidden"
          style={{ border: "0.5px solid rgba(255,255,255,0.07)" }}
        >
          {/* Table header */}
          <div className="overflow-x-auto">
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 560,
              }}
            >
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                  {[
                    "#",
                    "Date & Time",
                    "Remark",
                 
                    "Deposit",
                    "Withdraw",
                    "Balance",
                  ].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        fontFamily: "'Rajdhani',sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        color: "rgba(251,191,36,0.5)",
                        padding: "10px 12px",
                        textAlign: i >= 4 ? "right" : "left",
                        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageSlice.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.25)",
                        padding: "24px",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    >
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  pageSlice.map((t, i) => {
                    const isD = t.deposit > 0;
                    const dotColor = isD ? "#4ade80" : "#f87171";
                    const isLast = i === pageSlice.length - 1;
                    return (
                      <tr
                        key={t.id}
                        style={{
                          borderBottom: isLast
                            ? "none"
                            : "0.5px solid rgba(255,255,255,0.04)",
                          background:
                            i % 2 === 0
                              ? "transparent"
                              : "rgba(255,255,255,0.01)",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.04)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            i % 2 === 0
                              ? "transparent"
                              : "rgba(255,255,255,0.01)")
                        }
                      >
                        {/* # */}
                        <td
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.25)",
                            padding: "10px 12px",
                            width: 36,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {(safePage - 1) * PAGE_SIZE + i + 1}
                        </td>
                        {/* Date */}
                        <td
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.5)",
                            padding: "10px 12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fmtDate(t.dateTime)}
                        </td>
                        {/* Remark */}
                        <td
                          style={{
                            fontSize: 12,
                            color: "rgba(255,255,255,0.8)",
                            padding: "10px 12px",
                            maxWidth: 140,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: dotColor,
                              marginRight: 7,
                              verticalAlign: "middle",
                              flexShrink: 0,
                            }}
                          />
                          {t.remark}
                        </td>
                       
                        {/* Deposit */}
                        <td
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "10px 12px",
                            textAlign: "right",
                            color:
                              t.deposit > 0
                                ? "#4ade80"
                                : "rgba(255,255,255,0.15)",
                            fontFamily: "'Rajdhani',sans-serif",
                          }}
                        >
                          {t.deposit > 0 ? inr(t.deposit) : "—"}
                        </td>
                        {/* Withdraw */}
                        <td
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "10px 12px",
                            textAlign: "right",
                            color:
                              t.withdraw > 0
                                ? "#f87171"
                                : "rgba(255,255,255,0.15)",
                            fontFamily: "'Rajdhani',sans-serif",
                          }}
                        >
                          {t.withdraw > 0 ? inr(t.withdraw) : "—"}
                        </td>
                        {/* Balance */}
                        <td
                          style={{
                            fontSize: 11,
                            color: "rgba(255,255,255,0.45)",
                            padding: "10px 12px",
                            textAlign: "right",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {t.balance != null ? inr(t.balance) : "--"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PAGINATION */}
      {!loading && clientTotalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Page {safePage} of {clientTotalPages} · {filtered.length} records
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center disabled:opacity-25 transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <IoChevronBack size={14} />
            </button>

            {Array.from({ length: Math.min(5, clientTotalPages) }, (_, i) => {
              let page;
              if (clientTotalPages <= 5) page = i + 1;
              else if (safePage <= 3) page = i + 1;
              else if (safePage >= clientTotalPages - 2)
                page = clientTotalPages - 4 + i;
              else page = safePage - 2 + i;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center transition-all"
                  style={{
                    background:
                      safePage === page
                        ? "rgba(251,191,36,0.15)"
                        : "rgba(255,255,255,0.04)",
                    border:
                      safePage === page
                        ? "0.5px solid rgba(251,191,36,0.4)"
                        : "0.5px solid rgba(255,255,255,0.08)",
                    color:
                      safePage === page ? "#fbbf24" : "rgba(255,255,255,0.4)",
                    fontFamily: "'Rajdhani',sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={safePage === clientTotalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center disabled:opacity-25 transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              <IoChevronForward size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
