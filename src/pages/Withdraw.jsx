import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoCopy, IoTrash, IoAdd, IoWallet } from "react-icons/io5";
import { PiHandWithdrawFill } from "react-icons/pi";
import { toast } from "react-toastify";
import {
  getUserData, getUserId, selectDomainID, selectUserAvailableBalance,
} from "../utils/helper/commonSelectors";
import {
  createAccount, getAllAccounts, deleteAccount,
  createwithdraw, getwithdrawals,
} from "../api/index";

// ─── Reusable Input ───────────────────────────────────────────────────────────
function SheetInput({ type = "text", placeholder, value, onChange, name }) {
  return (
    <input
      type={type} name={name} placeholder={placeholder}
      value={value} onChange={onChange}
      className="w-full rounded-[12px] px-4 py-3 text-white text-[14px] outline-none mb-3 transition-all"
      style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", fontFamily: "'DM Sans',sans-serif" }}
      onFocus={(e) => { e.target.style.borderColor = "rgba(251,191,36,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.07)"; }}
      onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
    />
  );
}

// ─── Bottom Sheet ─────────────────────────────────────────────────────────────
function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-[9999]"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-t-[24px] px-4 pt-4 pb-8"
        style={{ background: "#131008", borderTop: "0.5px solid rgba(251,191,36,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[40px] h-[4px] rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }} />
        <p className="text-center mb-5" style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.85)" }}>
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Withdraw = () => {
  const navigate = useNavigate();
  const userId = useSelector(getUserId());
  const domainId = useSelector(selectDomainID());
  const admindomainId = useSelector((s) => s?.site?.siteDetails?.admindomainName?._id);
  const userData = useSelector(getUserData())
  const UserMobileNo = userData?.mobile;
  const userAvailableBalance = useSelector(selectUserAvailableBalance()) || 0;
  const userExposure = userData?.exposure || 0;

  const [activeTab, setActiveTab] = useState("accounts");
  const [amounts, setAmounts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showPwSheet, setShowPwSheet] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [password, setPassword] = useState("");

  const [formData, setFormData] = useState({
    accountType: "", accountHolderName: "", accountNumber: "",
    ifscCode: "", withdrawPassword: "",
    mobileNo: UserMobileNo || "", domainId: domainId || "", userId: userId || "",
  });

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllAccounts();
      setAccounts(Array.isArray(res) ? res : res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch accounts");
    } finally { setLoading(false); }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getwithdrawals(userId);
      setTransactions(Array.isArray(res) ? res : res.data?.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch transactions");
    } finally { setLoading(false); }
  }, [userId]);

  useEffect(() => { fetchAccounts(); fetchTransactions(); }, [fetchAccounts, fetchTransactions]);

  const handleSaveAccount = async () => {
    try {
      setLoading(true);
      const res = await createAccount({ ...formData, domainId, userId });
      if (res?.success) {
        toast.success("Account added successfully");
        setShowAddSheet(false);
        setFormData({ accountType: "", accountHolderName: "", accountNumber: "", ifscCode: "", withdrawPassword: "", mobileNo: UserMobileNo || "", domainId: domainId || "", userId: userId || "" });
        fetchAccounts();
      } else throw new Error(res?.data?.message || "Failed");
    } catch (err) { toast.error(err.response?.data?.message || err.message); }
    finally { setLoading(false); }
  };

  const handleDeleteAccount = async (id) => {
    try {
      setLoading(true);
      const res = await deleteAccount(id);
      if (res?.success) { setAccounts((p) => p.filter((a) => a._id !== id)); toast.success("Account deleted"); }
      else toast.error(res?.data?.message || "Failed to delete");
    } catch (err) { toast.error(err.response?.data?.message || "Failed to delete"); }
    finally { setLoading(false); }
  };

  const handleWithdraw = (accountId) => {
    const amt = amounts.find((i) => i.accountID === accountId)?.amount;
    if (!amt || userAvailableBalance < amt) {
      toast.error("Insufficient balance or invalid amount");
      return;
    }
    setSelectedAccountId(accountId);
    setShowPwSheet(true);
  };

  const handleSubmitWithdraw = async () => {
    try {
      setLoading(true);
      const withdrawAmount = amounts.find((i) => i.accountID === selectedAccountId)?.amount;
      if (!withdrawAmount) throw new Error("No amount specified");
      const res = await createwithdraw({
        UTR: crypto.randomUUID(), accountId: selectedAccountId,
        withdrawAmount, userId, domainId: admindomainId, withdrawPassword: password,
      });
      if (res?.success) {
        toast.success("Withdrawal request submitted");
        setShowPwSheet(false); setPassword("");
        setAmounts((p) => p.filter((i) => i.accountID !== selectedAccountId));
        fetchTransactions();
      } else throw new Error(res?.data?.message || "Failed");
    } catch (err) { toast.error(err.response?.data?.message || err.message); }
    finally { setLoading(false); }
  };

  const handleCopy = (text) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

  const statusStyle = (s) => {
    if (s === "Accepted") return { bg: "rgba(34,197,94,0.12)", color: "#4ade80" };
    if (s === "Rejected") return { bg: "rgba(239,68,68,0.12)", color: "#f87171" };
    return { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" };
  };

  const CopyBtn = ({ text }) => (
    <button onClick={() => handleCopy(text)}
      className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(34,197,94,0.1)", border: "0.5px solid rgba(34,197,94,0.2)", color: "#4ade80" }}>
      <IoCopy size={12} />
    </button>
  );

  return (
    <div className="min-h-screen px-4 pt-5 pb-32"
      style={{ background: "linear-gradient(160deg,#0f0c03,#1a1505 50%,#0d0d0d)" }}>

      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(-1)}
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white/50"
          style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
          <IoArrowBack size={17} />
        </button>
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.75)" }}>
          WITHDRAW
        </span>
        <div className="w-[34px]" />
      </div>

      {/* BALANCE CARD */}
      <div className="rounded-[16px] p-4 mb-4 flex items-center justify-between"
        style={{ background: "rgba(251,191,36,0.06)", border: "0.5px solid rgba(251,191,36,0.2)" }}>
        <div>
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(251,191,36,0.5)", marginBottom: 4 }}>
            AVAILABLE BALANCE
          </p>
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, fontWeight: 700, color: "#fbbf24" }}>
            ₹{Number(userAvailableBalance).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center"
          style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
          <IoWallet size={22} />
        </div>
      </div>

      {/* ADD ACCOUNT BTN */}
      <button onClick={() => setShowAddSheet(true)}
        className="w-full rounded-[14px] px-4 py-3 flex items-center justify-between mb-4 transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.65)" }}>
          + ADD BANK / UPI ACCOUNT
        </span>
        <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center"
          style={{ background: "rgba(251,191,36,0.12)", border: "0.5px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}>
          <IoAdd size={16} />
        </div>
      </button>

      {/* TABS */}
      <div className="flex rounded-[12px] overflow-hidden mb-4"
        style={{ border: "0.5px solid rgba(255,255,255,0.08)" }}>
        {["accounts", "transactions"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-3 transition-all"
            style={{
              fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700,
              letterSpacing: 1, border: "none", cursor: "pointer",
              background: activeTab === tab ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.03)",
              color: activeTab === tab ? "#fbbf24" : "rgba(255,255,255,0.35)",
              borderBottom: activeTab === tab ? "1.5px solid #fbbf24" : "none",
            }}>
            {tab === "accounts" ? `ACCOUNTS (${accounts.length})` : `TRANSACTIONS (${transactions.length})`}
          </button>
        ))}
      </div>

      {/* ── TAB: ACCOUNTS ── */}
      {activeTab === "accounts" && (
        <>
          {loading && (
            <p className="text-center py-8" style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
              Loading accounts...
            </p>
          )}
          {!loading && accounts.length === 0 && (
            <div className="flex flex-col items-center py-10 gap-3">
              <div className="w-[56px] h-[56px] rounded-[16px] flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <PiHandWithdrawFill size={26} color="rgba(255,255,255,0.25)" />
              </div>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>No accounts added yet</p>
              <button onClick={() => setShowAddSheet(true)}
                className="px-5 py-2 rounded-[10px] transition-all"
                style={{ background: "rgba(251,191,36,0.1)", border: "0.5px solid rgba(251,191,36,0.25)", fontFamily: "'Rajdhani',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 1, color: "#fbbf24" }}>
                + ADD ACCOUNT
              </button>
            </div>
          )}

          {accounts.map((acc) => {
            const isUPI = acc.accountType === "UPI";
            const myAmt = amounts.find((i) => i.accountID === acc._id)?.amount || "";
            return (
              <div key={acc._id} className="rounded-[16px] p-4 mb-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)" }}>

                {/* Top */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full"
                    style={{
                      fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1,
                      background: isUPI ? "rgba(34,197,94,0.12)" : "rgba(59,130,246,0.12)",
                      color: isUPI ? "#4ade80" : "#60a5fa",
                      border: `0.5px solid ${isUPI ? "rgba(34,197,94,0.25)" : "rgba(59,130,246,0.25)"}`,
                    }}>
                    {isUPI ? "UPI" : "BANK ACCOUNT"}
                  </span>
                  <button onClick={() => handleDeleteAccount(acc._id)}
                    className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center transition-all"
                    style={{ background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                    <IoTrash size={13} />
                  </button>
                </div>

                <p className="mb-3" style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                  {acc.accountHolderName}
                </p>

                {/* Info rows */}
                {isUPI ? (
                  <div className="flex items-center justify-between px-3 py-2 rounded-[10px] mb-2"
                    style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.35)" }}>UPI ID</p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans',sans-serif" }}>{acc.accountNumber}</p>
                    </div>
                    <CopyBtn text={acc.accountNumber} />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-3 py-2 rounded-[10px] mb-2"
                      style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                      <div>
                        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.35)" }}>ACCOUNT NO.</p>
                        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans',sans-serif" }}>
                          {acc.accountNumber?.replace(/.(?=.{4})/g, "•")}
                        </p>
                      </div>
                      <CopyBtn text={acc.accountNumber} />
                    </div>
                    {acc.ifscCode && (
                      <div className="flex items-center justify-between px-3 py-2 rounded-[10px] mb-2"
                        style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                        <div>
                          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.35)" }}>IFSC</p>
                          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans',sans-serif" }}>{acc.ifscCode}</p>
                        </div>
                        <CopyBtn text={acc.ifscCode} />
                      </div>
                    )}
                  </>
                )}

                {/* Amount input */}
                <input type="number" placeholder="Enter withdraw amount"
                  value={myAmt}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val > userAvailableBalance - userExposure) return;
                    setAmounts((p) => {
                      const ex = p.find((i) => i.accountID === acc._id);
                      if (ex) return p.map((i) => i.accountID === acc._id ? { ...i, amount: val } : i);
                      return [...p, { accountID: acc._id, amount: val }];
                    });
                  }}
                  className="w-full rounded-[12px] px-4 py-3 text-white outline-none my-3"
                  style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(251,191,36,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.07)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
                />

                <button onClick={() => handleWithdraw(acc._id)} disabled={loading}
                  className="w-full py-3 rounded-[12px] transition-all active:scale-[0.98] disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg,#d97706,#fbbf24)",
                    color: "#1c1003", fontFamily: "'Rajdhani',sans-serif",
                    fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
                    border: "none", cursor: loading ? "not-allowed" : "pointer",
                  }}>
                  {loading ? "PROCESSING..." : "WITHDRAW"}
                </button>
              </div>
            );
          })}

          <p className="text-center mt-3 text-sm" style={{ color: "rgba(251,113,36,0.8)", fontFamily: "'DM Sans',sans-serif" }}>
            <b>NOTE:</b> Withdrawal amount must be ≤ available balance.
          </p>
        </>
      )}

      {/* ── TAB: TRANSACTIONS ── */}
      {activeTab === "transactions" && (
        <>
          {transactions.length === 0 ? (
            <p className="text-center py-10" style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>
              No transactions found
            </p>
          ) : (
            <div className="rounded-[16px] overflow-hidden px-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
              {[...transactions].reverse().map((tx, i) => {
                const s = statusStyle(tx.status);
                return (
                  <div key={i} className="flex items-center gap-3 py-3"
                    style={{ borderBottom: i < transactions.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: s.color }} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                        {tx.accountId?.accountHolderName?.slice(-5)}–{tx.accountId?.accountNumber?.slice(-4) || "N/A"}
                      </p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, color: "#fbbf24" }}>
                        ₹{Number(tx.withdrawAmount).toLocaleString("en-IN")}
                      </p>
                      <span style={{ fontSize: 10, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: s.bg, color: s.color, display: "inline-block", marginTop: 2 }}>
                        {(tx.status || "PENDING").toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── ADD ACCOUNT SHEET ── */}
      <BottomSheet open={showAddSheet} onClose={() => setShowAddSheet(false)} title="ADD ACCOUNT">
        <select value={formData.accountType} onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
          className="w-full rounded-[12px] px-4 py-3 mb-3 outline-none"
          style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, appearance: "none" }}>
          <option value="">— Select Account Type —</option>
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
          <option value="UPI">UPI</option>
        </select>
        <SheetInput placeholder="Account Holder Name" name="accountHolderName" value={formData.accountHolderName} onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })} />
        <SheetInput placeholder={formData.accountType === "UPI" ? "UPI ID (example@upi)" : "Account Number"} name="accountNumber" value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
        {formData.accountType !== "UPI" && (
          <SheetInput placeholder="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })} />
        )}
        <SheetInput type="password" placeholder="Withdrawal Password" name="withdrawPassword" value={formData.withdrawPassword} onChange={(e) => setFormData({ ...formData, withdrawPassword: e.target.value })} />
        <button onClick={handleSaveAccount} disabled={loading}
          className="w-full py-3.5 rounded-[14px] mt-2 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#d97706,#fbbf24)", color: "#1c1003", fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2, border: "none" }}>
          {loading ? "SAVING..." : "SAVE ACCOUNT"}
        </button>
      </BottomSheet>

      {/* ── WITHDRAW PASSWORD SHEET ── */}
      <BottomSheet open={showPwSheet} onClose={() => { setShowPwSheet(false); setPassword(""); }} title="CONFIRM WITHDRAWAL">
        <div className="text-center mb-5">
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 30, fontWeight: 700, color: "#fbbf24" }}>
            ₹{Number(amounts.find((i) => i.accountID === selectedAccountId)?.amount || 0).toLocaleString("en-IN")}
          </p>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>
            {accounts.find((a) => a._id === selectedAccountId)?.accountHolderName || ""}
          </p>
        </div>
        <SheetInput type="password" placeholder="Enter withdrawal password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSubmitWithdraw} disabled={loading || !password}
          className="w-full py-3.5 rounded-[14px] mt-2 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#d97706,#fbbf24)", color: "#1c1003", fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2, border: "none" }}>
          {loading ? "PROCESSING..." : "CONFIRM WITHDRAWAL"}
        </button>
      </BottomSheet>
    </div>
  );
};

export default Withdraw;