import api from "./api";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

export async function getMaterials(groupId) {
  try {
    const response = await api.get(`/groups/${groupId}/materials`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function uploadMaterial(groupId, file) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/groups/${groupId}/materials`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function downloadMaterial(groupId, materialId, fileName) {
  try {
    const response = await api.get(
      `/groups/${groupId}/materials/${materialId}/download`,
      { responseType: "blob" }
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName || "file");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function deleteMaterial(groupId, materialId) {
  try {
    await api.delete(`/groups/${groupId}/materials/${materialId}`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default { getMaterials, uploadMaterial, downloadMaterial, deleteMaterial };
