import api from "./api";

const DISCUSSIONS_BASE_PATH = "/discussions";

function normalizeAxiosError(error) {
  const status = error?.response?.status;
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Request failed. Please try again.";
  return { status, message, raw: error };
}

// 🔹 Get messages for a group
export async function getGroupMessages(groupId) {
  try {
    const response = await api.get(`${DISCUSSIONS_BASE_PATH}/group/${groupId}`);
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

// 🔹 Send message
export async function sendMessage(groupId, payload) {
  try {
    const response = await api.post(
      `${DISCUSSIONS_BASE_PATH}/group/${groupId}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

// 🔹 Delete message
export async function deleteMessage(messageId) {
  try {
    await api.delete(`${DISCUSSIONS_BASE_PATH}/${messageId}`);
    return true;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export default {
  getGroupMessages,
  sendMessage,
  deleteMessage,
}; 
