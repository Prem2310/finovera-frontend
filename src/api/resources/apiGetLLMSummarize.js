import { post } from "../apiClient";

export const apiGetLLMSummarize = async (data) => {
  return await post("/summarize_llm/get_data", data);
};

export const apiGetChatbot = async (data) => {
  return await post("/chatbot/routes/chat/learn", data);
};
