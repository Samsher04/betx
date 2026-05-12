import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoWallet } from "react-icons/io5";
import { updateAvailableBalance, updateUserCasinoBalance } from "../redux/slices/userSlice";
import { ReCallCasinoBalance } from "../api";

const GameLobby = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const userData = useSelector((state) => state?.user?.userData);
  const gameId = decodeURIComponent(searchParams.get("gameId") || "");

  // game name URL se nikalo — fallback "LIVE GAME"
  const gameName = searchParams.get("name")
    ? decodeURIComponent(searchParams.get("name")).toUpperCase()
    : "LIVE GAME";

  const handlereCall = async () => {
    try {
      const response = await ReCallCasinoBalance({
        CasinoBalance: userData?.casinoBalance,
      });
      dispatch(updateAvailableBalance(response.data.user.availableBalance));
      dispatch(updateUserCasinoBalance(response.data.user.casinoBalance));
    } catch (error) {
      console.error("Error recalling balance:", error);
    }
  };

  const handleBack = async () => {
    await handlereCall();
    const returnURL = localStorage.getItem("returnURL");
    if (returnURL?.startsWith("/")) {
      navigate(returnURL);
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    if (location.pathname !== "/game-lobby") {
      handlereCall();
    }
  }, [location.pathname]);

  useEffect(() => {
    const prev = document.body.style.paddingBottom;
    document.body.style.paddingBottom = "0px";
    return () => {
      document.body.style.paddingBottom = prev;
    };
  }, []);

  const balance = userData?.availableBalance?.toFixed(2) ?? "0.00";

  return (
    <div className="flex flex-col" style={{ height: "100vh", width: "100vw", background: "#07080d" }}>

      {/* ── HEADER ── */}
      <div
        className="flex items-center justify-between px-3 flex-shrink-0"
        style={{
          height: "42px",
          background: "rgba(7,8,13,0.97)",
          borderBottom: "0.5px solid rgba(251,191,36,0.12)",
        }}
      >
        {/* Back */}
        <button
          onClick={handleBack}
          className="flex items-center justify-center transition-all active:scale-95"
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <IoIosArrowBack size={18} />
        </button>

        {/* Game name + live dot */}
        <div className="flex items-center gap-2">
          <span
            className="w-[7px] h-[7px] rounded-full bg-green-400"
            style={{ animation: "glpulse 1.5s ease-in-out infinite" }}
          />
          <span
            className="font-bold !text-[11px] tracking-[1.5px] text-white/75"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 14 }}
          >
            {gameName}
          </span>
        </div>

  
      </div>

      {/* ── IFRAME ── */}
      <iframe
        src={gameId}
        title="Game Lobby"
        style={{
          flex: 1,
          width: "100vw",
          border: "none",
          display: "block",
        }}
        allowFullScreen
      />

      {/* pulse animation */}
      <style>{`
        @keyframes glpulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};

export default GameLobby;