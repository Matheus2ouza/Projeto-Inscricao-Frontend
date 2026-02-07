"use client";

import SuccessPayment from "@/features/guest/components/success-payment/SuccessPayment";
import { getWithExpiry, setWithExpiry } from "@/shared/utils/storageWithExpiry";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GuestPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("eventId") ?? "";
  const clientName = searchParams.get("clientName") ?? "";
  const confirmationCode = searchParams.get("confirmationCode") ?? "";
  const persistKey = "guest_inscription_persist";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!eventId || !confirmationCode) return;

    const cached = getWithExpiry<{
      eventId: string;
      confirmationCode: string;
    }>("guest_inscription");

    if (
      !cached ||
      cached.eventId !== eventId ||
      cached.confirmationCode !== confirmationCode
    ) {
      return;
    }

    setWithExpiry(
      persistKey,
      {
        eventId,
        confirmationCode,
        createdAt: Date.now(),
      },
      null,
    );
  }, [eventId, confirmationCode]);

  const search = new URLSearchParams();
  search.set("confirmationCode", confirmationCode);
  const handleViewInscription = () => {
    router.push(`/guest/${eventId}/inscription?${search.toString()}`);
  };

  return (
    <SuccessPayment
      clientName={clientName}
      onViewInscription={handleViewInscription}
    />
  );
}
