"use client";

import SuccessPayment from "@/features/guest/components/success-payment/SuccessPayment";
import { useRouter, useSearchParams } from "next/navigation";

export default function GuestPaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("eventId") ?? "";
  const clientName = searchParams.get("clientName") ?? "";
  const confirmationCode = searchParams.get("confirmationCode") ?? "";

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
