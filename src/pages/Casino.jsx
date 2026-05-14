import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiFireFill, RiLiveFill, RiVipCrown2Fill } from "react-icons/ri";
import { BsLightningChargeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { launcherUrl, updateCasinoBalance } from "../api";
import { isMobile } from "react-device-detect";
import { showToast } from "../utils/ToastContent";
import {
  updateAvailableBalance,
  updateUserCasinoBalance,
} from "../redux/slices/userSlice";

const GAMES = [
  {
    title: "SPB-aviator",
    image:
      "https://client.qtlauncher.com/images/?id=SPB-aviator_en_US&type=logo-square&version=1717639255289",
    badge: "HOT",
    color: "#f59e0b",
    basePlayers: 24000,
  },
  {
    title: "EVP-uncrossablerush",
    image:
      "https://store-images.s-microsoft.com/image/apps.1626.14309466327337509.d2f79b81-de80-4931-aaaf-211eed56244f.d56cd67e-094e-4bb0-9771-c79972acdbb1",
    badge: "INDIA",
    color: "#f97316",
    basePlayers: 12300,
  },
  {
    title: "GLX-towerrush",
    image:
      "https://play-lh.googleusercontent.com/swtLo6soJ2JxqtIUSwBYnY_8peeoLozHU9MsahZJB5WRf9RFlmOncG4T9aZsqvXF7ZuH_Cv6SPDndF9VKCJg=w240-h480-rw",
    badge: "INDIA",
    color: "#f97316",
    basePlayers: 18500,
  },
  {
    title: "EVP-magicwheel",
    image:
      "https://client.qtlauncher.com/images/?id=JIL-wheel_en_US&type=logo-square&version=1735483781169",
    badge: "LIVE",
    color: "#ef4444",
    basePlayers: 31200,
  },
  {
    title: "TRB-crashx",
    image:
      "https://client.qtlauncher.com/images/?id=TRB-crashx_en_US&type=logo-square&version=1689793154196",
    badge: "NEW",
    color: "#06b6d4",
    basePlayers: 9800,
  },
  {
    title: "TRB-mines",
    image:
      "https://client.qtlauncher.com/images/?id=TRB-mines_en_US&type=logo-square&version=1689799362324",
    badge: "INDIA",
    color: "#f97316",
    basePlayers: 15600,
  },

  {
    title: "SMS-jetx",
    image:
      "https://imagedelivery.net/Vd-cIddpsfJ7XHHMXJuIbA/b2bfdaef-9ab6-497f-fc44-ab8d31c34e00/width=640,height=426",
    badge: "INDIA",
    color: "#f97316",
    basePlayers: 21000,
  },
  {
    title: "GLX-cashshow",
    image: "https://netcontent.cc/raceupcasino/i/s3/galaxsys/CashShow.webp",
    badge: "INDIA",
    color: "#f97316",
    basePlayers: 8900,
  },
  {
    title: "EZU-lucky7",
    image:
      "https://games.evolution.com/wp-content/uploads/2024/01/lucky_7_600.png",
    badge: "TRENDING",
    color: "#a855f7",
    basePlayers: 27400,
  },
  {
    title: "EZU-teenpatti",
    image:
      "https://client.qtlauncher.com/images/?id=JIL-teenpatti_en_US&type=logo-square&version=1735484924247",
    badge: "VIP",
    color: "#22c55e",
    basePlayers: 19200,
  },
];

const BADGE_COLORS = {
  HOT: {
    bg: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.4)",
    text: "#f59e0b",
  },
  LIVE: {
    bg: "rgba(239,68,68,0.15)",
    border: "rgba(239,68,68,0.4)",
    text: "#ef4444",
  },
  NEW: {
    bg: "rgba(6,182,212,0.15)",
    border: "rgba(6,182,212,0.4)",
    text: "#06b6d4",
  },
  INDIA: {
    bg: "rgba(249,115,22,0.15)",
    border: "rgba(249,115,22,0.4)",
    text: "#f97316",
  },
  TRENDING: {
    bg: "rgba(168,85,247,0.15)",
    border: "rgba(168,85,247,0.4)",
    text: "#a855f7",
  },
  VIP: {
    bg: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.4)",
    text: "#22c55e",
  },
};

const getBadgeIcon = (badge) => {
  if (badge === "LIVE") return <RiLiveFill size={10} />;
  if (badge === "VIP") return <RiVipCrown2Fill size={10} />;
  if (badge === "TRENDING") return <BsLightningChargeFill size={10} />;
  return <RiFireFill size={10} />;
};

const formatPlayers = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
};

// Per-game player count hook
function useGamePlayers(basePlayers) {
  const [count, setCount] = useState(basePlayers);
  useEffect(() => {
    const interval = setInterval(
      () => {
        const delta = Math.floor(Math.random() * 80) - 30;
        setCount((prev) => Math.max(5000, prev + delta));
      },
      2500 + Math.random() * 1000,
    );
    return () => clearInterval(interval);
  }, [basePlayers]);
  return count;
}

// Individual game card with its own live player count
function GameCard({ game, index, onPlay }) {
  const players = useGamePlayers(game.basePlayers);
  const badgeStyle = BADGE_COLORS[game.badge] || BADGE_COLORS.HOT;

  return (
    <motion.div
      onClick={() => onPlay({ gameId: game.title })}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.025 }}
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        borderRadius: 22,
        height: 230,
        border: `1px solid ${game.color}22`,
        background: "#0a0c10",
      }}
    >
      {/* Game Image */}
      <img
        src={game.image}
        alt={game.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Dark overlay - stronger at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)",
        }}
      />

      {/* Color tint overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at center top, ${game.color}15, transparent 70%)`,
        }}
      />

      {/* Badge */}
      <div
        className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1"
        style={{
          borderRadius: 50,
          background: badgeStyle.bg,
          border: `1px solid ${badgeStyle.border}`,
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ color: badgeStyle.text }}>
          {getBadgeIcon(game.badge)}
        </span>
        <span
          style={{
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: "0.12em",
            color: badgeStyle.text,
          }}
        >
          {game.badge}
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5">
        {/* Live player count */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#22c55e", boxShadow: "0 0 6px #22c55e" }}
            />
            <AnimatePresence mode="popLayout">
              <motion.span
                key={players}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.03em",
                }}
              >
                {formatPlayers(players)} playing
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Play button */}
          <motion.div
            whileHover={{ scale: 1.15 }}
            className="flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `linear-gradient(135deg, ${game.color}cc, ${game.color}88)`,
              boxShadow: `0 4px 20px ${game.color}55`,
            }}
          >
            <span style={{ fontSize: 13, color: "#fff", marginLeft: 2 }}>
              ▶
            </span>
          </motion.div>
        </div>

        {/* Game name */}
        <p
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {game.title.split("-")[1] || game.title}
        </p>
      </div>
    </motion.div>
  );
}

const Casino = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.user?.userData);
  const loginType = useSelector((state) => state.user.loggedInType);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const siteCasinoData = useSelector((state) => state.siteCasino);
  const [isLaunching, setIsLaunching] = useState(false);

  // Total online players (sum-like ambient number)
  const [onlinePlayers, setOnlinePlayers] = useState(24000);
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers((prev) => {
        const delta = Math.floor(Math.random() * 120) - 40;
        return Math.max(20000, prev + delta);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handlePlayClick = async (item) => {
    if (loginType === "") {
      navigate("/login");
      return;
    } else if (loginType === "demo") {
      showToast.error("Login with real id");
      return;
    }

    const amount = userData?.availableBalance - userData?.exposure || 0;
    const siteCasinoBalance = siteCasinoData?.casinoBalance || 0;
    const finalAmountToDeduct = Math.min(amount, siteCasinoBalance);

    if (
      finalAmountToDeduct === 0 &&
      (!userData?.casinoBalance || userData?.casinoBalance <= 0)
    ) {
      showToast.warning("Low balance");
      return;
    }

    setIsLaunching(true);

    try {
      const response = await updateCasinoBalance({
        CasinoBalance: finalAmountToDeduct,
      });
      dispatch(updateAvailableBalance(response.data.user.availableBalance));
      dispatch(updateUserCasinoBalance(response.data.user.casinoBalance));
    } catch (error) {
      console.error("error", error.response?.data?.message);
    }

    const data = {
      gameId: item.gameId,
      playerId: userData?._id || "",
      displayName: userData?.casinoDisplayName || "",
      currency: "INR",
      country: "IN",
      gender: "M",
      birthDate: "1996-10-12",
      mode: isLoggedIn ? "real" : "demo",
      device: isMobile ? "mobile" : "desktop",
      returnUrl: window.location.href,
      walletSessionId: userData?.sessionToken || "",
    };

    try {
      const res = await launcherUrl(data);
      if (res?.success && res?.data?.url) {
        const gameUrl = encodeURIComponent(res.data.url);
        navigate(`/game-lobby?gameId=${gameUrl}`);
      } else {
        console.error("Launcher URL request failed", res);
        setIsLaunching(false);
      }
    } catch (error) {
      console.error(
        "Error launching game:",
        error?.response?.data?.message || error.message,
      );
      setIsLaunching(false);
    }
  };

  return (
  <>

 <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(7,9,15,0.92)",
              backdropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {/* Spinner ring */}
            <div style={{ position: "relative", width: 72, height: 72 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  border: "3px solid rgba(245,158,11,0.15)",
                  borderTopColor: "#f59e0b",
                  position: "absolute",
                  inset: 0,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RiVipCrown2Fill size={26} color="#f59e0b" />
              </div>
            </div>

            {/* Text */}
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "0.04em",
                }}
              >
                Launching Game
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  marginTop: 4,
                  letterSpacing: "0.06em",
                }}
              >
                Please wait...
              </p>
            </div>

            {/* Animated dots */}
            <div style={{ display: "flex", gap: 6 }}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#f59e0b",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
      className="min-h-screen pb-28 overflow-hidden"
      style={{ background: "#07090f", color: "#fff" }}
    >
      {/* HEADER */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.22em",
                color: "rgba(245,158,11,0.5)",
                textTransform: "uppercase",
              }}
            >
              Premium Lobby
            </p>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 900,
                lineHeight: 1.1,
                marginTop: 2,
                letterSpacing: "-0.02em",
              }}
            >
              Casino Games
            </h1>
          </div>

          <div
            className="flex flex-col items-center justify-center"
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <RiVipCrown2Fill size={22} color="#f59e0b" />
          </div>
        </div>

        {/* Online count pill */}
        <div
          className="inline-flex items-center gap-2 mt-3 px-3 py-1.5"
          style={{
            borderRadius: 50,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#22c55e", animation: "pulse 2s infinite" }}
          />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={onlinePlayers}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: 11, fontWeight: 700, color: "#4ade80" }}
            >
              {onlinePlayers.toLocaleString("en-IN")} online now
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="px-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden"
          style={{ borderRadius: 28, height: 200 }}
        >
          <img
            src="https://client.qtlauncher.com/images/?id=EVO-teenpatti_en_US&type=banner&version=1657611668715"
            alt="Live Casino"
            className="w-full h-full object-cover"
          />

          {/* Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(120deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
            }}
          />

          {/* Live badge */}
          <div
            className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1"
            style={{
              borderRadius: 50,
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: "#ef4444",
                animation: "pulse 1.5s infinite",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 900,
                letterSpacing: "0.15em",
                color: "#f87171",
              }}
            >
              LIVE CASINO
            </span>
          </div>

          {/* Hero text */}
          <div className="absolute bottom-5 left-5">
            <h2
              style={{
                fontSize: 36,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              PLAY & WIN
            </h2>
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                marginTop: 6,
                maxWidth: 220,
                lineHeight: 1.4,
              }}
            >
              Real-time casino games with premium odds
            </p>
          </div>
        </motion.div>
      </div>

      {/* SECTION LABEL */}
      <div className="px-4 mb-4 flex items-center gap-3">
        <p
          style={{
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.25)",
            textTransform: "uppercase",
          }}
        >
          All Games
        </p>
        <div
          className="flex-1 h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: "rgba(245,158,11,0.5)",
          }}
        >
          {GAMES.length} games
        </span>
      </div>

      {/* GAME GRID */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {GAMES.map((game, i) => (
          <GameCard
            key={game.title}
            game={game}
            index={i}
            onPlay={handlePlayClick}
          />
        ))}
      </div>
    </div>
  </>
  );
};

export default Casino;
