import store from "../redux/store";
import { apiGET, apiPOST } from "./handler";
import axios from "axios";

export const API_URL = {
  get_sitesData: (domainName) => {
    return `/api/v1/find-by-domain/${domainName}`;
  },
  get_RefreshSitesData: (domainName) => {
    return `/api/v1/find-by-domain/${domainName}?refresh=${Math.random()}`;
  },
  login: "/api/v1/users/login",
  forgotPassword: "/api/forgot-password",
  resetPassword: "/api/reset-password",
  signup: "/api/v1/users/signup",
  demo: "/api/v1/demo",
  match: (eventID) => `/api/v1/get-matches-by-eventid/${eventID}`,
  create: "/api/v1/bet/create",
  myBets: "/api/v1/bet/myBets",
  getSettledBets: "/api/v1/bet/SettledBets",
  getUnsettledBets: "/api/v1/bet/UnsettleBets",
  loginRecord: "/api/v1/loginRecord",
  getLoginRecord: (userID) => `/api/v1/getLoginRecord/${userID}`,
  getAccountStatements: `/api/v1/account-statement`,
  getCurrentRecord: "",
  getuserdata: (userID) => `/api/v1/users/getuserdata/${userID}`,
  updatePassword: `/api/v1/users/change-password/`,
  updateUserPassword: `/api/v1/users/change-userpassword/`,
  createPayment: `/api/payments`,
  getPaymentsByUserId: (userID) => `/api/getPaymentsByUserId/${userID}`,
  upload_media: "/api/v1/upload_media",
  getListUrl: (listOf) => `api/v1/list/${listOf}`,
  getCasinoData: (casinoType, eventID) =>
    `api/v1/data/casino/${casinoType}/${eventID}`,
  createAccount: "/api/v1/new-account",
  getAccounts: "/api/v1/getAccounts",
  deleteAccount: (id) => `/api/v1/deleteAccount/${id}`,
  withdraw: `/api/v1/withdraw`,
  getProfitLossReport: `/api/v1/profit-loss`,
  getwithdrawals: (userId) => `/api/v1/withdrawals/${userId}`,
  getactiveAdminDepositMethod: "/api/v1/admin-deposit-methods-domainID",
  getBet: "/api/v1/bet/Bets",
  getLegues: (id) => `https://api.professor.monster/api/v1/get-legues/${id}`,
  getMatchesList: (id, marketId) =>
    `https://api.professor.monster/api/v1/get-matches/${id}/${marketId}`,
  getAffiliateData: "/api/v1/users/affiliate",
  generatePresignedUrlFromS3Url: "/api/v1/presigned-url",
  logPasswordChange: "/api/v1/logPasswordChange",
  GetDownlinelogPasswordHistory:
    "/api/v1/GetDownlinelogPasswordHistoryByUserId",
  updateCasinoBalance: `/api/v1/users/update-casinoBalance`,
  ReCallCasinoBalance: `/api/v1/users/recall-casinoBalance`,
  Multipin: "/api/v1/get-multipin",
  BookmakerMultipin: "/api/v1/get-multipin-bookmaker",

  getBetMinMaxSetting: (siteId) => `/api/v1/bet-settings${siteId}`,

  casinoList: "/api/v1/list-casino",
  aviatorList: "/api/v1/list/aviator",
  intCasinoList: (provider) => `/api/v1/int-c/list/${provider}`,
  UserLockApplications: "/api/v1/Userlock-application",
  getSportsBook: (competitionId, eventId) =>
    `/api/v2/sportsbook?competitionId=${competitionId}&eventId=${eventId}`,
  getDresult: (gmid, gmname, mid) =>
    `https://api.professor.monster/api/v1/dmd-casino-result/${mid}`,

  headTailsResult: "/api/v1/head-tails-result",

  checkWithdrawalAllowed: "/api/v1/users/withdrawal/check",
  SendOtp: "/api/send-otp",
  getCasinoBalance: "/api/casino-balance",

  updateFirstLoginStatus: `/api/v1/users/firstLogin-status`,
  getDiamondCasino: `/api/v1/d`,
  getSiteMetaData: (siteID) => `/api/v1/meta-data-settings/${siteID}`,
  get1chipValue: `https://qt.asianexchange.club/api/v2/multiplier/1chipValue`,
  // Aura Apis
  AuraGetProfitLoss: "/api/user/aura/profit_loss",
  userBetDetails: "/api/v1/user-bet-details",

  intBetHistory: `https://qt.asianexchange.club/api/v1/player-history/last30d`,
  getSiteSetting: (domainId) => `/api/v1/site/referalsettings/${domainId}`,
};
export const getSiteSetting = (domainId) =>
  apiGET(API_URL.getSiteSetting(domainId));
export const GetuserBetDetails = (params) =>
  apiGET(API_URL.userBetDetails, params);
export const AuraGetProfitLoss = (params) =>
  apiGET(API_URL.AuraGetProfitLoss, params);
export const getIntCasinoList = (provider) =>
  apiGET(API_URL.intCasinoList(provider));

export const getBetMinMaxSetting = (siteId, params) =>
  apiGET(API_URL.getBetMinMaxSetting(siteId), params);

export const UserLockApplications = (body) =>
  apiGET(API_URL.UserLockApplications, body);
export const getSitesByDomain = (domainName) =>
  apiGET(API_URL.get_sitesData(domainName));
export const getRefreshSitesByDomain = (domainName) =>
  apiGET(API_URL.get_RefreshSitesData(domainName));
export const login = (body) => apiPOST(API_URL.login, body);
export const Multipin = (body) => apiGET(API_URL.Multipin, body);
export const BookmakerMultipin = (body) =>
  apiGET(API_URL.BookmakerMultipin, body);
export const forgotPassword = (body) => apiPOST(API_URL.forgotPassword, body);
export const resetPassword = (body) => apiPOST(API_URL.resetPassword, body);
export const signUp = (body) => apiPOST(API_URL.signup, body);
export const Demo = () => apiGET(API_URL.demo);
export const casinoList = () => apiGET(API_URL.casinoList);
export const headTailsResult = (body) => apiGET(API_URL.headTailsResult, body);
export const aviatorList = () => apiGET(API_URL.aviatorList);
export const Match = (eventId) => apiGET(API_URL.match(eventId));
export const createData = (body) => apiPOST(API_URL.create, body);
export const updateFirstLoginStatus = (body) =>
  apiPOST(API_URL.updateFirstLoginStatus, body);

export const intBetHistory = (body) => apiPOST(API_URL.intBetHistory, body);

export const logPasswordChange = (body) =>
  apiPOST(API_URL.logPasswordChange, body);

export const myBet = () => {
  const state = store.getState();
  const token = state.user?.token || "";

  return token && apiGET(API_URL.myBets);
};
export const getSettledBets = (body) => apiGET(API_URL.getSettledBets, body);
export const getDiamondCasino = (body) =>
  apiGET(API_URL.getDiamondCasino, body);
export const getUnsettledBets = (body) =>
  apiGET(API_URL.getUnsettledBets, body);
export const getLoginRecord = (userID, params) =>
  apiPOST(API_URL.getLoginRecord(userID), params);
export const getAccountStatements = (params) =>
  apiGET(API_URL.getAccountStatements, params);
export const getCurrentRecord = () => apiGET(API_URL.getCurrentRecord);
export const createLoginRecord = async (body) => {
  try {
    // Fetch IPv4 (force IPv4 endpoint to avoid IPv6 fallback)
    const { data } = await axios.get("https://api.ipify.org?format=json");

    // Send the IP + any other data to your API
    await apiPOST(API_URL.loginRecord, {
      ...body,
      ip: data?.ip || "8.8.8.8",
    });
  } catch (error) {
    console.error("Error creating login record:", error?.message);

    // Fallback if ipify fails
    await apiPOST(API_URL.loginRecord, {
      ...body,
      ip: "8.8.8.8",
    });
  }
};
export const fetchuserdata = (userID) => apiPOST(API_URL.getuserdata(userID));
export const updatePassword = (body) => apiPOST(API_URL.updatePassword, body);
export const updateUserPassword = (body) =>
  apiPOST(API_URL.updateUserPassword, body);
export const updateCasinoBalance = (body) =>
  apiPOST(API_URL.updateCasinoBalance, body);
export const ReCallCasinoBalance = (body) =>
  apiPOST(API_URL.ReCallCasinoBalance, body);
export const createPayment = (body) => apiPOST(API_URL.createPayment, body);
export const uploadMedia = (body) => apiPOST(API_URL.upload_media, body);
export const getPaymentsByUserId = (userID) =>
  apiGET(API_URL.getPaymentsByUserId(userID));
export const getCasinoList = () => apiGET(API_URL.getListUrl("casino"));
export const getCasinoData = (casinoType, eventID) =>
  apiGET(API_URL.getCasinoData(casinoType, eventID));
export const createAccount = (body) => apiPOST(API_URL.createAccount, body);
export const getAllAccounts = () => apiGET(API_URL.getAccounts);
export const deleteAccount = (id) => apiPOST(API_URL.deleteAccount(id));
export const getwithdrawals = (id) => apiGET(API_URL.getwithdrawals(id));
export const getProfitLossReport = (prams) =>
  apiGET(API_URL.getProfitLossReport, prams);
export const checkWithdrawalAllowed = () =>
  apiGET(API_URL.checkWithdrawalAllowed);
export const createwithdraw = (body) => apiPOST(API_URL.withdraw, body);
export const grayhoundRace = () =>
  apiGET("https://api.professor.monster/api/v1/list/grayhoundRace");
export const getGreyhoundRaceOdds = (gmid) =>
  apiGET(`https://api.professor.monster/api/v1/greyhound?gmid=${gmid}`);
export const horseRace = () =>
  apiGET("https://api.professor.monster/api/v1/list/horseRace");
export const getHorseRaceOdds = (gmid) =>
  apiGET(`https://api.professor.monster/api/v1/horse?gmid=${gmid}`);
export const getactiveAdminDepositMethod = () =>
  apiGET(API_URL.getactiveAdminDepositMethod);

export const getBet = (body) => apiPOST(API_URL.getBet, body);
export const getLegues = (id) => apiGET(API_URL.getLegues(id));
export const getMatchesList = (id, marketId) =>
  apiGET(API_URL.getMatchesList(id, marketId));
export const getAffiliateData = (
  page = 1,
  limit = 10,
  search = "",
  roles = [],
  status = "active",
  currentUserId = "",
) => {
  const params = new URLSearchParams({
    page,
    limit,
    search,
    status,
    currentUserId,
  });

  if (roles.length > 0) {
    params.append("roles", roles.join(","));
  }

  return apiGET(`${API_URL.getAffiliateData}?${params.toString()}`);
};
export const generatePresignedUrlFromS3Url = (body) =>
  apiPOST(API_URL.generatePresignedUrlFromS3Url, body);

export const launcherUrl = (body) =>
  apiPOST("https://qt.asianexchange.club/api/v1/launcher/launch-url", body);
export const getSportsBook = (competitionId, matchId) =>
  apiGET(API_URL.getSportsBook(competitionId, matchId));

export const getDresult = (gmid, gmname, mid) =>
  apiGET(API_URL.getDresult(gmid, gmname, mid));

export const SendOtp = (body) => apiPOST(API_URL.SendOtp, body);

export const getCasinoBalance = (body) =>
  apiGET(API_URL.getCasinoBalance, body);
export const GetDownlinelogPasswordHistory = () =>
  apiGET(API_URL.GetDownlinelogPasswordHistory);

export const getSiteMetaData = (siteID) =>
  apiGET(API_URL.getSiteMetaData(siteID));
export const get1chipValue = (body) => apiPOST(API_URL.get1chipValue, body);
