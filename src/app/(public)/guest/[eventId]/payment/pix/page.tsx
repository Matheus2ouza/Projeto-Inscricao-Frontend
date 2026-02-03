"use client";

import RegisterPaymentPix from "@/features/payment/components/registerPayment/RegisterPaymentPix";
import { useGuestRegisterPayment } from "@/features/payment/hook/registerPayment/useGuestRegisterPayment";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function GuestRegisterPaymentPixPage() {
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

  const guestNameParam = searchParams.get("guestName");
  const guestName = guestNameParam ?? "";

  const guestEmailParam = searchParams.get("guestEmail");
  const guestEmail = guestEmailParam ?? "";

  const guestRegisterPayment = useGuestRegisterPayment();

  const allowCardParam = searchParams.get("allowCard");
  const allowCard = allowCardParam === "1" || allowCardParam === "true";

  const handleBack = () => {
    router.back();
  };

  const renderContent = () => {
    return (
      <RegisterPaymentPix
        selectedInscriptions={inscriptionsIds.map((id) => ({ id }))}
        eventId={eventId}
        totalValue={resolvedTotalValue}
        allowCard={allowCard}
        allowCustomValue={false}
        onSubmitPayment={({ value, image }) =>
          guestRegisterPayment.mutateAsync({
            eventId,
            guestName,
            guestEmail,
            isGuest: true,
            totalValue: value,
            image,
            inscriptions: inscriptionsIds.map((id) => ({ id })),
          })
        }
      />
    );
  };

  return (
    <PageContainer
      title="Registrar Pagamento"
      description="Envie o comprovante do Pix para finalizar o pagamento"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
