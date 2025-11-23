"use client";

import TicketSalesDetails from "@/features/tickets/components/TicketSalesDetails";
import { useParams } from "next/navigation";

export default function TicketSalesDetailsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const ticketId = params.ticketId as string;

  return <TicketSalesDetails eventId={eventId} ticketId={ticketId} />;
}
