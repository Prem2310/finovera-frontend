import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiGetUserTransaction } from "../../api/resources/apiGetUserTransaction";

export const useGetUserTrnasMutation = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["getUserTransaction"],
    queryFn:  apiGetUserTransaction,
    onSuccess: () => {
      toast.success("Transaction fetched successfully");
    },
    onError: () => {
      toast.error("Failed to fetch transaction");
    },
  });
  return { transactionData: data, isLoading, isError };
};
