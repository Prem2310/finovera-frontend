import { useMutation } from "@tanstack/react-query";
import { apiGetChatbot } from "../../api/resources/apiGetLLMSummarize";
import toast from "react-hot-toast";

export const useChatbotMutation = ({ setFinalMessage }) => {
  return useMutation({
    mutationFn: async (data) => {
      return await apiGetChatbot(data);
    },
    onSuccess: (response) => {
      toast.success("Chatbot response received!");
      if (setFinalMessage) {
        setFinalMessage(response);
      }
    },
    onError: (err) => {
      toast.error(`${err?.response?.data?.message || "An error occurred"}`);
    },
  });
};

