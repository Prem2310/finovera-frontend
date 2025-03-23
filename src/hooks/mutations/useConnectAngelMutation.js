import { useMutation } from "@tanstack/react-query";
import { apiGetHoldings } from "../../api/connectToAngel/apiGetHoldings";

export const useConnectAngelMutation = () => {
  return useMutation({
    mutationFn: async (data) => apiGetHoldings(data),
  });
};
