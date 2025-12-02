import axiosInstance from "@/shared/lib/apiClient";
import qs from "qs";
import { AccountRole } from "../types/accounts.types";

export type AccountDto = {
  id: string;
  username: string;
  role: string;
};

export async function getAccont(params?: {
  roles?: AccountRole[];
}): Promise<AccountDto[]> {
  const queryParams = params?.roles?.length
    ? { roles: params.roles }
    : undefined;

  const { data } = await axiosInstance.get<AccountDto[]>(
    "/users/all/usernames",
    {
      params: queryParams,
      paramsSerializer: (p) =>
        qs.stringify(p, { arrayFormat: "repeat", skipNulls: true }),
    }
  );
  return data;
}
