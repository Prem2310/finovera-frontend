import { post } from "../apiClient";

export const apiSetUserPreference = async (data) => {
  return await post("/userCRUD/save_preferences", data);
};
