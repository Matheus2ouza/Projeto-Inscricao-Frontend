"use client";

import {
  PaymentAllocation,
  PaymentInstallment,
  PaymentMethod,
  PaymentsDetails,
  StatusPayment,
} from "@/features/payment/types/adminDetailsPayment/paymentsDetailsTypes";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { calculateGlobalIndex } from "@/shared/utils/calculateGlobalIndex";
import { formatDateTime } from "@/shared/utils/formatDate";
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSign,
  FileImage,
  ImageIcon,
  Link,
  Receipt,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface PaymentDetailsContentProps {
  payment: PaymentsDetails | null;
  allocations?: PaymentAllocation[];
  installments?: PaymentInstallment[];
  onValidPayment: (paymentId: string) => void;
  onDeletePayment: (paymentId: string) => void;
}

export default function PaymentDetailsContent({
  payment,
  allocations = [],
  installments = [],
  onValidPayment,
  onDeletePayment,
}: PaymentDetailsContentProps) {
  if (!payment) {
    return null;
  }

  const [imageError, setImageError] = useState(false);

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const iconMap: Record<PaymentMethod, React.ReactNode> = {
      DINHEIRO: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      PIX: <Receipt className="h-4 w-4 text-muted-foreground" />,
      CARTÃO: <CreditCard className="h-4 w-4 text-muted-foreground" />,
    };
    return (
      iconMap[method] || (
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-6">
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes do Pagamento
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {payment.responsible || "-"}
                  </div>
                  {payment.isGuest && (
                    <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                      N/ Alocado
                    </Badge>
                  )}
                </div>
                <div className="mt-2 font-mono text-xs text-muted-foreground break-all">
                  {payment.id}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor Total</span>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {getFormatCurrency(payment.totalValue)}
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <Badge
                    className={`${getStatusColor(payment.status)} border-0 w-fit`}
                  >
                    {getConvertStatusPayment(payment.status)}
                  </Badge>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getPaymentMethodIcon(payment.methodPayment)}
                    <span className="text-sm font-medium">Método</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {payment.methodPayment}
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Registrado em</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {formatDateTime(payment.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full lg:w-auto lg:self-start">
              {getConvertStatusPayment(payment.status) !==
                StatusPayment.APPROVED && (
                <Button
                  className="w-full lg:w-auto"
                  onClick={() => onValidPayment(payment.id)}
                >
                  Validar pagamento
                </Button>
              )}
              <Button
                className="w-full lg:w-auto"
                onClick={() => onDeletePayment(payment.id)}
                variant="destructive"
              >
                Deletar pagamento
              </Button>
            </div>
          </div>
        </div>
      </div>

      {!!payment.rejectionReason && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Motivo da Rejeição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-white dark:bg-gray-800 border border-destructive/20 rounded-md">
              <p className="text-destructive">{payment.rejectionReason}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {allocations.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Alocações
              </h2>
              <p className="text-muted-foreground">
                {allocations.length} alocação
                {allocations.length !== 1 ? "ões" : ""} neste pagamento
              </p>
            </div>
          </div>

          <div className="hidden sm:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>ID da Inscrição</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map((alloc, idx) => (
                  <TableRow
                    key={`${alloc.inscriptionId}-${idx}`}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {calculateGlobalIndex(idx)}
                    </TableCell>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {alloc.inscriptionId.length > 12
                        ? `${alloc.inscriptionId.substring(0, 8)}...`
                        : alloc.inscriptionId}
                    </TableCell>
                    <TableCell className="">
                      {alloc.responsible || "-"}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {getFormatCurrency(alloc.value)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="block sm:hidden">
            <div className="space-y-3">
              {allocations.map((alloc, idx) => (
                <div
                  key={`${alloc.inscriptionId}-${idx}`}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      ID da Inscrição
                    </p>
                    <code className="font-mono text-xs bg-muted px-2 py-1 rounded block">
                      {alloc.inscriptionId.length > 16
                        ? `${alloc.inscriptionId.substring(0, 12)}...`
                        : alloc.inscriptionId}
                    </code>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Responsável
                    </p>
                    <p className="font-medium truncate">
                      {alloc.responsible || "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {getFormatCurrency(alloc.value)}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      #{calculateGlobalIndex(idx)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {installments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Parcelas
              </h2>
              <p className="text-muted-foreground">
                {installments.length} parcela
                {installments.length !== 1 ? "s" : ""} registrada
                {installments.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="hidden sm:block rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Nº</TableHead>
                  <TableHead className="w-[160px] text-right">Valor</TableHead>
                  <TableHead className="w-[160px] text-right">
                    Líquido
                  </TableHead>
                  <TableHead className="w-[220px]">Pago em</TableHead>
                  <TableHead className="w-[220px]">Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installments.map((inst) => (
                  <TableRow
                    key={`${inst.installmentNumber}-${String(inst.createdAt)}`}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {inst.installmentNumber}
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {getFormatCurrency(inst.value)}
                    </TableCell>
                    <TableCell className="text-right font-medium whitespace-nowrap">
                      {getFormatCurrency(inst.netValue)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {inst.paidAt ? formatDateTime(inst.paidAt) : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateTime(inst.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="block sm:hidden">
            <div className="space-y-3">
              {installments.map((inst) => (
                <div
                  key={`${inst.installmentNumber}-${String(inst.createdAt)}`}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #
                      </span>
                      <span className="font-semibold">
                        {inst.installmentNumber}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="text-base font-bold text-green-600 dark:text-green-400">
                        {getFormatCurrency(inst.value)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Líquido</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        {getFormatCurrency(inst.netValue)}
                      </p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground">Pago em</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {inst.paidAt ? formatDateTime(inst.paidAt) : "—"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground">Criado em</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatDateTime(inst.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {payment.imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Comprovante de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="max-w-lg">
                <div className="relative h-64 sm:h-80 w-full bg-muted rounded-lg overflow-hidden border">
                  {!imageError ? (
                    <Image
                      src={payment.imageUrl}
                      alt="Comprovante de pagamento"
                      fill
                      className="object-contain"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">
                        Erro ao carregar imagem
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <a
                  href={payment.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Link className="h-4 w-4" />
                  Abrir em nova aba
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
