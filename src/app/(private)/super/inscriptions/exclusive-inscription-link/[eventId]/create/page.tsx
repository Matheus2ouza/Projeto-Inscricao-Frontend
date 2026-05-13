'use client';

import { CreateExclusiveInscriptionLink } from '@/features/inscriptions/components/exclusiveInscriptionLink/createExclusiveInscriptionLink/createExclusiveInscriptionLink';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

export default function CreateExclusiveInscriptionLinkPageSuper() {
  const router = useRouter();
  const params = useParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  const handleBack = () => {
    router.back();
  };

  const renderContent = () => {
    if (!eventId) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <div>
            <p className="font-semibold text-red-600 dark:text-red-400">
              Parâmetro inválido.
            </p>
            <p className="text-muted-foreground mt-1 max-w-md">
              Não foi possível carregar esta página porque o identificador do
              evento está ausente ou inválido.
            </p>
          </div>

          <Button onClick={handleBack} variant="outline">
            Voltar
          </Button>
        </div>
      );
    }

    return <CreateExclusiveInscriptionLink eventId={eventId} />;
  };

  return (
    <PageContainer
      title="Criar Link de Inscrição Exclusivo"
      description="Configure um novo link para inscrições exclusivas com acesso restrito"
      showBackButton={true}
      showTitle={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
