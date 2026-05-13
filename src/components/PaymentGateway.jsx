import { useEffect, useState, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { IoArrowBack, IoCopy } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { SiPhonepe, SiTether } from "react-icons/si";
import { BsBank2, BsQrCode } from "react-icons/bs";
import { saveAs } from "file-saver";
import { createPayment, uploadMedia } from "../api";
import { generatePresignedUrl } from "../utils/helper/generatePresignedUrl";
import { getUserId, selectSite } from "../utils/helper/commonSelectors";

const INITIAL_FORM = {
  UTR: "", amount: 0, image: null,
  termsAccepted: false, PaymentMode: "",
  PaymentBy: "", domainId: "",
};

const TABS = [
  { name: "phone pe", label: "UPI / GPay", icon: <SiPhonepe size={20} color="#fff" />, color: "#7c3aed" },
  { name: "account",  label: "Bank",       icon: <BsBank2 size={20} color="#fff" />,   color: "#0284c7" },
  { name: "usdt",     label: "USDT",       icon: <SiTether size={20} color="#fff" />,  color: "#059669" },
];

export default function PaymentGateway({ amount, open, toggle, fetchTransactions, paymentDetails, selectedPayment }) {
  const siteDetails = useSelector(selectSite());
  const userID = useSelector(getUserId());
  const domainId = useSelector((s) => s?.site?.siteDetails?.admindomainName?._id);

  const [activeTab, setActiveTab] = useState(
    selectedPayment?.method === "bank" ? "account" :
    selectedPayment?.method === "usdt" ? "usdt" : "phone pe"
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success("Copied!"))
      .catch(() => toast.error("Copy failed"));
  }, []);

  useEffect(() => {
    setFormData((p) => ({ ...p, amount, PaymentMode: activeTab, PaymentBy: userID, domainId }));
  }, [amount, activeTab, userID, domainId]);

  useEffect(() => {
    const src = activeTab === "phone pe" ? paymentDetails.gpay : paymentDetails.usdt;
    if (src?.[0]?.imageUrl) {
      setLoading(true);
      generatePresignedUrl(src[0].imageUrl)
        .then(setQrImageUrl)
        .catch(() => { toast.error("Failed to load QR"); setQrImageUrl(""); })
        .finally(() => setLoading(false));
    }
  }, [paymentDetails, activeTab]);

  const handleInputChange = async (e) => {
    const { id, value, type, checked, files } = e.target;
    if (type === "file" && files?.[0]) {
      const file = files[0];
      new FileReader().onloadend = (r) => setImagePreview(r.target.result);
      const reader = new FileReader();
      reader.onloadend = (r) => setImagePreview(r.target.result);
      reader.readAsDataURL(file);

      const clean = new File([file], file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, ""), { type: file.type });
      const fd = new FormData(); fd.append("image", clean);
      setLoading(true);
      try {
        const res = await uploadMedia(fd);
        const url = res?.data?.data?.url;
        if (url) { setFormData((p) => ({ ...p, image: url })); toast.success("Image uploaded"); }
      } catch { toast.error("Upload failed"); }
      finally { setLoading(false); }
    } else {
      setFormData((p) => ({ ...p, [id]: type === "checkbox" ? checked : value }));
    }
  };

  const handlePayment = async (e) => {
    e?.preventDefault();
    if (!formData.UTR) return toast.error("Enter UTR / Transaction Hash");
    if (!formData.image) return toast.error("Upload payment proof");
    if (!formData.termsAccepted) return toast.error("Accept terms & conditions");
    setLoading(true);
    try {
      const res = await createPayment(formData);
      if (res.success) {
        toast.success("Payment submitted successfully");
        setFormData(INITIAL_FORM); setImagePreview("");
        if (fileInputRef.current) fileInputRef.current.value = null;
        toggle(); fetchTransactions();
      } else { toast.error(res.data?.message || "Submission failed"); }
    } catch { toast.error("Payment error"); }
    finally { setLoading(false); }
  };

  const CopyBtn = ({ text }) => (
    <button
      onClick={() => handleCopy(text)}
      className="flex items-center justify-center transition-all active:scale-95"
      style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(34,197,94,0.12)", border: "0.5px solid rgba(34,197,94,0.25)", color: "#4ade80" }}
    >
      <IoCopy size={12} />
    </button>
  );

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>{label}</span>
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.85)", fontFamily: "'DM Sans',sans-serif" }}>{value}</span>
        <CopyBtn text={value} />
      </div>
    </div>
  );

  const renderDetails = () => {
    if (activeTab === "phone pe") {
      const d = paymentDetails.gpay?.[0];
      if (!d) return <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "12px 0" }}>No UPI details available</p>;
      return (
        <>
          <InfoRow label="UPI ID" value={d.upiId} />
          {qrImageUrl && (
            <div className="flex flex-col items-center mt-4 gap-3">
              <img src={qrImageUrl} alt="QR Code" onClick={() => saveAs(qrImageUrl, "qr.png")}
                className="w-[160px] h-[160px] object-contain rounded-[14px] cursor-pointer"
                style={{ border: "0.5px solid rgba(255,255,255,0.1)", background: "#fff", padding: 8 }} />
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>Tap to download QR</p>
            </div>
          )}
        </>
      );
    }
    if (activeTab === "account") {
      const d = paymentDetails.account?.[0];
      if (!d) return <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "12px 0" }}>No bank details available</p>;
      return (
        <>
          <InfoRow label="Bank Name" value={d.bankName} />
          <InfoRow label="Account No." value={d.accountNumber} />
          <InfoRow label="IFSC Code" value={d.ifscCode} />
          <InfoRow label="Account Holder" value={d.accountHolder} />
        </>
      );
    }
    if (activeTab === "usdt") {
      const d = paymentDetails.usdt?.[0];
      if (!d) return <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", padding: "12px 0" }}>No USDT details available</p>;
      return (
        <>
          <InfoRow label="Wallet Address" value={d.walletAddress} />
          {d.network && <InfoRow label="Network" value={d.network} />}
          {qrImageUrl && (
            <div className="flex flex-col items-center mt-4 gap-3">
              <img src={qrImageUrl} alt="USDT QR" onClick={() => saveAs(qrImageUrl, "usdt-qr.png")}
                className="w-[160px] h-[160px] object-contain rounded-[14px] cursor-pointer"
                style={{ border: "0.5px solid rgba(255,255,255,0.1)", background: "#fff", padding: 8 }} />
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>Tap to download QR</p>
            </div>
          )}
        </>
      );
    }
  };

  if (!amount || !open) return null;

  const isValid = formData.UTR && formData.image && formData.amount > 0 && formData.termsAccepted;

  return (
    <div className="min-h-screen px-4 pt-5 pb-10"
      style={{ background: "linear-gradient(160deg,#0f0c03,#1a1505 50%,#0d0d0d)" }}>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-yellow-400/30 border-t-yellow-400 animate-spin" />
            <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: 1 }}>PROCESSING...</p>
          </div>
        </div>
      )}


      {/* Amount pill */}
      <div className="flex justify-center mb-5">
        <div className="flex items-center gap-2 px-5 py-2 rounded-full"
          style={{ background: "rgba(251,191,36,0.08)", border: "0.5px solid rgba(251,191,36,0.25)" }}>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>AMOUNT</span>
          <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, color: "#fbbf24" }}>₹{Number(amount).toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 mb-5">
        {TABS.map((t) => (
          <button key={t.name} onClick={() => setActiveTab(t.name)}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[14px] transition-all"
            style={{
              background: activeTab === t.name ? `${t.color}20` : "rgba(255,255,255,0.03)",
              border: activeTab === t.name ? `0.5px solid ${t.color}60` : "0.5px solid rgba(255,255,255,0.08)",
            }}>
            <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
              style={{ background: activeTab === t.name ? t.color : "rgba(255,255,255,0.08)" }}>
              {t.icon}
            </div>
            <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: activeTab === t.name ? "#fff" : "rgba(255,255,255,0.35)" }}>
              {t.label}
            </span>
          </button>
        ))}
        {siteDetails?.whatsappSupport && (
          <button
            onClick={() => window.open(`https://wa.me/${siteDetails.whatsappSupport.replace(/\s/g, "")}?text=${encodeURIComponent("Hello, I need help with my deposit.")}`, "_blank")}
            className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[14px] transition-all"
            style={{ background: "rgba(0,201,81,0.1)", border: "0.5px solid rgba(0,201,81,0.3)" }}>
            <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center" style={{ background: "#00C951" }}>
              <FaWhatsapp size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#4ade80" }}>
              SUPPORT
            </span>
          </button>
        )}
      </div>

      {/* Payment details card */}
      <div className="rounded-[16px] p-4 mb-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(251,191,36,0.45)", marginBottom: 12 }}>
          PAYMENT DETAILS
        </p>
        {renderDetails()}
      </div>

      {/* Form */}
      <div className="rounded-[16px] p-4"
        style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)" }}>
        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(251,191,36,0.45)", marginBottom: 14 }}>
          CONFIRM PAYMENT
        </p>

        {/* UTR */}
        <div className="mb-4">
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.5)", marginBottom: 7 }}>
            {activeTab === "usdt" ? "TRANSACTION HASH" : "UTR NUMBER"} <span style={{ color: "#f87171" }}>*</span>
          </p>
          <input id="UTR" value={formData.UTR} onChange={handleInputChange}
            placeholder={activeTab === "usdt" ? "Enter Transaction Hash" : "Enter 6-12 digit UTR"}
            className="w-full rounded-[12px] px-4 py-3 text-white outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(251,191,36,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(251,191,36,0.07)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Upload */}
        <div className="mb-4">
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.5)", marginBottom: 7 }}>
            PAYMENT PROOF <span style={{ color: "#f87171" }}>*</span>
          </p>
          <label className="flex items-center gap-3 rounded-[12px] px-4 py-3 cursor-pointer transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
            <div className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ background: imagePreview ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)", color: imagePreview ? "#4ade80" : "rgba(255,255,255,0.4)" }}>
              <i className={`ti ${imagePreview ? "ti-circle-check" : "ti-upload"}`} style={{ fontSize: 16 }} />
            </div>
            {imagePreview ? (
              <div className="flex items-center gap-2 flex-1">
                <img src={imagePreview} alt="preview" className="w-[32px] h-[32px] rounded-[6px] object-cover" />
                <span style={{ fontSize: 12, color: "#4ade80", fontFamily: "'DM Sans',sans-serif" }}>Uploaded successfully</span>
              </div>
            ) : (
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>Tap to upload screenshot</span>
            )}
            <input id="image" type="file" ref={fileInputRef} onChange={handleInputChange} accept="image/*" className="hidden" />
          </label>
        </div>

        {/* Amount readonly */}
        <div className="mb-4">
          <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.5)", marginBottom: 7 }}>AMOUNT</p>
          <input type="number" value={formData.amount} readOnly
            className="w-full rounded-[12px] px-4 py-3 text-white/60 outline-none"
            style={{ background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.07)", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }} />
        </div>

        {/* Terms */}
        <label className="flex items-center gap-3 cursor-pointer mb-5">
          <input id="termsAccepted" type="checkbox" checked={formData.termsAccepted} onChange={handleInputChange}
            className="w-[18px] h-[18px] rounded accent-yellow-400 cursor-pointer" />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans',sans-serif" }}>
            I accept the terms and conditions <span style={{ color: "#f87171" }}>*</span>
          </span>
        </label>

        {/* Submit */}
        <button onClick={handlePayment} disabled={loading || !isValid}
          className="w-full py-3.5 rounded-[14px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg,#d97706,#f59e0b,#fbbf24)",
            color: "#1c1003",
            fontFamily: "'Rajdhani',sans-serif",
            fontSize: 14, fontWeight: 700, letterSpacing: 2,
            boxShadow: isValid ? "0 6px 24px rgba(251,191,36,0.3)" : "none",
            border: "none", cursor: isValid ? "pointer" : "not-allowed",
          }}>
          <i className="ti ti-circle-check" style={{ fontSize: 18 }} />
          {loading ? "PROCESSING..." : "SUBMIT PAYMENT"}
        </button>
      </div>
    </div>
  );
}