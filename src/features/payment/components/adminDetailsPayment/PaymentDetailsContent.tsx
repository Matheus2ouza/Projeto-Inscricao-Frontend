"use client";

import type { PaymentsDetailsOutput } from "@/features/payment/types/adminDetailsPayment/paymentsDetailsTypes";
import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { ImageOff, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatDateTime = (value: string | Date) => {
  const date = new Date(value);
  return date.toLocaleString("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  });
};

interface PaymentDetailsContentProps {
  payment: PaymentsDetailsOutput | null;
}

export default function PaymentDetailsContent({
  payment,
}: PaymentDetailsContentProps) {
  if (!payment) {
    return null;
  }

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerMeta, setViewerMeta] = useState<{
    url: string;
    title: string;
    description: string;
  } | null>(null);

  const handleOpenViewer = () => {
    if (!payment.imageUrl) {
      return;
    }

    setViewerMeta({
      url: payment.imageUrl,
      title: `Comprovante ${payment.id.slice(0, 8)}`,
      description: formatDateTime(payment.createdAt),
    });
    setViewerOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border border-muted/30 bg-gradient-to-br from-white/80 via-muted/70 to-muted/50 shadow-lg">
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-bold text-foreground">
                  Detalhes do Pagamento
                </h2>
                <p className="text-sm text-muted-foreground font-mono">
                  {payment.id}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  payment.status,
                )}`}
              >
                {getConvertStatusPayment(payment.status)}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-muted/30 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Responsável
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {payment.responsible}
                </p>
              </div>
              <div className="rounded-2xl border border-muted/30 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Método
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {payment.methodPayment}
                </p>
              </div>
              <div className="rounded-2xl border border-muted/30 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Total
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {getFormatCurrency(payment.totalValue)}
                </p>
              </div>
              <div className="rounded-2xl border border-muted/30 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Data
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {formatDateTime(payment.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-muted/30 bg-white/80 p-4 shadow-sm">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Convidado
                </p>
                <p className="mt-1 text-base font-semibold text-foreground">
                  {payment.isGuest ? "Sim" : "Não"}
                </p>
              </div>
              {payment.rejectionReason && (
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Motivo da recusa
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
                    {payment.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-muted/30 bg-card/40 shadow-sm">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Comprovante
              </h3>
              {payment.imageUrl && (
                <button
                  type="button"
                  onClick={handleOpenViewer}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                >
                  <ZoomIn className="h-4 w-4" />
                  Ampliar
                </button>
              )}
            </div>
            <AspectRatio
              ratio={4 / 5}
              className={`relative rounded-xl border border-muted/30 bg-muted/60 ${
                payment.imageUrl ? "group cursor-pointer" : ""
              }`}
            >
              {payment.imageUrl ? (
                <button
                  type="button"
                  onClick={handleOpenViewer}
                  className="absolute inset-0"
                  aria-label="Visualizar comprovante"
                >
                  <Image
                    src={payment.imageUrl}
                    alt={`Comprovante ${payment.id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 480px"
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                    <ZoomIn className="w-10 h-10 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </button>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
                  <ImageOff className="h-6 w-6" />
                  Sem imagem enviada
                </div>
              )}
            </AspectRatio>
          </CardContent>
        </Card>

        {(payment.allocations?.length ?? 0) > 0 && (
          <Card className="border border-muted/30 shadow-sm">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Alocações
                </h3>
                <p className="text-sm text-muted-foreground">
                  {payment.allocations?.length} item
                  {payment.allocations?.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[260px]">Inscrição</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead className="w-[160px] text-right">
                        Valor
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payment.allocations?.map((alloc) => (
                      <TableRow key={`${alloc.inscriptionId}-${alloc.value}`}>
                        <TableCell className="font-mono text-sm">
                          {alloc.inscriptionId}
                        </TableCell>
                        <TableCell>
                          {alloc.responsible ?? "Não informado"}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {currencyFormatter.format(alloc.value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {(payment.installments?.length ?? 0) > 0 && (
          <Card className="border border-muted/30 shadow-sm">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Parcelas
                </h3>
                <p className="text-sm text-muted-foreground">
                  {payment.installments?.length} parcela
                  {payment.installments?.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Nº</TableHead>
                      <TableHead className="w-[160px] text-right">
                        Valor
                      </TableHead>
                      <TableHead className="w-[160px] text-right">
                        Líquido
                      </TableHead>
                      <TableHead className="w-[220px]">Pago em</TableHead>
                      <TableHead className="w-[220px]">Criado em</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payment.installments?.map((inst) => (
                      <TableRow
                        key={`${inst.installmentNumber}-${inst.createdAt}`}
                      >
                        <TableCell className="font-semibold">
                          {inst.installmentNumber}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {currencyFormatter.format(inst.value)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {currencyFormatter.format(inst.netValue)}
                        </TableCell>
                        <TableCell>
                          {inst.paidAt ? formatDateTime(inst.paidAt) : "—"}
                        </TableCell>
                        <TableCell>{formatDateTime(inst.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {viewerMeta && (
        <ImageViewerDialog
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          imageUrl={viewerMeta.url}
          title={viewerMeta.title}
          description={viewerMeta.description}
        />
      )}
    </>
  );
}
