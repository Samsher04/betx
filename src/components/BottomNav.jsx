import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  RiHome5Fill,
  RiWallet3Fill,
  RiVipCrown2Fill,
  RiUser3Fill,
} from "react-icons/ri";

import { useLocation, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  {
    icon: RiHome5Fill,
    label: "Home",
    id: "home",
    path: "/",
  },
  {
    icon: RiWallet3Fill,
    label: "Deposit",
    id: "deposit",
    path: "/deposit",
  },
  {
    icon: RiVipCrown2Fill,
    label: "VIP",
    id: "vip",
    path: "/vip",
  },
  {
    icon: RiUser3Fill,
    label: "Profile",
    id: "profile",
    path: "/profile",
  },
];

const BottomNav = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const [activeNav, setActiveNav] = useState(
    location.pathname
  );

  const handleNavigate = (item) => {
    setActiveNav(item.path);

    navigate(item.path);
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[28px] px-2 py-3 flex justify-around items-center"
        style={{
          background: "rgba(10,10,18,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
        }}
      >
        {/* GOLD TOP BORDER */}
        <div
          className="absolute top-0 inset-x-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(251,191,36,0.4), transparent)",
          }}
        />

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path;

          return (
            <motion.button
              key={item.id}
              onClick={() =>
                handleNavigate(item)
              }
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-2xl transition-all duration-300 relative"
              style={{
                background: isActive
                  ? "rgba(251,191,36,0.12)"
                  : "transparent",
              }}
            >
              {/* ACTIVE ANIMATION */}
              {isActive && (
                <motion.div
                  layoutId="navActive"
                  className="absolute inset-0 rounded-2xl"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  style={{
                    background:
                      "rgba(251,191,36,0.1)",
                    border:
                      "1px solid rgba(251,191,36,0.2)",
                  }}
                />
              )}

              {/* ICON */}
              <Icon
                size={22}
                className="relative z-10 transition-all duration-300"
                style={{
                  color: isActive
                    ? "#f59e0b"
                    : "rgba(255,255,255,0.35)",

                  filter: isActive
                    ? "drop-shadow(0 0 8px rgba(251,191,36,0.8))"
                    : "none",

                  transform: isActive
                    ? "scale(1.18)"
                    : "scale(1)",
                }}
              />

              {/* LABEL */}
              <span
                className="text-[9px] font-bold tracking-wider relative z-10"
                style={{
                  color: isActive
                    ? "#f59e0b"
                    : "rgba(255,255,255,0.3)",
                }}
              >
                {item.label.toUpperCase()}
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default BottomNav;