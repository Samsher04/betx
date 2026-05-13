import React from "react";
import { motion } from "framer-motion";
import { RiFireFill, RiLiveFill, RiVipCrown2Fill } from "react-icons/ri";

const GAMES = [
  {
    title: "",
    image:
      "https://client.qtlauncher.com/images/?id=SPB-aviator_en_US&type=logo-square&version=1717639255289",
    badge: "HOT",
    color: "#f59e0b",
  },
  {
    title: "",
    image:
      "https://client.qtlauncher.com/images/?id=JIL-wheel_en_US&type=logo-square&version=1735483781169",
    badge: "LIVE",
    color: "#ef4444",
  },
  {
    title: "",
    image:
      "https://client.qtlauncher.com/images/?id=JIL-teenpatti_en_US&type=logo-square&version=1735484924247",
    badge: "VIP",
    color: "#22c55e",
  },
  {
    title: "",
    image:
      "https://client.qtlauncher.com/images/?id=JIL-7up7down_en_US&type=logo-square&version=1735056385975",
    badge: "TRENDING",
    color: "#a855f7",
  },
  {
    title: "Crash X",
    image:
      "https://client.qtlauncher.com/images/?id=TRB-crashx_en_US&type=logo-square&version=1689793154196",
    badge: "NEW",
    color: "#06b6d4",
  },
  {
    title: "Mines",
    image:
      "https://client.qtlauncher.com/images/?id=TRB-mines_en_US&type=logo-square&version=1689799362324",
    badge: "INDIA",
    color: "#f97316",
  },

  {
    title: "EVP-uncrossablerush",
    image:
      "https://store-images.s-microsoft.com/image/apps.1626.14309466327337509.d2f79b81-de80-4931-aaaf-211eed56244f.d56cd67e-094e-4bb0-9771-c79972acdbb1",
    badge: "INDIA",
    color: "#f97316",
  },

    {
    title: "GLX-towerrush",
    image:
      "https://play-lh.googleusercontent.com/swtLo6soJ2JxqtIUSwBYnY_8peeoLozHU9MsahZJB5WRf9RFlmOncG4T9aZsqvXF7ZuH_Cv6SPDndF9VKCJg=w240-h480-rw",
    badge: "INDIA",
    color: "#f97316",
  },

      {
    title: "SMS-jetx",
    image:
      "https://imagedelivery.net/Vd-cIddpsfJ7XHHMXJuIbA/b2bfdaef-9ab6-497f-fc44-ab8d31c34e00/width=640,height=426",
    badge: "INDIA",
    color: "#f97316",
  },

        {
    title: "GLX-cashshow",
    image:
      "https://netcontent.cc/raceupcasino/i/s3/galaxsys/CashShow.webp",
    badge: "INDIA",
    color: "#f97316",
  },
];

const getBadgeIcon = (badge) => {
  if (badge === "LIVE") return <RiLiveFill size={12} />;
  if (badge === "VIP") return <RiVipCrown2Fill size={12} />;
  return <RiFireFill size={12} />;
};

const Casino = () => {
  return (
    <div className="min-h-screen px-4 pt-5 pb-28 bg-[#020702] text-white overflow-hidden">
      {/* TOP */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] tracking-[4px] font-black text-yellow-500/50 uppercase">
            Premium Lobby
          </p>

          <h1 className="text-[28px] leading-none mt-1 font-black">
            Casino Games
          </h1>
        </div>

        <div className="w-[48px] h-[48px] rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.2)]">
          <RiVipCrown2Fill size={24} className="text-yellow-400" />
        </div>
      </div>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[30px] h-[210px] mb-5"
      >
        <img
          src="https://client.qtlauncher.com/images/?id=EVO-teenpatti_en_US&type=banner&version=1657611668715"
          alt="EVO-teenpatti"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 flex items-center gap-2 backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-[2px] text-red-400">
            LIVE CASINO
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-5">
          <h2 className="text-[34px] font-black leading-none">PLAY & WIN</h2>

          <p className="text-white/55 text-sm mt-2 max-w-[250px]">
            Experience real-time casino games with premium odds.
          </p>
        </div>
      </motion.div>

      {/* GAME GRID */}
      <div className="grid grid-cols-2 gap-4">
        {GAMES.map((game, i) => (
          <motion.div
            key={game.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-[24px] h-[220px] cursor-pointer group"
            style={{
              border: `1px solid ${game.color}25`,
              boxShadow: `0 0 30px ${game.color}15`,
            }}
          >
            {/* IMAGE */}
            <img
              src={game.image}
              alt={game.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* SHINE */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

            {/* BADGE */}
            <div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full flex items-center gap-1.5 backdrop-blur-xl"
              style={{
                background: `${game.color}18`,
                border: `1px solid ${game.color}40`,
              }}
            >
              <span style={{ color: game.color }}>
                {getBadgeIcon(game.badge)}
              </span>

              <span
                className="text-[9px] font-black tracking-[2px]"
                style={{ color: game.color }}
              >
                {game.badge}
              </span>
            </div>

            {/* TITLE */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-[24px] font-black leading-none drop-shadow-2xl">
                {game.title}
              </h3>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-white/55 font-semibold tracking-wide">
                  24K Players
                </span>

                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{
                    background: `${game.color}18`,
                    border: `1px solid ${game.color}40`,
                  }}
                >
                  <span className="text-lg" style={{ color: game.color }}>
                    ▶
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Casino;
