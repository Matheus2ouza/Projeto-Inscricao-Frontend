"use client";

import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  getConvertStatusInscription,
  getConvertStatusPayment,
} from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { ImageOff, ZoomIn } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  PaymentDetailsResponse,
  PaymentSummary,
} from "../types/paymentsDetails.types";

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
  data: PaymentDetailsResponse;
}

export default function PaymentDetailsContent({
  data,
}: PaymentDetailsContentProps) {
  const { inscription } = data;
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerMeta, setViewerMeta] = useState<{
    url: string;
    title: string;
    description: string;
  } | null>(null);

  const handleOpenViewer = (payment: PaymentSummary) => {
    setViewerMeta({
      url: payment.imageUrl,
      title: `Comprovante ${payment.id.slice(0, 8)}`,
      description: `Inscrição ${inscription.id} • ${formatDateTime(
        payment.createdAt
      )}`,
    });
    setViewerOpen(true);
  };

  const totalPaid = useMemo(
    () => inscription.payments.reduce((sum, payment) => sum + payment.value, 0),
    [inscription.payments]
  );

  return (
    <>
      <div className="space-y-6">
        <Card className="border border-muted/30 bg-gradient-to-br from-white/80 via-muted/70 to-muted/50 shadow-lg">
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-foreground">
                Detalhes da Inscrição
              </h2>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Responsável
                </p>
                <p className="text-base font-semibold text-foreground">
                  {inscription.responsible}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  inscription.status
                )}`}
              >
                {getConvertStatusInscription(inscription.status)}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email
                </p>
                <p className="text-base text-foreground">
                  {inscription.email ?? "Não informado"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Telefone
                </p>
                <p className="text-base text-foreground">
                  {inscription.phone ?? "Não informado"}
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-muted/30 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Participantes
                </p>
                <p className="mt-1 text-3xl font-semibold text-foreground">
                  {inscription.countParticipants}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] ">
                  Qtd. de participantes
                </p>
              </div>
              <div className="rounded-2xl border border-muted/30 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Total pago
                </p>
                <p className="mt-1 text-3xl font-semibold text-foreground">
                  {currencyFormatter.format(totalPaid)}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] ">
                  Valor já pago
                </p>
              </div>
              <div className="rounded-2xl border border-muted/30 bg-white/80 p-4 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Saldo aberto
                </p>
                <p className="mt-1 text-3xl font-semibold text-red-500">
                  {currencyFormatter.format(inscription.openBalance)}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-red-400">
                  Aguarda pagamento
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {inscription.payments.map((payment) => (
            <article
              key={payment.id}
              className="flex min-w-[320px] flex-shrink-0 flex-col gap-4 rounded-2xl border border-muted/30 bg-card/40 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="text-base font-semibold text-foreground">
                  {payment.accountName ?? "Conta não informada"}
                </span>
                <span>{formatDateTime(payment.createdAt)}</span>
              </div>
              <AspectRatio
                ratio={4 / 5}
                className={`relative rounded-xl border border-muted/30 bg-muted/60 transition ${
                  payment.imageUrl ? "group cursor-pointer" : ""
                }`}
              >
                {payment.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => handleOpenViewer(payment)}
                    className="absolute inset-0"
                    aria-label="Visualizar comprovante"
                  >
                    <Image
                      src={payment.imageUrl}
                      alt={`Comprovante ${payment.id}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </button>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center text-sm font-medium uppercase tracking-wide text-muted-foreground">
                    <ImageOff className="h-6 w-6" />
                    Sem imagem enviada
                  </div>
                )}
                <span
                  className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getStatusColor(
                    payment.status
                  )}`}
                >
                  {getConvertStatusPayment(payment.status)}
                </span>
              </AspectRatio>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Valor</span>
                  <span className="font-semibold text-foreground">
                    {currencyFormatter.format(payment.value)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Aprovado por</span>
                  <span className="font-medium text-foreground">
                    {payment.approvedBy ?? "Pendente"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
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
