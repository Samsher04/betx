import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCoins,
  FaArrowRight,
  FaDice,
  FaGift,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";
import { MdCasino, MdVerified, MdSecurity } from "react-icons/md";
import {
  RiVipCrownFill,
  RiLockPasswordFill,
  RiUserSmileFill,
} from "react-icons/ri";

import { BsTrophyFill, BsFillLightningChargeFill } from "react-icons/bs";
import SignupForm from "../components/auth/SignupForm";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/userSlice";
import { subscribeToLogin } from "../socketClient";
import { setAccountType } from "../redux/slices/accountSlice";

function FloatingParticle({ style }) {
  return (
    <motion.div
      animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute text-yellow-500/20 pointer-events-none"
      style={style}
    >
      <FaDice size={style.size || 18} />
    </motion.div>
  );
}

function InputField({
  icon,
  rightIcon,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black tracking-widest text-white/40 flex items-center gap-1.5">
        <span className="text-yellow-500/60">{icon}</span>
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
          style={{ fontSize: 15 }}
        >
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-2xl pl-11 pr-11 py-3.5 text-sm font-medium text-white placeholder-white/20 outline-none transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: error
              ? "1px solid rgba(239,68,68,0.6)"
              : "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
          onFocus={(e) => {
            e.target.style.border = "1px solid rgba(251,191,36,0.4)";
            e.target.style.background = "rgba(251,191,36,0.04)";
            e.target.style.boxShadow =
              "0 0 0 3px rgba(251,191,36,0.08), 0 2px 12px rgba(0,0,0,0.2)";
          }}
          onBlur={(e) => {
            e.target.style.border = error
              ? "1px solid rgba(239,68,68,0.6)"
              : "1px solid rgba(255,255,255,0.08)";
            e.target.style.background = "rgba(255,255,255,0.04)";
            e.target.style.boxShadow = "0 2px 12px rgba(0,0,0,0.2)";
          }}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 cursor-pointer hover:text-white/60 transition-colors">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-[11px] font-medium flex items-center gap-1.5 pl-1"
        >
          <FaShieldAlt size={10} /> {error}
        </motion.p>
      )}
    </div>
  );
}

function LoginForm({ onSwitch, onSuccess }) {
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    x_panel_type: "user",
  });

  const dispatch = useDispatch();

  const validateLogin = () => {
    const e = {};
    if (!formData.userName || formData.userName.length < 3)
      e.userName = "Valid username required";
    if (!formData.password || formData.password.length < 6)
      e.password = "Min 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);

    try {
      const response = await subscribeToLogin(formData);

      if (response.success) {
        const { token, userdata } = response;

        localStorage.setItem("userId", userdata?._id);

        dispatch(loginSuccess({
          userData: userdata,
          loggedInType: "real",
          token: token,
        }));
        dispatch(setAccountType({
          userData: userdata,
          type: "real",
        }));

        onSuccess?.();
      } else {
        setErrors({ general: response.message || "Login failed. Try again." });
      }
    } catch (error) {
      console.error("Login API error:", error);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.35 }}
      className="space-y-5"
    >
      <InputField
        icon={<RiUserSmileFill size={15} />}
        label="USERNAME"
        placeholder="Enter username"
        value={formData.userName}
        onChange={(e) => setFormData((prev) => ({ ...prev, userName: e.target.value }))}
        error={errors.userName}
      />

      <InputField
        icon={<RiLockPasswordFill size={15} />}
        label="PASSWORD"
        type={showPw ? "text" : "password"}
        placeholder="Enter your password"
        value={formData.password}
        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
        error={errors.password}
        rightIcon={
          <span onClick={() => setShowPw((s) => !s)}>
            {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </span>
        }
      />

      {/* General error */}
      {errors.general && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-[11px] font-medium flex items-center gap-1.5 pl-1"
        >
          <FaShieldAlt size={10} /> {errors.general}
        </motion.p>
      )}

      {/* Forgot password */}
      <div className="flex justify-end">
        <button className="text-[11px] font-semibold text-yellow-400/70 hover:text-yellow-400 transition-colors">
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <motion.button
        onClick={handleSubmit}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        className="w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
        style={{
          background: loading
            ? "rgba(251,191,36,0.3)"
            : "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
          color: "#1c1003",
          boxShadow: loading
            ? "none"
            : "0 6px 30px rgba(251,191,36,0.45), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <MdCasino size={18} />
            </motion.span>
            Signing In...
          </>
        ) : (
          <>
            <FaSignInAlt size={15} />
            LOGIN TO PLAY
            <FaArrowRight size={13} />
          </>
        )}
      </motion.button>

      {/* Switch */}
      <p className="text-center text-xs text-white/30">
        New player?{" "}
        <button
          onClick={onSwitch}
          className="text-yellow-400 font-black hover:text-yellow-300 transition-colors"
        >
          Create Account →
        </button>
      </p>
    </motion.div>
  );
}

function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-10 space-y-5 text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 0.6 }}
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{
          background: "linear-gradient(135deg, #d97706, #f59e0b)",
          boxShadow: "0 10px 40px rgba(251,191,36,0.5)",
        }}
      >
        <BsTrophyFill color="#1c1003" size={36} />
      </motion.div>

      <div>
        <h3 className="text-2xl font-black text-white">Welcome to BetX!</h3>
        <p className="text-white/40 text-sm mt-1">Your account is ready</p>
      </div>

      <div
        className="w-full rounded-2xl p-4 space-y-3"
        style={{
          background: "rgba(251,191,36,0.06)",
          border: "1px solid rgba(251,191,36,0.15)",
        }}
      >
        <div className="flex items-center gap-2 text-sm">
          <FaGift color="#f59e0b" size={14} />
          <span className="text-white/70">Bonus credited:</span>
          <span className="text-yellow-400 font-black">₹10,000 Free</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BsFillLightningChargeFill color="#22c55e" size={14} />
          <span className="text-white/70">Deposit match:</span>
          <span className="text-green-400 font-black">200% on 1st Deposit</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <RiVipCrownFill color="#a78bfa" size={14} />
          <span className="text-white/70">Status unlocked:</span>
          <span className="text-purple-400 font-black">Silver VIP</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2"
        style={{
          background: "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
          color: "#1c1003",
          boxShadow: "0 6px 30px rgba(251,191,36,0.45)",
        }}
      >
        <MdCasino size={18} />
        START PLAYING NOW
        <FaArrowRight size={13} />
      </motion.button>
    </motion.div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [success, setSuccess] = useState(false);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex items-center justify-center p-4"
      style={{ background: "#07080d" }}
    >
      {/* AMBIENT */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(251,191,36,0.07) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px]"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-[300px] h-[300px]"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Floating dice */}
        <FloatingParticle style={{ top: "8%", left: "5%", size: 22 }} />
        <FloatingParticle style={{ top: "15%", right: "8%", size: 16 }} />
        <FloatingParticle style={{ bottom: "20%", left: "10%", size: 28 }} />
        <FloatingParticle style={{ bottom: "10%", right: "6%", size: 18 }} />
        <FloatingParticle style={{ top: "45%", left: "3%", size: 14 }} />
      </div>

      <div className="relative w-full max-w-[410px]">
        {/* Logo + Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #d97706, #f59e0b)",
                boxShadow: "0 8px 30px rgba(251,191,36,0.4)",
              }}
            >
              <MdCasino size={26} color="#1c1003" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              BET
              <span
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
          <p className="text-[11px] font-black tracking-[0.2em] text-white/25">
            INDIA'S PREMIUM CASINO
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-[32px] p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Gold top shimmer */}
          <div
            className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)",
            }}
          />

          {!success && (
            <>
              {/* Tab Toggle */}
              <div
                className="relative flex p-1 rounded-2xl mb-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <motion.div
                  layout
                  className="absolute top-1 rounded-xl"
                  style={{
                    height: "calc(100% - 8px)",
                    width: "calc(50% - 4px)",
                    left: mode === "login" ? "4px" : "calc(50%)",
                    background: "linear-gradient(135deg, #d97706, #f59e0b)",
                    boxShadow: "0 4px 15px rgba(251,191,36,0.35)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
                {[
                  {
                    id: "login",
                    label: "Sign In",
                    icon: <FaSignInAlt size={13} />,
                  },
                  {
                    id: "signup",
                    label: "Register",
                    icon: <FaUserPlus size={13} />,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMode(tab.id)}
                    className="relative z-10 flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl text-xs font-black tracking-wider transition-colors duration-300"
                    style={{
                      color:
                        mode === tab.id ? "#1c1003" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {tab.icon}
                    {tab.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Security badge */}
          {!success && (
            <div
              className="flex items-center gap-1.5 mb-5 px-3 py-2 rounded-xl"
              style={{
                background: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.15)",
              }}
            >
              <MdSecurity size={14} color="#22c55e" />
              <span className="text-[10px] font-bold text-green-400/70 tracking-wide">
                256-BIT SSL ENCRYPTED
              </span>
              <MdVerified
                size={13}
                color="#22c55e"
                style={{ marginLeft: "auto" }}
              />
              <span className="text-[10px] text-green-400/50">VERIFIED</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {success ? (
              <SuccessScreen key="success" />
            ) : mode === "login" ? (
              <LoginForm
                key="login"
                onSwitch={() => setMode("signup")}
                onSuccess={() => setSuccess(true)}
              />
            ) : (
              <SignupForm
                key="signup"
                onSwitch={() => setMode("login")}
                onSuccess={() => setSuccess(true)}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        {!success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mt-5"
          >
            {[
              { icon: <FaShieldAlt size={11} />, text: "Secure" },
              {
                icon: <BsFillLightningChargeFill size={11} />,
                text: "Instant",
              },
              { icon: <FaCoins size={11} />, text: "Fair Play" },
            ].map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-[10px] font-bold text-white/20"
              >
                <span className="text-yellow-500/40">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
