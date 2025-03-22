import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiUserLogin, apiUserSignup } from "../../api/userOnboarding/apiUser";
import toast from "react-hot-toast";

export const useSignupUser = (options = {}) => {
  return useMutation({
    mutationFn: async (data) => await apiUserSignup(data),
    onSuccess: () => {
      toast.success("User signed up successfully");
      options.navigate("/signin");
    },
    onError: (err) => {
      toast.error(`Error occured ${err?.response?.data?.message}`);
    },
  });
};

export const useLoginUser = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => await apiUserLogin(data),
    onSuccess: async (responseData) => {
      toast.success("Welcome, you are logged in!");

      // Store token before refetching session data
      console.log(responseData);
      localStorage.setItem("access_token", responseData?.access_token);

      // Invalidate session query to refetch updated data
      await queryClient.invalidateQueries(["userInfo"]);

      // Delay navigation until session is updated
      setTimeout(() => {
        options.dataOnSuccess?.(responseData);
        options.navigate("/");
      }, 500); // Small delay to ensure session updates
    },
    onError: (err) => {
      toast.error(`Error occured ${err?.response?.data?.message}`);
    },
  });
};
