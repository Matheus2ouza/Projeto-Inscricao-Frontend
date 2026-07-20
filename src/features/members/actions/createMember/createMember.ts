'use server';

import {
  CreateMemberInput,
  CreateMemberResponse,
} from '@/features/members/types/createMember/createMemberTypes';
import { createMemberService } from '../../services/createMember/createMember';

export async function createMemberAction(
  input: CreateMemberInput,
): Promise<CreateMemberResponse> {
  return createMemberService(input);
}
