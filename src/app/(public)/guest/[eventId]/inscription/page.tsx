"use client";

import { DetailsInscription } from "@/features/guest/components/detailsInscription/detailsInscription";
import { useDetailsInscription } from "@/features/guest/hook/detailsInscription/useDetailsInscription";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { getWithExpiry } from "@/shared/utils/storageWithExpiry";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GuestInscription() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  if (!eventId) {
    return null;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlCode = searchParams.get("confirmationCode");
      if (urlCode) {
        setConfirmationCode(urlCode);
        return;
      }

      const cached = getWithExpiry<{
        eventId: string;
        confirmationCode: string;
      }>("guest_inscription");
      if (cached?.eventId === eventId && cached.confirmationCode) {
        setConfirmationCode(cached.confirmationCode);
        return;
      }

      setConfirmationCode(null);
    }
  }, [eventId, searchParams]);

  const { inscriptionDetails, loading, error, refetch } = useDetailsInscription(
    {
      confirmationCode: confirmationCode ?? "",
    },
  );

  const handleRegisterPaymentCard = () => {
    if (!inscriptionDetails || !eventId) return;
    const participantsTotal = inscriptionDetails.participants.reduce(
      (total, participant) => total + participant.typeInscription.price,
      0,
    );
    const payment = inscriptionDetails.payments?.[0];
    const totalValue = payment?.totalValue ?? participantsTotal;
    const totalPaid = payment?.totalPaid ?? 0;
    const remainingTotal = Math.max(totalValue - totalPaid, 0);
    const search = new URLSearchParams();
    search.set("inscriptions", inscriptionDetails.id);
    search.set("totalValue", String(remainingTotal));
    router.push(`/guest/${eventId}/payment/card?${search.toString()}`);
  };

  const handleRegisterPaymentPix = () => {
    if (!inscriptionDetails || !eventId) return;
    const participantsTotal = inscriptionDetails.participants.reduce(
      (total, participant) => total + participant.typeInscription.price,
      0,
    );
    const payment = inscriptionDetails.payments?.[0];
    const totalValue = payment?.totalValue ?? participantsTotal;
    const totalPaid = payment?.totalPaid ?? 0;
    const remainingTotal = Math.max(totalValue - totalPaid, 0);
    const search = new URLSearchParams();
    search.set("inscriptions", inscriptionDetails.id);
    search.set("confirmationCode", confirmationCode ?? "");
    search.set("guestName", inscriptionDetails.guestName ?? "");
    search.set("guestEmail", inscriptionDetails.guestEmail ?? "");
    search.set("totalValue", String(remainingTotal));
    router.push(`/guest/${eventId}/payment/pix?${search.toString()}`);
  };

  const renderContent = () => {
    return (
      <div className="space-y-6">
        <DetailsInscription
          confirmationCode={confirmationCode}
          inscriptionDetails={inscriptionDetails}
          loading={loading}
          onSearch={(code) => setConfirmationCode(code)}
          onClear={() => setConfirmationCode(null)}
          onRegisterPaymentCard={handleRegisterPaymentCard}
          onRegisterPaymentPix={handleRegisterPaymentPix}
        />
        {error && (
          <div className="min-h-[120px] flex items-center justify-center">
            <div className="text-center">
              <p className="mb-4 text-foreground">{error}</p>
              <Button onClick={() => refetch()}>Tentar Novamente</Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <PageContainer
      title="Minha Inscrição"
      description="Acompanhe o status da sua inscrição"
    >
      {renderContent()}
    </PageContainer>
  );
}
