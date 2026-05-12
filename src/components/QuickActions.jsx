import { useNavigate } from "react-router-dom";
import { IoAdd, IoArrowUp } from "react-icons/io5";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
    
      <div className="grid grid-cols-2 gap-2.5">
        {/* Deposit */}
        <button
          onClick={() => navigate("/deposit")}
          className="rounded-[14px] py-3.5 flex flex-col items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "rgba(34,197,94,0.08)",
            border: "0.5px solid rgba(34,197,94,0.25)",
          }}
        >
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.12)" }}
          >
            <IoAdd size={20} color="#4ade80" />
          </div>
          <span className="font-rajdhani text-[13px] font-bold tracking-[1px] text-[#4ade80]">
            DEPOSIT
          </span>
          <span className="text-[11px] text-[#4ade80]/60">Add funds</span>
        </button>

        {/* Withdraw */}
        <button
          onClick={() => navigate("/withdraw")}
          className="rounded-[14px] py-3.5 flex flex-col items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: "rgba(251,191,36,0.06)",
            border: "0.5px solid rgba(251,191,36,0.2)",
          }}
        >
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center"
            style={{ background: "rgba(251,191,36,0.1)" }}
          >
            <IoArrowUp size={20} color="#fbbf24" />
          </div>
          <span className="font-rajdhani text-[13px] font-bold tracking-[1px] text-yellow-400">
            WITHDRAW
          </span>
          <span className="text-[11px] text-yellow-400/60">Cash out</span>
        </button>
      </div>
    </div>
  );
}