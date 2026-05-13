import { useEffect, useState, useMemo, useRef } from "react";

import { useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import BottomNav from "./BottomNav";
import Navbar from "./Navbar";

import {
  getRefreshSitesByDomain,
  getSiteMetaData,
  getSitesByDomain,
} from "../api";
import { getUserId } from "../utils/helper/commonSelectors";

import { setMetaDataSettings, setSiteDetails } from "../redux/slices/siteSlice";

import { fetchNetworkDetails } from "../redux/slices/networkSlice";
import { subscribeToJoinProfileRoom } from "../socketClient";

export default function Layout({ children }) {
  const location = useLocation();

  const loggedInUserId = useSelector(getUserId());

  const dispatch = useDispatch();

  const mountedRef = useRef(true);

  // HIDE NAVBAR/BOTTOMNAV
  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/Login" ||
    location.pathname === "/signup" ||
    location.pathname === "/profile" ||
    location.pathname === "/game-lobby";

  // LOCAL STORAGE HYDRATE
  const [siteDetails, setSiteDetailsState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("siteDetails")) || {};
    } catch {
      return {};
    }
  });

  const domainName = useMemo(() => window.location.host, []);

  // ================= PRELOAD ROUTER =================

  useEffect(() => {
    let active = true;

    const loadRouter = async () => {
      const layout = siteDetails?.layout;

      if (!layout) return;

      try {
        const loader = null;

        if (!loader) return;

        const router = await loader();

        if (active) {
          setSelectedRouter(router);
        }
      } catch (err) {
        console.error("Router preload failed:", err);
      }
    };

    loadRouter();

    return () => {
      active = false;
    };
  }, [siteDetails]);

  // ================= META DATA =================

  const fetchSiteMetaData = async (siteID) => {
    try {
      const response = await getSiteMetaData(siteID);

      if (response.success && response.data) {
        dispatch(setMetaDataSettings(response.data));
      }
    } catch (err) {
      console.error("Failed to fetch metadata:", err);
    }
  };

  // ================= INITIAL SITE FETCH =================

  useEffect(() => {
    mountedRef.current = true;

    const fetchInitial = async () => {
      try {
        const response = await getSitesByDomain(domainName);

        const details = response?.data?.siteDetails;

        if (details && mountedRef.current) {
          dispatch(setSiteDetails(details));

          setSiteDetailsState(details);

          localStorage.setItem("siteDetails", JSON.stringify(details));

          await fetchSiteMetaData(details?._id);

          if (details?.meta_data?.metaPixelId) {
            if (window.__LOADED_PIXEL_ID__ !== details.meta_data.metaPixelId) {
              loadMetaPixel(details.meta_data.metaPixelId);

              window.__LOADED_PIXEL_ID__ = details.meta_data.metaPixelId;
            }
          }
        }
      } catch (err) {
        console.error("Site fetch failed:", err);
      }
    };

    fetchInitial();

    return () => {
      mountedRef.current = false;
    };
  }, [dispatch, domainName]);

  // ================= AUTO REFRESH =================

  useEffect(() => {
    let active = true;

    let intervalId;

    const startRefresh = () => {
      const refresh = async () => {
        try {
          const response = await getRefreshSitesByDomain(domainName);

          const details = response?.data?.siteDetails;

          if (details && active) {
            dispatch(setSiteDetails(details));

            setSiteDetailsState(details);

            localStorage.setItem("siteDetails", JSON.stringify(details));
          }
        } catch (err) {
          console.error("Refresh failed:", err);
        }
      };

      refresh();

      intervalId = setInterval(refresh, 900000);
    };

    if (document.readyState === "complete") {
      startRefresh();
    } else {
      window.addEventListener("load", startRefresh, { once: true });
    }

    return () => {
      active = false;

      if (intervalId) {
        clearInterval(intervalId);
      }

      window.removeEventListener("load", startRefresh);
    };
  }, [dispatch, domainName]);

  // ================= NETWORK =================

  useEffect(() => {
    dispatch(fetchNetworkDetails());

    const id = setInterval(() => {
      dispatch(fetchNetworkDetails());
    }, 900000);

    return () => clearInterval(id);
  }, [dispatch]);

  useEffect(() => {
    if (loggedInUserId) {
      subscribeToJoinProfileRoom(loggedInUserId);
    }
  }, [loggedInUserId]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#020702] text-white">
      {/* NAVBAR */}
      {!hideLayout && <Navbar />}

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-lime-500/20 blur-[160px]" />

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:100%_60px]" />
      </div>
      {children}

      {/* BOTTOM NAV */}
      {!hideLayout && <BottomNav />}
    </div>
  );
}
