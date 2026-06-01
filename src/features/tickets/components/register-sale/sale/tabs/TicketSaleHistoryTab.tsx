'use client';

import type { TicketSaleHistoryItem } from '@/features/tickets/types/register-sale/ticketSaleRegisterTypes';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';

interface TicketSaleHistoryTabProps {
  history: TicketSaleHistoryItem[];
}

export default function TicketSaleHistoryTab({
  history,
}: TicketSaleHistoryTabProps) {
  return (
    <Card className="border-muted/30 border shadow-sm">
      <CardHeader>
        <CardTitle className="text-foreground text-lg font-semibold">
          Histórico de vendas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma venda registrada ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Registrado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold">{item.id}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(item.createdAt).toLocaleString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
