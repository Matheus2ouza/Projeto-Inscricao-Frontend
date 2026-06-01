'use client';

import type {
  SaleGrupRequest,
  TicketSaleHistoryItem,
  TicketSummary,
} from '@/features/tickets/types/register-sale/ticketSaleRegisterTypes';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { useState } from 'react';
import TicketSaleHistoryTab from './tabs/TicketSaleHistoryTab';
import TicketSaleRegisterTab from './tabs/TicketSaleRegisterTab';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

enum TabValue {
  REGISTER = 'register',
  HISTORY = 'history',
}

interface TicketSaleDetailsContentProps {
  eventId: string;
  ticket: TicketSummary;
  history: TicketSaleHistoryItem[];
  onRegisterSubmit?: (payload: SaleGrupRequest) => void;
}

export default function TicketSaleDetailsContent({
  eventId,
  ticket,
  history,
  onRegisterSubmit,
}: TicketSaleDetailsContentProps) {
  const [activeTab, setActiveTab] = useState<TabValue>(TabValue.REGISTER);
  const totalSold = ticket.quantity - ticket.available;

  return (
    <div className="space-y-6">
      <Card className="border-muted/30 border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-foreground text-lg font-semibold uppercase">
              {ticket.name}
            </CardTitle>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-base font-semibold ${
                ticket.isActive
                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                  : 'border border-red-500/30 bg-red-500/10 text-red-500'
              }`}
            >
              {ticket.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">{ticket.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs uppercase">Preço</p>
              <p className="text-lg font-semibold">
                {currencyFormatter.format(ticket.price)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">
                Disponíveis
              </p>
              <p className="text-lg font-semibold">
                {ticket.available} de {ticket.quantity}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">
                Expira em
              </p>
              <p className="text-lg font-semibold">
                {new Date(ticket.expirationDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs uppercase">
                Total vendido
              </p>
              <p className="text-lg font-semibold">{totalSold}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="border-muted/20 bg-muted/30 rounded-xl border p-1"
      >
        <TabsList>
          <TabsTrigger value={TabValue.REGISTER}>Registrar venda</TabsTrigger>
          <TabsTrigger value={TabValue.HISTORY}>Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value={TabValue.REGISTER} className="mt-4 space-y-4">
          <TicketSaleRegisterTab
            eventId={eventId}
            ticket={ticket}
            onRegisterSubmit={onRegisterSubmit}
          />
        </TabsContent>
        <TabsContent value={TabValue.HISTORY} className="mt-4 space-y-4">
          <TicketSaleHistoryTab history={history} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
