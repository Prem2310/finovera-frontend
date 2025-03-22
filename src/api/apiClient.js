import axiosInstance from "./axiosInstance";

export const get = async url => {
  const response = await axiosInstance.get(url);
  return response.data;
};

export const post = async (url, payload, config = {}) => {
  console.log("Log from final api client", payload, config);
  const response = await axiosInstance.post(url, payload, config);
  return response.data;
};

export const put = async (url, payload) => {
  console.log("Log from final api client", payload);
  const response = await axiosInstance.put(url, payload);
  return response.data;
};

export const del = async url => {
  const response = await axiosInstance.delete(url);
  return response.data;
};
