import { useMutation } from "@tanstack/react-query";
import { apiSetUserPreference } from "../../api/apiUserPref/apiSetUserPreference";
import toast from "react-hot-toast";

export const useSetUserPrefMutation = () => {
  return useMutation({
    mutationFn: async (data) => {
      await apiSetUserPreference(data);
    },
    onSuccess: () => {
      toast.success("Preferences saved successfully!");
    },
    onError: () => {
      toast.error("Failed to save preferences. Please try again.");
    },
  });
};
