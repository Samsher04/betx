import { useState } from "react";

const BETS = [
  { id: 1, match: "India vs Australia", meta: "Cricket · Match Winner · 2h ago", amount: "+₹1,800", stake: "₹1,000", status: "won" },
  { id: 2, match: "Mumbai City FC vs Bengaluru FC", meta: "Football · Over 2.5 · 5h ago", amount: "-₹500", stake: "₹500", status: "lost" },
  { id: 3, match: "CSK vs RCB", meta: "Cricket · Top Batsman · Running", amount: "₹2,000", stake: "Live", status: "live" },
  { id: 4, match: "RR vs KKR", meta: "Cricket · Match Winner · Yesterday", amount: "+₹3,200", stake: "₹2,000", status: "won" },
  { id: 5, match: "Man City vs Arsenal", meta: "Football · Asian Handicap · Yesterday", amount: "-₹750", stake: "₹750", status: "lost" },
];

const STATUS_COLOR = {
  won: "#4ade80",
  lost: "#f87171",
  live: "#fbbf24",
};

const TABS = ["All", "Won", "Lost"];

export default function BetHistory() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = BETS.filter((b) => {
    if (activeTab === "Won") return b.status === "won";
    if (activeTab === "Lost") return b.status === "lost";
    return true;
  });

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

      {/* Bet Cards */}
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
              style={{ background: STATUS_COLOR[bet.status] }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-rajdhani text-[13px] font-bold text-white/85 truncate">
                {bet.match}
              </p>
              <p className="text-[11px] text-white/30 mt-0.5 truncate">
                {bet.meta}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className="font-rajdhani text-[14px] font-bold"
                style={{ color: STATUS_COLOR[bet.status] }}
              >
                {bet.amount}
              </p>
              <p
                className="text-[11px] mt-0.5"
                style={{ color: `${STATUS_COLOR[bet.status]}99` }}
              >
                {bet.stake}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}