import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { IoWallet } from "react-icons/io5";
import { getCasinoBalance } from "../api";
import { updateSiteCasinoSlice } from "../redux/slices/siteCasinoSlice";

import {
  selectDomainID,
  selectSite,
} from "../utils/helper/commonSelectors";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userData = useSelector((state) => state?.user?.userData) || {};
  const siteDetails = useSelector(selectSite());
  const domainId = useSelector(selectDomainID());
  const exposure = Number(userData?.exposure || 0);
    const dispatch = useDispatch();

  const availableBalance = Number(userData.availableBalance - exposure || 0);

  const fetchData = async () => {
    try {
      const res = await getCasinoBalance({
        domainId: siteDetails?.domainName?._id || "",
        userDomainId: siteDetails?.domainName?._id || "",
      });
      dispatch(updateSiteCasinoSlice(res?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between pt-2 pb-3"
      >
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            BET
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              X
            </span>
          </h1>
        </div>

        {isLoggedIn ? (
          <button
            className="flex items-center gap-1.5 px-3 h-[28px] rounded-[8px] text-[12px] font-bold tracking-wide"
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "0.5px solid rgba(251,191,36,0.25)",
              color: "#fbbf24",
            }}
          >
            <IoWallet size={13} />
            <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
              INR
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
            <span>{availableBalance?.toFixed(2)}</span>
          </button>
        ) : (
          <Link to="/login">
            <button
              className="relative overflow-hidden group px-6 py-[11px] rounded-2xl font-bold text-sm tracking-wide text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg,#ef4444,#f97316)",
                color: "#fff",
                boxShadow: "0 10px 30px rgba(239,68,68,0.35)",
              }}
            >
              {/* GLOW */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />

              {/* SHINE EFFECT */}
              <div className="absolute top-0 -left-[120%] w-[80%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[25deg] group-hover:left-[120%] duration-700" />

              {/* TEXT */}
              <span className="relative z-10 flex items-center gap-2">
                Login
              </span>
            </button>
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default Navbar;
