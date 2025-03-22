import { post } from "../apiClient";

export const apiUserSignup = async (data) => {
  return await post("/auth/signup", data);
};

export const apiUserLogin = async data => {
  return await post("/auth/login", data);
}