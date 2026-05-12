import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser, FaLock, FaEye, FaEyeSlash, FaPhone,
  FaGoogle, FaFacebook, FaTelegram,
  FaShieldAlt, FaCheckCircle, FaCoins,
  FaArrowRight, FaChevronLeft, FaDice,
  FaGift, FaStar, FaBolt,
  FaEnvelope, FaUserPlus, FaSignInAlt,
} from "react-icons/fa";
import {
  MdCasino, MdVerified, MdSecurity,
} from "react-icons/md";
import {
  RiVipCrownFill, RiLockPasswordFill, RiUserSmileFill,
} from "react-icons/ri";
import {
  HiSparkles,
} from "react-icons/hi";
import { BsTrophyFill, BsFillLightningChargeFill } from "react-icons/bs";

const PERKS = [
  { icon: <FaGift size={14} />, text: "₹10 Lakh Welcome Bonus", color: "#f59e0b" },
  { icon: <BsTrophyFill size={12} />, text: "Instant Withdrawals", color: "#22c55e" },
  { icon: <RiVipCrownFill size={14} />, text: "VIP Rewards Program", color: "#a78bfa" },
  { icon: <FaBolt size={13} />, text: "24/7 Live Support", color: "#38bdf8" },
];

const SOCIAL = [
  { icon: <FaGoogle size={16} />, label: "Google", color: "#ea4335", bg: "rgba(234,67,53,0.12)", border: "rgba(234,67,53,0.25)" },
  { icon: <FaFacebook size={16} />, label: "Facebook", color: "#1877f2", bg: "rgba(24,119,242,0.12)", border: "rgba(24,119,242,0.25)" },
  { icon: <FaTelegram size={16} />, label: "Telegram", color: "#29a8eb", bg: "rgba(41,168,235,0.12)", border: "rgba(41,168,235,0.25)" },
];

function FloatingParticle({ style }) {
  return (
    <motion.div
      animate={{ y: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute text-yellow-500/20 pointer-events-none"
      style={style}
    >
      <FaDice size={style.size || 18} />
    </motion.div>
  );
}

function InputField({ icon, rightIcon, label, type = "text", placeholder, value, onChange, error }) {
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
            border: error ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          }}
          onFocus={e => {
            e.target.style.border = "1px solid rgba(251,191,36,0.4)";
            e.target.style.background = "rgba(251,191,36,0.04)";
            e.target.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.08), 0 2px 12px rgba(0,0,0,0.2)";
          }}
          onBlur={e => {
            e.target.style.border = error ? "1px solid rgba(239,68,68,0.6)" : "1px solid rgba(255,255,255,0.08)";
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
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-[11px] font-medium flex items-center gap-1.5 pl-1">
          <FaShieldAlt size={10} /> {error}
        </motion.p>
      )}
    </div>
  );
}

function LoginForm({ onSwitch, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!phone || phone.length < 10) e.phone = "Valid phone number required";
    if (!password || password.length < 6) e.password = "Min 6 characters required";
    return e;
  };

  const handleLogin = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess?.(); }, 1800);
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
        icon={<FaPhone size={13} />}
        label="MOBILE NUMBER"
        type="tel"
        placeholder="Enter 10-digit number"
        value={phone}
        onChange={e => setPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
        error={errors.phone}
      />

      <InputField
        icon={<RiLockPasswordFill size={15} />}
        label="PASSWORD"
        type={showPw ? "text" : "password"}
        placeholder="Enter your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={errors.password}
        rightIcon={
          <span onClick={() => setShowPw(s => !s)}>
            {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </span>
        }
      />

      {/* Forgot password */}
      <div className="flex justify-end">
        <button className="text-[11px] font-semibold text-yellow-400/70 hover:text-yellow-400 transition-colors">
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <motion.button
        onClick={handleLogin}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        disabled={loading}
        className="w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
        style={{
          background: loading
            ? "rgba(251,191,36,0.3)"
            : "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
          color: "#1c1003",
          boxShadow: loading ? "none" : "0 6px 30px rgba(251,191,36,0.45), 0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        {loading ? (
          <>
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
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
        <button onClick={onSwitch} className="text-yellow-400 font-black hover:text-yellow-300 transition-colors">
          Create Account →
        </button>
      </p>
    </motion.div>
  );
}

function SignupForm({ onSwitch, onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const validateStep1 = () => {
    const e = {};
    if (!name.trim()) e.name = "Full name required";
    if (!phone || phone.length < 10) e.phone = "Valid 10-digit number required";
    return e;
  };

  const validateStep2 = () => {
    const e = {};
    if (!email || !email.includes("@")) e.email = "Valid email required";
    if (!password || password.length < 8) e.password = "Min 8 characters required";
    if (!agreed) e.agreed = "Please accept terms to continue";
    return e;
  };

  const nextStep = () => {
    const e = validateStep1();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handleSignup = () => {
    const e = validateStep2();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess?.(); }, 2000);
  };

  const strength = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
    : password.length >= 6 ? 2
    : password.length >= 3 ? 1 : 0;

  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e"];

  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-2">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300"
              style={{
                background: step >= s ? "linear-gradient(135deg, #d97706, #f59e0b)" : "rgba(255,255,255,0.05)",
                color: step >= s ? "#1c1003" : "rgba(255,255,255,0.25)",
                border: step >= s ? "none" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: step >= s ? "0 4px 15px rgba(251,191,36,0.4)" : "none",
              }}
            >
              {step > s ? <FaCheckCircle size={12} /> : s}
            </div>
            <span className="text-[10px] font-bold tracking-wider" style={{ color: step >= s ? "#f59e0b" : "rgba(255,255,255,0.2)" }}>
              {s === 1 ? "IDENTITY" : "ACCOUNT"}
            </span>
            {s < 2 && <div className="w-6 h-px mx-1" style={{ background: step > s ? "rgba(251,191,36,0.6)" : "rgba(255,255,255,0.1)" }} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <InputField
              icon={<RiUserSmileFill size={15} />}
              label="FULL NAME"
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
              error={errors.name}
            />
            <InputField
              icon={<FaPhone size={13} />}
              label="MOBILE NUMBER"
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/, "").slice(0, 10))}
              error={errors.phone}
            />

            <motion.button
              onClick={nextStep}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
                color: "#1c1003",
                boxShadow: "0 6px 30px rgba(251,191,36,0.4)",
              }}
            >
              Continue
              <FaArrowRight size={13} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-yellow-400 transition-colors font-semibold">
              <FaChevronLeft size={10} /> Back
            </button>

            <InputField
              icon={<FaEnvelope size={13} />}
              label="EMAIL ADDRESS"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
            />

            <div className="space-y-1.5">
              <InputField
                icon={<RiLockPasswordFill size={15} />}
                label="CREATE PASSWORD"
                type={showPw ? "text" : "password"}
                placeholder="Min 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                rightIcon={
                  <span onClick={() => setShowPw(s => !s)}>
                    {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </span>
                }
              />
              {/* Password strength */}
              {password.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-1 w-8 rounded-full transition-all duration-300"
                        style={{ background: strength >= i ? strengthColor[strength] : "rgba(255,255,255,0.08)" }} />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </span>
                </motion.div>
              )}
            </div>

            <InputField
              icon={<FaStar size={12} />}
              label="REFERRAL CODE (OPTIONAL)"
              placeholder="Enter referral code"
              value={referral}
              onChange={e => setReferral(e.target.value.toUpperCase())}
            />

            {/* Terms */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => setAgreed(a => !a)}
                className="w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-300"
                style={{
                  background: agreed ? "linear-gradient(135deg, #d97706, #f59e0b)" : "rgba(255,255,255,0.05)",
                  border: agreed ? "none" : "1px solid rgba(255,255,255,0.15)",
                  boxShadow: agreed ? "0 2px 10px rgba(251,191,36,0.4)" : "none",
                }}
              >
                {agreed && <FaCheckCircle size={11} color="#1c1003" />}
              </button>
              <span className="text-[11px] text-white/30 leading-relaxed">
                I agree to{" "}
                <button className="text-yellow-400/80 hover:text-yellow-400">Terms of Service</button>
                {" "}and{" "}
                <button className="text-yellow-400/80 hover:text-yellow-400">Privacy Policy</button>
                . I am 18+ years old.
              </span>
            </div>
            {errors.agreed && (
              <p className="text-red-400 text-[11px] flex items-center gap-1.5 pl-1">
                <FaShieldAlt size={10} /> {errors.agreed}
              </p>
            )}

            <motion.button
              onClick={handleSignup}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                background: loading ? "rgba(251,191,36,0.3)" : "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
                color: "#1c1003",
                boxShadow: loading ? "none" : "0 6px 30px rgba(251,191,36,0.45)",
              }}
            >
              {loading ? (
                <>
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <MdCasino size={18} />
                  </motion.span>
                  Creating Account...
                </>
              ) : (
                <>
                  <FaUserPlus size={14} />
                  CREATE ACCOUNT
                  <HiSparkles size={15} />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-xs text-white/30">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-yellow-400 font-black hover:text-yellow-300 transition-colors">
          Login →
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

      <div className="w-full rounded-2xl p-4 space-y-3" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.15)" }}>
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]"
          style={{ background: "radial-gradient(ellipse, rgba(251,191,36,0.07) 0%, transparent 65%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px]"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.04) 0%, transparent 70%)" }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
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
              <span style={{
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>X</span>
            </h1>
          </div>
          <p className="text-[11px] font-black tracking-[0.2em] text-white/25">INDIA'S PREMIUM CASINO</p>
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
            boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Gold top shimmer */}
          <div className="absolute top-0 inset-x-0 h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)" }} />

          {!success && (
            <>
              {/* Tab Toggle */}
              <div
                className="relative flex p-1 rounded-2xl mb-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
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
                  { id: "login", label: "Sign In", icon: <FaSignInAlt size={13} /> },
                  { id: "signup", label: "Register", icon: <FaUserPlus size={13} /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setMode(tab.id)}
                    className="relative z-10 flex-1 py-2.5 flex items-center justify-center gap-2 rounded-xl text-xs font-black tracking-wider transition-colors duration-300"
                    style={{ color: mode === tab.id ? "#1c1003" : "rgba(255,255,255,0.3)" }}
                  >
                    {tab.icon}
                    {tab.label.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Form title */}
              <div className="mb-5">
                <h2 className="text-xl font-black text-white">
                  {mode === "login" ? "Welcome Back! 👋" : "Join BetX Today 🎉"}
                </h2>
                <p className="text-xs text-white/30 mt-1">
                  {mode === "login"
                    ? "Login to continue your winning streak"
                    : "Create account & claim your welcome bonus"}
                </p>
              </div>
            </>
          )}

          {/* Security badge */}
          {!success && (
            <div className="flex items-center gap-1.5 mb-5 px-3 py-2 rounded-xl"
              style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.15)" }}>
              <MdSecurity size={14} color="#22c55e" />
              <span className="text-[10px] font-bold text-green-400/70 tracking-wide">256-BIT SSL ENCRYPTED</span>
              <MdVerified size={13} color="#22c55e" style={{ marginLeft: "auto" }} />
              <span className="text-[10px] text-green-400/50">VERIFIED</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {success ? (
              <SuccessScreen key="success" />
            ) : mode === "login" ? (
              <LoginForm key="login" onSwitch={() => setMode("signup")} onSuccess={() => setSuccess(true)} />
            ) : (
              <SignupForm key="signup" onSwitch={() => setMode("login")} onSuccess={() => setSuccess(true)} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        {!success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-4 mt-5"
          >
            {[
              { icon: <FaShieldAlt size={11} />, text: "Secure" },
              { icon: <BsFillLightningChargeFill size={11} />, text: "Instant" },
              { icon: <FaCoins size={11} />, text: "Fair Play" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold text-white/20">
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