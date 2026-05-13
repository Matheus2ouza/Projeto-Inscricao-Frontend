import { createExclusiveInscriptionLink } from '@/features/inscriptions/api/exclusiveInscriptionLink/createExclusiveInscriptionLink/createExclusiveInscriptionLink';
import { CreateExclusiveInscriptionLinkRequest } from '@/features/inscriptions/types/exclusiveInscriptionLink/createExclusiveInscriptionLink/createExclusiveInscriptionLinkTypes';
import { useMutation } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useInvalidateListExclusiveInscriptionLinkQuery } from '../useListExclusiveInscriptionLinkQuery';

export function useCreateExclusiveInscriptionLink() {
  const router = useRouter();
  const pathname = usePathname();
  const { invalidateLists } = useInvalidateListExclusiveInscriptionLinkQuery();

  return useMutation({
    mutationFn: (payload: CreateExclusiveInscriptionLinkRequest) =>
      createExclusiveInscriptionLink(payload),

    onSuccess: async (data, variables) => {
      await invalidateLists(variables.eventId);
      toast.success('Link de inscrição criado com sucesso!');
      const basePath = pathname?.startsWith('/super/') ? '/super' : '/admin';
      router.replace(
        `${basePath}/inscriptions/exclusive-inscription-link/${variables.eventId}`,
      ); // Redireciona para a página de listagem de links
    },

    onError: (error) => {
      toast.error('Erro ao criar link de inscrição', {
        description: error.message,
      });
    },
  });
}
