import { useCallback, useEffect, useRef, useState } from "react";
import { getSettledBets } from "../api";

const LIMIT = 100;

const STATUS_COLOR = {
  win: "#4ade80",
  loss: "#f87171",
  live: "#fbbf24",
};

const TABS = ["All", "Won", "Lost"];

// ── helpers ──────────────────────────────────────────────────────────────────
function getISTToday() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function formatYYYYMMDD(date) {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

function istDateToUTCZ(dateStr, h, m, s) {
  const ist = new Date(
    `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}+05:30`
  );
  return ist.toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
export default function BetHistory({ sport, betStatus }) {
  const [activeTab, setActiveTab] = useState("All");
  const [betHistory, setBetHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const latestRequestIdRef = useRef(0);
  const controllerRef = useRef(null);

  // Auto last 1 month — no date picker
  const endDate = getISTToday();
  const startDate = (() => {
    const d = new Date(endDate + "T00:00:00");
    d.setMonth(d.getMonth() - 1);
    return formatYYYYMMDD(d);
  })();

  const fetchSettledBets = useCallback(
    async (opts = {}) => {
      const page = opts.page || 1;
      const reqId = ++latestRequestIdRef.current;

      if (controllerRef.current) controllerRef.current.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const params = {
          sportId: sport,
          startDate: istDateToUTCZ(startDate, 0, 0, 0),
          endDate: istDateToUTCZ(endDate, 23, 59, 59),
          betStatus,
          page,
          limit: LIMIT,
        };

        const res = await getSettledBets(params, { signal: controller.signal });

        if (reqId !== latestRequestIdRef.current) return;

        if (res?.success || res?.data) {
          const bets = res?.data?.data || [];
          const pagination = res?.data?.pagination || res?.pagination;

          setBetHistory(
            bets.map((bet) => {
              const status = bet.betStatus; // "win" | "loss"
           const displayAmount =
  status === "win"
    ? `+₹${Number(
        bet.favourMargin || 0
      ).toFixed(2)}`
    : `-₹${Number(
        bet.againstMargin || 0
      ).toFixed(2)}`;

              return {
                id: bet._id,
                sportsName: bet.sportsName || "-",
                event: bet.event || "-",
                market: bet.market || "-",
                selection: bet.selection || "-",
                type: bet.type || "-",
                oddsReq: bet.oddsReq ?? "-",
                stake: bet.stake ?? 0,
                createdAt: bet.createdAt || "-",
                status,
                amount: displayAmount,
              };
            })
          );

          if (pagination) {
            setTotalPages(pagination.totalPages || 1);
            setTotalRecords(pagination.total || 0);
            if (opts.page) setCurrentPage(pagination.page || opts.page);
          }
        } else {
          setBetHistory([]);
          setError("No bets found");
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("Failed to load bets");
        setBetHistory([]);
      } finally {
        if (reqId === latestRequestIdRef.current) setLoading(false);
      }
    },
    [sport, betStatus, startDate, endDate] // currentPage NOT in deps
  );

  useEffect(() => {
    fetchSettledBets({ page: 1 });
  }, [fetchSettledBets]);

  // ── tab filter ────────────────────────────────────────────────────────────
  const filtered = betHistory.filter((b) => {
    if (activeTab === "Won") return b.status === "win";
    if (activeTab === "Lost") return b.status === "loss";
    return true;
  });

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="mb-6">
      <p className="font-rajdhani text-[11px] font-bold tracking-[2px] text-yellow-500/40 mb-2.5 pl-0.5">
        BET HISTORY
      </p>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="font-rajdhani text-[12px] font-bold tracking-[1px] px-3.5 py-1.5 rounded-full transition-all"
            style={
              activeTab === tab
                ? {
                    background: "rgba(251,191,36,0.12)",
                    border: "0.5px solid rgba(251,191,36,0.3)",
                    color: "#fbbf24",
                  }
                : {
                    background: "rgba(255,255,255,0.03)",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.35)",
                  }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && (
        <p className="text-white/30 text-[12px] text-center py-6">Loading…</p>
      )}
      {!loading && error && (
        <p className="text-red-400/60 text-[12px] text-center py-6">{error}</p>
      )}

      {/* Bet Cards */}
      {!loading && !error && (
        <div className="flex flex-col gap-2">
          {filtered.map((bet) => (
            <div
              key={bet.id}
              className="flex items-center gap-3 rounded-[14px] px-3.5 py-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: STATUS_COLOR[bet.status] ?? "#888" }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-rajdhani text-[13px] font-bold text-white/85 truncate">
                  {bet.event}
                </p>
                <p className="text-[11px] text-white/30 mt-0.5 truncate">
                  {bet.sportsName} · {bet.market}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className="font-rajdhani text-[14px] font-bold"
                  style={{ color: STATUS_COLOR[bet.status] ?? "#888" }}
                >
           {bet.amount}
                </p>
                <p
                  className="text-[11px] mt-0.5"
                  style={{ color: `#f87171` }}
                >
                  ₹{bet.stake}
                </p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-white/20 text-[12px] text-center py-6">
              No bets found
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => fetchSettledBets({ page: currentPage - 1 })}
            className="text-[11px] text-white/40 disabled:opacity-20 px-3 py-1 rounded-full"
            style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}
          >
            ← Prev
          </button>
          <span className="text-[11px] text-white/30 self-center">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => fetchSettledBets({ page: currentPage + 1 })}
            className="text-[11px] text-white/40 disabled:opacity-20 px-3 py-1 rounded-full"
            style={{ border: "0.5px solid rgba(255,255,255,0.1)" }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}