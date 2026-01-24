import {
  FindTicketDetailsResponse,
  TicketDetails,
} from "../types/ticketDetails/ticketDetailsTypes";

export function mapTicketDetails(
  data: FindTicketDetailsResponse,
): TicketDetails {
  return {
    ...data,
    description: data.description ?? "",
    expirationDate: String(data.expirationDate),
    ticketSaleItems: data.TicketSaleItens ?? [],
    ticketSalePayments: data.TicketSalePayments ?? [],
  };
}
