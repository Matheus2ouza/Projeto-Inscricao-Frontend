"use client";

import { TicketPurchaseModal } from "@/shared/components/TicketPurchaseModal";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Copy, Ticket, Wallet } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { TicketsByEventResponse } from "../types/ticketsTypes";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type TicketsPageContentProps = {
  eventId: string;
  event: TicketsByEventResponse;
};

export function TicketsPageContent({
  eventId,
  event,
}: TicketsPageContentProps) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tickets = event?.tickets ?? [];
  const publicTicketLink = useMemo(() => {
    if (typeof window === "undefined" || !eventId) {
      return "";
    }
    return `${window.location.origin}/events/tickets/${eventId}`;
  }, [eventId]);

  const internalTicketLink = useMemo(() => {
    if (typeof window === "undefined" || !event?.id) {
      return "";
    }
    return `${window.location.origin}/user/tickets/${event.id}`;
  }, [event?.id]);

  const purchaseItems = useMemo(() => {
    return tickets
      .map((ticket) => ({
        id: ticket.id,
        name: ticket.name,
        quantity: quantities[ticket.id] || 0,
        price: ticket.price,
      }))
      .filter((item) => item.quantity > 0);
  }, [tickets, quantities]);

  const totalAmount = purchaseItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const totalQuantity = purchaseItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const canProceed = purchaseItems.length > 0;

  const handleQuantityChange = (
    ticketId: string,
    value: number,
    max: number
  ) => {
    if (Number.isNaN(value)) return;
    const clamped = Math.max(0, Math.min(value, max));
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: clamped,
    }));
  };

  const handlePurchase = () => {
    if (!canProceed) return;
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = () => {
    if (!canProceed || !eventId) {
      return;
    }

    const selectedTickets = purchaseItems.map((item) => ({
      ticketId: item.id,
      quantity: item.quantity,
    }));

    const params = new URLSearchParams();
    params.set("tickets", JSON.stringify(selectedTickets));

    router.push(`/events/tickets/${eventId}/checkout?${params.toString()}`);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 flex flex-col gap-6 md:flex-row md:items-stretch">
              <div className="w-full md:w-1/2 relative">
                {event.imageUrl ? (
                  <div className="relative h-60 w-full overflow-hidden rounded-xl">
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw,
                        (max-width: 1200px) 70vw,
                        50vw"
                    />
                  </div>
                ) : (
                  <div className="h-60 w-full rounded-xl bg-muted flex items-center justify-center">
                    <Ticket className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  className={cn(
                    "absolute top-4 right-4 shadow-sm",
                    event.ticketEnabled
                      ? "bg-green-600 text-white"
                      : "bg-amber-500 text-white"
                  )}
                >
                  {event.ticketEnabled
                    ? "Vendas disponíveis"
                    : "Vendas indisponíveis"}
                </Badge>
              </div>
              <div className="flex-1 flex flex-col space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold">{event.name}</h1>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    Abaixo você verá os tickets disponíveis para compra. Caso
                    prefira, copie o link e compartilhe com os inscritos para
                    que eles mesmos possam acessar e adquirir seus tickets.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Link
                  </span>
                  <div className="flex-1 min-w-0">
                    <input
                      readOnly
                      value={internalTicketLink}
                      className="w-full text-xs bg-transparent border rounded px-2 py-1 truncate"
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="p-1 h-7 w-7 sm:h-8 sm:w-8 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
                    onClick={() => {
                      if (!internalTicketLink) return;
                      navigator.clipboard.writeText(internalTicketLink);
                      toast.success("Link interno copiado");
                    }}
                    title="Copiar link"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Tickets disponíveis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((ticket) => {
                const quantity = quantities[ticket.id] ?? 0;
                return (
                  <Card
                    key={ticket.id}
                    className="border border-border/40 shadow-sm rounded-2xl flex flex-col"
                  >
                    <CardContent className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {ticket.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Até {ticket.available} disponíveis
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            ticket.available > 0
                              ? "border-green-300 text-green-600"
                              : "border-red-300 text-red-600"
                          )}
                        >
                          {ticket.available} disp.
                        </Badge>
                      </div>
                      <dl className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <dt>Preço</dt>
                          <dd className="font-medium text-foreground flex items-center gap-1">
                            <Wallet className="w-4 h-4" />
                            {currencyFormatter.format(ticket.price)}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <dt className="text-foreground font-medium">
                            Quantidade
                          </dt>
                          <Input
                            type="number"
                            min={0}
                            max={ticket.available}
                            value={quantity === 0 ? "" : quantity}
                            onChange={(event) =>
                              handleQuantityChange(
                                ticket.id,
                                Number(event.target.value),
                                ticket.available
                              )
                            }
                            className="w-24 text-right"
                            placeholder="0"
                          />
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <aside>
          <Card className="sticky top-6 border-0 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Resumo da compra
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tickets selecionados detalhados
                  </p>
                </div>
                {purchaseItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Selecione ao menos um ticket para ver o resumo.
                  </p>
                ) : (
                  <div className="space-y-2 rounded-lg border border-border/50 p-3">
                    {purchaseItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.quantity}x{" "}
                            {currencyFormatter.format(item.price)}
                          </span>
                        </div>
                        <span className="font-semibold text-foreground">
                          {currencyFormatter.format(item.quantity * item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tickets selecionados
                  </p>
                  <p className="text-2xl font-semibold ml-2">{totalQuantity}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm text-muted-foreground">
                    Total estimado
                  </p>
                  <p className="text-2xl font-semibold">
                    {currencyFormatter.format(totalAmount)}
                  </p>
                </div>
              </div>
              <Button
                className="w-full flex items-center gap-2"
                disabled={!canProceed}
                onClick={handlePurchase}
              >
                Revisar compra
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <TicketPurchaseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        items={purchaseItems}
        totalAmount={totalAmount}
        onConfirm={handleConfirmPurchase}
        confirmLabel="Ir para checkout"
      />
    </>
  );
}
