"use client";

import { ReportGeneralResponse } from "@/features/report/types/reportTypes";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Image from "next/image";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface ReportDetailsProps {
  data: ReportGeneralResponse | null;
  loading: boolean;
  isFetching: boolean;
  error: string | null;
  eventId: string;
  listPath: string;
  isDownloading: boolean;
  onDownload: () => Promise<void>;
  onRefresh: () => void;
}

export default function ReportDetails({
  data,
  loading,
  isFetching,
  error,
}: ReportDetailsProps) {
  if (loading || isFetching) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 space-y-2">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6 text-center text-destructive font-semibold">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="border-0 shadow-sm space-y-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative h-28 w-full overflow-hidden rounded-3xl border border-border/40 bg-muted lg:w-1/3">
            {data.image ? (
              <Image
                src={data.image}
                alt={data.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 280px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                {data.name?.charAt(0)}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Evento
            </span>
            <p className="text-2xl font-semibold">{data.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(data.startDate).toLocaleDateString("pt-BR")} -{" "}
              {new Date(data.endDate).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Total arrecadado
            </span>
            <p className="mt-2 font-semibold">
              {currencyFormatter.format(data.totalValue)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Débitos totais
            </span>
            <p className="mt-2 font-semibold text-destructive">
              {currencyFormatter.format(data.totalDebt)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Inscrições
            </span>
            <p className="mt-2 font-semibold">{data.totalInscriptions}</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Tipos de inscrição
            </span>
            <p className="mt-2 font-semibold">{data.countTypeInscription}</p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Participantes
            </span>
            <p className="mt-2 font-semibold">{data.countParticipants}</p>
          </div>
        </div>
        {data.typeInscription.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Tipos de inscrição
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {data.typeInscription.map((type) => (
                <div
                  key={type.id}
                  className="rounded-lg border border-border/50 bg-white/80 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{type.description}</span>
                    <span>{type.countParticipants} participantes</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      Valor por participante
                    </p>
                    <p className="text-base font-semibold">
                      {currencyFormatter.format(type.amount)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Total: {currencyFormatter.format(type.totalValue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
