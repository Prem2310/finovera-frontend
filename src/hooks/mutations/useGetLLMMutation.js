import { useMutation } from "@tanstack/react-query";
import { apiGetLLMSummarize } from "../../api/resources/apiGetLLMSummarize";
import toast from "react-hot-toast";

export const useGetLLMMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      await apiGetLLMSummarize(data);
    },
    onSuccess: () => {
      toast.success("LLM Summarized Successfully");
    },
    onError: () => {
      toast.error("Error while summarizing LLM");
    },
  });
};
