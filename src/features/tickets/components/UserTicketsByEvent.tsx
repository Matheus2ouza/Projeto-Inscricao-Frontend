"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import { getFontSizeClass } from "@/shared/utils/getFontSizeClass";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Check, Copy, ExternalLink, Ticket, Wallet } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { TicketsByEventResponse } from "../types/ticketsTypes";

type UserTicketsByEventProps = {
  event: TicketsByEventResponse;
  onSelectTicket: (ticketId: string) => void;
};

export function UserTicketsByEvent({
  event,
  onSelectTicket,
}: UserTicketsByEventProps) {
  const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  });

  const [copied, setCopied] = useState(false);
  const tickets = event.tickets ?? [];
  const canPurchase = Boolean(event.ticketEnabled);
  const ticketPageUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return `${window.location.origin}/events/tickets/${event.id}`;
  }, [event.id]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ticketPageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Falha ao copiar link de tickets", error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-stretch">
          <div className="w-full md:w-1/2 relative">
            {event.imageUrl ? (
              <div className="relative w-full overflow-hidden rounded-xl">
                <AspectRatio ratio={16 / 9}>
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
            ) : (
              <div className="h-56 w-full rounded-xl bg-muted flex items-center justify-center">
                <Ticket className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <Badge
              variant={canPurchase ? "default" : "outline"}
              className={cn(
                "absolute top-4 right-4 shadow-sm",
                canPurchase
                  ? "bg-green-600 text-white hover:bg-green-600"
                  : "text-amber-600 border-amber-400 bg-white/90 backdrop-blur"
              )}
            >
              {canPurchase ? "Vendas disponíveis" : "Vendas indisponíveis"}
            </Badge>
          </div>
          <div className="flex-1 space-y-4 md:flex md:flex-col">
            <div>
              <h1 className={cn("text-2xl font-semibold")}>{event.name}</h1>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Abaixo você verá os tickets disponíveis para compra. Caso prefira,
              copie o link e compartilhe com os inscritos para que eles mesmos
              possam acessar e adquirir seus tickets.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Link direto
              </span>
              <div className="flex-1 min-w-0">
                <input
                  readOnly
                  value={ticketPageUrl}
                  className="w-full text-xs bg-transparent border rounded px-2 py-1 truncate"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={cn(
                  "p-1 h-7 w-7 sm:h-8 sm:w-8 transition-all duration-300",
                  copied
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                )}
                onClick={handleCopyLink}
                title={copied ? "Copiado!" : "Copiar link"}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="flex justify-end">
              <Button
                className="flex items-center gap-2"
                disabled={
                  !canPurchase || tickets.every((t) => t.available <= 0)
                }
                onClick={() => {
                  const availableTicket = tickets.find((t) => t.available > 0);
                  if (availableTicket) {
                    onSelectTicket(availableTicket.id);
                  }
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Comprar ticket
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {tickets.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center text-muted-foreground">
            Nenhum ticket disponível para este evento no momento.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => {
            const isUnavailable = ticket.available <= 0 || !canPurchase;
            return (
              <Card
                key={ticket.id}
                className="h-full border border-border/40 shadow-sm rounded-2xl flex flex-col"
              >
                <CardContent className="flex flex-col h-full">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-full bg-primary/10 text-primary">
                        <Ticket className="w-4 h-4" />
                      </span>
                      <h3
                        className={cn(
                          "font-semibold leading-tight text-lg",
                          getFontSizeClass(ticket.name, true)
                        )}
                      >
                        {ticket.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        ticket.available > 0
                          ? "border-green-300 text-green-600 dark:text-green-300"
                          : "border-red-300 text-red-600 dark:text-red-300"
                      )}
                    >
                      {ticket.available} disp.
                    </Badge>
                  </div>

                  <dl className="space-y-3 text-sm text-muted-foreground flex-1">
                    <div className="flex items-center justify-between">
                      <dt>Quantidade total</dt>
                      <dd className="font-medium text-foreground">
                        {ticket.quantity}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Validade</dt>
                      <dd className="font-medium text-foreground">
                        {dateFormatter.format(new Date(ticket.expirationDate))}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt>Preço</dt>
                      <dd className="font-medium text-foreground flex items-center gap-1">
                        <Wallet className="w-4 h-4" />
                        {currencyFormatter.format(ticket.price)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    {isUnavailable
                      ? "Url indisponível até o ticket ser liberado."
                      : "Disponível na tela de compra."}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
