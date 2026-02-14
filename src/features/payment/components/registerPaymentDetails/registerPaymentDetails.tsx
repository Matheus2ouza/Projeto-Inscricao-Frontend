"use client";

import {
  Inscription,
  Participant,
  Payment,
} from "@/features/payment/types/registerPaymentDetails/registerPaymentDetails";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useCurrentUser } from "@/shared/context/user-context";
import { formatDate, formatDateTime } from "@/shared/utils/formatDate";
import { getCalculateAge } from "@/shared/utils/getCalculateAge";
import {
  getConvertStatusInscription,
  getConvertStatusPayment,
} from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  AlertCircle,
  Calendar,
  Check,
  Copy,
  DollarSign,
  Eye,
  FileText,
  ImageIcon,
  LinkIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type RegisterPaymentDetailsProps = {
  eventId: string;
  inscriptions: Inscription | null;
  participant: Participant[];
  payments: Payment[];
  allowCard: boolean;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onRegisterPaymentPix: (payload: {
    inscriptionId: string;
    totalValue: number;
  }) => void;
  onRegisterPaymentCard: (payload: {
    inscriptionId: string;
    totalValue: number;
  }) => void;
};

export function RegisterPaymentDetailsTable({
  eventId,
  inscriptions,
  participant,
  payments,
  allowCard,
  total,
  page,
  pageCount,
  onPageChange,
  onRegisterPaymentPix,
  onRegisterPaymentCard,
}: RegisterPaymentDetailsProps) {
  const { user } = useCurrentUser();
  const [paymentLink, setPaymentLink] = useState("");
  const [copied, setCopied] = useState(false);

  if (!inscriptions) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <AlertCircle className="h-10 w-10 mb-4" />
        <p>Inscrição não encontrada.</p>
      </div>
    );
  }

  const remainingTotal = Math.max(inscriptions.totalValue - total, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setPaymentLink(
        `${origin}/events/payment/card?eventId=${eventId}&inscriptions=${inscriptions.id}&userId=${user.id}&totalValue=${remainingTotal}`,
      );
    }
  }, [eventId, inscriptions.id, user.id, remainingTotal]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
    }
  };

  // Função para formatar gênero
  const formatGender = (gender: string) => {
    const genderMap: Record<string, string> = {
      MASCULINO: "Masculino",
      FEMININO: "Feminino",
    };

    return genderMap[gender] || gender;
  };

  return (
    <div className="space-y-8">
      {/* Card da Inscrição */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes da Inscrição
                </h1>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 mt-2">
                  <FileText className="h-4 w-4" />
                  <code className="font-mono bg-muted px-2 py-1 rounded">
                    {inscriptions.id.substring(0, 12)}...
                  </code>
                </div>

                <div className="text-xs text-muted-foreground">
                  Criada em: {formatDateTime(inscriptions.createdAt)}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  onClick={() =>
                    onRegisterPaymentPix({
                      inscriptionId: inscriptions.id,
                      totalValue: remainingTotal,
                    })
                  }
                  disabled={remainingTotal <= 0}
                >
                  Registrar pagamento Pix
                </Button>
                {allowCard && (
                  <Button
                    type="button"
                    onClick={() =>
                      onRegisterPaymentCard({
                        inscriptionId: inscriptions.id,
                        totalValue: remainingTotal,
                      })
                    }
                    disabled={remainingTotal <= 0}
                  >
                    Registrar pagamento Cartão
                  </Button>
                )}
              </div>
            </div>

            {/* Informações em linha - Responsável, Status e Valor Total */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {/* Responsável */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Responsável</span>
                </div>
                <p className="text-lg font-semibold">
                  {inscriptions.responsible}
                </p>
              </div>

              {/* Status */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    inscriptions.status,
                  )}`}
                >
                  {getConvertStatusInscription(inscriptions.status)}
                </span>
              </div>

              {/* Valor Total */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Valor Total</span>
                </div>
                <p className="text-xl font-bold">
                  {getFormatCurrency(inscriptions.totalValue)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link de Pagamento Público */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Link de Pagamento
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Compartilhe este link para que outra pessoa possa realizar o pagamento
          desta inscrição.
        </p>
        <div className="flex items-center gap-2">
          <Input value={paymentLink} readOnly className="bg-muted" />
          <Button onClick={handleCopy} size="icon" variant="outline">
            {copied ? (
              <Check className="h-4 w-4 text-green-500 animate-in zoom-in duration-300" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Seção de Participantes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Participantes
            </h2>
            <p className="text-muted-foreground">
              {participant.length} participante
              {participant.length !== 1 ? "s" : ""} nesta inscrição
            </p>
          </div>
        </div>

        {/* Participantes - Versão Desktop */}
        <div className="hidden sm:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Idade</TableHead>
                <TableHead className="w-[120px]">Gênero</TableHead>
                <TableHead className="w-[140px]">Nascimento</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participant.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {p.name}
                    </div>
                  </TableCell>
                  <TableCell>{getCalculateAge(p.birthDate)} anos</TableCell>
                  <TableCell>{formatGender(p.gender)}</TableCell>
                  <TableCell>{formatDate(p.birthDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Participantes - Versão Mobile */}
        <div className="block sm:hidden">
          {participant.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
              Nenhum participante encontrado.
            </div>
          ) : (
            <div className="space-y-3">
              {participant.map((p) => (
                <div
                  key={p.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">{p.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Idade</p>
                      <p className="text-sm font-medium">
                        {getCalculateAge(p.birthDate)} anos
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Gênero</p>
                      <p className="text-sm font-medium">
                        {formatGender(p.gender)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Nascimento
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(p.birthDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Seção de Pagamentos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Histórico de Pagamentos
            </h2>
            <p className="text-muted-foreground">
              {payments.length} pagamento{payments.length !== 1 ? "s" : ""}{" "}
              registrado{payments.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Pagamentos - Versão Desktop */}
        <div className="hidden sm:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="w-[120px]">Valor</TableHead>
                <TableHead className="w-[180px]">Data</TableHead>
                <TableHead className="w-[100px]">Comprovante</TableHead>
                <TableHead className="w-[100px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Nenhum pagamento registrado.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge className={getStatusColor(p.status)}>
                        {getConvertStatusPayment(p.status)}
                      </Badge>
                      {p.rejectionReason && (
                        <div className="text-xs text-destructive mt-1">
                          {p.rejectionReason}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {getFormatCurrency(p.totalValue)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDateTime(p.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {p.imageUrl ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          title="Ver Comprovante"
                        >
                          <Link
                            href={p.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagamentos - Versão Mobile */}
        <div className="block sm:hidden">
          {payments.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
              Nenhum pagamento registrado.
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {/* Primeira linha: Status e Valor */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getStatusColor(p.status)}>
                      {getConvertStatusPayment(p.status)}
                    </Badge>
                    <p className="font-semibold text-green-600 dark:text-green-400">
                      {getFormatCurrency(p.totalValue)}
                    </p>
                  </div>

                  {/* Segunda linha: Data */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDateTime(p.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Terceira linha: Ações */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      {p.imageUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          title="Ver Comprovante"
                        >
                          <Link
                            href={p.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ImageIcon className="h-4 w-4" />
                            <span className="ml-1 text-sm">Comprovante</span>
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Sem comprovante
                        </span>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Motivo de rejeição (se houver) */}
                  {p.rejectionReason && (
                    <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
                      <p className="font-medium">Motivo da rejeição:</p>
                      <p>{p.rejectionReason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paginação */}
        {pageCount > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={page === p}
                      onClick={() => onPageChange(p)}
                      className="cursor-pointer"
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < pageCount && onPageChange(page + 1)}
                    className={
                      page >= pageCount
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
