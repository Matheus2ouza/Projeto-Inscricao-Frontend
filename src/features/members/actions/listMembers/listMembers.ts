'use server';

import { FindAllToMembersResponse } from '@/features/members/types/membersType';
import { listMembersService } from '../../services/listMembers/listMembers';

export async function listMembersAction(
  page: number,
  pageSize: number,
  localityId?: string,
): Promise<FindAllToMembersResponse> {
  return listMembersService(page, pageSize, localityId);
}
