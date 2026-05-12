import { useEffect, useState } from "react";
import { HiSparkles } from "react-icons/hi";
import { motion } from "framer-motion";
import { RiLockPasswordFill, RiUserSmileFill } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaShieldAlt, FaUserPlus } from "react-icons/fa";
import { MdCasino } from "react-icons/md"; // ✅ Missing import added

import { useDispatch, useSelector } from "react-redux";
import { selectSite } from "../../utils/helper/commonSelectors";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getSitesByDomain, signUp } from "../../api";
import { loginSuccess } from "../../redux/slices/userSlice";
import { setAccountType } from "../../redux/slices/accountSlice";
import { subscribeToLogin } from "../../socketClient";
import { showToast } from "../../utils/ToastContent";

// ─────────────────────────────────────────────
// Reusable InputField component
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// SignupForm component
// ─────────────────────────────────────────────
function SignupForm({ onSwitch, onSuccess }) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [params, setParams] = useState({});

  const siteDetails = useSelector(selectSite());

  const [formData, setFormData] = useState({
    mobile: "",
    userName: "",
    name: "",
    password: "",
    confirmPassword: "",
    x_panel_type: "user",
    commission: 0,
    openingBalance: 0,
    availableBalance: 0,
    creditReference: 0,
    partnership: 0,
    currency: "INR",
    exposureLimit: 200000,
    exposure: 0,
    createdBy: "",
    referredBy: "",
    deviceIp: "0.0.0",
    role: "",
    domain: "",
    ownerDomainId: "",
    otp: "",
    isSignupUser: true,
    layout: "gugoexchnage",
    siteID: "",
  });

  // ✅ Helper to update any formData field
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // mobile aur name mein bhi userName hi jayega
      ...(field === "userName" && { name: value }),
    }));
    // Clear that field's error on change
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ✅ Read URL query params on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const referral = searchParams.get("referral") || "";
    setParams({ referral });
  }, []);

  // ✅ Fetch site details by domain
  useEffect(() => {
    const fetchSiteDetails = async () => {
      try {
        const domainName = window.location.host;
        const response = await getSitesByDomain(domainName);
        const site = response?.data;

        setFormData((prev) => ({
          ...prev,
          createdBy: site?.createdBy?._id || site?.siteDetails?.createrId || "",
          role: site?.userRoleId || "",
          domain: site?.siteDetails?.domainDetails?._id || "",
          ownerDomainId: site?.siteDetails?.admindomainName?._id || "",
          ...(params.referral && { referredBy: params.referral }),
        }));
      } catch (error) {
        console.error("Failed to fetch site details:", error);
      }
    };

    fetchSiteDetails();
  }, [params]); // re-run after params are set

  // ✅ Sync siteID from Redux store
  useEffect(() => {
    if (siteDetails?._id) {
      setFormData((prev) => ({ ...prev, siteID: siteDetails._id }));
    }
  }, [siteDetails]);

  // ─── Validation ───────────────────────────
  const validate = () => {
    const e = {};

    if (!formData.userName.trim()) {
      e.userName = "Username is required";
    }

    if (!formData.password || formData.password.length < 6) {
      e.password = "Minimum 6 characters required";
    }

    if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    return e;
  };


 
 
  const handleSignup = async () => {
    // ✅ VALIDATION
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      // REMOVE CONFIRM PASSWORD
      const { confirmPassword, ...payload } = formData;

      // ─── SIGNUP API ───────────────────────
      const response = await signUp(payload);



      // ─── SUCCESS ─────────────────────────
      if (response?.data?.message === "User created successfully") {
        // ─── AUTO LOGIN ────────────────────
        const loginResponse = await subscribeToLogin({
          userName: formData.userName,
          password: formData.password,
          x_panel_type: "user",
        });



        // ─── LOGIN SUCCESS ─────────────────
        if (loginResponse?.success) {
          const { token, userdata } = loginResponse;

          localStorage.setItem("userId", userdata?._id);

          dispatch(
            loginSuccess({
              userData: userdata,
              loggedInType: "real",
              token,
            }),
          );

          dispatch(
            setAccountType({
              userData: userdata,
              type: "real",
            }),
          );

          showToast.success(`Welcome ${userdata?.userName}`);



          // REDIRECT
          navigate("/");
        } else {
          showToast.error(loginResponse?.message || "Auto login failed");
        }
      } else {
        showToast.error(response?.data?.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);

      showToast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // ─── Password strength ────────────────────
  const pw = formData.password;
  const strength =
    pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)
      ? 3
      : pw.length >= 6
        ? 2
        : pw.length >= 3
          ? 1
          : 0;

  const strengthLabel = ["", "Weak", "Good", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#22c55e"];

  // ─────────────────────────────────────────
  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {/* USERNAME */}
      <InputField
        icon={<RiUserSmileFill size={15} />}
        label="USERNAME"
        placeholder="Enter username"
        value={formData.userName}
        onChange={handleChange("userName")}
        error={errors.userName}
      />

      {/* PASSWORD */}
      <div className="space-y-1.5">
        <InputField
          icon={<RiLockPasswordFill size={15} />}
          label="PASSWORD"
          type={showPw ? "text" : "password"}
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange("password")}
          error={errors.password}
          rightIcon={
            <span onClick={() => setShowPw((s) => !s)}>
              {showPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
            </span>
          }
        />

        {/* PASSWORD STRENGTH BAR */}
        {pw.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 pl-1"
          >
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1 w-8 rounded-full transition-all duration-300"
                  style={{
                    background:
                      strength >= i
                        ? strengthColor[strength]
                        : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
            <span
              className="text-[10px] font-bold"
              style={{ color: strengthColor[strength] }}
            >
              {strengthLabel[strength]}
            </span>
          </motion.div>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <InputField
        icon={<RiLockPasswordFill size={15} />}
        label="CONFIRM PASSWORD"
        type={showConfirmPw ? "text" : "password"}
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={handleChange("confirmPassword")}
        error={errors.confirmPassword}
        rightIcon={
          <span onClick={() => setShowConfirmPw((s) => !s)}>
            {showConfirmPw ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
          </span>
        }
      />

      {/* CREATE ACCOUNT BUTTON */}
      <motion.button
        onClick={handleSignup}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        disabled={loading}
        className="w-full py-4 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-300"
        style={{
          background: loading
            ? "rgba(251,191,36,0.3)"
            : "linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)",
          color: "#1c1003",
          boxShadow: loading ? "none" : "0 6px 30px rgba(251,191,36,0.45)",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? (
          <>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <MdCasino size={18} /> {/* ✅ Now imported */}
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

      {/* SWITCH TO LOGIN */}
      <p className="text-center text-xs text-white/30">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-yellow-400 font-black hover:text-yellow-300 transition-colors"
        >
          Login →
        </button>
      </p>
    </motion.div>
  );
}

export default SignupForm;
