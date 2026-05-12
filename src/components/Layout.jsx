import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login";

  return (
    <div className="min-h-screen overflow-hidden bg-[#020702] text-white">
      {!hideLayout && <Navbar />}

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-lime-500/20 blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:100%_60px]" />
      </div>

      {children}

      {!hideLayout && <BottomNav />}
    </div>
  );
}