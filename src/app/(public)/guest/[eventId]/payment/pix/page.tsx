"use client";

import RegisterPaymentDialog from "@/features/payment/components/registerPayment/RegisterPaymentPix";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function RegisterPaymentPixPage() {
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
          <RegisterPaymentDialog
            selectedInscriptions={inscriptionsIds.map((id) => ({ id }))}
            eventId={eventId}
            totalValue={resolvedTotalValue}
            allowCard={allowCard}
          />
        </div>
      )}
    </PageContainer>
  );
}
