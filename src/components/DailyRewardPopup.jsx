import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoGiftOutline, IoClose } from "react-icons/io5";
import { RiVipCrown2Fill } from "react-icons/ri";
import { HiCheck, HiLockClosed } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { updateAvailableBalance } from "../redux/slices/userSlice";
import { showToast } from "../utils/ToastContent";
// import { claimDailyReward } from "../api";
// import { updateAvailableBalance } from "../redux/slices/userSlice";

const DAYS = [
  { day: 1, amount: 10 },
  { day: 2, amount: 15 },
  { day: 3, amount: 20 },
  { day: 4, amount: 30 },
  { day: 5, amount: 50 },
  { day: 6, amount: 75 },
  { day: 7, amount: 200, special: true },
];

function getStreakDay(createdAt) {
  if (!createdAt) return 1;
  const created = new Date(createdAt);
  const now = new Date();
  const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = todayDate - createdDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return (diffDays % 7) + 1;
}

// localStorage utils
function hasClaimedToday(userId) {
  if (!userId) return false;
  const raw = localStorage.getItem(`dailyClaimed_${userId}`);
  if (!raw) return false;
  const last = new Date(raw);
  const now = new Date();
  return (
    last.getFullYear() === now.getFullYear() &&
    last.getMonth() === now.getMonth() &&
    last.getDate() === now.getDate()
  );
}

function setClaimedToday(userId) {
  if (!userId) return;
  localStorage.setItem(`dailyClaimed_${userId}`, new Date().toISOString());
}

const DailyRewardPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.user?.userData);

  const userId = userData?._id;
  const TODAY = useMemo(() => getStreakDay(userData?.createdAt), [userData?.createdAt]);
  const alreadyClaimed = useMemo(() => hasClaimedToday(userId), [userId]);

  const [claimed, setClaimed] = useState(alreadyClaimed);
  const [loading, setLoading] = useState(false);

  const todayReward = DAYS.find((d) => d.day === TODAY);
const handleClaim = async () => {
  if (claimed) return;

  setLoading(true);

  try {
    // CLAIM AMOUNT
    const claimAmount = rewardAmount;

    // CURRENT BALANCE
    const currentBalance =
      Number(userData?.availableBalance || 0);

    // NEW BALANCE
    const updatedBalance =
      currentBalance + Number(claimAmount);

    // UPDATE REDUX
    dispatch(
      updateAvailableBalance(updatedBalance)
    );

    // SMALL ANIMATION DELAY
    await new Promise((r) =>
      setTimeout(r, 1000)
    );

    // SAVE CLAIM STATUS
    setClaimedToday(userId);

    setClaimed(true);

    // SUCCESS TOAST
    showToast.success(
      `₹${claimAmount} added successfully`
    );
  } catch (err) {
    console.error("Claim error:", err);

    showToast.error(
      "Failed to claim reward"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 360,
            background: "#07090f",
            borderRadius: 24,
            border: "1px solid rgba(251,191,36,0.2)",
            overflow: "hidden",
            position: "relative",
            margin: "auto",
          }}
        >
          {/* Glow top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 180,
            background: "radial-gradient(ellipse at 50% 0%, rgba(251,191,36,0.18), transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer", zIndex: 2,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <IoClose size={16} />
          </button>

          {/* Header */}
          <div style={{ padding: "28px 20px 20px", textAlign: "center", position: "relative" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20, margin: "0 auto 14px",
              background: "rgba(251,191,36,0.1)",
              border: "1px solid rgba(251,191,36,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <IoGiftOutline size={32} color="#fbbf24" />
            </div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(251,191,36,0.5)", margin: "0 0 4px" }}>
              DAILY REWARD
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Claim Your Bonus
            </h2>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>
              Come back every day to collect bigger rewards
            </p>

            {/* Streak pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 10, padding: "5px 12px", borderRadius: 50,
              background: "rgba(251,191,36,0.07)",
              border: "0.5px solid rgba(251,191,36,0.2)",
            }}>
              <span style={{ fontSize: 10, color: "rgba(251,191,36,0.5)", fontWeight: 700 }}>
                🔥 Day {TODAY} streak
              </span>
            </div>
          </div>

          {/* Day cards */}
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
              {DAYS.map(({ day, amount, special }) => {
                const isDone = day < TODAY || (day === TODAY && claimed);
                const isToday = day === TODAY && !claimed;

                return (
                  <div key={day} style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 3, padding: "8px 4px", borderRadius: 10,
                    border: `0.5px solid ${
                      isDone ? "rgba(34,197,94,0.2)"
                      : isToday ? "rgba(251,191,36,0.4)"
                      : special ? "rgba(251,191,36,0.2)"
                      : "rgba(255,255,255,0.07)"
                    }`,
                    background: isDone
                      ? "rgba(34,197,94,0.07)"
                      : isToday ? "rgba(251,191,36,0.1)"
                      : special ? "rgba(251,191,36,0.06)"
                      : "rgba(255,255,255,0.03)",
                  }}>
                    <span style={{
                      fontSize: 8, fontWeight: 700, letterSpacing: "0.08em",
                      color: isDone ? "rgba(74,222,128,0.5)" : isToday ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.25)"
                    }}>
                      Day {day}
                    </span>

                    {isDone ? (
                      <HiCheck size={14} color="#22c55e" />
                    ) : isToday ? null : special ? (
                      <RiVipCrown2Fill size={12} color={day > TODAY ? "rgba(251,191,36,0.4)" : "#fbbf24"} />
                    ) : (
                      <HiLockClosed size={12} color="rgba(255,255,255,0.25)" />
                    )}

                    <span style={{
                      fontSize: 10, fontWeight: 800,
                      color: isDone ? "#4ade80" : isToday ? "#fbbf24" : special ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.35)"
                    }}>
                      ₹{amount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's reward pill */}
          <div style={{ padding: "0 16px 8px" }}>
            <div style={{
              background: "rgba(34,197,94,0.06)",
              border: "0.5px solid rgba(34,197,94,0.2)",
              borderRadius: 12, padding: "10px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Today's reward</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#4ade80" }}>₹{todayReward?.amount}</span>
            </div>
          </div>

          {/* Claim button */}
          <div style={{ padding: "12px 16px 20px" }}>
            {!claimed ? (
              <button
                onClick={handleClaim}
                disabled={loading}
                style={{
                  width: "100%", height: 46, borderRadius: 14,
                  background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                  border: "none", color: "#07090f",
                  fontSize: 14, fontWeight: 900, letterSpacing: "0.05em",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "opacity 0.2s",
                }}
              >
                {loading ? (
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%",
                    border: "2px solid rgba(7,9,15,0.2)",
                    borderTopColor: "#07090f",
                    animation: "spin 0.7s linear infinite",
                  }} />
                ) : (
                  <>
                    <IoGiftOutline size={16} />
                    CLAIM ₹{todayReward?.amount}
                  </>
                )}
              </button>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  width: "100%", height: 46, borderRadius: 14,
                  background: "rgba(34,197,94,0.1)",
                  border: "0.5px solid rgba(34,197,94,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <HiCheck size={18} color="#22c55e" />
                <span style={{ fontSize: 14, fontWeight: 900, color: "#4ade80" }}>
                  {alreadyClaimed ? "Already Claimed Today!" : "Claimed!"}
                </span>
              </motion.div>
            )}
            <p style={{ textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)", margin: "10px 0 0", letterSpacing: "0.05em" }}>
              Resets daily at midnight · Don't miss a day!
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DailyRewardPopup;