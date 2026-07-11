import {
  AnalysisInscriptionResponse,
  InscriptionDetailRequest,
} from '@/features/inscriptions/types/analysis/analysisTypes';
import { axiosClient } from '@/lib/axios';
export async function getInscriptionDetails(
  inscriptionId: string,
  params: InscriptionDetailRequest,
): Promise<AnalysisInscriptionResponse> {
  try {
    const { data } = await axiosClient.get<AnalysisInscriptionResponse>(
      `/inscriptions/${inscriptionId}/analytics`,
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
        },
      },
    );
    console.log(data);
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    throw new Error(
      axiosError.response?.data?.message ||
        'Falha ao carregar detalhes da inscrição',
    );
  }
}
