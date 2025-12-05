"use client";

import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
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
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  DollarSign,
  ImageOff,
  User,
  UserCheck,
  Users,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { FindAccountsDetailsResponse } from "../types/checkInTypes";

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

interface CheckInAccountDetailsProps {
  account: FindAccountsDetailsResponse;
}

type PaymentDetailsEntry =
  FindAccountsDetailsResponse["inscriptions"][number]["paymentInscription"][number];

export default function CheckInAccountDetails({
  account,
}: CheckInAccountDetailsProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerMeta, setViewerMeta] = useState<{
    url: string;
    title: string;
    description?: string;
  } | null>(null);

  const handleOpenViewer = (
    payment: PaymentDetailsEntry,
    inscriptionId: string
  ) => {
    if (!payment.image) {
      return;
    }

    setViewerMeta({
      url: payment.image,
      title: `Comprovante ${inscriptionId}`,
      description: formatDateTime(payment.createdAt),
    });
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setViewerMeta(null);
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="px-6 pt-6">
            <CardTitle>Dados da conta</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Conta
                </p>
                <p className="text-2xl font-semibold">{account.username}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  E-mail
                </p>
                <p className="text-base">{account.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Status
                </p>
                <span className="text-sm font-semibold uppercase tracking-[0.3em]">
                  {account.status}
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border/50 bg-card px-4 py-3 flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Inscrições
                  </p>
                  <p className="text-lg font-semibold">
                    {account.countInscriptions}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card px-4 py-3 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Débitos
                  </p>
                  <p className="text-lg font-semibold text-destructive">
                    {account.countDebt}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card px-4 py-3 flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Pagamentos
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {account.countPay}
                  </p>
                </div>
              </div>
              <div className="rounded-xl border border-border/50 bg-card px-4 py-3 flex items-center gap-3">
                <User className="h-5 w-5 text-foreground" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Participantes
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {account.countParticipants}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {account.inscriptions.map((inscription) => (
            <Card key={inscription.id} className="border-0 shadow-sm">
              <CardHeader className="px-6 pt-6">
                <CardTitle>Inscrição #{inscription.id}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Criada em{" "}
                    {new Date(inscription.createdAt).toLocaleDateString(
                      "pt-BR"
                    )}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em]">
                    Status: {inscription.status}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em]">
                    Pagou {currencyFormatter.format(inscription.totalPayd)}
                  </span>
                  <span className="text-xs uppercase tracking-[0.3em]">
                    Débito {currencyFormatter.format(inscription.totalDebt)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Participantes
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Gênero</TableHead>
                        <TableHead>Data Nasc.</TableHead>
                        <TableHead>Tipo</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inscription.participants.map((participant) => (
                        <TableRow
                          key={participant.name + participant.birthDate}
                        >
                          <TableCell>{participant.name}</TableCell>
                          <TableCell>{participant.gender}</TableCell>
                          <TableCell>
                            {new Date(participant.birthDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </TableCell>
                          <TableCell>{participant.typeInscription}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Pagamentos
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inscription.paymentInscription.map((payment, index) => (
                        <TableRow key={`${payment.image}-${index}`}>
                          <TableCell>
                            {currencyFormatter.format(payment.value)}
                          </TableCell>
                          <TableCell>
                            {getConvertStatusPayment(payment.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(payment.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2">
                    Comprovantes
                  </p>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {inscription.paymentInscription.map((payment) => (
                      <article
                        key={`${payment.image ?? ""}-${payment.createdAt}`}
                        className="flex min-w-[280px] flex-col gap-3 rounded-2xl border border-muted/30 bg-card/40 p-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <span>{formatDateTime(payment.createdAt)}</span>
                        </div>
                        <AspectRatio
                          ratio={1 / 1}
                          className="relative overflow-hidden rounded-xl border border-muted/40 bg-muted/40"
                        >
                          {payment.image ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenViewer(payment, inscription.id)
                              }
                              className="absolute inset-0 group"
                              aria-label="Visualizar comprovante"
                            >
                              <Image
                                src={payment.image}
                                alt={`Comprovante ${inscription.id}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 280px"
                              />
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                                <ZoomIn className="w-8 h-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                              </div>
                            </button>
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              <ImageOff className="h-5 w-5" />
                              Sem imagem
                            </div>
                          )}
                        </AspectRatio>
                        <div className="flex items-center justify-between text-sm font-semibold">
                          <span>{currencyFormatter.format(payment.value)}</span>
                          <span
                            className={`${getStatusColor(payment.status)} px-3 py-1 text-xs rounded-full border`}
                          >
                            {getConvertStatusPayment(payment.status)}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {viewerMeta && (
        <ImageViewerDialog
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
          imageUrl={viewerMeta.url}
          title={viewerMeta.title}
          description={viewerMeta.description}
        />
      )}
    </>
  );
}
