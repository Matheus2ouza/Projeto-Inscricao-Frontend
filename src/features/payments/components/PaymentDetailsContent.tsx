"use client";

import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { CalendarClock, ZoomIn } from "lucide-react";
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
        <Card className="border shadow-sm">
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Inscrição
              </p>
              <p className="text-lg font-semibold">{inscription.id}</p>
              <p className="text-sm text-muted-foreground">
                {inscription.responsible}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase font-semibold tracking-wide text-muted-foreground">
                Participantes
              </p>
              <p className="text-lg font-semibold">
                {inscription.countParticipants}
              </p>
              <p className="text-sm text-muted-foreground">
                Saldo aberto:{" "}
                {currencyFormatter.format(inscription.openBalance)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {inscription.payments.map((payment) => (
            <Card key={payment.id} className="border shadow-sm">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    className={getStatusColor(payment.status)}
                    variant="outline"
                  >
                    {getConvertStatusPayment(payment.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(payment.createdAt)}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
                  <AspectRatio
                    ratio={4 / 5}
                    className="relative rounded-xl border border-muted/30 bg-muted group"
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
                        <CalendarClock className="w-6 h-6" />
                        Sem imagem enviada
                      </div>
                    )}
                  </AspectRatio>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Conta
                      </p>
                      <p className="text-base font-semibold">
                        {payment.accountName ?? "Não informado"}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Valor</span>
                      <span className="text-lg font-bold text-foreground">
                        {currencyFormatter.format(payment.value)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Aprovado por{" "}
                      <span className="text-foreground font-semibold">
                        {payment.approvedBy ?? "Pendente"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border shadow-sm">
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total pago</p>
              <p className="text-xl font-semibold text-foreground">
                {currencyFormatter.format(totalPaid)}
              </p>
            </CardContent>
          </Card>
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
