import api from "./api";

const GROUPS_BASE_PATH = "/groups";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

export async function browseGroups(params = {}) {
  try {
    const response = await api.get(GROUPS_BASE_PATH, {
      params: {
        subject: params.subject || undefined,
        search: params.search || undefined,
      },
    });
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function getGroupById(groupId) {
  try {
    const response = await api.get(`${GROUPS_BASE_PATH}/${groupId}`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function getMyGroups() {
  try {
    const response = await api.get(`${GROUPS_BASE_PATH}/mine`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function createGroup(payload) {
  try {
    const response = await api.post(GROUPS_BASE_PATH, payload);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function updateGroup(groupId, payload) {
  try {
    const response = await api.put(`${GROUPS_BASE_PATH}/${groupId}`, payload);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function deleteGroup(groupId) {
  try {
    await api.delete(`${GROUPS_BASE_PATH}/${groupId}`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default {
  browseGroups,
  getGroupById,
  getMyGroups,
  createGroup,
  updateGroup,
  deleteGroup,
};

 
