import axiosInstance from "./axiosInstance";

export const getAllWards = async () => {
  const response = await axiosInstance.get("/wards");
  return response.data;
};

export const getWardById = async (id) => {
  const response = await axiosInstance.get(`/wards/${id}`);
  return response.data;
};

export const createWard = async (wardData) => {
  const response = await axiosInstance.post("/wards", wardData);
  return response.data;
};

export const updateWard = async (id, wardData) => {
  const response = await axiosInstance.put(`/wards/${id}`, wardData);
  return response.data;
};

export const updateWardStatus = async (id, status) => {
  const response = await axiosInstance.put(`/wards/${id}/status`, { status });
  return response.data;
};