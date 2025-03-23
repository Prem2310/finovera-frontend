import { post } from "../apiClient";

export const apiGetLLMSummarize = async (data) => {
  return post("/summarize_llm/get_data", data);
};
