"use client";

import RegisterPaymentPix from "@/features/payment/components/registerPayment/RegisterPaymentPix";
import { useRegisterPayment } from "@/features/payment/hook/registerPayment/useRegisterPayment";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { useCurrentUser } from "@/shared/context/user-context";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function RegisterPaymentPixPage() {
  const { user } = useCurrentUser();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) {
    return null;
  }

  const totalValueParam = searchParams.get("totalValue");
  const totalValue = Number(totalValueParam ?? 0);
  const resolvedTotalValue = Number.isFinite(totalValue) ? totalValue : 0;

  const queryCsv = searchParams.get("inscriptions");
  const queryList = queryCsv
    ? queryCsv
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const repeatedParams =
    typeof searchParams.getAll === "function"
      ? searchParams.getAll("inscriptionId")
      : [];

  const inscriptionsIds = Array.from(
    new Set<string>([...queryList, ...repeatedParams]),
  );

  const registerPayment = useRegisterPayment();

  const allowCardParam = searchParams.get("allowCard");
  const allowCard = allowCardParam === "1" || allowCardParam === "true";

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Registrar Pagamento"
      description="Envie o comprovante do Pix para finalizar o pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {inscriptionsIds.length === 0 ? (
        <div className="p-6 flex items-center justify-center min-h-72">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Nenhuma inscrição selecionada para pagamento.
            </p>
            <Button onClick={handleBack}>Voltar</Button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl">
          <RegisterPaymentPix
            selectedInscriptions={inscriptionsIds.map((id) => ({ id }))}
            eventId={eventId}
            totalValue={resolvedTotalValue}
            allowCard={allowCard}
            allowCustomValue={false}
            onSubmitPayment={({ value, image }) =>
              registerPayment.mutateAsync({
                eventId,
                accountId: user.id,
                totalValue: value,
                image,
                inscriptions: inscriptionsIds.map((id) => ({ id })),
              })
            }
          />
        </div>
      )}
    </PageContainer>
  );
}
