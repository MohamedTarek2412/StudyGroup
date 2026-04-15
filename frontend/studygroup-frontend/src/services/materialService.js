import api from "./api";

const MATERIALS_BASE_PATH = "/materials";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

// 🔹 Get materials for group
export async function getGroupMaterials(groupId) {
  try {
    const response = await api.get(`${MATERIALS_BASE_PATH}/group/${groupId}`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

// 🔹 Upload material
export async function uploadMaterial(groupId, payload) {
  try {
    const response = await api.post(
      `${MATERIALS_BASE_PATH}/group/${groupId}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default {
  getGroupMaterials,
  uploadMaterial,
}; 
