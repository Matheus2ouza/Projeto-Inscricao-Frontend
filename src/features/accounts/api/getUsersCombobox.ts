import axiosInstance from "@/shared/lib/apiClient";
import { AccountResponse } from "../types/accounts.types";

export async function getAccont(): Promise<AccountResponse[]> {
  const { data } = await axiosInstance.get<AccountResponse[]>(
    "/users/all/usernames"
  );
  return data;
}
