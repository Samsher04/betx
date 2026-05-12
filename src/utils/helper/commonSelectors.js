export const selectState = () => {
  return (state) => state;
};

export const selectSite = () => {
  return (state) => state?.site?.siteDetails;
};
export const selectSiteMetaData = () => {
  return (state) => state?.site?.meta_data;
};
export const selectSiteId = () => {
  return (state) => state?.site?.siteDetails?._id;
};
export const selectSiteBanners = () => {
  return (state) => state?.site?.siteDetails?.banners;
};

export const selectSiteSubBanners = () => {
  return (state) => state?.site?.siteDetails?.subBanners;
};

export const selectSiteLogo = () => {
  return (state) => state?.site?.siteDetails?.logo;
};

export const selectSiteFevicon = () => {
  return (state) => state?.site?.siteDetails?.favIcon;
};

export const selectSiteName = () => {
  return (state) => state?.site?.siteDetails?.siteName;
};

export const selectSiteHeaderColor = () => {
  return (state) => state?.site?.siteDetails?.headerColor;
};

export const selectSiteTopHeaderColor = () => {
  return (state) => state?.site?.siteDetails?.topHeaderColor;
};

export const newSky = () => {
  return (state) => state?.site?.siteDetails?.new_footer;
};

export const isRadhe = () => {
  return (state) => state?.site?.siteDetails?.isRadhe;
};

export const selectSiteLoginColor = () => {
  return (state) => state?.site?.siteDetails?.loginButtonColor;
};
export const selectSiteSignUpColor = () => {
  return (state) => state?.site?.siteDetails?.signupButtonColor;
};
export const selectTopBaarBgColor = () => {
  return (state) => state?.site?.siteDetails?.topHeaderColor;
};
export const selectSiteActiveTabBgColor = () => {
  return (state) => state?.site?.siteDetails?.bottomNavActiveTabBgColor;
};

export const selectSiteNews = () => {
  return (state) => state?.site?.siteDetails?.news;
};
export const selectSiteDomainName = () => {
  return (state) => state?.site?.siteDetails?.domainName?.name;
};
export const selectSiteLayout = () => {
  return (state) => state?.site?.siteDetails?.layout;
};
export const IsSignUpButton = () => {
  return (state) => state?.site?.siteDetails?.signUp_button;
};
export const Premiumcricket = () => {
  return (state) => state?.site?.siteDetails?.premium_cricket;
};
export const selectDomainID = () => {
  return (state) => state?.site?.siteDetails?.domainDetails?._id;
};
export const selectAdminDomainID = () => {
  return (state) => state?.site?.siteDetails?.admindomainName?._id;
};
export const getToken = () => {
  return (state) => state?.user?.token;
};
export const getBets = () => {
  return (state) => state?.account?.bets;
};
export const getUserData = () => {
  return (state) => state?.user?.userData;
};
export const selectwhatsappSupport = () => {
  return (state) => state?.user?.userData?.createdBy?.whatsappSupport;
};
export const getreferralKey = () => {
  return (state) => state?.user?.userData?.referralKey;
};
export const isSignupUser = () => {
  return (state) => state?.user?.userData?.isSignupUser;
};

export const getUserLoggedInType = () => {
  return (state) => state?.user?.loggedInType;
};
export const selectUserAvailableBalance = () => {
  return (state) => state?.user?.userData?.availableBalance;
};
export const getUserId = () => {
  return (state) => state?.user?.userData?._id;
};
export const getMinBet = () => {
  return (state) => state?.betSettingsSlice?.betSettings?.minBet;
};
export const getMaxBet = () => {
  return (state) => state?.betSettingsSlice?.betSettings?.maxBet;
};
export const SelectUserLockApplications = () => {
  return (state) => state?.user?.UserLoackApplications?.lockApplication;
};

export const SelectTimeZone = () => {
  return (state) => state.timezone.value;
};
export const getSkyUserSettings = () => {
  const userSettings = localStorage.getItem("userSettings");
  return JSON.parse(userSettings);
};

export const SelectSiteSportsControl = () => {
  return (state) => state?.site?.siteDetails?.sportsControl;
};
