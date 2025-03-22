import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiGetSEBICompliance } from "../../api/resources/apiGetCompliance";

export const useGetSebiRegulation = (title) => {
  const {
    data: sebiRegulation,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["sebi-regulation", title],
    queryFn: async () => await apiGetSEBICompliance(title),
    enabled: false,
    onSuccess: () => {
      toast.success("SEBI Compliance summary done");
    },
    onError: () => {
      toast.error("SEBI Compliance summary failed");
    },
  });

  return { data: sebiRegulation, isLoading, isError, refetch };
};
