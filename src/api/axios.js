//         import axios from "axios";
// import store, { persistor } from "./../redux/store";
// import { revertUser } from "../redux/slices/userSlice";
// import { revertAccount } from "../redux/slices/accountSlice";
// // import { logoutUser } from "./../redux/actions/authActions";

// export const baseUrl = import.meta.env.PROD
//   ? import.meta.env.VITE_API_BASE_URL_PROD
//   : import.meta.env.VITE_API_BASE_URL_DEV;

// const API = axios.create({
//   baseURL: baseUrl,
//   timeout: 60000,
// });

// API.interceptors.request.use(
//   (config) => {
//     const state = store.getState();
//     const accountType = state.account?.accountType || "";

//     const issportsbookRoute = config.url.includes("/api/v2/sportsbook")
//     const intCasinoRoute = config.url.includes("/api/v1/int-c/list")
//     if (accountType === "demo" && !issportsbookRoute && !intCasinoRoute) {
//       return Promise.resolve({ data: null });
//     }
//     const token = state.user?.token || "";
//     const domainId = state.site?.siteDetails?.domainDetails?._id || "";
//     const admindomainId = state.site?.siteDetails?.admindomainName?._id || "";
//     config.headers.Authorization = `Bearer ${token}`;
//     config.headers.Domainid = domainId;
//     config.headers.admindomainId = admindomainId;
//     config.headers.X_Panel_Type = "user";
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// const handleLogout = async () => {
//   try {
//     store.dispatch(revertUser());
//     store.dispatch(revertAccount());
//     localStorage.clear();
//     await persistor.purge();
//     window.location.href = "/";
//   } catch (error) {
//     console.error("Logout error:", error);
//   }
// };

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error(error, "error");
//     if (
//       error.response &&
//       (error.response.status === 403 || error.response.status === 401)
//     ) {
//       handleLogout();
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;



import axios from "axios";
import store, { persistor } from "./../redux/store";
import { revertUser } from "../redux/slices/userSlice";
import { revertAccount } from "../redux/slices/accountSlice";
import { encryptPayload, decryptPayload } from "../utils/cryptoUtil";

export const baseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

const API = axios.create({
  baseURL: baseUrl,
  timeout: 60000,
});

/* ===============================
   🔐 ROUTES WHERE ENCRYPTION SKIP
================================ */
const SKIP_ENCRYPT_ROUTES = [
  "qt.asianexchange.club",
];

const shouldSkipEncryption = (url = "") =>
  SKIP_ENCRYPT_ROUTES.some(route => url.includes(route));

/* ===============================
    REQUEST INTERCEPTOR
================================ */
API.interceptors.request.use(
  async (config) => {
    const state = store.getState();

    const token = state.user?.token || "";
    const domainId =
      state.site?.siteDetails?.domainDetails?._id || "";
    const admindomainId =
      state.site?.siteDetails?.admindomainName?._id || "";

    /*  ALWAYS SET HEADERS */
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers.Domainid = domainId;
    config.headers.admindomainId = admindomainId;
    config.headers.X_Panel_Type = "user";

    /*  ENCRYPT BODY (except skipped routes) */
    if (
      !shouldSkipEncryption(config.url) &&
      config.data &&
      !(config.data instanceof FormData) &&
      config.method !== "get"
    ) {
      try {
        const encrypted = await encryptPayload(
          JSON.stringify(config.data)
        );
        config.data = { _data: encrypted };
      } catch (err) {
        console.error("Encryption Error:", err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
    LOGOUT
================================ */
const handleLogout = async () => {
  store.dispatch(revertUser());
  store.dispatch(revertAccount());
  localStorage.clear();
  await persistor.purge();
  window.location.href = "/";
};

/* ===============================
    RESPONSE INTERCEPTOR
================================ */
// API.interceptors.response.use(
//   async (response) => {
//     if (shouldSkipEncryption(response.config.url)) {
//       return response;
//     }

//     try {
//       if (
//         response?.data &&
//         typeof response.data === "object" &&
//         typeof response.data._data === "string"
//       ) {
//         const decrypted = await decryptPayload(
//           response.data._data
//         );
//         response.data = JSON.parse(decrypted);
//       }
//     } catch (err) {
//       console.error("Decryption Error:", err);
//     }

//     return response;
//   },
//   async (error) => {
//     if (
//       error.response &&
//       (error.response.status === 401 ||
//         error.response.status === 403)
//     ) {
//       await handleLogout();
//     }

//     return Promise.reject(error);
//   }
// );


API.interceptors.response.use(
  async (response) => {
    if (shouldSkipEncryption(response.config.url)) {
      return response;
    }

    try {
      const encryptedData =
        response?.data?._data || response?.data?.data?._data;

      if (typeof encryptedData === "string") {
        const decrypted = await decryptPayload(encryptedData);
        const parsed = JSON.parse(decrypted);

        // Replace correctly based on structure
        if (response?.data?._data) {
          response.data = parsed;
        } else if (response?.data?.data?._data) {
          response.data.data = parsed;
        }
      }
    } catch (err) {
      console.error("Decryption Error:", err);
    }

    return response;
  },

  async (error) => {
    if (error.response) {
      try {
        const encryptedData =
          error.response?.data?._data ||
          error.response?.data?.data?._data;

        if (typeof encryptedData === "string") {
          const decrypted = await decryptPayload(encryptedData);
          const parsed = JSON.parse(decrypted);

          if (error.response?.data?._data) {
            error.response.data = parsed;
          } else if (error.response?.data?.data?._data) {
            error.response.data.data = parsed;
          }
        }
      } catch (err) {
        console.error("Error Decryption Failed:", err);
      }

      if (
        error.response.status === 401 ||
        error.response.status === 403
      ) {
        await handleLogout();
      }
    }

    return Promise.reject(error);
  }
);

export default API;


