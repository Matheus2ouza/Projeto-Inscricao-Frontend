"use client";

import type { FindTicketsForSaleOutput } from "@/features/tickets/types/register-sale/ticketSaleRegisterTypes";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface TicketsForSaleListProps {
  event: FindTicketsForSaleOutput;
  onRegisterTicket: (ticketId: string) => void;
}

export default function TicketsForSaleList({
  event,
  onRegisterTicket,
}: TicketsForSaleListProps) {
  const hasTickets = event.tickets?.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{event.name}</h2>
        {!event.ticketEnabled && (
          <Badge variant="outline" className="text-xs">
            Tickets desativados
          </Badge>
        )}
      </div>

      {hasTickets ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {event.tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="rounded-2xl border border-muted/30 shadow"
            >
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {ticket.name}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs border-emerald-500 text-emerald-600"
                  >
                    {ticket.available} disp.
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground ">
                  PREÇO - por unidade
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-foreground">
                    {currencyFormatter.format(ticket.price)}
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    disabled={!ticket.isActive || ticket.available <= 0}
                    onClick={() => onRegisterTicket(ticket.id)}
                  >
                    Registrar venda
                  </Button>
                </div>
                <p className="text-xs text-red-500">
                  Expira em{" "}
                  {ticket.expirationDate
                    ? format(
                        new Date(ticket.expirationDate),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR },
                      )
                    : "—"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum ticket disponível para venda.
        </p>
      )}
    </div>
  );
}
