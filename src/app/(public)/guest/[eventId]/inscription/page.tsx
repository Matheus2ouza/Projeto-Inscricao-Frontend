"use client";

import { DetailsInscription } from "@/features/guest/components/detailsInscription/detailsInscription";
import { useDetailsInscription } from "@/features/guest/hook/detailsInscription/useDetailsInscription";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
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
      // Verifica se o código de confirmação foi fornecido na URL
      // Se não, tenta recuperar do localStorage
      const storedCode = localStorage.getItem(
        "guestInscriptionConfirmationCode",
      );
      if (storedCode) {
        setConfirmationCode(storedCode);
        return;
      }
      const urlCode = searchParams.get("confirmationCode");
      setConfirmationCode(urlCode);
    }
  }, [searchParams]);

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
    const totalValue =
      inscriptionDetails.payment?.totalValue ?? participantsTotal;
    const totalPaid = inscriptionDetails.payment?.totalPaid ?? 0;
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
    const totalValue =
      inscriptionDetails.payment?.totalValue ?? participantsTotal;
    const totalPaid = inscriptionDetails.payment?.totalPaid ?? 0;
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
