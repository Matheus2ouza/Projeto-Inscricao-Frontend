import { useGlobalLoading } from '@/components/GlobalLoading';
import { generateListExpensesPdf } from '@/features/expenses/api/actions/reports/generateListExpensesPdf';
import {
  GenerateListeExpensesPdfInput,
  GenerateListeExpensesPdfResponse,
} from '@/features/expenses/types/actions/reports/generateListeExpensesPdfTypes';
import { downloadFile } from '@/shared/utils/downloadFile';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function useExpenseReports() {
  const { setLoading } = useGlobalLoading();

  const {
    mutateAsync: generateListExpensesPdfMutation,
    isPending: isGenerateListExpensesPdfMutation,
  } = useMutation<
    GenerateListeExpensesPdfResponse,
    Error,
    GenerateListeExpensesPdfInput
  >({
    mutationFn: generateListExpensesPdf,
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      const fileBase64 = data.fileBase64;
      const filename = data.filename;
      const contentType = data.contentType;

      if (!fileBase64 || !filename || !contentType) {
        toast.error('Não foi possível gerar o relatório.');
        return;
      }

      downloadFile(fileBase64, filename, contentType);
      toast.success('Download iniciado.');
    },
    onError: (error) => {
      toast.error(error.message || 'Não foi possível gerar o relatório.');
    },
    onSettled: () => setLoading(false),
  });

  return {
    generateListExpensesPdf: {
      execute: async (data: GenerateListeExpensesPdfInput) => {
        generateListExpensesPdfMutation(data);
      },
      loading: isGenerateListExpensesPdfMutation,
    },
  };
}
