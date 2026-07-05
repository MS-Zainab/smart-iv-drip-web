import axiosInstance from "./axiosInstance";

export const getAllNurses = async () => {
  const response = await axiosInstance.get("/nurses");
  return response.data;
};

export const getNurseById = async (id) => {
  const response = await axiosInstance.get(`/nurses/${id}`);
  return response.data;
};

export const createNurse = async (nurseData) => {
  const response = await axiosInstance.post("/nurses", nurseData);
  return response.data;
};

export const updateNurse = async (id, nurseData) => {
  const response = await axiosInstance.put(`/nurses/${id}`, nurseData);
  return response.data;
};

export const deactivateNurse = async (id) => {
  const response = await axiosInstance.put(`/nurses/${id}/deactivate`);
  return response.data;
};

export const assignPatientsToNurse = async (id, patientIds) => {
  const response = await axiosInstance.put(`/nurses/${id}/assign-patients`, {
    patientIds,
  });
  return response.data;
};