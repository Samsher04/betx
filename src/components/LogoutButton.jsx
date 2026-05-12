import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";

import { resetApp } from "../redux/appReset";
import { resetBetSettings } from "../redux/slices/betSettingsSlice";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(resetApp());
    dispatch(resetBetSettings());

    navigate("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-3.5 rounded-[14px] font-rajdhani text-[14px] font-bold tracking-[2px] text-[#f87171] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
      style={{
        background: "rgba(239,68,68,0.08)",
        border: "0.5px solid rgba(239,68,68,0.25)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.14)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
        e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
      }}
    >
      <IoLogOut size={17} />
      LOGOUT
    </button>
  );
}