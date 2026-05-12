import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  RiTeamFill,
  RiMoneyDollarCircleFill,
  RiGamepadFill,
} from "react-icons/ri";

import {
  RiRocket2Fill,
  RiPlayFill,
  RiVipCrown2Fill,
} from "react-icons/ri";


const LIVE_GAMES = [
  {
    title: "CRASH",
    players: "12.4K",
    multiplier: "4.52x",
    icon: "🚀",
    color: "#22c55e",
    glow: "0 0 30px rgba(34,197,94,0.4)",
    bg: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
    badge: "LIVE",
    trending: true,
  },
  {
    title: "DICE",
    players: "8.2K",
    multiplier: "2.1x",
    icon: "🎲",
    color: "#f59e0b",
    glow: "0 0 30px rgba(245,158,11,0.4)",
    bg: "linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%)",
    badge: "HOT",
    trending: false,
  },
];

const ORIGINALS = [
  {
    title: "HILO",
    icon: "🃏",
    color: "#a78bfa",
    bg: "from-violet-900/80 to-purple-900/80",
    border: "#7c3aed",
  },
  {
    title: "MINES",
    icon: "💣",
    color: "#f472b6",
    bg: "from-pink-900/80 to-rose-900/80",
    border: "#be185d",
  },
  {
    title: "PLINKO",
    icon: "🎯",
    color: "#38bdf8",
    bg: "from-sky-900/80 to-cyan-900/80",
    border: "#0284c7",
  },
];

const SLOTS = [
  {
    title: "Sweet Bonanza",
    rtp: "96.5%",
    rating: "4.9",
    tag: "JACKPOT",
    tagColor: "#f59e0b",
    img: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Wild Spin",
    rtp: "97.1%",
    rating: "4.8",
    tag: "NEW",
    tagColor: "#22c55e",
    img: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop",
  },
  {
    title: "Lucky Joker",
    rtp: "95.8%",
    rating: "4.7",
    tag: "HOT",
    tagColor: "#ef4444",
    img: "https://images.unsplash.com/photo-1606166325683-e6deb697d301?q=80&w=600&auto=format&fit=crop",
  },
];

const WINNERS = [
  { name: "Raj***", game: "Crash", amount: "₹1,24,500", time: "2m ago" },
  { name: "Pri***", game: "Mines", amount: "₹87,200", time: "5m ago" },
  { name: "Vik***", game: "HILO", amount: "₹2,05,000", time: "8m ago" },
];

function PulsingDot({ color = "#22c55e" }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

function SectionTitle({ title, icon, accent = "#f59e0b" }) {
  return (
    <div className="flex items-center justify-between mt-8 mb-4">
      <div className="flex items-center gap-3">
        <span
          className="w-1 h-7 rounded-full block"
          style={{
            background: `linear-gradient(to bottom, ${accent}, transparent)`,
          }}
        />
        <h2 className="text-white font-black text-lg tracking-wider flex items-center gap-2">
          <span>{icon}</span>
          <span>{title}</span>
        </h2>
      </div>
      <button
        className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all duration-300 hover:scale-105"
        style={{
          color: accent,
          borderColor: `${accent}40`,
          background: `${accent}10`,
        }}
      >
        View All →
      </button>
    </div>
  );
}

function LiveGameCard({ game, i }) {
  const [multiplier, setMultiplier] = useState(parseFloat(game.multiplier));
  useEffect(() => {
    const t = setInterval(() => {
      setMultiplier((m) => +(m + (Math.random() * 0.1 - 0.02)).toFixed(2));
    }, 800);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.15 }}
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative overflow-hidden rounded-[24px] p-5 cursor-pointer"
      style={{
        background: game.bg,
        boxShadow: game.glow,
        border: `1px solid ${game.color}25`,
      }}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Badge */}
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider"
          style={{
            background: `${game.color}25`,
            color: game.color,
            border: `1px solid ${game.color}40`,
          }}
        >
          <PulsingDot color={game.color} />
          {game.badge}
        </div>
        {game.trending && (
          <span className="text-[10px] font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded-full border border-orange-400/20">
            TRENDING
          </span>
        )}
      </div>

      {/* Icon */}
      <div className="text-5xl drop-shadow-2xl mb-2">{game.icon}</div>

      {/* Title */}
      <h3 className="text-2xl font-black text-white tracking-widest">
        {game.title}
      </h3>

      {/* Live multiplier */}
      <motion.div
        key={multiplier}
        animate={{ scale: [1.1, 1] }}
        transition={{ duration: 0.2 }}
        className="text-3xl font-black mt-1"
        style={{ color: game.color, textShadow: `0 0 20px ${game.color}` }}
      >
        {multiplier.toFixed(2)}x
      </motion.div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-white/50">👥 {game.players} playing</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold"
          style={{
            background: `${game.color}20`,
            border: `1px solid ${game.color}40`,
            color: game.color,
          }}
        >
          ▶
        </motion.button>
      </div>
    </motion.div>
  );
}

function WinnersTicket() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % WINNERS.length), 2500);
    return () => clearInterval(t);
  }, []);

  const w = WINNERS[idx];
  return (
    <motion.div
      className="rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        border: "1px solid rgba(251,191,36,0.2)",
        boxShadow: "0 4px 24px rgba(251,191,36,0.1)",
      }}
    >
      <div className="px-4 py-3 flex items-center gap-2 border-b border-yellow-500/10">
        <span className="text-yellow-400 text-sm">🏆</span>
        <span className="text-yellow-400 font-black text-xs tracking-widest">
          RECENT BIG WINS
        </span>
        <PulsingDot color="#f59e0b" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="px-4 py-3 flex items-center justify-between"
        >
          <div>
            <span className="text-white font-bold text-sm">{w.name}</span>
            <span className="text-white/40 text-xs"> won on </span>
            <span className="text-yellow-400 text-xs font-semibold">
              {w.game}
            </span>
          </div>
          <div className="text-right">
            <div className="text-green-400 font-black text-base">
              {w.amount}
            </div>
            <div className="text-white/30 text-xs">{w.time}</div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function OriginalCard({ item, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`rounded-[22px] p-4 text-center overflow-hidden relative bg-gradient-to-br ${item.bg} cursor-pointer`}
      style={{
        border: `1px solid ${item.border}40`,
        boxShadow: `0 8px 32px ${item.border}20`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <div className="text-5xl drop-shadow-2xl mb-3">{item.icon}</div>
        <div className="font-black text-base tracking-widest text-white">
          {item.title}
        </div>
        <div
          className="text-[9px] font-black tracking-widest mt-1 px-2 py-0.5 rounded-full inline-block"
          style={{
            color: item.color,
            background: `${item.color}15`,
            border: `1px solid ${item.color}30`,
          }}
        >
          BETX ORIGINAL
        </div>
      </div>
    </motion.div>
  );
}

function SlotCard({ slot, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.12 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-[22px] h-[160px] cursor-pointer"
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <img
        src={slot.img}
        className="w-full h-full object-cover"
        alt={slot.title}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
        }}
      />

      {/* Left content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex gap-2">
          <span
            className="text-[10px] font-black px-2.5 py-0.5 rounded-full"
            style={{ background: slot.tagColor, color: "#000" }}
          >
            {slot.tag}
          </span>
          <span className="text-[10px] text-white/60 bg-black/40 backdrop-blur-xl px-2.5 py-0.5 rounded-full">
            RTP {slot.rtp}
          </span>
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-white/60 text-xs">{slot.rating}</span>
          </div>
          <h3 className="text-white font-black text-lg leading-tight">
            {slot.title}
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 text-xs font-bold px-4 py-1.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #d97706, #f59e0b)",
              color: "#1c1003",
              boxShadow: "0 4px 12px rgba(251,191,36,0.4)",
            }}
          >
            Play Now ▶
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {


  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{
        background: "#07080d",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* AMBIENT BG */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(251,191,36,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 -left-20 w-[300px] h-[300px]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[300px] h-[300px]"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.05) 0%, transparent 70%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-[430px] mx-auto px-4 pb-24">
        {/* TOP BAR */}

     {/* AVIATOR HERO BANNER */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="relative overflow-hidden rounded-[32px] h-[240px]"
  style={{
    border: "1px solid rgba(239,68,68,0.18)",
    background:
      "linear-gradient(135deg,#140909 0%,#09090f 100%)",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.55), 0 0 45px rgba(239,68,68,0.12)",
  }}
>
  {/* AVIATOR IMAGE */}
  <img
    src="https://igamingafrika.com/wp-content/uploads/2023/05/Aviator_10.png"
    alt="aviator"
    className="absolute right-0 top-0 h-full object-contain opacity-90"
  />

  {/* DARK OVERLAY */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.82) 40%, rgba(0,0,0,0.15) 100%)",
    }}
  />

  {/* RED GLOW */}
  <div className="absolute -left-20 top-0 w-[240px] h-[240px] bg-red-500/20 blur-[100px] rounded-full" />

  {/* GOLD TOP LINE */}
  <div
    className="absolute top-0 inset-x-0 h-px"
    style={{
      background:
        "linear-gradient(90deg,transparent,rgba(251,191,36,0.6),transparent)",
    }}
  />

  {/* CONTENT */}
  <div className="relative z-10 h-full p-6 flex flex-col justify-between">
    {/* TOP */}
    <div className="flex items-center justify-between">
      {/* LIVE */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(239,68,68,0.12)",
          border: "1px solid rgba(239,68,68,0.25)",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

        <span className="text-[10px] font-black tracking-[2px] text-red-400">
          LIVE GAME
        </span>
      </div>

      {/* PLAYERS */}
      <div
        className="flex items-center gap-1 px-3 py-1.5 rounded-full"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <RiVipCrown2Fill
          size={13}
          className="text-yellow-400"
        />

        <span className="text-[10px] font-bold text-white/70">
          24K PLAYERS
        </span>
      </div>
    </div>

    {/* BOTTOM */}
    <div>
 

      {/* DESC */}
      <p className="text-white/50 text-xs mt-3 leading-relaxed max-w-[220px]">
        Cash out before the plane crashes
        and win huge multipliers instantly.
      </p>

      {/* BUTTON */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-5 px-5 py-3 rounded-2xl flex items-center gap-2 text-sm font-black tracking-wide"
        style={{
          background:
            "linear-gradient(135deg,#ef4444,#f97316)",
          color: "#fff",
          boxShadow:
            "0 10px 30px rgba(239,68,68,0.35)",
        }}
      >
        <RiPlayFill size={18} />
        PLAY AVIATOR
      </motion.button>
    </div>
  </div>

  {/* FLOATING MULTIPLIER */}
  <motion.div
    animate={{
      y: [-5, 5, -5],
    }}
    transition={{
      repeat: Infinity,
      duration: 2.5,
    }}
    className="absolute right-5 bottom-5 px-4 py-2 rounded-2xl"
    style={{
      background:
        "linear-gradient(135deg,#ef4444,#f97316)",
      boxShadow:
        "0 8px 25px rgba(239,68,68,0.35)",
    }}
  >
    <span className="text-white text-sm font-black tracking-wide">
      12.43x
    </span>
  </motion.div>
</motion.div>

        {/* STATS BAR */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 mt-4"
        >
          {[
            {
              label: "Online Players",
              value: "24,891",
              icon: RiTeamFill,
              color: "#22c55e",
              glow: "rgba(34,197,94,0.35)",
            },
            {
              label: "Today's Payouts",
              value: "₹2.4Cr",
              icon: RiMoneyDollarCircleFill,
              color: "#f59e0b",
              glow: "rgba(245,158,11,0.35)",
            },
            {
              label: "Live Games",
              value: "340+",
              icon: RiGamepadFill,
              color: "#a78bfa",
              glow: "rgba(167,139,250,0.35)",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;

            return (
              <motion.div
                whileHover={{
                  y: -4,
                  scale: 1.03,
                }}
                key={i}
                className="relative overflow-hidden rounded-[22px] p-4 text-center"
                style={{
                  background: `${stat.color}10`,
                  border: `1px solid ${stat.color}25`,
                  backdropFilter: "blur(14px)",
               
                }}
              >
                {/* TOP LIGHT */}
                <div
                  className="absolute top-0 inset-x-0 h-px"
                  style={{
                    background: `linear-gradient(90deg,transparent,${stat.color},transparent)`,
                  }}
                />

                {/* ICON */}
                <div
                  className="w-[42px] h-[42px] rounded-2xl mx-auto flex items-center justify-center"
                  style={{
                    background: `${stat.color}18`,
                    boxShadow: `0 0 18px ${stat.glow}`,
                  }}
                >
                  <Icon
                    size={22}
                    style={{
                      color: stat.color,
                      filter: `drop-shadow(0 0 8px ${stat.glow})`,
                    }}
                  />
                </div>

                {/* VALUE */}
                <div className="text-sm font-black text-white mt-3 tracking-wide">
                  {stat.value}
                </div>

                {/* LABEL */}
                <div className="text-[10px] text-white/40 mt-1 leading-tight font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* WINNERS TICKER */}
        <div className="mt-4">
          <WinnersTicket />
        </div>

        {/* LIVE GAMES */}
        <SectionTitle title="Live Games" icon="🔴" accent="#ef4444" />
        <div className="grid grid-cols-2 gap-3">
          {LIVE_GAMES.map((game, i) => (
            <LiveGameCard key={i} game={game} i={i} />
          ))}
        </div>

        {/* ORIGINALS */}
        <SectionTitle title="BetX Originals" icon="👑" accent="#f59e0b" />
        <div className="grid grid-cols-3 gap-3">
          {ORIGINALS.map((item, i) => (
            <OriginalCard key={i} item={item} i={i} />
          ))}
        </div>

        {/* PROMO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-[24px] p-5 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #1c1003 0%, #292004 50%, #1c1003 100%)",
            border: "1px solid rgba(251,191,36,0.3)",
            boxShadow: "0 8px 40px rgba(251,191,36,0.1)",
          }}
        >
          <div className="absolute top-0 right-0 text-8xl opacity-10 pointer-events-none">
            💎
          </div>
          <div
            className="text-[10px] font-black tracking-widest mb-1"
            style={{ color: "#f59e0b" }}
          >
            ⚡ LIMITED OFFER
          </div>
          <h3 className="text-white font-black text-xl leading-tight">
            Refer & Earn <span style={{ color: "#f59e0b" }}>₹5,000</span>
          </h3>
          <p className="text-white/40 text-xs mt-1 mb-3">
            For every friend who deposits ₹500+
          </p>
          <button
            className="text-xs font-black px-4 py-2 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #d97706, #f59e0b)",
              color: "#1c1003",
            }}
          >
            Invite Friends →
          </button>
        </motion.div>

        {/* SLOTS */}
        <SectionTitle title="Popular Slots" icon="🎰" accent="#a78bfa" />
        <div className="space-y-3">
          {SLOTS.map((slot, i) => (
            <SlotCard key={i} slot={slot} i={i} />
          ))}
        </div>

        {/* BOTTOM SPACER */}
        <div className="h-6" />
      </div>

      {/* BOTTOM NAV */}
    </div>
  );
}
