"use client";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { getConvertStatusInscription } from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { AlertCircle, CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import RegisterPaymentDialog from "./RegisterPaymentDialog";

type Inscription = {
  id: string;
  eventId: string;
  accountId: string;
  totalValue: number;
  status: string;
  createAt: Date;
  canPay: boolean;
};

type InscriptionsPaymentTableProps = {
  inscriptions: Inscription[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
};

// Função para formatar data e hora no formato brasileiro
const formatDateTime = (dateString: string | Date): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Formata data: DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  // Formata hora: HH:MM
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

// Função para formatar valor em reais
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export default function InscriptionsPaymentTable({
  inscriptions,
  total,
  page,
  pageCount,
  onPageChange,
  pageSize = 10,
}: InscriptionsPaymentTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Calcular o total das inscrições selecionadas
  const selectedTotal = selectedIds.reduce((sum, id) => {
    const inscription = inscriptions.find((ins) => ins.id === id);
    return sum + (inscription?.totalValue || 0);
  }, 0);

  // Obter o eventId da primeira inscrição (todas devem pertencer ao mesmo evento)
  const eventId = inscriptions.length > 0 ? inscriptions[0].eventId : "";

  // Preparar o array de inscrições selecionadas para o dialog
  const selectedInscriptions = selectedIds.map((id) => ({ id }));

  // Função para calcular o índice global
  const calculateGlobalIndex = (localIndex: number): number => {
    return (page - 1) * pageSize + localIndex + 1;
  };

  // Função para alternar seleção de uma inscrição
  const toggleInscription = (id: string) => {
    const inscription = inscriptions.find((ins) => ins.id === id);
    if (!inscription || !inscription.canPay) {
      return;
    }

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Função para alternar seleção de todas as inscrições da página
  const toggleAll = () => {
    if (selectedIds.length === inscriptions.length) {
      setSelectedIds([]);
    } else {
      // Apenas selecionar inscrições que podem ser pagas
      const payableInscriptions = inscriptions.filter((ins) => ins.canPay);
      setSelectedIds(payableInscriptions.map((ins) => ins.id));
    }
  };

  // Função para lidar com o pagamento
  const handlePayment = () => {
    if (selectedIds.length === 0) {
      toast.error("Selecione pelo menos uma inscrição para pagar");
      return;
    }

    setIsPaymentDialogOpen(true);
  };

  const handlePaymentRegistered = () => {
    setSelectedIds([]); // Limpar seleção após sucesso
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Cabeçalho com informações de seleção e botão de pagamento */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Inscrições Pendentes</h3>
            <p className="text-sm text-muted-foreground">
              {selectedIds.length > 0
                ? `${selectedIds.length} inscrição${
                    selectedIds.length > 1 ? "ões" : ""
                  } selecionada${selectedIds.length > 1 ? "s" : ""}`
                : "Selecione as inscrições que deseja pagar"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {selectedIds.length > 0 && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Valor total</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(selectedTotal)}
                </p>
              </div>
            )}

            <Button
              onClick={handlePayment}
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              {selectedIds.length > 0
                ? `Pagar ${selectedIds.length} Inscrição${
                    selectedIds.length > 1 ? "ões" : ""
                  }`
                : "Selecionar para Pagar"}
            </Button>
          </div>
        </div>

        {/* Tabela de inscrições */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3 text-center font-semibold">
                  <Checkbox
                    checked={
                      inscriptions.length > 0 &&
                      selectedIds.length ===
                        inscriptions.filter((ins) => ins.canPay).length
                    }
                    onCheckedChange={toggleAll}
                    aria-label="Selecionar todas as inscrições"
                    disabled={inscriptions.every((ins) => !ins.canPay)}
                  />
                </th>
                <th className="w-12 px-4 py-3 text-center font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">ID</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Valor</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Criado em
                </th>
              </tr>
            </thead>
            <tbody>
              {inscriptions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Nenhuma inscrição pendente encontrada
                  </td>
                </tr>
              ) : (
                inscriptions.map((inscription, idx) => {
                  const isSelected = selectedIds.includes(inscription.id);
                  return (
                    <tr
                      key={inscription.id}
                      className={`border-t hover:bg-muted/30 transition-colors ${
                        isSelected ? "bg-primary/5" : ""
                      } ${!inscription.canPay ? "opacity-50 bg-muted/20" : ""}`}
                    >
                      <td className="w-12 px-4 py-3 text-center">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleInscription(inscription.id)
                          }
                          aria-label={`Selecionar inscrição ${inscription.id}`}
                          disabled={!inscription.canPay}
                        />
                      </td>
                      <td className="w-12 px-4 py-3 text-center font-medium">
                        {calculateGlobalIndex(idx)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {inscription.id.substring(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            inscription.status
                          )}`}
                        >
                          {getConvertStatusInscription(inscription.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">
                        {formatCurrency(inscription.totalValue)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {formatDateTime(inscription.createAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Total de {total} inscrições pendentes
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? "#" : undefined}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < pageCount && onPageChange(page + 1)}
                  href={page < pageCount ? "#" : undefined}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Informações de paginação */}
        <div className="text-center text-sm text-muted-foreground mt-2">
          Página {page} de {pageCount} • {pageSize} itens por página
        </div>

        {/* Informações sobre o processo de pagamento */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">
                Como funciona o pagamento?
              </h4>
              <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• Selecione as inscrições que deseja pagar</li>
                <li>• O valor total será somado automaticamente</li>
                <li>
                  • Clique em "Pagar" para prosseguir com o pagamento via PIX
                </li>
                <li>
                  • Após o pagamento, anexe o comprovante para confirmação
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dialog de Registro de Pagamento */}
        <RegisterPaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          selectedInscriptions={selectedInscriptions}
          eventId={eventId}
          totalValue={selectedTotal}
          onPaymentRegistered={handlePaymentRegistered}
        />
      </div>
    </div>
  );
}
