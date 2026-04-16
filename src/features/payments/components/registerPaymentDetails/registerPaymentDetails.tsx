'use client';

import {
  Inscription,
  Participant,
  Payment,
} from '@/features/payments/types/registerPaymentDetails/registerPaymentDetails';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { useCurrentUser } from '@/shared/context/user-context';
import { formatDate, formatDateTime } from '@/shared/utils/formatDate';
import { getCalculateAge } from '@/shared/utils/getCalculateAge';
import {
  getConvertStatusInscription,
  getConvertStatusPayment,
} from '@/shared/utils/getConvertStatus';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getStatusColor } from '@/shared/utils/getStatusColor';
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
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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
  const [paymentLink, setPaymentLink] = useState('');
  const [copied, setCopied] = useState(false);

  if (!inscriptions) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
        <AlertCircle className="mb-4 h-10 w-10" />
        <p>Inscrição não encontrada.</p>
      </div>
    );
  }

  const remainingTotal = Math.max(inscriptions.totalValue - total, 0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
      console.error('Erro ao copiar link:', error);
    }
  };

  // Função para formatar gênero
  const formatGender = (gender: string) => {
    const genderMap: Record<string, string> = {
      MASCULINO: 'Masculino',
      FEMININO: 'Feminino',
    };

    return genderMap[gender] || gender;
  };

  return (
    <div className="space-y-8">
      {/* Card da Inscrição */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes da Inscrição
                </h1>

                <div className="text-muted-foreground mt-2 mb-1 flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4" />
                  <code className="bg-muted rounded px-2 py-1 font-mono">
                    {inscriptions.id.substring(0, 12)}...
                  </code>
                </div>

                <div className="text-muted-foreground text-xs">
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
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* Responsável */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Responsável</span>
                </div>
                <p className="text-lg font-semibold">
                  {inscriptions.responsible}
                </p>
              </div>

              {/* Status */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                    inscriptions.status,
                  )}`}
                >
                  {getConvertStatusInscription(inscriptions.status)}
                </span>
              </div>

              {/* Valor Total */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
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
      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className="mb-4 flex items-center gap-2">
          <LinkIcon className="text-primary h-5 w-5" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Link de Pagamento
          </h2>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">
          Compartilhe este link para que outra pessoa possa realizar o pagamento
          desta inscrição.
        </p>
        <div className="flex items-center gap-2">
          <Input value={paymentLink} readOnly className="bg-muted" />
          <Button onClick={handleCopy} size="icon" variant="outline">
            {copied ? (
              <Check className="animate-in zoom-in h-4 w-4 text-green-500 duration-300" />
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
              {participant.length !== 1 ? 's' : ''} nesta inscrição
            </p>
          </div>
        </div>

        {/* Participantes - Versão Desktop */}
        <div className="hidden rounded-md border sm:block">
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
                      <User className="text-muted-foreground h-4 w-4" />
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
            <div className="text-muted-foreground rounded-lg border px-4 py-8 text-center">
              Nenhum participante encontrado.
            </div>
          ) : (
            <div className="space-y-3">
              {participant.map((p) => (
                <div
                  key={p.id}
                  className="hover:bg-muted/30 rounded-lg border p-4 transition-colors"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <h3 className="font-semibold">{p.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Idade</p>
                      <p className="text-sm font-medium">
                        {getCalculateAge(p.birthDate)} anos
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Gênero</p>
                      <p className="text-sm font-medium">
                        {formatGender(p.gender)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">
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
              {payments.length} pagamento{payments.length !== 1 ? 's' : ''}{' '}
              registrado{payments.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Pagamentos - Versão Desktop */}
        <div className="hidden rounded-md border sm:block">
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
                    className="text-muted-foreground px-4 py-8 text-center"
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
                        <div className="text-destructive mt-1 text-xs">
                          {p.rejectionReason}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {getFormatCurrency(p.totalValue)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground h-4 w-4" />
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
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
            <div className="text-muted-foreground rounded-lg border px-4 py-8 text-center">
              Nenhum pagamento registrado.
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="hover:bg-muted/30 rounded-lg border p-4 transition-colors"
                >
                  {/* Primeira linha: Status e Valor */}
                  <div className="mb-3 flex items-center justify-between">
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
                      <Calendar className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">
                        {formatDateTime(p.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Terceira linha: Ações */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      {p.imageUrl ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 px-2 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
                        <span className="text-muted-foreground text-sm">
                          Sem comprovante
                        </span>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Motivo de rejeição (se houver) */}
                  {p.rejectionReason && (
                    <div className="bg-destructive/10 border-destructive/20 text-destructive mt-3 rounded border p-2 text-xs">
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
                        ? 'pointer-events-none cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
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
                        ? 'pointer-events-none cursor-not-allowed opacity-50'
                        : 'cursor-pointer'
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
