import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";

// ─── Toast Helper Functions ───────────────────────────────────────────────────

const ToastContent = ({ icon, title, msg, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
    <div
      style={{
        width: 4,
        alignSelf: "stretch",
        borderRadius: "30px 0 0 30px",
        background: color,
        flexShrink: 0,
      }}
    />
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "20%",
        background: `${color}1a`,
        margin: "8px",
        flexShrink: 0,
        fontSize: 16,
        color: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, padding: "8px 10px 8px 0" }}>
      <div
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.5px",
          color: color,
          marginBottom: 2,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          lineHeight: 1.5,
          color: `${color}b3`,
        }}
      >
        {msg}
      </div>
    </div>
  </div>
);

// Spinner style for loading toast
const spinnerStyle = `
  @keyframes toast-spin { to { transform: rotate(360deg); } }
  .toast-spinner { animation: toast-spin 1s linear infinite; display: inline-block; }
`;

export const showToast = {
  success: (title, msg) =>
    toast(
      <ToastContent
        icon={<FaCheckCircle />}
        title={title}
        msg={msg}
        color="#4ade80"
      />,
      { style: { borderLeft: "none" } },
    ),

  error: (title, msg) =>
    toast(
      <ToastContent
        icon={<FaTimesCircle />}
        title={title}
        msg={msg}
        color="#f87171"
      />,
      { style: { borderLeft: "none" } },
    ),

  warning: (title, msg) =>
    toast(
      <ToastContent
        icon={<FaExclamationTriangle />}
        title={title}
        msg={msg}
        color="#fbbf24"
      />,
      { style: { borderLeft: "none" } },
    ),

  info: (title, msg) =>
    toast(
      <ToastContent
        icon={<FaInfoCircle />}
        title={title}
        msg={msg}
        color="#60a5fa"
      />,
      { style: { borderLeft: "none" } },
    ),

  loading: (title, msg) => {
    const id = toast(
      <ToastContent
        icon={
          <>
            <style>{spinnerStyle}</style>
            <span className="toast-spinner">
              <FaSpinner />
            </span>
          </>
        }
        title={title}
        msg={msg}
        color="#fbbf24"
      />,
      { autoClose: false, style: { borderLeft: "none" } },
    );
    return id;
  },

  dismiss: (id) => toast.dismiss(id),
};

// ─── ToastContainer Config ────────────────────────────────────────────────────

export function AppToastContainer() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover={false}
      draggable
      theme="dark"
      toastStyle={{
        background: "transparent",
        boxShadow: "none",
        padding: 0,
        width: "fit-content",
        minWidth: "340px",
        maxWidth: "95vw",
      }}
 toastClassName={() =>
  `!bg-[#07090f]/95 !border !border-yellow-500/15 backdrop-blur-2xl !rounded-[30px] overflow-hidden !p-0 shadow-[0_0_40px_rgba(245,158,11,0.12)] [&_.Toastify__close-button]:hidden`
}
      bodyClassName={() => `!p-0 !m-0`}
      progressStyle={{
        background: "linear-gradient(90deg, #d97706, #fbbf24)",
        height: 2,
        borderRadius: "0 0 30px 30px",
      }}
    />
  );
}
