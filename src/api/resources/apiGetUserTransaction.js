import { get, post } from "../apiClient";

export const apiGetUserTransaction = async () => {
  const access_token = localStorage.getItem("access_token");
  return await post("/stocksCRUD/get_transactions", { access_token });
};
