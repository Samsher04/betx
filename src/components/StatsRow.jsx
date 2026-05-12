export default function StatsRow() {
  const stats = [
    { label: "Balance", value: "₹24,500", color: "#fbbf24" },
    { label: "Total Bets", value: "148", color: "#fbbf24" },
    { label: "Withdrawals", value: "₹12,300", color: "#fbbf24" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2.5 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-[14px] py-3 px-2 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "0.5px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            className="font-rajdhani text-[17px] font-bold mb-0.5"
            style={{ color: s.color }}
          >
            {s.value}
          </p>
          <p className="text-[11px] text-white/30 tracking-[0.5px]">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}