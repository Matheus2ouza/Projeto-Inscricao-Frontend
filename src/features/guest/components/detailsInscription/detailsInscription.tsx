"use client";

import type { UpdateGuestInscriptionFormInputs } from "@/features/guest/schema/actions/updateGuestInscriptionSchema";
import type { UpdateGuestParticipantFormInputs } from "@/features/guest/schema/actions/updateGuestParticipantSchema";
import {
  InscriptionDetails,
  InscriptionStatus,
  Participant,
  Payment,
  PaymentInstallment,
  StatusPayment,
} from "@/features/guest/types/detailsInscription/detailsInscriptionType";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import ImageUpdateDialog from "@/shared/components/ImageUpdateDialog";
import ImageViewerDialog, {
  ImageViewerDownloadExtension,
} from "@/shared/components/ImageViewerDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { Input } from "@/shared/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { formatDateTime } from "@/shared/utils/formatDate";
import { getCalculateAge } from "@/shared/utils/getCalculateAge";
import {
  getConvertStatusInscription,
  getConvertStatusPayment,
} from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  Calendar,
  Check,
  ChevronsUpDown,
  CreditCard,
  FileText,
  HelpCircle,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type {
  ModifyReceiptPaymentInput,
  ModifyReceiptPaymentResponse,
} from "../../types/detailsInscription/actions/modifyReceiptPaymentTypes";

interface DetailsInscriptionProps {
  confirmationCode: string | null;
  inscription: InscriptionDetails | null;
  participants: Participant[] | null;
  payments: Payment[] | null;
  inscriptionEdit?: {
    isEditing: boolean;
    form: UseFormReturn<UpdateGuestInscriptionFormInputs>;
    onStart: () => void;
    onCancel: () => void;
    onSubmit: () => void;
  };
  participantEdit?: {
    editingParticipantId: string | null;
    form: UseFormReturn<UpdateGuestParticipantFormInputs>;
    onStart: (participantId: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
  };
  onSearch: (code: string) => void;
  loading: boolean;
  onClear: () => void;
  onRegisterPaymentCard: () => void;
  onRegisterPaymentPix: () => void;
  onDeletePayment: (paymentId: string) => void;
  onModifyReceipt: (
    input: ModifyReceiptPaymentInput,
  ) => Promise<ModifyReceiptPaymentResponse>;
  isModifingReceipt: boolean;
}

export function DetailsInscription({
  confirmationCode,
  inscription,
  participants,
  payments,
  inscriptionEdit,
  participantEdit,
  onSearch,
  loading,
  onClear,
  onRegisterPaymentCard,
  onRegisterPaymentPix,
  onDeletePayment,
  onModifyReceipt,
  isModifingReceipt,
}: DetailsInscriptionProps) {
  const [searchCode, setSearchCode] = useState(confirmationCode || "");
  const [receiptViewerOpen, setReceiptViewerOpen] = useState(false);
  const [receiptViewerUrl, setReceiptViewerUrl] = useState<string | null>(null);
  const [receiptViewerFileName, setReceiptViewerFileName] = useState<
    string | undefined
  >(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState<string | null>(
    null,
  );
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
  const [paymentIdToModify, setPaymentIdToModify] = useState<string | null>(
    null,
  );
  const modifyDialogScrollRef = useRef(0);
  const [openGenderParticipant, setOpenGenderParticipant] = useState(false);
  const [openShirtSizeParticipant, setOpenShirtSizeParticipant] =
    useState(false);
  const [openShirtTypeParticipant, setOpenShirtTypeParticipant] =
    useState(false);

  const genderOptions = [
    { value: "MASCULINO", label: "Masculino" },
    { value: "FEMININO", label: "Feminino" },
  ];
  const shirtSizeOptions = [
    { value: "PP", label: "PP" },
    { value: "P", label: "P" },
    { value: "M", label: "M" },
    { value: "G", label: "G" },
    { value: "GG", label: "GG" },
    { value: "XG", label: "XG" },
  ];
  const shirtTypeOptions = [
    { value: "TRADICIONAL", label: "Tradicional" },
    { value: "BABYLOOK", label: "Babylook" },
  ];

  const formatSearchCode = (value: string) => {
    const normalized = value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 12);

    if (normalized.length <= 4) return normalized;
    if (normalized.length <= 8)
      return `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
    return `${normalized.slice(0, 4)}-${normalized.slice(4, 8)}-${normalized.slice(8)}`;
  };

  const searchCodeNormalized = searchCode.replace(/[^A-Z0-9]/g, "");

  useEffect(() => {
    if (confirmationCode) {
      setSearchCode(formatSearchCode(confirmationCode));
    }
  }, [confirmationCode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCodeNormalized.trim()) return;
    if (searchCodeNormalized.length !== 12) return;
    onSearch(formatSearchCode(searchCodeNormalized));
  };

  const openReceiptViewer = (payment: Payment) => {
    if (!payment.imageUrl) return;
    setReceiptViewerUrl(payment.imageUrl);
    setReceiptViewerFileName(`comprovante-${payment.id}`);
    setReceiptViewerOpen(true);
  };

  const inscriptionDetails = inscription;
  const participantsList =
    participants ?? inscriptionDetails?.participants ?? [];
  const paymentsList = payments ?? inscriptionDetails?.payments ?? [];

  // variavel para armazenar o valor total a ser pago
  const paymentTotalValue = inscriptionDetails?.totalValue || 0;

  // variavel para armazenar o valor total pago
  const paymentTotalPaid = paymentsList.reduce((total, payment) => {
    if (payment.status !== StatusPayment.APPROVED) return total;
    const value = Number(payment.totalPaid) || 0;
    return total + Math.max(value, 0);
  }, 0);

  const paymentTotalPaidAll = paymentsList.reduce((total, payment) => {
    const value = Number(payment.totalValue) || 0;
    return total + Math.max(value, 0);
  }, 0);

  // variavel para armazenar o progresso do pagamento em porcentagem
  const paymentProgress =
    paymentTotalValue > 0
      ? Math.min(Math.round((paymentTotalPaid / paymentTotalValue) * 100), 100)
      : 0;

  // variavel para armazenar o valor restante a ser pago
  const paymentDebt = Math.max(paymentTotalValue - paymentTotalPaidAll, 0);

  const isEditingCurrentInscription = inscriptionEdit?.isEditing ?? false;

  return (
    <div className="w-full space-y-8">
      <div className="w-full">
        <Card className="border border-gray-200 dark:border-gray-800 shadow-sm w-full gap-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Buscar por código
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="w-full space-y-4">
              <div className="space-y-4 w-full">
                <div className="flex flex-col gap-3 w-full lg:flex-row lg:items-center">
                  <div className="relative w-full">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      value={searchCode}
                      onChange={(e) =>
                        setSearchCode(formatSearchCode(e.target.value))
                      }
                      placeholder="Digite o código (ex: N4LJ-3QTT-ECGL)"
                      className="w-full pl-10 pr-16 h-10 text-sm font-mono tracking-wider border border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 rounded-md"
                      disabled={loading}
                      maxLength={14}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="flex items-center gap-2">
                        <div className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                          {searchCodeNormalized.length}/12
                        </div>
                        {searchCodeNormalized.length === 12 && (
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
                    <Button
                      type="submit"
                      disabled={
                        !searchCodeNormalized.trim() ||
                        loading ||
                        searchCodeNormalized.length !== 12
                      }
                      className="w-full h-10 text-sm font-semibold bg-blue-600 hover:bg-blue-700 rounded-md lg:w-36"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Buscando</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Search className="h-4 w-4" />
                          <span>Consultar</span>
                        </div>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading || !searchCode.trim()}
                      onClick={() => {
                        setSearchCode("");
                        onClear();
                      }}
                      className="w-full h-10 text-sm font-semibold rounded-md lg:w-28"
                    >
                      Limpar
                    </Button>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-md border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 px-4 py-2 text-sm text-blue-700 dark:text-blue-200">
                  <HelpCircle className="h-4 w-4 mt-0.5 text-blue-500 dark:text-blue-300" />
                  <span>
                    O codigo foi enviado para o e-mail inserido no ato da
                    inscrição. Seu formato é parecido com XXXX-XXXX-XXXX
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {inscriptionDetails && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Detalhes da Inscrição
                        </h1>
                        <div className="text-xs text-muted-foreground">
                          Registrada em:{" "}
                          {formatDateTime(inscriptionDetails.createdAt)}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={`gap-2 ${
                          isEditingCurrentInscription || !inscriptionEdit
                            ? "hidden"
                            : ""
                        }`}
                        onClick={() => inscriptionEdit?.onStart()}
                      >
                        <Pencil className="h-4 w-4" />
                        Editar Inscrição
                      </Button>
                      {isEditingCurrentInscription && (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => inscriptionEdit?.onCancel()}
                            disabled={loading}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            className="gap-2"
                            onClick={() => inscriptionEdit?.onSubmit()}
                            disabled={loading}
                          >
                            Salvar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Responsável</span>
                      </div>
                      {isEditingCurrentInscription ? (
                        <Input
                          disabled={loading}
                          className="h-10"
                          {...inscriptionEdit?.form.register("guestName")}
                        />
                      ) : (
                        <p className="text-lg font-semibold">
                          {inscriptionDetails.guestName}
                        </p>
                      )}
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Email</span>
                      </div>
                      {isEditingCurrentInscription ? (
                        <Input
                          disabled={loading}
                          className="h-10"
                          {...inscriptionEdit?.form.register("guestEmail")}
                        />
                      ) : (
                        <p className="text-sm font-medium break-all">
                          {inscriptionDetails.guestEmail}
                        </p>
                      )}
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Telefone</span>
                      </div>
                      {isEditingCurrentInscription ? (
                        <Input
                          disabled={loading}
                          className="h-10"
                          {...inscriptionEdit?.form.register("phone")}
                        />
                      ) : (
                        <p className="text-sm font-medium">
                          {inscriptionDetails.phone}
                        </p>
                      )}
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Localidade</span>
                      </div>
                      {isEditingCurrentInscription ? (
                        <Input
                          disabled={loading}
                          className="h-10"
                          {...inscriptionEdit?.form.register("guestLocality")}
                        />
                      ) : (
                        <p className="text-sm font-medium">
                          {inscriptionDetails.guestLocality}
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
                          inscriptionDetails.status,
                        )}`}
                      >
                        {getConvertStatusInscription(inscriptionDetails.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Participantes
                </h2>
              </div>
            </div>

            {participantsList.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
                Nenhum participante encontrado
              </div>
            ) : (
              <div className="space-y-6">
                {participantsList.map((participant) => (
                  <div
                    key={participant.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">
                        <div className="space-y-4 flex-1 w-full">
                          <div>
                            <div className="flex items-start justify-between gap-4">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {participant.preferredName || participant.name}
                              </h3>
                              {(() => {
                                if (!participantEdit) return null;
                                const isEditingCurrentParticipant =
                                  participantEdit.editingParticipantId ===
                                  participant.id;
                                const isEditingOtherParticipant =
                                  !!participantEdit.editingParticipantId &&
                                  participantEdit.editingParticipantId !==
                                    participant.id;

                                if (isEditingCurrentParticipant) {
                                  return (
                                    <div className="flex items-center gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          participantEdit.onCancel()
                                        }
                                        disabled={loading}
                                      >
                                        Cancelar
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() =>
                                          participantEdit.onSubmit()
                                        }
                                        disabled={loading}
                                      >
                                        Salvar
                                      </Button>
                                    </div>
                                  );
                                }

                                if (isEditingOtherParticipant) return null;

                                return (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() =>
                                      participantEdit.onStart(participant.id)
                                    }
                                    disabled={loading}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    Editar Participante
                                  </Button>
                                );
                              })()}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  Nome
                                </span>
                              </div>
                              {participantEdit?.editingParticipantId ===
                              participant.id ? (
                                <Input
                                  disabled={loading}
                                  className="h-10"
                                  {...participantEdit.form.register("name")}
                                />
                              ) : (
                                <p className="text-sm font-medium">
                                  {participant.name || "-"}
                                </p>
                              )}
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  Nome Preferido
                                </span>
                              </div>
                              {participantEdit?.editingParticipantId ===
                              participant.id ? (
                                <Input
                                  disabled={loading}
                                  className="h-10"
                                  {...participantEdit.form.register(
                                    "preferredName",
                                  )}
                                />
                              ) : (
                                <p className="text-sm font-medium">
                                  {participant.preferredName || "N/ Definido"}
                                </p>
                              )}
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  Gênero
                                </span>
                              </div>
                              {participantEdit?.editingParticipantId ===
                              participant.id ? (
                                <Popover
                                  open={openGenderParticipant}
                                  onOpenChange={setOpenGenderParticipant}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={openGenderParticipant}
                                      type="button"
                                      disabled={loading}
                                      className={cn(
                                        "w-full justify-between",
                                        !participantEdit.form.watch("gender") &&
                                          "text-muted-foreground",
                                      )}
                                    >
                                      {participantEdit.form.watch("gender")
                                        ? genderOptions.find(
                                            (gender) =>
                                              gender.value ===
                                              participantEdit.form.watch(
                                                "gender",
                                              ),
                                          )?.label
                                        : "Selecione"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] p-0"
                                    align="start"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                  >
                                    <Command>
                                      <CommandList>
                                        <CommandEmpty>
                                          Nenhum gênero encontrado.
                                        </CommandEmpty>
                                        <CommandGroup>
                                          {genderOptions.map((gender) => (
                                            <CommandItem
                                              value={gender.label}
                                              key={gender.value}
                                              onSelect={() => {
                                                participantEdit.form.setValue(
                                                  "gender",
                                                  gender.value,
                                                  {
                                                    shouldDirty: true,
                                                    shouldTouch: true,
                                                    shouldValidate: true,
                                                  },
                                                );
                                                setOpenGenderParticipant(false);
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  gender.value ===
                                                    participantEdit.form.watch(
                                                      "gender",
                                                    )
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                              {gender.label}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <p className="text-sm font-medium">
                                  {participant.gender}
                                </p>
                              )}
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {participantEdit?.editingParticipantId ===
                                  participant.id
                                    ? "Data de nascimento"
                                    : "Idade"}
                                </span>
                              </div>
                              {participantEdit?.editingParticipantId ===
                              participant.id ? (
                                <Input
                                  type="date"
                                  disabled={loading}
                                  className="h-10"
                                  {...participantEdit.form.register(
                                    "birthDate",
                                  )}
                                />
                              ) : (
                                <p className="text-sm font-medium">
                                  {getCalculateAge(participant.birthDate)} anos
                                </p>
                              )}
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  Inscrição
                                </span>
                              </div>
                              <p className="text-sm font-medium uppercase">
                                {participant.typeInscription.description ||
                                  "N/ Definido"}
                              </p>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  Tamanho da camisa
                                </span>
                              </div>
                              {participantEdit?.editingParticipantId ===
                              participant.id ? (
                                <Popover
                                  open={openShirtSizeParticipant}
                                  onOpenChange={setOpenShirtSizeParticipant}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={openShirtSizeParticipant}
                                      type="button"
                                      disabled={loading}
                                      className={cn(
                                        "w-full justify-between",
                                        !participantEdit.form.watch(
                                          "shirtSize",
                                        ) && "text-muted-foreground",
                                      )}
                                    >
                                      {participantEdit.form.watch("shirtSize")
                                        ? shirtSizeOptions.find(
                                            (s) =>
                                              s.value ===
                                              participantEdit.form.watch(
                                                "shirtSize",
                                              ),
                                          )?.label
                                        : "Selecione"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] p-0"
                                    align="start"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                  >
                                    <Command>
                                      <CommandEmpty>
                                        Nenhum tamanho encontrado.
                                      </CommandEmpty>
                                      <CommandList>
                                        <CommandGroup>
                                          {shirtSizeOptions.map((size) => (
                                            <CommandItem
                                              key={size.value}
                                              value={size.value}
                                              onSelect={() => {
                                                participantEdit.form.setValue(
                                                  "shirtSize",
                                                  size.value,
                                                  {
                                                    shouldDirty: true,
                                                    shouldTouch: true,
                                                    shouldValidate: true,
                                                  },
                                                );
                                                setOpenShirtSizeParticipant(
                                                  false,
                                                );
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  size.value ===
                                                    participantEdit.form.watch(
                                                      "shirtSize",
                                                    )
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                              {size.label}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <p className="text-sm font-medium">
                                  {participant.shirtSize || "-"}
                                </p>
                              )}
                            </div>

                            <div className="bg-muted/30 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  Modelo da camisa
                                </span>
                              </div>
                              {participantEdit?.editingParticipantId ===
                              participant.id ? (
                                <Popover
                                  open={openShirtTypeParticipant}
                                  onOpenChange={setOpenShirtTypeParticipant}
                                >
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={openShirtTypeParticipant}
                                      type="button"
                                      disabled={loading}
                                      className={cn(
                                        "w-full justify-between",
                                        !participantEdit.form.watch(
                                          "shirtType",
                                        ) && "text-muted-foreground",
                                      )}
                                    >
                                      {participantEdit.form.watch("shirtType")
                                        ? shirtTypeOptions.find(
                                            (s) =>
                                              s.value ===
                                              participantEdit.form.watch(
                                                "shirtType",
                                              ),
                                          )?.label
                                        : "Selecione"}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] p-0"
                                    align="start"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                  >
                                    <Command>
                                      <CommandEmpty>
                                        Nenhum modelo encontrado.
                                      </CommandEmpty>
                                      <CommandList>
                                        <CommandGroup>
                                          {shirtTypeOptions.map((type) => (
                                            <CommandItem
                                              key={type.value}
                                              value={type.value}
                                              onSelect={() => {
                                                participantEdit.form.setValue(
                                                  "shirtType",
                                                  type.value,
                                                  {
                                                    shouldDirty: true,
                                                    shouldTouch: true,
                                                    shouldValidate: true,
                                                  },
                                                );
                                                setOpenShirtTypeParticipant(
                                                  false,
                                                );
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  type.value ===
                                                    participantEdit.form.watch(
                                                      "shirtType",
                                                    )
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                                )}
                                              />
                                              {type.label}
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <p className="text-sm font-medium">
                                  {participant.shirtType || "-"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div
              id="guest-payment"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 scroll-mt-24"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Resumo Financeiro
                      </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        onClick={onRegisterPaymentPix}
                        disabled={paymentDebt <= 0}
                      >
                        Registrar pagamento Pix
                      </Button>
                      <Button
                        type="button"
                        onClick={onRegisterPaymentCard}
                        disabled={paymentDebt <= 0}
                        variant="outline"
                      >
                        Registrar pagamento Cartão
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total pago
                      </p>
                      <p
                        className={`text-2xl font-bold ${paymentTotalPaid > 0 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}
                      >
                        {getFormatCurrency(paymentTotalPaid)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Valor total
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getFormatCurrency(inscriptionDetails.totalValue)}
                      </p>
                    </div>

                    {paymentDebt > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Saldo pendente
                        </p>
                        <p
                          className={
                            "text-2xl font-bold text-amber-600 dark:text-amber-500"
                          }
                        >
                          {getFormatCurrency(paymentDebt)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">
                        Progresso
                      </span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {paymentProgress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${paymentProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ImageUpdateDialog
              open={modifyDialogOpen}
              onOpenChange={(open) => {
                setModifyDialogOpen(open);
                if (!open) setPaymentIdToModify(null);
              }}
              title="Modificar comprovante"
              description="Selecione ou arraste uma imagem para atualizar o comprovante."
              onSubmit={async (imageDataUrl) => {
                if (!paymentIdToModify) return;
                await onModifyReceipt({
                  paymentId: paymentIdToModify,
                  image: imageDataUrl,
                });
              }}
              isSubmitting={isModifingReceipt}
            />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Histórico de Pagamentos
                </h2>
                <p className="text-muted-foreground">
                  {paymentsList.length} pagamento
                  {paymentsList.length !== 1 ? "s" : ""} registrado
                  {paymentsList.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {paymentsList.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
                {inscriptionDetails.status === InscriptionStatus.UNDER_REVIEW
                  ? "Aguardando revisão"
                  : "Nenhum pagamento registrado"}
              </div>
            ) : (
              <div className="space-y-4">
                {paymentsList.map((p) => {
                  const installments: PaymentInstallment[] =
                    p.paymentInstallment ?? [];
                  const isApproved =
                    String(p.status).toUpperCase() === "APPROVED";
                  const installmentsTotal = Math.max(
                    Number(p.installments) || 0,
                    1,
                  );
                  const installmentsPaid = Math.min(
                    Number(p.paidInstallments) || 0,
                    installmentsTotal,
                  );

                  return (
                    <div
                      key={p.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                            {p.id.slice(0, 12)}...
                          </h3>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                          {p.status === StatusPayment.REFUSED && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                modifyDialogScrollRef.current = window.scrollY;
                                setPaymentIdToModify(p.id);
                                setModifyDialogOpen(true);
                              }}
                            >
                              Modificar comprovante
                            </Button>
                          )}

                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setPaymentIdToDelete(p.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Deletar pagamento
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Total pago
                          </p>
                          <p
                            className={`text-xl font-bold ${
                              p.totalPaid > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                          >
                            {getFormatCurrency(p.totalPaid)}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Valor total
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {getFormatCurrency(p.totalValue)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Status
                          </p>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                              p.status,
                            )}`}
                          >
                            {getConvertStatusPayment(p.status)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Método
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {p.method}
                          </p>
                        </div>

                        {isApproved ||
                          (installmentsPaid > 0 && (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Parcelas
                              </p>
                              <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {installmentsPaid}/{installmentsTotal}
                              </p>
                            </div>
                          ))}
                      </div>

                      {p.rejectionReason && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t">
                          <div className="space-y-1">
                            <p className="text-base font-bold uppercase mt-3 text-gray-900 dark:text-gray-400">
                              Motivo da recusa
                            </p>
                            <p className="text-base text-red-600">
                              {p.rejectionReason}
                            </p>
                          </div>
                        </div>
                      )}

                      {p.imageUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-fit"
                          onClick={() => openReceiptViewer(p)}
                        >
                          <FileText className="h-4 w-4" />
                          Visualizar comprovante
                        </Button>
                      )}

                      {isApproved && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                              Parcelas
                            </h4>
                          </div>

                          <div className="block sm:hidden">
                            {p.paymentInstallment.length === 0 ? (
                              <div className="px-4 py-6 text-center text-muted-foreground border rounded-lg">
                                Nenhuma parcela registrada
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {p.paymentInstallment.map((installment) => (
                                  <div
                                    key={installment.id}
                                    className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-muted-foreground">
                                          #
                                        </span>
                                        <span className="font-semibold">
                                          {installment.installmentNumber}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                          Valor
                                        </p>
                                        <p className="text-base font-bold text-green-600 dark:text-green-400">
                                          {getFormatCurrency(installment.value)}
                                        </p>
                                      </div>
                                      <div className="space-y-1 col-span-2">
                                        <p className="text-xs text-muted-foreground">
                                          Data
                                        </p>
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <p className="text-sm font-medium">
                                            {installment.paidAt
                                              ? formatDateTime(
                                                  installment.paidAt,
                                                )
                                              : "Em aberto"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="hidden sm:block rounded-md border sm:w-1/2">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-16">#</TableHead>
                                  <TableHead>
                                    <div className="w-fit mx-auto text-left">
                                      Valor
                                    </div>
                                  </TableHead>
                                  <TableHead className="w-[180px] ">
                                    Data
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {installments.length === 0 ? (
                                  <TableRow>
                                    <TableCell
                                      colSpan={3}
                                      className="h-24 text-center text-muted-foreground"
                                    >
                                      Nenhuma parcela registrada
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  installments.map((installment) => (
                                    <TableRow
                                      key={installment.id}
                                      className="hover:bg-muted/50"
                                    >
                                      <TableCell className="font-medium">
                                        {installment.installmentNumber}
                                      </TableCell>
                                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                                        <div className="w-fit mx-auto text-left whitespace-nowrap">
                                          {getFormatCurrency(installment.value)}
                                        </div>
                                      </TableCell>
                                      <TableCell className="whitespace-nowrap">
                                        {installment.paidAt
                                          ? formatDateTime(installment.paidAt)
                                          : "Em aberto"}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
      {receiptViewerUrl && (
        <ImageViewerDialog
          isOpen={receiptViewerOpen}
          onClose={() => {
            setReceiptViewerOpen(false);
            setReceiptViewerUrl(null);
            setReceiptViewerFileName(undefined);
          }}
          imageUrl={receiptViewerUrl}
          title="Comprovante"
          downloadFileName={receiptViewerFileName}
          downloadFileExtension={ImageViewerDownloadExtension.WEBP}
        />
      )}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setPaymentIdToDelete(null);
        }}
        onConfirm={() => {
          if (!paymentIdToDelete) return;
          onDeletePayment(paymentIdToDelete);
          setDeleteDialogOpen(false);
          setPaymentIdToDelete(null);
        }}
        title="Deletar pagamento"
        message="Tem certeza que deseja deletar este pagamento? Essa ação não pode ser desfeita."
        confirmText="Deletar"
        variant="destructive"
      />
    </div>
  );
}
