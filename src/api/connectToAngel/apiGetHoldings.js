import { post } from "../apiClient";

export const apiGetHoldings = async (data) => {
  return await post("/api/angelone/holdings", data);
};
