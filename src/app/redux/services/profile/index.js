import { APP_API_URL } from "../../../../assets/api-endpoints";
import UseAxios from "../../../../assets/hooks/use-axios";

export const fetchProfile = async (auth) => {
  const axiosInstance = UseAxios();
  try {
    const response = await axiosInstance.get(
      `${APP_API_URL.FETCH_PROFILE_DETAILS}`,
      {
        headers: {
          Authorization: auth ? `Bearer ${auth}` : undefined,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const createProfile = async (payload, auth) => {
  const axiosInstance = UseAxios();
  try {
    const response = await axiosInstance.post(
      `${APP_API_URL.ADD_PROFILE_DETAILS}`,
      payload,
      {
        headers: {
          Authorization: auth ? `Bearer ${auth}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const updateProfile = async (payload, auth) => {
  const axiosInstance = UseAxios();
  try {
    const response = await axiosInstance.put(
      `${APP_API_URL.UPDATE_PROFILE_DETAILS}`,
      payload,
      {
        headers: {
          Authorization: auth ? `Bearer ${auth}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};
