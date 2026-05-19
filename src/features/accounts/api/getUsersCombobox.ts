import axiosInstance from '@/shared/lib/apiClient';
import qs from 'qs';
import { AccountResponse, AccountRole } from '../types/accounts.types';

export async function getAccont(
  roles?: AccountRole[],
): Promise<AccountResponse[]> {
  const { data } = await axiosInstance.get<AccountResponse[]>(
    '/users/all/usernames',
    {
      params: {
        roles,
      },
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: 'repeat' }),
    },
  );
  return data;
}
