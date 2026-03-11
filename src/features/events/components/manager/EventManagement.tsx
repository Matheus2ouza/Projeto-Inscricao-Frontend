"use client";

import { useAccount } from "@/features/accounts/hooks/useAccount";
import { deleteImageEvent } from "@/features/events/api/manager/eventActions/deleteImageEvent";
import { deleteLogoEvent } from "@/features/events/api/manager/eventActions/deleteLogoEvent";
import { updateEventImage } from "@/features/events/api/manager/eventActions/updateEventImage";
import { updateEventLogo } from "@/features/events/api/manager/eventActions/updateEventLogo";
import ResponsiblesDialog from "@/features/events/components/manager/ResponsiblesDialog";
import { useFormEditEvent } from "@/features/events/hooks/manager/useFormEditEvent";
import { useEventResponsible } from "@/features/events/hooks/useEventResponsible";
import {
  Event,
  InscriptionMode,
} from "@/features/events/types/manager/eventManagerTypes";
import TypeInscriptionDialog from "@/features/typeInscription/components/TypeInscriptionDialog";
import { useTypeInscriptionsActions } from "@/features/typeInscription/hook/useTypeInscriptionsActions";
import { TypeInscriptions } from "@/features/typeInscription/types/typesInscriptionsTypes";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import EventMap from "@/shared/components/EventMap";
import ImageCropDialog from "@/shared/components/ImageCropDialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import calculateMaxAge from "@/shared/utils/calculateMaxAge";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import {
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSign,
  Edit3,
  Eye,
  EyeClosed,
  MapPin,
  Plus,
  Save,
  Tag,
  Trash2,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useInvalidateDetailsEventQuery } from "../../hooks/manager/useEventManagerQuery";
import InscriptionModesDialog from "./InscriptionModesDialog";

interface EventManagementProps {
  event: Event | null;
  typeInscriptions: TypeInscriptions[] | null;
  refreshEvent: () => void;
  refreshTypeInscriptions: () => void;
}

export default function EventManagement({
  event,
  typeInscriptions,
  refreshEvent,
  refreshTypeInscriptions,
}: EventManagementProps) {
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Evento não encontrado</h2>
          <p className="text-muted-foreground">
            O evento que você está tentando acessar não existe ou não foi
            carregado.
          </p>
        </div>
      </div>
    );
  }

  const [showAmount, setShowAmount] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<TypeInscriptions | null>(null);
  const dialogScrollPositionRef = useRef(0);

  const {
    isEditing,
    setIsEditing,
    loading,
    formData,
    handleInputChange,
    handleSave,
    handleDelete,
    handleCancel,
    handleUpdatePayment,
    handleUpdateAllowCard,
    handleUpdateInscription,
    handleResponsiblesChange,
    handleInscriptionModesChange,
    getNewResponsibleIds,
  } = useFormEditEvent(event);
  const { invalidateDetail } = useInvalidateDetailsEventQuery();

  // Buscar contas para obter os nomes dos responsáveis
  const { accounts } = useAccount(isEditing);

  const {
    loading: typeInscriptionLoading,
    create,
    update,
    remove,
  } = useTypeInscriptionsActions(event.id);

  const { remove: removeResponsible, loading: removingResponsible } =
    useEventResponsible();

  const [responsiblesDialogOpen, setResponsiblesDialogOpen] = useState(false);
  const [inscriptionModesDialogOpen, setInscriptionModesDialogOpen] =
    useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);
  const [deleteLogo, setDeleteLogo] = useState(false);
  const [isDeleteImageOpen, setIsDeleteImageOpen] = useState(false);
  const [isDeleteLogoOpen, setIsDeleteLogoOpen] = useState(false);
  const [isDeleteEventOpen, setisDeleteEventOpen] = useState(false);
  const [deleteResponsibleDialog, setDeleteResponsibleDialog] = useState<{
    open: boolean;
    responsibleId: string | null;
    responsibleName: string | null;
  }>({
    open: false,
    responsibleId: null,
    responsibleName: null,
  });

  // Opções para os modos de inscrição
  const inscriptionModeOptions = [
    { value: InscriptionMode.NORMAL, label: "Normal" },
    { value: InscriptionMode.GUEST, label: "Não Alocados" },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getEventStatus = () => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (now >= start && now <= end) {
      return { label: "Em Andamento", color: "bg-blue-600" };
    }

    switch (event.status) {
      case "OPEN":
        return { label: "Inscrições Abertas", color: "bg-green-600" };
      case "CLOSE":
        return { label: "Inscrições Fechadas", color: "bg-amber-600" };
      case "FINALIZED":
        return { label: "Finalizado", color: "bg-red-600" };
      default:
        return { label: "Status desconhecido", color: "bg-gray-600" };
    }
  };

  const handleConfirmDeleteImage = useCallback(async () => {
    try {
      setDeleteImage(true);
      await deleteImageEvent(event.id);
      toast.success("Imagem deletada com sucesso!");
      setIsDeleteImageOpen(false);
      await refreshEvent();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Falha ao tentar deletar a imagem do evento";
      toast.error(message);
    } finally {
      setDeleteImage(false);
    }
  }, [event.id, refreshEvent]);

  const handleConfirmDeleteLogo = useCallback(async () => {
    try {
      setDeleteLogo(true);
      await deleteLogoEvent(event.id);
      toast.success("Logo deletada com sucesso!");
      setIsDeleteLogoOpen(false);
      refreshEvent();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Falha ao tentar deletar o logo do evento";
      toast.error(message);
    } finally {
      setDeleteLogo(false);
    }
  }, [event.id, refreshEvent]);

  const statusBadge = getEventStatus();
  const totalRevenue = event.amountCollected;
  const typesInscriptions = typeInscriptions ?? event.typesInscriptions ?? [];
  const hasTypeInscriptions = typesInscriptions.length > 0;

  // Funções para gerenciar tipos de inscrição
  const handleCreateType = () => {
    dialogScrollPositionRef.current =
      typeof window !== "undefined" ? window.scrollY : 0;
    setCurrentType(null);
    setDialogOpen(true);
    requestAnimationFrame(() => {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: dialogScrollPositionRef.current,
          behavior: "auto",
        });
      }
    });
  };

  const handleEditType = (type: TypeInscriptions) => {
    dialogScrollPositionRef.current =
      typeof window !== "undefined" ? window.scrollY : 0;
    setCurrentType(type);
    setDialogOpen(true);
    requestAnimationFrame(() => {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: dialogScrollPositionRef.current,
          behavior: "auto",
        });
      }
    });
  };

  const handleDeleteType = async (type: TypeInscriptions) => {
    if (
      confirm(`Tem certeza que deseja excluir o tipo "${type.description}"?`)
    ) {
      try {
        await remove(type.id);
        // Invalidar cache do evento para recarregar os tipos de inscrição
        invalidateDetail(event.id);
        await refreshTypeInscriptions(); // Recarrega os dados do evento
        await refreshEvent();
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  };

  const handleSubmitType = async (data: {
    description: string;
    value: number;
    specialType: boolean;
    rule: Date | null;
  }) => {
    try {
      const payload = {
        ...data,
        rule: data.rule,
      };
      if (currentType) {
        // Edição
        await update(currentType.id, payload);
      } else {
        // Criação
        await create({ ...payload, eventId: event.id });
      }
      // Invalidar cache do evento para recarregar os tipos de inscrição
      invalidateDetail(event.id);
      refreshTypeInscriptions(); // Recarrega os dados do evento
      refreshEvent();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleConfirmDelete = useCallback(async () => {
    const success = await handleDelete();
    if (success) {
      setisDeleteEventOpen(false);
    }
  }, [handleDelete]);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Evento não encontrado</h2>
          <p className="text-muted-foreground">
            O evento que você está tentando acessar não existe ou não foi
            carregado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header com ações principais */}
        <div className="flex items-center justify-end mb-8">
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <Button
                  variant={event.status === "OPEN" ? "destructive" : "outline"}
                  onClick={() =>
                    handleUpdateInscription(
                      event.status === "OPEN" ? "CLOSE" : "OPEN",
                    )
                  }
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  {event.status === "OPEN"
                    ? "Fechar Inscrições"
                    : "Abrir Inscrições"}
                </Button>
                <Button
                  variant={event.paymentEnebled ? "destructive" : "outline"}
                  onClick={() => handleUpdatePayment(!event.paymentEnebled)}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  {event.paymentEnebled
                    ? "Fechar Pagamentos"
                    : "Abrir Pagamentos"}
                </Button>
                <Button
                  variant={event.allowCard ? "destructive" : "outline"}
                  onClick={() => handleUpdateAllowCard(!event.allowCard)}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <CreditCard className="h-4 w-4" />
                  {event.allowCard ? "Desabilitar Cartão" : "Habilitar Cartão"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                  disabled={loading}
                >
                  <Edit3 className="h-4 w-4" />
                  Editar Evento
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => setisDeleteEventOpen(true)}
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    // Obter apenas os IDs dos novos responsáveis adicionados
                    const newResponsibleIds = getNewResponsibleIds();

                    // Salvar apenas com os IDs dos novos responsáveis
                    handleSave(newResponsibleIds);
                  }}
                  className="flex items-center gap-2 dark:text-white"
                  disabled={loading}
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card de Informações Básicas */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Informações Básicas
                </h2>
                <Badge className={statusBadge.color + " text-white"}>
                  {statusBadge.label}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome do Evento
                  </label>
                  {isEditing ? (
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nome do evento"
                    />
                  ) : (
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {event.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Card de Datas e Horários */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Datas e Horários
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Início
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Término
                  </label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.endDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card de Modos de Inscrição */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Modos de Inscrição
                </h2>
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {event.allowedInscriptionModes?.length || 0} modos
                </Badge>
              </div>

              <div className="space-y-4">
                {!event.allowedInscriptionModes?.length ? (
                  <div className="text-center flex flex-col items-center justify-center py-8">
                    <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhum modo de inscrição configurado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Selecione os modos de inscrição disponíveis para este
                      evento.
                    </p>
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => setInscriptionModesDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar Modos
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {(() => {
                        // Durante edição, mostrar todos os modos selecionados
                        // No modo visualização, mostrar apenas os modos do evento
                        const displayModes = isEditing
                          ? formData.allowedInscriptionModes || []
                          : event.allowedInscriptionModes || [];

                        return displayModes.map((mode) => {
                          const modeOption = inscriptionModeOptions.find(
                            (opt) => opt.value === mode,
                          );
                          return (
                            <div
                              key={mode}
                              className="flex items-center justify-between p-3 border border-gray-200/60 dark:border-white/10 rounded-lg bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {modeOption?.label || mode}
                                </span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => setInscriptionModesDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Gerenciar Modos de Inscrição
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Card de Localização */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Localização
                </h2>
              </div>

              {/* Card de Endereço */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endereço
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  {isEditing ? (
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Localização do evento"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location || "Local não definido"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card de Latitude */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Latitude
                  </label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    {isEditing ? (
                      <Input
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        placeholder="Latitude"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <MapPin className="h-4 w-4" />
                        <span>{event.latitude || "não definido"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card de Longitude */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Longitude
                  </label>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    {isEditing ? (
                      <Input
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        placeholder="Longitude"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <MapPin className="h-4 w-4" />
                        <span>{event.longitude || "não definido"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <Alert className="mb-4 border-yellow-500/50 text-yellow-600 dark:text-yellow-400 dark:border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    Alterar a latitude e longitude afetará a posição do marcador
                    no mapa. Certifique-se de usar coordenadas válidas. Caso
                    tenha dúvidas sobre como obter as coordenadas, consulte no
                    site do{" "}
                    <a
                      href={
                        formData.location
                          ? `https://www.google.com.br/maps/search/${encodeURIComponent(
                              formData.location,
                            )}`
                          : "https://www.google.com.br/maps"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium no-underline hover:underline underline-offset-4"
                    >
                      Google Maps
                    </a>
                  </AlertDescription>
                </Alert>
              )}
              {/* Mapa do Evento - Exibir apenas se não estiver editando e houver coordenadas válidas */}
              {!isEditing &&
                event.latitude &&
                event.longitude &&
                (event.latitude !== 0 || event.longitude !== 0) && (
                  <div className="mt-6 rounded-lg overflow-hidden border border-gray-200 dark:border-white/10">
                    <EventMap
                      lat={event.latitude as number}
                      lng={event.longitude as number}
                      height="300px"
                      markerTitle={event.name}
                    />
                  </div>
                )}
            </div>

            {/* Card de Responsáveis */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Responsáveis
                </h2>
                <div className="flex items-center gap-3">
                  {event.regionName && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" />
                      {event.regionName}
                    </Badge>
                  )}
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setResponsiblesDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar Responsável
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {(() => {
                  // Durante edição, mostrar todos os responsáveis selecionados (originais + novos)
                  // No modo visualização, mostrar apenas os responsáveis do evento
                  const displayResponsibles = isEditing
                    ? formData.responsibleIds
                        .map((id) => {
                          // Tentar encontrar no evento primeiro
                          const eventResponsible = event.responsibles?.find(
                            (r) => r.id === id,
                          );
                          if (eventResponsible) {
                            return eventResponsible;
                          }
                          // Se não encontrar, buscar nas accounts (novo responsável)
                          const account = accounts.find((acc) => acc.id === id);
                          if (account) {
                            return {
                              id: account.id,
                              name: account.username,
                            };
                          }
                          return null;
                        })
                        .filter(
                          (r): r is { id: string; name: string } => r !== null,
                        )
                    : event.responsibles || [];

                  return displayResponsibles.length > 0 ? (
                    <div className="space-y-2">
                      {displayResponsibles.map((responsible) => (
                        <div
                          key={responsible.id}
                          className="flex items-center justify-between p-3 border border-gray-200/60 dark:border-white/10 rounded-lg bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <UserCheck className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {responsible.name}
                            </span>
                          </div>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Verificar se é o último responsável
                                if (displayResponsibles.length === 1) {
                                  toast.error(
                                    "Impossível remover o responsável",
                                    {
                                      description:
                                        "O evento deve ter pelo menos um responsável.",
                                    },
                                  );
                                  return;
                                }
                                setDeleteResponsibleDialog({
                                  open: true,
                                  responsibleId: responsible.id,
                                  responsibleName: responsible.name,
                                });
                              }}
                              disabled={removingResponsible}
                              className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Nenhum responsável atribuído
                      </p>
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4 flex items-center gap-2"
                          onClick={() => setResponsiblesDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                          Adicionar Responsável
                        </Button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Card de Tipos de Inscrição */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tipos de Inscrição
                </h2>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {typesInscriptions.length} tipos
                </Badge>
              </div>

              {!hasTypeInscriptions ? (
                <div className="text-center flex flex-col items-center justify-center py-8">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Nenhum tipo de inscrição configurado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Adicione tipos de inscrição para permitir que participantes
                    se inscrevam no evento.
                  </p>
                  <Button
                    className="flex items-center gap-2"
                    onClick={handleCreateType}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Primeiro Tipo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {typesInscriptions.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center justify-between p-4 border border-gray-200/60 dark:border-white/10 rounded-lg bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-gray-900 dark:text-white uppercase">
                            {type.description}
                          </h4>
                          {type.specialType && (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1 text-xs uppercase tracking-wide"
                            >
                              Especial
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {getFormatCurrency(type.value)} •{" "}
                          {calculateMaxAge(type.rule)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditType(type)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteType(type)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={handleCreateType}
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Novo Tipo
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Estatísticas */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Estatísticas
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50/80 dark:bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-200/60 dark:border-blue-500/10">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium">Participantes</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {event.quantityParticipants}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50/80 dark:bg-green-500/10 backdrop-blur-sm rounded-lg border border-green-200/60 dark:border-green-500/10">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">Arrecadado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {showAmount ? "****" : getFormatCurrency(totalRevenue)}
                    </span>
                    <button
                      onClick={() => setShowAmount(!showAmount)}
                      className="focus:outline-none"
                    >
                      {showAmount ? (
                        <EyeClosed className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </button>
                  </div>
                </div>

                {event.maxParticipants && (
                  <div className="flex items-center justify-between p-3 bg-purple-50/80 dark:bg-purple-500/10 backdrop-blur-sm rounded-lg border border-purple-200/60 dark:border-purple-500/10">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium">Vagas Totais</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {event.maxParticipants}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card de Imagem do Evento */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Imagem do Evento
              </h2>
              <AspectRatio
                ratio={16 / 9}
                className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden w-full max-w-[640px] mx-auto"
              >
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    width={400}
                    height={225}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Sem imagem
                    </p>
                  </div>
                )}
              </AspectRatio>
              {isEditing && (
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setImageDialogOpen(true)}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? "Enviando..." : "Alterar Imagem"}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setIsDeleteImageOpen(true)}
                    disabled={deleteImage}
                  >
                    {deleteImage ? "Deletando..." : "Deletar Imagem"}
                  </Button>
                </div>
              )}
            </div>

            {/* Card de Logo do Evento */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Logo do Evento
              </h2>
              <div className="flex justify-center">
                <div className="w-[180px]">
                  <AspectRatio
                    ratio={1}
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                  >
                    {event.logoUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={event.logoUrl}
                          alt={`Logo do evento ${event.name}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
                        SEM LOGO
                      </span>
                    )}
                  </AspectRatio>
                </div>
              </div>
              {isEditing && (
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setLogoDialogOpen(true)}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? "Enviando..." : "Alterar Logo"}
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => setIsDeleteLogoOpen(true)}
                    disabled={deleteLogo}
                  >
                    {deleteLogo ? "Deletando..." : "Deletar Logo"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Diálogo para tipos de inscrição */}
        <TypeInscriptionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          typeInscription={currentType}
          eventId={event.id}
          eventStartDate={event.startDate}
          onSubmit={handleSubmitType}
          loading={typeInscriptionLoading}
        />
        {/* Diálogo para gerenciar responsáveis */}
        {isEditing && (
          <ResponsiblesDialog
            open={responsiblesDialogOpen}
            onOpenChange={setResponsiblesDialogOpen}
            selectedResponsibleIds={formData.responsibleIds}
            onAddResponsible={(responsibleId) => {
              if (!formData.responsibleIds.includes(responsibleId)) {
                handleResponsiblesChange([
                  ...formData.responsibleIds,
                  responsibleId,
                ]);
              }
            }}
          />
        )}

        {/* Diálogo para gerenciar modos de inscrição */}
        {isEditing && (
          <InscriptionModesDialog
            open={inscriptionModesDialogOpen}
            onOpenChange={setInscriptionModesDialogOpen}
            selectedModes={formData.allowedInscriptionModes || []}
            onAddMode={(mode) => {
              const currentModes = formData.allowedInscriptionModes || [];
              if (!currentModes.includes(mode)) {
                handleInscriptionModesChange([...currentModes, mode]);
              }
            }}
          />
        )}

        {/* Diálogo de crop de imagem 16:9 para salvar em 1920x1080 */}
        {isEditing && (
          <>
            <ImageCropDialog
              open={imageDialogOpen}
              onOpenChange={setImageDialogOpen}
              aspect={16 / 9}
              targetWidth={1920}
              targetHeight={1080}
              title="Alterar imagem do evento"
              description="Arraste/solte sua imagem, ajuste o zoom e posição. Salvaremos em 1920x1080."
              confirmLabel={uploadingImage ? "Enviando..." : "Salvar imagem"}
              onConfirm={async ({ base64 }) => {
                try {
                  setUploadingImage(true);
                  await updateEventImage({
                    eventId: event.id,
                    imageBase64: base64,
                  });
                  toast.success("Imagem atualizada com sucesso!");
                  setImageDialogOpen(false);
                  invalidateDetail(event.id);
                  refreshEvent();
                } catch (err) {
                  toast.error("Falha ao atualizar imagem do evento");
                } finally {
                  setUploadingImage(false);
                }
              }}
            />

            <ImageCropDialog
              open={logoDialogOpen}
              onOpenChange={setLogoDialogOpen}
              aspect={1}
              targetWidth={500}
              targetHeight={500}
              title="Alterar logo do evento"
              description="Faça upload da logo, ajustando no formato quadrado. Salvaremos em 500x500."
              confirmLabel={uploadingLogo ? "Enviando..." : "Salvar logo"}
              onConfirm={async ({ base64 }) => {
                try {
                  setUploadingLogo(true);
                  await updateEventLogo({
                    eventId: event.id,
                    imageBase64: base64,
                  });
                  toast.success("Logo atualizada com sucesso!");
                  setLogoDialogOpen(false);
                  invalidateDetail(event.id);
                  refreshEvent();
                } catch (err) {
                  toast.error("Falha ao atualizar logo do evento");
                } finally {
                  setUploadingLogo(false);
                }
              }}
            />
          </>
        )}
        {/* Diálogo de confirmação para deletar imagem */}
        <ConfirmationDialog
          open={isDeleteImageOpen}
          onOpenChange={setIsDeleteImageOpen}
          onConfirm={handleConfirmDeleteImage}
          title="Deletar imagem do evento?"
          message="Tem certeza que deseja deletar a imagem do evento?"
          confirmText="Deletar imagem"
          cancelText="Cancelar"
          isLoading={deleteImage}
          variant="destructive"
        />
        {/* Diálogo de confirmação para deletar logo */}
        <ConfirmationDialog
          open={isDeleteLogoOpen}
          onOpenChange={setIsDeleteLogoOpen}
          onConfirm={handleConfirmDeleteLogo}
          title="Deletar logo do evento?"
          message="Tem certeza que deseja deletar o logo do evento?"
          confirmText="Deletar logo"
          cancelText="Cancelar"
          isLoading={deleteLogo}
          variant="destructive"
        />
        {/* Diálogo de confirmação para excluir evento */}
        <ConfirmationDialog
          open={isDeleteEventOpen}
          onOpenChange={setisDeleteEventOpen}
          onConfirm={handleConfirmDelete}
          title="Excluir evento?"
          message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
          confirmText="Excluir evento"
          cancelText="Cancelar"
          isLoading={loading}
          variant="destructive"
        />
        {/* Diálogo de confirmação para excluir responsável */}
        <ConfirmationDialog
          open={deleteResponsibleDialog.open}
          onOpenChange={(open) => {
            setDeleteResponsibleDialog({
              open,
              responsibleId: null,
              responsibleName: null,
            });
          }}
          onConfirm={async () => {
            if (deleteResponsibleDialog.responsibleId) {
              const success = await removeResponsible(
                event.id,
                deleteResponsibleDialog.responsibleId,
                () => {
                  // Callback de sucesso: recarregar e atualizar lista local
                  refreshEvent();
                  handleResponsiblesChange(
                    formData.responsibleIds.filter(
                      (id) => id !== deleteResponsibleDialog.responsibleId,
                    ),
                  );
                  setDeleteResponsibleDialog({
                    open: false,
                    responsibleId: null,
                    responsibleName: null,
                  });
                },
              );
            }
          }}
          title="Excluir Responsável"
          message={`Tem certeza que deseja remover o responsável "${deleteResponsibleDialog.responsibleName}" deste evento?`}
          confirmText="Excluir"
          cancelText="Cancelar"
          variant="destructive"
          isLoading={removingResponsible}
        />
      </div>
    </div>
  );
}
