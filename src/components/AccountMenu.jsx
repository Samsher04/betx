import { useNavigate } from "react-router-dom";
import { IoWallet, IoPerson, IoGift, IoHeadset, IoChevronForward } from "react-icons/io5";

const menuItems = [
  {
    icon: <IoWallet size={17} />,
    iconBg: "rgba(251,191,36,0.1)",
    iconColor: "#fbbf24",
    title: "Transactions",
    sub: "Deposit & withdrawal history",
    route: "/transactions",
  },
 

];

export default function AccountMenu() {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <p className="font-rajdhani text-[11px] font-bold tracking-[2px] text-yellow-500/40 mb-2.5 pl-0.5">
        ACCOUNT
      </p>
      <div className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.route)}
            className="flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-left transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            }}
          >
            {/* Icon */}
            <div
              className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center flex-shrink-0"
              style={{ background: item.iconBg, color: item.iconColor }}
            >
              {item.icon}
            </div>

            {/* Text */}
            <div className="flex-1">
              <p className="font-rajdhani text-[14px] font-bold tracking-[0.5px] text-white/85">
                {item.title}
              </p>
              <p className="text-[11px] text-white/30 mt-0.5">{item.sub}</p>
            </div>

            {/* Tag */}
            {item.tag && (
              <span
                className="font-rajdhani text-[10px] font-bold px-2 py-0.5 rounded-full tracking-[1px] mr-1"
                style={{ background: item.tagBg, color: item.tagColor }}
              >
                {item.tag}
              </span>
            )}

            <IoChevronForward size={15} color="rgba(255,255,255,0.2)" />
          </button>
        ))}
      </div>
    </div>
  );
}