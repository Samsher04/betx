import StatsRow from "../components/StatsRow";
import QuickActions from "../components/QuickActions";
import AccountMenu from "../components/AccountMenu";
import BetHistory from "../components/BetHistory";
import LogoutButton from "../components/LogoutButton";
import ProfileHeader from "../components/ProfileHeader";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen px-4 pt-5 pb-32"
      style={{
        background:
          "linear-gradient(160deg, #0f0c03 0%, #1a1505 50%, #0d0d0d 100%)",
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigate(-1)}
          className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
          }}
        >
          <IoArrowBack size={16} />
        </button>
        <span className="font-rajdhani text-[16px] font-bold tracking-[2px] text-white/70">
          MY PROFILE
        </span>
        <button className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center text-white/50 hover:text-white/80 transition-colors"></button>
      </div>

      <ProfileHeader />
    
      <QuickActions />
      <AccountMenu />
      <BetHistory />
      <LogoutButton />
    </div>
  );
}
