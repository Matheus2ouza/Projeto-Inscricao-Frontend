import { axiosClient } from '@/lib/axios/client';
import qs from 'qs';
import {
  generatePdfParams,
  generatePdfResponse,
} from '../../../types/cashRegisterDetails/actions/generatePdfTypes';

export async function generatePdf({
  cashRegisterId,
  listExpenseCategory,
  moviments,
  favorite,
}: generatePdfParams): Promise<generatePdfResponse> {
  try {
    const { data } = await axiosClient.get<generatePdfResponse>(
      `cash-register/${cashRegisterId}/pdf`,
      {
        params: {
          listExpenseCategory,
          moviments,
          favorite,
        },
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'repeat' }),
      },
    );
    return data;
  } catch (error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };

    throw new Error(
      axiosError.response?.data?.message ??
        axiosError.message ??
        'Não foi possível gerar o relatório.',
    );
  }
}
