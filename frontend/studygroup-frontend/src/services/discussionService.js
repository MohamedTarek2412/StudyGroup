import api from "./api";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

export async function getMessages(groupId, page = 1, pageSize = 50) {
  try {
    const response = await api.get(`/groups/${groupId}/discussions`, {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function sendMessage(groupId, content) {
  try {
    const response = await api.post(`/groups/${groupId}/discussions`, {
      content,
    });
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function deleteMessage(groupId, messageId) {
  try {
    await api.delete(`/groups/${groupId}/discussions/${messageId}`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default { getMessages, sendMessage, deleteMessage };
