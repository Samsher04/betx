import io from "socket.io-client";
import { baseUrl } from "./api/axios";
import store from "./redux/store";
import {
  setMatchesLoading,
  updateMatches,
  setMatchesError,
} from "./redux/slices/matchSlice";
import {
  setMarketOddsLoading,
  setMarketOddsData,
  setMarketOddsError,
} from "./redux/slices/fullmarketSlice";
import {
  setBookmakerData,
  setBookmakerError,
  setBookmakerLoading,
} from "./redux/slices/bookmakerSlice";
import { setUserData } from "./redux/slices/userSlice";
import {
  updateProfileData,
  addLatestBet,
  addBet,
} from "./redux/slices/accountSlice";
import {
  setFancyOddsData,
  setFancyOddsError,
  setFancyOddsLoading,
} from "./redux/slices/fancySlice";
import {
  updateHorseMarket,
  updateHorseSlice,
} from "./redux/slices/horseSlice";
import {
  updateGreyhoundMarket,
  updateGreyhoundSlice,
} from "./redux/slices/greyhoundSlice";
import { toast } from "react-toastify";
import {
  updateKabaddiMarket,
  updatekabaddiSlice,
} from "./redux/slices/kabaddiSlice";
import { addMatchBetsData } from "./redux/slices/betsSlice";
import {
  setDiamondCasinoOddsData,
  setDiamondCasinoOddsError,
  setDiamondCasinoOddsLoading,
} from "./redux/slices/diamondCasinoOddsSlice";

const activeSubscriptions = {
  matches: new Map(), // key: `${eventId}-${eventType}`
  marketOdds: new Map(), // key: `${eventId}-${marketId}`
  auraMarketOdds: new Map(),
  bookmaker: new Map(), // key: eventId
  auraBookmaker: new Map(),
  fancyOdds: new Map(), // key: eventId
  horseMatches: false,
  horseOdds: new Map(), // key: gmid
  greyhoundMatches: false,
  greyhoundOdds: new Map(), // key: gmid
  kabaddiMatches: false,
  kabaddiOdds: new Map(), // key: gmid
  diamondCasino: new Map(), // key: gmid
  profileRoom: null,
  myBets: null,
};

let isResubscribing = false;

export const socket = io(baseUrl, {
  auth: {
    token: store.getState().user.token || "",
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  transports: ["websocket"],
});

// ==================== GLOBAL LISTENERS (only one time) ====================

socket.on("connect", () => {
  console.log("Socket connected");
  resubscribeAll();
});

let lastHiddenTime = null;
let redirected = false;

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    console.log("App going to background");

    lastHiddenTime = Date.now();


    redirected = false;
  }

  if (document.visibilityState === "visible") {
    if (!lastHiddenTime || redirected) return;

    const diff = Date.now() - lastHiddenTime;

    // 🔥 15 seconds threshold
    if (diff > 15000) {
      console.log("Foreground after 15s → redirecting to /");

      redirected = true;

      window.location.reload();
    }
  }
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
  store.dispatch(setMatchesError({ sport: "all", error: error.message }));
  store.dispatch(setMarketOddsError(error.message));
});

// Match Updates
socket.on("matchUpdate", (data) => {
  // 🔥 CASE 1: Sports list (NO eventId)
  if (data.matches && data.sport) {
    store.dispatch(
      updateMatches({
        sport: data.sport,
        data: { data: data.matches },
      })
    );
    return;
  }

  // 🔥 CASE 2: Match-specific update (WITH eventId)
  if (data?.eventId && data?.eventType) {
    const key = `${data.eventId}-${data.eventType}`;
    const sub = activeSubscriptions.matches.get(key);
    if (!sub) return;

    const sport = data.sport || sub.sport || "unknown";
    if (data.matches) {
      store.dispatch(
        updateMatches({
          sport,
          data: { data: data.matches },
        })
      );
    }
  }
});

// Market Odds
socket.on("marketOddsUpdate", (data) => {
  if (data.marketOdds) {
    const sport = data.sport || "unknown";
    store.dispatch(
      setMarketOddsData({ data: { data: data.marketOdds }, sport })
    );
  }
});

socket.on("auramarketOddsUpdate", (data) => {
  if (data.auraMarketOdds) {
    const sport = data.sport || "unknown";
    store.dispatch(
      setMarketOddsData({ data: { data: data.auraMarketOdds }, sport })
    );
  }
});

// Bookmaker
socket.on("bookmakerUpdate", (data) => {
  if (data.bookmakerOdds) {
    const sport = data.sport || "unknown";
    store.dispatch(
      setBookmakerData({
        data: data.bookmakerOdds,
        sport,
        matchId: data.matchId || null,
      })
    );
  }
});

socket.on("auraBookmakerUpdate", (data) => {
  if (data.auraBookmakerOdds) {
    const sport = data.sport || "unknown";
    store.dispatch(
      setBookmakerData({
        data: data.auraBookmakerOdds,
        sport,
        matchId: data.matchId || null,
      })
    );
  }
});

// Fancy Odds
socket.on("fancyOddsUpdate", (data) => {
  if (data.fancyOdds) {
    const sport = data.sport || "unknown";
    store.dispatch(
      setFancyOddsData({
        data: data.fancyOdds,
        sport,
        matchId: data?.matchId || null,
      })
    );
  }
});

// Horse
socket.on("horseMatchesUpdate", (data) => {
  if (activeSubscriptions.horseMatches && data.status && data.data) {
    store.dispatch(updateHorseSlice({ horseRaceList: data?.data?.t1 }));
  }
});

socket.on("horseOddsUpdate", (data) => {
  if (data.horseOdds?.data?.length > 0) {
    const gmid = data.horseOdds.data[0].gmid;
    if (activeSubscriptions.horseOdds.has(gmid.toString())) {
      store.dispatch(updateHorseMarket({ gmid, odds: data.horseOdds.data }));
    }
  }
});

// Greyhound
socket.on("greyhoundMatchesUpdate", (data) => {
  if (activeSubscriptions.greyhoundMatches && data.status && data.data) {
    store.dispatch(updateGreyhoundSlice({ greyhoundRaceList: data?.data?.t1 }));
  }
});

socket.on("greyhoundOddsUpdate", (data) => {
  if (data.greyhoundOdds?.data?.length > 0) {
    const gmid = data.greyhoundOdds.data[0].gmid;
    if (activeSubscriptions.greyhoundOdds.has(gmid.toString())) {
      store.dispatch(
        updateGreyhoundMarket({ gmid, odds: data.greyhoundOdds.data })
      );
    }
  }
});

// Kabaddi
socket.on("kabaddiMatchesUpdate", (data) => {
  if (activeSubscriptions.kabaddiMatches && data?.kabaddiMatches) {
    store.dispatch(updatekabaddiSlice({ kabaddiList: data.kabaddiMatches }));
  }
});

socket.on("kabaddiOddsUpdate", (data) => {
  if (data?.kabaddiOdds?.length > 0) {
    const gmid = data.kabaddiOdds[0].gmid;
    if (activeSubscriptions.kabaddiOdds.has(gmid.toString())) {
      store.dispatch(updateKabaddiMarket({ gmid, odds: data.kabaddiOdds }));
    }
  }
});

// Diamond Casino
socket.on("diamondCasinoOddsUpdate", (data) => {
  if (data.diamondCasinoOdds) {
    store.dispatch(setDiamondCasinoOddsData({ data: data.diamondCasinoOdds }));
  } else if (data.message) {
    store.dispatch(setDiamondCasinoOddsError(data.message));
  }
});

// Profile & My Bets
socket.on("ProfileUpdated", (data) => {
  if (activeSubscriptions.profileRoom && data) {
    store.dispatch(setUserData(data));
    store.dispatch(updateProfileData(data));
  }
});

socket.on("myBetsUpdate", (data) => {
  if (activeSubscriptions.myBets) {
    const reversedData = Array.isArray(data?.data)
      ? [...data.data].reverse()
      : [];
    store.dispatch(addMatchBetsData(reversedData));
    store.dispatch(addBet(reversedData));
  }
});

// Global error (optional)
socket.on("error", (error) => {
  console.error("Socket error:", error.message);
});

// ==================== RESUBSCRIBE ON RECONNECT ====================
const resubscribeAll = () => {
  if (isResubscribing) return;
  isResubscribing = true;

  console.log("Resubscribing all active channels...");

  activeSubscriptions.matches.forEach((params) => {
    socket.emit("subscribeToMatches", {
      eventId: params.eventId,
      eventType: params.eventType,
    });
  });

  activeSubscriptions.marketOdds.forEach((params) => {
    socket.emit("subscribeToMarketOdds", params);
  });

  activeSubscriptions.auraMarketOdds.forEach((params) => {
    socket.emit("subscribeToAuraMarketOdds", params);
  });

  activeSubscriptions.bookmaker.forEach((params) => {
    socket.emit("subscribeToBookmaker", params);
  });

  activeSubscriptions.auraBookmaker.forEach((params) => {
    socket.emit("subscribeToAuraBookmaker", params);
  });

  activeSubscriptions.fancyOdds.forEach((params) => {
    socket.emit("subscribeToFancyOdds", params);
  });

  if (activeSubscriptions.horseMatches) socket.emit("subscribeToHourseMatches");
  activeSubscriptions.horseOdds.forEach((params) =>
    socket.emit("subscribeToHourseOdds", params)
  );

  if (activeSubscriptions.greyhoundMatches)
    socket.emit("subscribeToGreyhoundMatches");
  activeSubscriptions.greyhoundOdds.forEach((params) =>
    socket.emit("subscribeToGreyHoundOdds", params)
  );

  if (activeSubscriptions.kabaddiMatches)
    socket.emit("subscribeToKabaddiMatches", { eventId: "8" });
  activeSubscriptions.kabaddiOdds.forEach((params) =>
    socket.emit("subscribeToKabaddiOdds", params)
  );

  activeSubscriptions.diamondCasino.forEach((params) =>
    socket.emit("subscribeToDiamondCasinoOdds", params)
  );

  if (activeSubscriptions.profileRoom)
    socket.emit("joinProfileRoom", activeSubscriptions.profileRoom);
  if (activeSubscriptions.myBets)
    socket.emit("joinMyBets", activeSubscriptions.myBets);
};

// ==================== SUBSCRIPTION FUNCTIONS (Safe & Clean) ====================

export const subscribeToMatchData = ({
  eventId,
  eventType,
  sport = "unknown",
}) => {
  const key = `${eventId}-${eventType}`;
  activeSubscriptions.matches.set(key, { eventId, eventType, sport });

  store.dispatch(setMatchesLoading({ sport }));
  socket.emit("subscribeToMatches", { eventId, eventType });

  return () => {
    activeSubscriptions.matches.delete(key);
    socket.emit("unsubscribeFromMatches", { eventId });
  };
};

export const subscribeToMarketOddsData = ({
  eventId,
  eventType,
  competitionId,
  matchId,
  marketId,
  sport = "unknown",
}) => {
  const key = `${eventId}-${marketId}`;
  const params = { eventId, eventType, competitionId, matchId, marketId };

  activeSubscriptions.marketOdds.set(key, { ...params, sport });
  store.dispatch(setMarketOddsLoading());
  socket.emit("subscribeToMarketOdds", params);

  return () => {
    activeSubscriptions.marketOdds.delete(key);
    socket.emit("unsubscribeFromMarketOdds", { eventId, marketId });
  };
};

export const subscribeToAuraMarketOddsData = ({
  eventId,
  eventType,
  competitionId,
  matchId,
  marketId,
  sport = "unknown",
}) => {
  const key = `${eventId}-${marketId}`;
  const params = { eventId, eventType, competitionId, matchId, marketId };

  activeSubscriptions.auraMarketOdds.set(key, { ...params, sport });
  store.dispatch(setMarketOddsLoading());
  socket.emit("subscribeToAuraMarketOdds", params);

  return () => {
    activeSubscriptions.auraMarketOdds.delete(key);
    socket.emit("unsubscribeFromAuraMarketOdds", { eventId, marketId });
  };
};

export const subscribeToLeaveMyBets = () => {
  const userId = store.getState()?.user?.userData?._id;
  if (!userId) return;

  activeSubscriptions.myBets = null;

  socket.emit("leaveMyBets", userId);
  socket.off("myBetsUpdate");
};

export const subscribeToBookmakerData = ({
  eventId,
  eventType,
  competitionId,
  sport = "unknown",
}) => {
  const key = `${eventId}`;
  const params = { eventId, eventType, competitionId };

  activeSubscriptions.bookmaker.set(key, { ...params, sport });
  store.dispatch(setBookmakerLoading());
  socket.emit("subscribeToBookmaker", params);

  return () => {
    activeSubscriptions.bookmaker.delete(key);
    socket.emit("unsubscribeFromBookmaker", { eventId });
  };
};

export const subscribeToAuraBookmakerData = ({
  eventId,
  eventType,
  competitionId,
  sport = "unknown",
}) => {
  const key = `${eventId}`;
  const params = { eventId, eventType, competitionId };

  activeSubscriptions.auraBookmaker.set(key, { ...params, sport });
  store.dispatch(setBookmakerLoading());
  socket.emit("subscribeToAuraBookmaker", params);

  return () => {
    activeSubscriptions.auraBookmaker.delete(key);
    socket.emit("unsubscribeFromAuraBookmaker", { eventId });
  };
};

export const subscribeToFancyOddsData = ({
  eventId,
  eventType,
  competitionId,
  sport = "unknown",
}) => {
  const key = `${eventId}`;
  const params = { eventId, eventType, competitionId };

  activeSubscriptions.fancyOdds.set(key, { ...params, sport });
  store.dispatch(setFancyOddsLoading());
  socket.emit("subscribeToFancyOdds", params);

  return () => {
    activeSubscriptions.fancyOdds.delete(key);
    socket.emit("unsubscribeFromFancyOdds", { eventId });
  };
};

export const subscribeToHorseMatchesData = () => {
  activeSubscriptions.horseMatches = true;
  socket.emit("subscribeToHourseMatches");

  return () => {
    activeSubscriptions.horseMatches = false;
    socket.emit("unsubscribeFromHourseMatches", {});
  };
};

export const subscribeToHourseOddsData = ({ eventId, eventType, gmid }) => {
  const key = `${gmid}`;
  activeSubscriptions.horseOdds.set(key, { eventId, eventType, gmid });
  socket.emit("subscribeToHourseOdds", { eventId, eventType, gmid });

  return () => {
    activeSubscriptions.horseOdds.delete(key);
    socket.emit("unsubscribeFromHourseOdds", { eventId, gmid });
  };
};

export const subscribeToGreyhoundMatchesData = () => {
  activeSubscriptions.greyhoundMatches = true;
  socket.emit("subscribeToGreyhoundMatches");

  return () => {
    activeSubscriptions.greyhoundMatches = false;
  };
};

export const subscribeToGreyHoundOddsData = ({ eventId, eventType, gmid }) => {
  const key = `${gmid}`;
  activeSubscriptions.greyhoundOdds.set(key, { eventId, eventType, gmid });
  socket.emit("subscribeToGreyHoundOdds", { eventId, eventType, gmid });

  return () => {
    activeSubscriptions.greyhoundOdds.delete(key);
    socket.emit("unsubscribeFromGreyHoundOdds", { eventId, gmid });
  };
};

export const subscribeToKabaddiMatchesData = () => {
  activeSubscriptions.kabaddiMatches = true;
  socket.emit("subscribeToKabaddiMatches", { eventId: "8" });

  return () => {
    activeSubscriptions.kabaddiMatches = false;
  };
};

export const subscribeToKabaddiMatchesDataOdds = (gmid) => {
  const key = `${gmid}`;
  activeSubscriptions.kabaddiOdds.set(key, {
    eventId: "8",
    eventType: "kabaddi",
    gmid,
  });
  socket.emit("subscribeToKabaddiOdds", {
    eventId: "8",
    eventType: "kabaddi",
    gmid,
  });

  return () => {
    activeSubscriptions.kabaddiOdds.delete(key);
    socket.emit("unsubscribeFromKabaddiOdds", { gmid });
  };
};

export const subscribeToDiamondCasinoOddsData = ({
  eventId,
  eventType,
  gmid,
}) => {
  const key = `${gmid}`;
  activeSubscriptions.diamondCasino.set(key, { eventId, eventType, gmid });
  store.dispatch(setDiamondCasinoOddsLoading());
  socket.emit("subscribeToDiamondCasinoOdds", { eventId, eventType, gmid });

  return () => {
    activeSubscriptions.diamondCasino.delete(key);
    socket.emit("unsubscribeFromDiamondCasinoOdds", { gmid });
  };
};

export const subscribeToJoinProfileRoom = (currentUserId) => {
  activeSubscriptions.profileRoom = currentUserId;
  socket.emit("joinProfileRoom", currentUserId);

  return () => {
    activeSubscriptions.profileRoom = null;
    socket.emit("profile_disconnect");
  };
};

export const subscribeToJoinMyBets = () => {
  const userId = store.getState()?.user?.userData?._id;
  if (!userId) return () => {};

  activeSubscriptions.myBets = userId;
  socket.emit("joinMyBets", userId);

  return () => {
    activeSubscriptions.myBets = null;
    socket.emit("leaveMyBets", userId);
  };
};

// ==================== MANUAL UNSUBSCRIBE EXPORTS (Tere project) ====================

export const unsubscribeFromMatches = (eventId) => {
  activeSubscriptions.matches.forEach((value, key) => {
    if (value.eventId === eventId) {
      activeSubscriptions.matches.delete(key);
    }
  });
  socket.emit("unsubscribeFromMatches", { eventId });
};

export const unsubscribeFromMarketOdds = (eventId, marketId) => {
  const key = `${eventId}-${marketId}`;
  activeSubscriptions.marketOdds.delete(key);
  socket.emit("unsubscribeFromMarketOdds", { eventId, marketId });
};

export const unsubscribeFromAuraMarketOdds = (eventId, marketId) => {
  const key = `${eventId}-${marketId}`;
  activeSubscriptions.auraMarketOdds.delete(key);
  socket.emit("unsubscribeFromAuraMarketOdds", { eventId, marketId });
};

export const unsubscribeFromBookmaker = (eventId) => {
  activeSubscriptions.bookmaker.delete(`${eventId}`);
  socket.emit("unsubscribeFromBookmaker", { eventId });
};

export const unsubscribeFromAuraBookmaker = (eventId) => {
  activeSubscriptions.auraBookmaker.delete(`${eventId}`);
  socket.emit("unsubscribeFromAuraBookmaker", { eventId });
};

export const unsubscribeFromFancyOdds = (eventId) => {
  activeSubscriptions.fancyOdds.delete(`${eventId}`);
  socket.emit("unsubscribeFromFancyOdds", { eventId });
};

export const unsubscribeFromHourseOdds = (gmid) => {
  activeSubscriptions.horseOdds.delete(`${gmid}`);
  socket.emit("unsubscribeFromHourseOdds", { gmid });
};

export const unsubscribeFromGreyHoundOdds = (gmid) => {
  activeSubscriptions.greyhoundOdds.delete(`${gmid}`);
  socket.emit("unsubscribeFromGreyHoundOdds", { gmid });
};

export const unsubscribeFromKabaddiOdds = (gmid) => {
  activeSubscriptions.kabaddiOdds.delete(`${gmid}`);
  socket.emit("unsubscribeFromKabaddiOdds", { gmid });
};

export const unsubscribeFromDiamondCasinoOdds = (gmid) => {
  activeSubscriptions.diamondCasino.delete(`${gmid}`);
  socket.emit("unsubscribeFromDiamondCasinoOdds", { gmid });
};

export const setUserOnline = (userId) =>
  socket.emit("userOnline", { currentUserId: userId });
export const setUserOffline = (userId) =>
  socket.emit("userOffline", { currentUserId: userId });

export const placeBet = async (betData) => {
  const state = store?.getState();
  const {
    minBet: globalMin,
    maxBet: globalMax,
    sports,
  } = state?.betSettingsSlice?.betSettings || {};
  const { ip, isp } = state?.network || {};
  const siteId = state?.site?.siteDetails?._id || "";
  const layout = state?.site?.siteDetails?.layout || "";
  const UserAvailableBalance = state?.user?.userData?.availableBalance;
  let minBet = globalMin || 50;
  let maxBet = globalMax || 50000;

  if (betData.sportsName && betData.market) {
    const sport = sports?.find((s) => s.sportName === betData.sportsName);
    if (sport) {
      const market = sport.markets?.find(
        (m) => m.marketName === betData.market
      );
      if (market) {
        minBet = market.minBet ?? globalMin;
        maxBet = market.maxBet ?? globalMax;
      }
    }
  }
  if (!betData?.isCashout) {
    if (minBet !== undefined && betData?.stake < minBet) {
      toast.error(`Bet amount must be at least ${minBet}`);
      return Promise.reject();
    }
    if (maxBet !== undefined && betData?.stake > maxBet) {
      toast.error(`Bet amount cannot exceed ${maxBet}`);
      return Promise.reject();
    }
  }

  if (UserAvailableBalance < 0) {
    toast.error("Your balance is negative. Please deposit funds.");
    return Promise.reject();
  }
  const _id = localStorage?.getItem("userId") || "";

  return new Promise((resolve) => {
    socket.emit(
      "placeBet",
      {
        ...betData,
        type: betData?.type?.toLowerCase()?.trim() === "lay" ? "Lay" : "Back",
        userId: _id,
        layout,
        siteId,
        network: {
          deviceIp: ip,
          isp,
        },
      },
      (response) => {
        if (response?.statusCode === 200) {
          store.dispatch(addLatestBet(betData));
        }
        resolve(response);
      }
    );
  });
};

export const generatePresignedUrlFromS3Url = (s3Url) => {
  return new Promise((resolve, reject) => {
    socket.emit("generatePresignedUrlFromS3Url", s3Url, (response) => {
      if (response.status === "success") resolve(response.data);
      else reject(new Error(response.message || "Failed"));
    });
  });
};

export const subscribeToLogin = (payload) => {
  return new Promise((resolve) => {
    const domainId =
      store.getState()?.site?.siteDetails?.domainDetails?._id || "";
    socket.emit("login", { ...payload, domainid: domainId }, (response) => {
      resolve(response);
    });
  });
};

export default socket;
