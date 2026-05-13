import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoRefresh } from "react-icons/io5";
import { BsBank2, BsQrCode } from "react-icons/bs";
import { SiTether } from "react-icons/si";
import { FaDollarSign } from "react-icons/fa";
import { format } from "date-fns";
import PaymentGateway from "../components/PaymentGateway";
import { getactiveAdminDepositMethod, getPaymentsByUserId } from "../api";
import { getUserId } from "../utils/helper/commonSelectors";
import { showToast } from "../utils/ToastContent";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function Deposit() {
  const navigate = useNavigate();
  const userID = useSelector(getUserId());

  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);
  const [userPayment, setUserPayment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [quickAmt, setQuickAmt] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    account: [],
    gpay: [],
    usdt: [],
  });

  const allPayments = [
    ...paymentDetails.account.map((i) => ({ ...i, method: "bank" })),
    ...paymentDetails.gpay.map((i) => ({ ...i, method: "qr" })),
    ...paymentDetails.usdt.map((i) => ({ ...i, method: "usdt" })),
  ];

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const res = await getPaymentsByUserId(userID);
      setUserPayment(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayment(); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getactiveAdminDepositMethod();
        setPaymentDetails({
          account: res?.data?.filter((a) => a.type === "bank") || [],
          gpay: res?.data?.filter((a) => a.type === "qr") || [],
          usdt: res?.data?.filter((a) => a.type === "usdt") || [],
        });
      } catch {
        showToast.error("Failed to fetch payment details");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = () => {
    if (!selectedPayment) return showToast.error("Please select a payment method");
    const amt = Number(amount);
    if (!amt || isNaN(amt)) return showToast.error("Please enter a valid amount");
    const min = Number(selectedPayment.minAmount);
    const max = Number(selectedPayment.maxAmount);
    const sym = selectedPayment.method === "usdt" ? "$" : "₹";
    if (amt < min) return showToast.error(`Minimum deposit is ${sym}${min}`);
    if (amt > max) return showToast.error(`Maximum deposit is ${sym}${max}`);
    setOpen(true);
  };

  const methodIcon = (method) => {
    if (method === "qr") return <BsQrCode size={18} />;
    if (method === "bank") return <BsBank2 size={18} />;
    return <SiTether size={18} />;
  };

  const methodTitle = (method) => {
    if (method === "qr") return "UPI / GPay";
    if (method === "bank") return "Bank Transfer";
    return "USDT";
  };

  const statusStyle = (status) => {
    if (status === "accepted") return { bg: "rgba(34,197,94,0.12)", color: "#4ade80" };
    if (status === "pending") return { bg: "rgba(251,191,36,0.12)", color: "#fbbf24" };
    return { bg: "rgba(239,68,68,0.12)", color: "#f87171" };
  };

  const dotColor = (status) => {
    if (status === "accepted") return "#4ade80";
    if (status === "pending") return "#fbbf24";
    return "#f87171";
  };

  return (
    <div
      className="min-h-screen px-4 pt-5 pb-32"
      style={{ background: "linear-gradient(160deg,#0f0c03,#1a1505 50%,#0d0d0d)" }}
    >
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white/50 transition-colors"
          style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)" }}
        >
          <IoArrowBack size={17} />
        </button>
        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.75)" }}>
          DEPOSIT
        </span>
        <div className="w-[34px]" />
      </div>

      {!open ? (
        <>
          {/* ── AMOUNT ── */}
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(251,191,36,0.45)", marginBottom: 10 }}>
            ENTER AMOUNT
          </p>
          <div
            className="rounded-[16px] p-4 mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)" }}
          >
            <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(251,191,36,0.45)", marginBottom: 8 }}>
              AMOUNT (INR)
            </p>
            <input
              type="number"
              placeholder="Enter deposit amount"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setQuickAmt(null); }}
              className="w-full rounded-[12px] px-4 py-3 text-white text-[16px] font-medium outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                fontFamily: "'DM Sans',sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(251,191,36,0.4)";
                e.target.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.07)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.boxShadow = "none";
              }}
            />
            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  onClick={() => { setAmount(String(q)); setQuickAmt(q); }}
                  className="px-3.5 py-1.5 rounded-full transition-all"
                  style={{
                    fontFamily: "'Rajdhani',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    background: quickAmt === q ? "rgba(251,191,36,0.15)" : "rgba(251,191,36,0.07)",
                    border: quickAmt === q ? "0.5px solid rgba(251,191,36,0.4)" : "0.5px solid rgba(251,191,36,0.2)",
                    color: "#fbbf24",
                  }}
                >
                  ₹{q.toLocaleString("en-IN")}
                </button>
              ))}
            </div>
          </div>

          {/* ── PAYMENT METHODS ── */}
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(251,191,36,0.45)", marginBottom: 10 }}>
            PAYMENT METHOD
          </p>
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {allPayments.map((item, i) => {
              const isSelected = selectedPayment?._id === item._id;
              return (
                <div
                  key={item._id || i}
                  onClick={() => setSelectedPayment(item)}
                  className="relative rounded-[14px] p-3 flex flex-col items-center gap-2 cursor-pointer transition-all"
                  style={{
                    background: isSelected ? "rgba(251,191,36,0.07)" : "rgba(255,255,255,0.03)",
                    border: isSelected ? "0.5px solid rgba(251,191,36,0.45)" : "0.5px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {isSelected && (
                    <span
                      className="absolute top-1.5 right-1.5"
                      style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#fbbf24", background: "rgba(251,191,36,0.15)", padding: "2px 6px", borderRadius: 20 }}
                    >
                      ✓ SELECTED
                    </span>
                  )}
                  <div
                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isSelected ? "rgba(251,191,36,0.18)" : "rgba(255,255,255,0.06)",
                      color: isSelected ? "#fbbf24" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {methodIcon(item.method)}
                  </div>
                  <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", textAlign: "center" }}>
                    {methodTitle(item.method)}
                  </p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.4 }}>
                    {item.method === "usdt" ? (
                      <>Min ${item.minAmount}<br />Max ${item.maxAmount}</>
                    ) : (
                      <>Min ₹{item.minAmount}<br />Max ₹{item.maxAmount}</>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── SUBMIT ── */}
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-[14px] mb-6 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)",
              color: "#1c1003",
              fontFamily: "'Rajdhani',sans-serif",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 2,
              boxShadow: "0 6px 24px rgba(251,191,36,0.3)",
              border: "none",
            }}
          >
            <i className="ti ti-arrow-up-circle" style={{ fontSize: 18 }} />
            PROCEED TO PAY
          </button>

          {/* ── TRANSACTION HISTORY ── */}
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(251,191,36,0.45)", marginBottom: 10 }}>
            TRANSACTION HISTORY
          </p>
          <div
            className="rounded-[16px] overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}
            >
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, color: "rgba(255,255,255,0.7)" }}>
                RECENT DEPOSITS
              </span>
              <button
                onClick={fetchPayment}
                className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-white/40 transition-colors hover:text-white/70"
                style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)" }}
              >
                <IoRefresh size={15} />
              </button>
            </div>

            {/* Rows */}
            {loading ? (
              <div className="p-6 text-center text-white/30" style={{ fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
                Loading...
              </div>
            ) : userPayment.length === 0 ? (
              <div className="p-6 text-center text-white/25" style={{ fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
                No transactions found
              </div>
            ) : (
              [...userPayment].reverse().map((e, i) => {
                const s = statusStyle(e?.status);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 transition-colors"
                    style={{ borderBottom: i < userPayment.length - 1 ? "0.5px solid rgba(255,255,255,0.04)" : "none" }}
                  >
                    <div className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: dotColor(e?.status) }} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        UTR: {e?.UTR || "—"}
                      </p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>
                        {e?.createdAt ? format(new Date(e.createdAt), "dd MMM yyyy · hh:mm a") : "—"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, fontWeight: 700, color: "#fbbf24" }}>
                        ₹{parseFloat(e?.amount).toLocaleString("en-IN")}
                      </p>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "'Rajdhani',sans-serif",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 20,
                          letterSpacing: 0.5,
                          background: s.bg,
                          color: s.color,
                          display: "inline-block",
                          marginTop: 2,
                        }}
                      >
                        {e?.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <PaymentGateway
          amount={amount}
          open={open}
          toggle={() => setOpen(false)}
          fetchTransactions={fetchPayment}
          paymentDetails={paymentDetails}
          selectedPayment={selectedPayment}
        />
      )}
    </div>
  );
}