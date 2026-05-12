import axios from "axios";

export const fetchCasinoData = async (domainId) => {
  if (!domainId) return [];

  try {
    const response = await axios.get(
      `https://api.professor.monster/api/int/getIntCasinos?domainId=${domainId}`
    );
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching casino data:", error);
    return [];
  }
};
