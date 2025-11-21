import axiosInstance from "@/shared/lib/apiClient";

export type AccountDto = {
  id: string;
  username: string;
  role: string;
};

export async function getAccont(roles?: string[]): Promise<AccountDto[]> {
  const roleParam = roles?.length ? roles.join(",") : "SUPER, ADMIN";

  const { data } = await axiosInstance.get<AccountDto[]>(
    "/users/all/usernames",
    {
      params: {
        role: roleParam,
      }
    }
  );
  return data;
}
