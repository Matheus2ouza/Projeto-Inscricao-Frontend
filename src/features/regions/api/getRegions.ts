import { axiosClient } from '@/lib/axios';
import { getAllRegionsResponse } from '../types/regionsTypes';

export type RegionDto = {
  id: string;
  name: string;
};

export async function getRegions(): Promise<RegionDto[]> {
  const { data } = await axiosClient.get<RegionDto[]>('/regions/all/names');
  return data;
}

export async function getAllRegions(params: {
  page: number;
  pageSize: number;
}): Promise<getAllRegionsResponse> {
  const { data } = await axiosClient.get<getAllRegionsResponse>('/regions', {
    params: { page: params.page, pageSize: params.pageSize },
  });
  return data;
}
