import { get } from "../apiClient";


// sebi compliance api
export const apiGetSEBICompliance = async (data) => {
  return await get("stocksCRUD/sebi_regulations_chat/" + data);
};
