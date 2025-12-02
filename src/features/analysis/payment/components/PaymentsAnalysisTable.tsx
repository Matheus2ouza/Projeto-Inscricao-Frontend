"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CreditCard, Users } from "lucide-react";
import { PaymentAnalysisResponse } from "../types/analysisTypes";

interface PaymentsAnalysisTableProps {
  eventId: string;
  analysisData: PaymentAnalysisResponse | null;
  loading: boolean;
  error: string | Error | null;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onViewPayment: (inscriptionId: string) => void;
}

export default function PaymentsAnalysisTable({
  analysisData,
  loading,
  page,
  pageCount,
  onPageChange,
  onViewPayment,
}: PaymentsAnalysisTableProps) {
  const shouldRenderPagination = pageCount > 1;

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analysisData || analysisData.inscriptions.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">
          Nenhuma inscrição encontrada
        </h3>
        <p className="text-muted-foreground">
          Este evento não possui inscrições pagas.
        </p>
      </div>
    );
  }

  const totalPayments = analysisData.inscriptions.reduce(
    (total, inscription) => total + inscription.countPayments,
    0
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total de Inscrições
              </p>
              <p className="text-2xl font-bold">
                {analysisData.inscriptions.length}
              </p>
            </div>
            <span className="p-2 bg-blue-100 rounded-full">
              <Users className="w-4 h-4 text-blue-600" />
            </span>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total de Pagamentos
              </p>
              <p className="text-2xl font-bold">{totalPayments}</p>
            </div>
            <span className="p-2 bg-green-100 rounded-full">
              <CreditCard className="w-4 h-4 text-green-600" />
            </span>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold">
                R${" "}
                {analysisData.inscriptions
                  .reduce(
                    (total, inscription) => total + inscription.totalValue,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
            <span className="p-2 bg-purple-100 rounded-full">
              <CreditCard className="w-4 h-4 text-purple-600" />
            </span>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {analysisData.inscriptions.map((inscription) => {
          return (
            <Card key={inscription.id} className="border-0 shadow-sm">
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold">
                    {inscription.accountName || inscription.responsible}
                  </h3>
                  <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                    <span>Responsável: {inscription.responsible}</span>
                    <span className="uppercase font-semibold text-foreground">
                      Saldo devedor R$ {inscription.totalValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {inscription.payments.length} pagamento
                      {inscription.payments.length === 1 ? "" : "s"}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => onViewPayment(inscription.id)}
                    >
                      Detalhes
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto rounded-xl border">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 uppercase text-xs tracking-wide">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Data
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscription.payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-t even:bg-muted/40 hover:bg-muted/50 transition-colors"
                        >
                          <td className="px-4 py-3 font-mono text-xs">
                            {payment.id.slice(0, 8)}...
                          </td>
                          <td className="px-4 py-3">
                            {new Date(payment.date).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            R$ {payment.value.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {shouldRenderPagination && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={page > 1 ? "#" : undefined}
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    isActive={page === index + 1}
                    onClick={() => onPageChange(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={page < pageCount ? "#" : undefined}
                  onClick={() => page < pageCount && onPageChange(page + 1)}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
