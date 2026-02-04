"use client";

import RegisterPaymentCardDialog from "@/features/payment/components/registerPayment/RegisterPaymentCard";
import useFormCreatePaymentCard from "@/features/payment/hook/registerPaymentDetails/useRegisterPaymentCard";
import PageContainer from "@/shared/components/layout/PageContainer";
import { useCurrentUser } from "@/shared/context/user-context";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function RegisterPaymentCardPage() {
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

  const rawInscriptionParam = params.inscriptionId;
  const routeSingle = Array.isArray(rawInscriptionParam)
    ? rawInscriptionParam
    : rawInscriptionParam
      ? [rawInscriptionParam]
      : [];

  const inscriptionsIds = Array.from(
    new Set<string>([...queryList, ...repeatedParams, ...routeSingle]),
  );

  const handleBack = () => {
    router.back();
  };

  const { form, onSubmit } = useFormCreatePaymentCard();

  return (
    <PageContainer
      title="Pagamento com cartão"
      description="Preencha com seus os dados do titular do cartão."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <RegisterPaymentCardDialog
        inscriptionsIds={inscriptionsIds}
        totalValue={resolvedTotalValue}
        onCancel={handleBack}
        form={form}
        onSubmitPayment={() =>
          onSubmit(eventId, resolvedTotalValue, inscriptionsIds, {
            accountId: user.id,
            isGuest: false,
          })
        }
      />
    </PageContainer>
  );
}
