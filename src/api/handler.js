import API from "./axios";  // Assuming axios is configured here

// apiGET: Handles GET requests
export const apiGET = async (endPoint, params, cancelToken) => {
    try {
        const config = cancelToken ? { params, cancelToken } : { params };
        const res = await API.get(endPoint, config);
        return { data: res.data, success: true };
    } catch (error) {
        const data = error?.response?.data ?? { message: error?.message };
        const code = error?.response?.status;
        console.error("GET request error:", error);  // Optional: logging for debugging
        return { success: false, data, code };
    }
};

// apiPOST: Handles POST requests
export const apiPOST = async (endPoint, body, params) => {
    try {
        const res = await API.post(endPoint, body, { params });
        return { data: res.data, success: true };
    } catch (error) {
        const data = error?.response?.data ?? { message: error?.message };
        const code = error?.response?.status;
        console.error("POST request error:", error);  // Optional: logging for debugging
        return { success: false, data, code };
    }
};
