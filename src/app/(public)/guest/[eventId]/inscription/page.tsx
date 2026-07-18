'use client';

import { DetailsInscription } from '@/features/guest/components/detailsInscription/DetailsInscription';
import { SearchInscriptionCard } from '@/features/guest/components/detailsInscription/SearchInscriptionCard';
import { useDeletePayment } from '@/features/guest/hook/detailsInscription/actions/useDeletePayment';
import { useModifyReceiptPayment } from '@/features/guest/hook/detailsInscription/actions/useModifyReceiptPayment';
import { useDetailsInscription } from '@/features/guest/hook/detailsInscription/useDetailsInscription';
import PageContainer from '@/shared/components/layout/PageContainer';
import {
  Card,
  CardContent,
  CardHeader,
  Skeleton,
} from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { getWithExpiry } from '@/shared/utils/storageWithExpiry';
import { FileText, Frown } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function GuestInscriptionPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const hasAutoScrolledRef = useRef(false);
  const persistKey = 'guest_inscription_persist';

  if (!eventId) {
    return null;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlCode = searchParams.get('confirmationCode');
      if (urlCode) {
        setConfirmationCode(urlCode);
        return;
      }

      const cached = getWithExpiry<{
        eventId: string;
        confirmationCode: string;
      }>('guest_inscription');
      if (cached?.eventId === eventId && cached.confirmationCode) {
        setConfirmationCode(cached.confirmationCode);
        return;
      }

      const persistedRaw = window.localStorage.getItem(persistKey);
      if (persistedRaw) {
        try {
          const persisted = JSON.parse(persistedRaw) as {
            eventId?: string;
            confirmationCode?: string;
          };
          if (persisted?.eventId === eventId && persisted.confirmationCode) {
            setConfirmationCode(persisted.confirmationCode);
            return;
          }
        } catch {
          window.localStorage.removeItem(persistKey);
        }
      }

      setConfirmationCode(null);
    }
  }, [eventId, searchParams]);

  const {
    eventConfig,
    inscription,
    participant,
    payments,
    loading,
    error,
    refetch,
  } = useDetailsInscription({
    confirmationCode: confirmationCode ?? '',
  });

  const { deletePaymentMutation } = useDeletePayment();

  useEffect(() => {
    if (hasAutoScrolledRef.current) return;
    if (searchParams.get('scroll') !== 'payment') return;
    if (loading) return;
    if (!inscription) return;
    if (error) return;

    requestAnimationFrame(() => {
      const el = document.getElementById('guest-payment');
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
      hasAutoScrolledRef.current = true;
    });
  }, [searchParams, loading, inscription, error]);

  const handleRegisterPaymentCard = () => {
    if (!inscription || !eventId || !participant) return;

    const participantTotal = participant.typeInscription.price;
    const payment = payments?.[0];
    const totalValue = payment?.totalValue ?? participantTotal;
    const totalPaid = payment?.totalPaid ?? 0;
    const remainingTotal = Math.max(totalValue - totalPaid, 0);
    const search = new URLSearchParams();
    search.set('inscriptions', inscription.id);
    search.set('totalValue', String(remainingTotal));
    router.push(`/guest/${eventId}/payment/card?${search.toString()}`);
  };

  const { handleModifyReceiptPayment, isModifingReceiptPayment } =
    useModifyReceiptPayment();

  const renderContent = () => {
    // Remove loading state - ele será mostrado como conteúdo interno
    if (error) {
      return (
        <div className="flex min-h-[160px] items-center justify-center">
          <div className="w-full max-w-xl rounded-xl border border-gray-200 p-6 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <Frown className="h-9 w-9" />
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Não foi possível carregar sua inscrição
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {error}
            </p>
            <Button className="mt-4" onClick={() => refetch()}>
              Tentar Novamente
            </Button>
          </div>
        </div>
      );
    }

    // Mostra loading APENAS quando estiver carregando e não houver dados ainda
    if (loading) {
      return (
        <div className="w-full space-y-8">
          {/* Skeleton do Card de Detalhes da Inscrição */}
          <Card className="liquid-card w-full overflow-hidden border-0 shadow-none">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-36" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skeleton do Card de Participante */}
          <Card className="liquid-card w-full overflow-hidden border-0 shadow-none">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-9 w-36" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-28" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skeleton do Card de Pagamento */}
          <Card className="liquid-card w-full overflow-hidden border-0 shadow-none">
            <CardHeader className="pb-4">
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <Skeleton className="h-6 w-24" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (!eventConfig || !inscription || !participant) {
      return (
        <div className="flex min-h-[160px] items-center justify-center">
          <div className="border-riodavida/20 bg-riodavida/5 w-full max-w-xl rounded-xl border p-6 text-center shadow-sm backdrop-blur-sm">
            <div className="bg-riodavida/10 text-riodavida mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <FileText className="h-9 w-9" />
            </div>
            <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-semibold">
              Dados da inscrição não disponíveis
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Não foi possível encontrar os dados da inscrição. Tente recarregar
              a página.
            </p>
            <Button
              className="bg-riodavida hover:bg-riodavida-dark mt-4 text-white"
              onClick={() => refetch()}
            >
              Recarregar Dados
            </Button>
          </div>
        </div>
      );
    }

    return (
      <DetailsInscription
        eventId={eventId}
        confirmationCode={confirmationCode}
        eventConfig={eventConfig}
        inscription={inscription}
        participant={participant}
        payments={payments}
        loading={loading}
        onSearch={(code) => setConfirmationCode(code)}
        onClear={() => setConfirmationCode(null)}
        onRegisterPaymentCard={handleRegisterPaymentCard}
        onDeletePayment={deletePaymentMutation.mutate}
        onModifyReceipt={handleModifyReceiptPayment}
        isModifingReceipt={isModifingReceiptPayment}
      />
    );
  };

  return (
    <div className="relative isolate max-h-screen w-full">
      <PageContainer
        title="Minha Inscrição"
        description="Acompanhe o status da sua inscrição"
      >
        {/* Card de Busca - SEMPRE visível */}
        <SearchInscriptionCard
          confirmationCode={confirmationCode}
          onSearch={(code) => setConfirmationCode(code)}
          onClear={() => setConfirmationCode(null)}
          loading={loading}
        />

        {/* Conteúdo principal (loading, error, dados) */}
        {renderContent()}
      </PageContainer>
    </div>
  );
}
