"use client";

import {
  CreatePaymentLinkInput,
  CreatePaymentLinkResponse,
} from "@/features/inscriptions/types/actions/createPaymentLinkTypes";
import {
  UpdateExpiredInput,
  UpdateExpiredResponse,
} from "@/features/inscriptions/types/actions/updateExpiredTypes";
import { UpdateInscriptionResponse } from "@/features/inscriptions/types/actions/updeteInscriptionType";
import {
  Inscription,
  InscriptionStatus,
  Participant,
  Payment,
  PaymentLink,
} from "@/features/inscriptions/types/list-inscriptions/inscription/detailsInscriptionTypes";
import type {
  GenderType,
  ShirtSizeType,
  ShirtType,
  UpdateParticipantInput,
  UpdateParticipantResponse,
} from "@/features/participants/types/actions/updateParticipantTypes";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Progress } from "@/shared/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Textarea } from "@/shared/components/ui/textarea";
import { formatInput } from "@/shared/utils/format";
import { formatDate, formatDateTime } from "@/shared/utils/formatDate";
import { getCalculateAge } from "@/shared/utils/getCalculateAge";
import { getGenderInfo } from "@/shared/utils/getConvertGender";
import { getConvertStatusInscription } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { Empty } from "antd";
import {
  CalendarIcon,
  Check,
  Clock,
  Copy,
  CreditCard,
  Download,
  Eye,
  FileText,
  Mail,
  Pencil,
  Phone,
  Save,
  Trash2,
  Undo2,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ParticipantEditModal from "./ParticipantEditModal";

export interface InscriptionFormFields {
  responsible: string;
  email: string;
  phone: string;
  observation: string;
}

export interface ParticipantFomrFields {
  id: string;
  name?: string;
  cpf: string;
  birthDate?: Date;
  gender?: GenderType;
  preferredName?: string;
  shirtSize?: ShirtSizeType;
  shirtType?: ShirtType;
}

interface DetailsInscriptionProps {
  inscription: Inscription | null;
  participants: Participant[];
  payments: Payment[];
  paymentLink: PaymentLink | null;
  onViewPayment: (paymentId: string) => void;
  onUpdateExpired: (
    input: UpdateExpiredInput,
  ) => Promise<UpdateExpiredResponse>;
  isUpdatingExpired: boolean;
  onCreatePaymentLink: (
    input: CreatePaymentLinkInput,
  ) => Promise<CreatePaymentLinkResponse>;
  isCreatingPaymentLink: boolean;
  onDownloadInscriptionDetailsPdf: (inscriptionId: string) => Promise<boolean>;
  isDownloadingInscriptionDetailsPdf: boolean;
  onDeleteInscription: (inscriptionId: string) => Promise<void>;
  isDeletingInscription?: boolean;
  onSaveInscription: (
    fields: InscriptionFormFields,
  ) => Promise<UpdateInscriptionResponse>;
  isSavingInscription: boolean;
  onSaveParticipant: (
    fields: ParticipantFomrFields,
  ) => Promise<UpdateParticipantResponse>;
  isSavingParticipants: boolean;
}

export default function DetailsInscriptionTable({
  inscription,
  participants,
  payments,
  onViewPayment,
  paymentLink,
  onUpdateExpired,
  isUpdatingExpired = false,
  onCreatePaymentLink,
  isCreatingPaymentLink = false,
  onDownloadInscriptionDetailsPdf,
  isDownloadingInscriptionDetailsPdf = false,
  onDeleteInscription,
  isDeletingInscription,
  onSaveInscription,
  isSavingInscription,
  onSaveParticipant,
  isSavingParticipants,
}: DetailsInscriptionProps) {
  if (!inscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Inscrição não encontrada</h3>
        <p className="text-muted-foreground">
          Não foi possível carregar os detalhes desta inscrição.
        </p>
      </div>
    );
  }

  const [now, setNow] = useState(() => new Date());
  const [customOpen, setCustomOpen] = useState(false);
  const [customDate, setCustomDate] = useState<Date>(() => {
    const base = new Date(inscription.expiresAt);
    return new Date(base.getFullYear(), base.getMonth(), base.getDate());
  });
  const [customTime, setCustomTime] = useState(() => {
    const base = new Date(inscription.expiresAt);
    const hh = String(base.getHours()).padStart(2, "0");
    const mm = String(base.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  });

  const [isEditingInscription, setIsEditingInscription] = useState(false);
  const [inscriptionForm, setInscriptionForm] = useState<InscriptionFormFields>(
    {
      responsible: inscription.responsible,
      email: inscription.email ?? "",
      phone: inscription.phone ?? "",
      observation: inscription.observation ?? "",
    },
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isEditingInscription) {
      setInscriptionForm({
        responsible: inscription.responsible,
        email: inscription.email ?? "",
        phone: inscription.phone ?? "",
        observation: inscription.observation ?? "",
      });
    }
  }, [inscription, isEditingInscription]);

  const handleCancelInscriptionEdit = () => {
    setIsEditingInscription(false);
  };

  const handleSaveInscription = async () => {
    await onSaveInscription(inscriptionForm);
    setIsEditingInscription(false);
  };

  const [paymentLinkCreated, setPaymentLinkCreated] =
    useState<CreatePaymentLinkResponse | null>(null);
  const [paymentLinkCopied, setPaymentLinkCopied] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const activePaymentLink = useMemo(() => {
    if (paymentLinkCreated) {
      return {
        url: paymentLinkCreated.url,
        active: paymentLinkCreated.active,
      };
    }
    if (paymentLink) {
      return {
        url: paymentLink.url,
        active: paymentLink.active,
      };
    }
    return null;
  }, [paymentLink, paymentLinkCreated]);

  const handleCopyPaymentLink = async () => {
    if (!activePaymentLink?.url) {
      return;
    }
    try {
      await navigator.clipboard.writeText(activePaymentLink.url);
      setPaymentLinkCopied(true);
      window.setTimeout(() => setPaymentLinkCopied(false), 2000);
    } catch {
      setPaymentLinkCopied(false);
    }
  };

  const handleCreatePaymentLink = async () => {
    if (!onCreatePaymentLink) {
      return;
    }
    try {
      const result = await onCreatePaymentLink({
        inscriptionId: inscription.id,
      });
      setPaymentLinkCreated(result);
    } catch {
      return;
    }
  };

  const expiresAt = useMemo(
    () => new Date(inscription.expiresAt),
    [inscription.expiresAt],
  );

  const remainingMs = useMemo(
    () => expiresAt.getTime() - now.getTime(),
    [expiresAt, now],
  );

  const remainingLabel = useMemo(() => {
    const absSeconds = Math.floor(Math.abs(remainingMs) / 1000);
    const days = Math.floor(absSeconds / 86400);
    const hours = Math.floor((absSeconds % 86400) / 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const seconds = absSeconds % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${minutes}m`);
    parts.push(`${String(seconds).padStart(2, "0")}s`);

    const base = parts.join(" ");
    return remainingMs >= 0 ? `Faltam ${base}` : `Expirado há ${base}`;
  }, [remainingMs]);

  const remainingPercent = useMemo(() => {
    const createdAt = new Date(inscription.createdAt).getTime();
    const totalMs = expiresAt.getTime() - createdAt;
    if (totalMs <= 0) return remainingMs > 0 ? 100 : 0;

    const remainingClamped = Math.max(0, Math.min(totalMs, remainingMs));
    const percent = (remainingClamped / totalMs) * 100;
    return Math.max(0, Math.min(100, percent));
  }, [expiresAt, inscription.createdAt, remainingMs]);

  const paidPercent =
    inscription.totalValue > 0
      ? Math.min(
          Math.round((inscription.totalPaid / inscription.totalValue) * 100),
          100,
        )
      : 0;

  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);

  const ActionButtons = () => (
    <>
      {!isEditingInscription && (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={async () => {
            await onDownloadInscriptionDetailsPdf(inscription.id);
          }}
          disabled={
            !onDownloadInscriptionDetailsPdf ||
            isDownloadingInscriptionDetailsPdf
          }
          className="bg-blue-500 text-white p-0 flex items-center justify-center gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Baixar PDF</span>
        </Button>
      )}

      {!isEditingInscription ? (
        <Button
          variant="link"
          type="button"
          size="sm"
          className="bg-green-500 text-white p-0 flex items-center justify-center gap-1"
          onClick={() => setIsEditingInscription(true)}
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
      ) : (
        <>
          <Button
            type="button"
            size="sm"
            variant="link"
            onClick={handleCancelInscriptionEdit}
            disabled={isSavingInscription}
            className="bg-red-500 text-white flex items-center justify-center gap-1"
          >
            <Undo2 className="h-4 w-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveInscription}
            disabled={isSavingInscription}
            className="gap-1"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isSavingInscription ? "Salvando..." : "Salvar alterações"}
            </span>
          </Button>
        </>
      )}

      {!isEditingInscription && (
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={!onDeleteInscription || !!isDeletingInscription}
          className="bg-red-500 text-white flex items-center justify-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isDeletingInscription ? "Deletando..." : "Deletar"}
          </span>
        </Button>
      )}
    </>
  );

  const handleCloseParticipantModal = () => setEditingParticipant(null);
  const handleSubmitParticipant = async (input: UpdateParticipantInput) => {
    await onSaveParticipant({
      id: input.id,
      name: input.name,
      cpf: input.cpf ?? "",
      birthDate: input.birthDate,
      gender: input.gender,
      preferredName: input.preferredName,
      shirtSize: input.shirtSize,
      shirtType: input.shirtType,
    });
    handleCloseParticipantModal();
  };

  return (
    <div className="space-y-8">
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={async () => {
          await onDeleteInscription?.(inscription.id);
        }}
        title="Deletar inscrição"
        message="Tem certeza que deseja deletar esta inscrição? Essa ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
        isLoading={!!isDeletingInscription}
        variant="destructive"
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        {/* Card dos dados da inscrição */}
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              {/* Primeira linha: Título à esquerda, botões à direita em telas maiores */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes da Inscrição
                </h1>
                <div className="hidden sm:flex flex-wrap items-center gap-2 justify-end">
                  <ActionButtons />
                </div>
              </div>

              {/* Segunda linha: ID, data e botões em telas menores */}
              <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground mt-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <code className="font-mono bg-muted px-2 py-1 rounded text-xs sm:text-sm">
                    {inscription.id.substring(0, 12)}...
                  </code>
                  <div className="text-xs sm:text-sm">
                    Criada em: {formatDateTime(inscription.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 sm:hidden">
                  <ActionButtons />
                </div>
              </div>
            </div>

            {/* Cards de informações - versão responsiva */}
            {/* Versão para mobile (cards empilhados) */}
            <div className="block sm:hidden space-y-3">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Responsável</span>
                </div>
                {isEditingInscription ? (
                  <Input
                    value={inscriptionForm.responsible}
                    onChange={(event) =>
                      setInscriptionForm((prev) => ({
                        ...prev,
                        responsible: event.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-base font-semibold">
                    {inscription.responsible}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                {isEditingInscription ? (
                  <Input
                    type="email"
                    value={inscriptionForm.email}
                    onChange={(event) =>
                      setInscriptionForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm break-all">
                    {inscription.email ?? "Não informado"}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Telefone</span>
                </div>
                {isEditingInscription ? (
                  <Input
                    value={inscriptionForm.phone}
                    onChange={(event) =>
                      setInscriptionForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm">
                    {inscription.phone ? inscription.phone : "Não informado"}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    inscription.status,
                  )}`}
                >
                  {getConvertStatusInscription(inscription.status)}
                </span>
              </div>
            </div>

            {/* Versão para desktop (grid 4 colunas) */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Responsável</span>
                </div>
                {isEditingInscription ? (
                  <Input
                    value={inscriptionForm.responsible}
                    onChange={(event) =>
                      setInscriptionForm((prev) => ({
                        ...prev,
                        responsible: event.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-lg font-semibold">
                    {inscription.responsible}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                {isEditingInscription ? (
                  <Input
                    type="email"
                    value={inscriptionForm.email}
                    onChange={(event) =>
                      setInscriptionForm((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm font-medium break-all">
                    {inscription.email ?? "Não informado"}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Telefone</span>
                </div>
                {isEditingInscription ? (
                  <Input
                    value={inscriptionForm.phone}
                    onChange={(event) =>
                      setInscriptionForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                  />
                ) : (
                  <p className="text-sm font-medium">
                    {inscription.phone ? inscription.phone : "Não informado"}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    inscription.status,
                  )}`}
                >
                  {getConvertStatusInscription(inscription.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Observação
              </h2>
            </div>
          </div>
          {isEditingInscription ? (
            <Textarea
              value={inscriptionForm.observation}
              onChange={(event) =>
                setInscriptionForm((prev) => ({
                  ...prev,
                  observation: event.target.value,
                }))
              }
              className="min-h-[120px]"
            />
          ) : (
            <>
              {inscription.observation ? (
                // Mostra a observação quando existe conteúdo
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {inscription.observation}
                </p>
              ) : (
                // Mostra o Empty quando não há observação
                <Empty
                  description="Nenhuma observação registrada para essa inscrição."
                  className="py-4"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Card do tempo de expiração da inscrição */}
      {inscription.status !== InscriptionStatus.PAID &&
        inscription.status !== InscriptionStatus.CANCELLED && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Expiração
                    </h2>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full lg:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!onUpdateExpired || isUpdatingExpired}
                      onClick={() => {
                        const next = new Date(
                          expiresAt.getTime() + 60 * 60 * 1000,
                        );
                        onUpdateExpired?.({
                          inscriptionId: inscription.id,
                          expiresAt: next,
                        });
                      }}
                    >
                      + 1 hora
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!onUpdateExpired || isUpdatingExpired}
                      onClick={() => {
                        const next = new Date(
                          expiresAt.getTime() + 24 * 60 * 60 * 1000,
                        );
                        onUpdateExpired?.({
                          inscriptionId: inscription.id,
                          expiresAt: next,
                        });
                      }}
                    >
                      + 24h
                    </Button>

                    <Popover open={customOpen} onOpenChange={setCustomOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          disabled={!onUpdateExpired || isUpdatingExpired}
                        >
                          Personalizado
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="text-sm font-semibold text-foreground">
                              Data e hora
                            </div>
                            <div className="rounded-md border">
                              <Calendar
                                mode="single"
                                selected={customDate}
                                onSelect={(date) => {
                                  if (!date) return;
                                  setCustomDate(date);
                                }}
                                initialFocus
                              />
                            </div>
                            <Input
                              type="time"
                              value={customTime}
                              onChange={(e) => setCustomTime(e.target.value)}
                            />
                          </div>

                          <Button
                            type="button"
                            className="w-full"
                            disabled={!onUpdateExpired || isUpdatingExpired}
                            onClick={() => {
                              const [hh, mm] = customTime.split(":");
                              const hours = Number(hh);
                              const minutes = Number(mm);

                              const next = new Date(customDate);
                              next.setHours(Number.isFinite(hours) ? hours : 0);
                              next.setMinutes(
                                Number.isFinite(minutes) ? minutes : 0,
                              );
                              next.setSeconds(0);
                              next.setMilliseconds(0);

                              onUpdateExpired?.({
                                inscriptionId: inscription.id,
                                expiresAt: next,
                              });
                              setCustomOpen(false);
                            }}
                          >
                            Aplicar
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div
                  className={`px-3 py-1 rounded-full border text-sm font-semibold whitespace-nowrap w-fit ${
                    remainingMs >= 0
                      ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:border-blue-900 dark:text-blue-300"
                      : "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300"
                  }`}
                >
                  {remainingLabel}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Expira em{" "}
                    <span className="font-semibold text-foreground">
                      {formatDateTime(expiresAt)}
                    </span>
                  </span>
                  <span className="font-medium">
                    {Math.round(remainingPercent)}%
                  </span>
                </div>
                <Progress
                  value={remainingPercent}
                  className="h-2.5 bg-gray-200 dark:bg-gray-700 [&_[data-slot=progress-indicator]]:bg-blue-500"
                />
              </div>
            </div>
          </div>
        )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Participantes
            </h2>
            <p className="text-muted-foreground">
              {participants.length} participante
              {participants.length !== 1 ? "s" : ""} nesta inscrição
            </p>
          </div>
        </div>

        <div className="block sm:hidden">
          {participants.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
              Nenhum participante encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => {
                const { label: genderLabel } = getGenderInfo(
                  participant.gender,
                );
                return (
                  <div
                    key={participant.id}
                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{participant.name}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Tipo</p>
                        <p className="text-sm font-medium">
                          {participant.typeInscription || "Não informado"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Idade</p>
                        <p className="text-sm font-medium">
                          {getCalculateAge(participant.birthDate)} anos
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Gênero</p>
                        <p className="text-sm font-medium">{genderLabel}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Nascimento
                        </p>
                        <p className="text-sm font-medium">
                          {formatDate(participant.birthDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingParticipant(participant)}
                      >
                        Editar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="hidden sm:block rounded-md border overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nome</TableHead>
                <TableHead className="w-[140px]">CPF</TableHead>
                <TableHead className="w-[120px]">Tipo</TableHead>
                <TableHead className="w-[100px]">Idade</TableHead>
                <TableHead className="w-[100px]">Gênero</TableHead>
                <TableHead className="w-[140px]">Data de Nasc.</TableHead>
                <TableHead className="w-[100px]">Modelo</TableHead>
                <TableHead className="w-[100px]">Tamanho</TableHead>
                <TableHead className="w-[80px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => {
                const { label: genderLabel } = getGenderInfo(
                  participant.gender,
                );
                return (
                  <TableRow key={participant.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{participant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {participant.cpf
                        ? formatInput("cpf", participant.cpf)
                        : "-"}
                    </TableCell>
                    <TableCell>{participant.typeInscription || "—"}</TableCell>
                    <TableCell>
                      {getCalculateAge(participant.birthDate)} anos
                    </TableCell>
                    <TableCell>{genderLabel}</TableCell>
                    <TableCell>
                      {formatDate(participant.birthDate) || "—"}
                    </TableCell>
                    <TableCell>{participant.shirtType || "—"}</TableCell>
                    <TableCell>{participant.shirtSize || "—"}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="link"
                        size="sm"
                        className="h-8 w-8 rounded-lg bg-green-500 text-white p-0 hover:bg-green-600 transition-colors"
                        onClick={() => setEditingParticipant(participant)}
                        aria-label="Editar Participante"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <ParticipantEditModal
        open={!!editingParticipant}
        participant={editingParticipant}
        onClose={handleCloseParticipantModal}
        onSubmit={handleSubmitParticipant}
        loading={isSavingParticipants}
      />

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Resumo Financeiro
                  </h3>
                </div>
                {inscription.status === InscriptionStatus.PENDING && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={
                      !onCreatePaymentLink ||
                      isCreatingPaymentLink ||
                      !!activePaymentLink?.active
                    }
                    onClick={handleCreatePaymentLink}
                  >
                    {activePaymentLink?.active
                      ? "Link ativo"
                      : isCreatingPaymentLink
                        ? "Criando..."
                        : "Criar link de pagamento"}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total pago
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getFormatCurrency(inscription.totalPaid)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {payments.length} pagamento
                    {payments.length !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor total
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getFormatCurrency(inscription.totalValue)}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Saldo pendente
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      inscription.totalDebt > 0
                        ? "text-amber-600 dark:text-amber-500"
                        : "text-green-600 dark:text-green-500"
                    }`}
                  >
                    {getFormatCurrency(inscription.totalDebt)}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                {activePaymentLink?.active && !!activePaymentLink.url && (
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      readOnly
                      value={activePaymentLink.url}
                      className="h-9 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="h-9 w-9 p-0"
                      onClick={handleCopyPaymentLink}
                      aria-label={paymentLinkCopied ? "Copiado" : "Copiar link"}
                    >
                      {paymentLinkCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">
                    Progresso
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {paidPercent}%
                  </span>
                </div>
                <Progress
                  value={paidPercent}
                  className="h-2.5 bg-gray-200 dark:bg-gray-700 [&_[data-slot=progress-indicator]]:bg-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Histórico de Pagamentos
            </h2>
          </div>
        </div>

        <div className="block sm:hidden">
          {payments.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
              Nenhum pagamento registrado ainda
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div
                  key={payment.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #
                      </span>
                      <span className="font-semibold">{index + 1}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="text-base font-bold text-green-600 dark:text-green-400">
                        {getFormatCurrency(payment.value)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">ID</p>
                      <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {payment.id.substring(0, 8)}...
                      </code>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground">Data</p>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {formatDateTime(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:block">
          {payments.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
              Nenhum pagamento registrado ainda
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table className="table-fixed min-w-[520px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead className="w-1/2">Valor</TableHead>
                    <TableHead className="w-1/2">Data</TableHead>
                    <TableHead className="w-20 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment, index) => (
                    <TableRow key={payment.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        {getFormatCurrency(payment.value)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          {formatDateTime(payment.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="link"
                            size="sm"
                            className="h-6 w-6 rounded-lg bg-blue-500 text-white p-0 flex items-center justify-center"
                            onClick={() => onViewPayment(payment.paymentId)}
                            aria-label="Detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
