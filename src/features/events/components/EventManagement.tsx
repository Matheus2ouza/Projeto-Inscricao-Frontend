"use client";

import { useAccount } from "@/features/accounts/hooks/useAccount";
import { updateEventImage } from "@/features/events/api/updateEventImage";
import TypeInscriptionDialog from "@/features/typeInscription/components/TypeInscriptionDialog";
import { useTypeInscriptions } from "@/features/typeInscription/hook/useTypeInscriptions";
import { TypeInscriptions } from "@/features/typeInscription/types/typesInscriptionsTypes";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import EventMap from "@/shared/components/EventMap";
import ImageCropDialog from "@/shared/components/ImageCropDialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit3,
  Eye,
  EyeClosed,
  MapPin,
  Plus,
  Save,
  Tag,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useEventResponsible } from "../hooks/useEventResponsible";
import { useInvalidateEventsQuery } from "../hooks/useEventsQuery";
import { useFormEditEvent } from "../hooks/useFormEditEvent";
import { Event } from "../types/eventTypes";
import ResponsiblesDialog from "./ResponsiblesDialog";

interface EventManagementProps {
  event: Event;
  refetch: () => void;
}

export default function EventManagement({
  event,
  refetch,
}: EventManagementProps) {
  const router = useRouter();
  const { invalidateDetail } = useInvalidateEventsQuery();
  const [showAmount, setShowAmount] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<TypeInscriptions | null>(null);
  const dialogScrollPositionRef = useRef(0);

  const {
    isEditing,
    setIsEditing,
    loading,
    formData,
    originalResponsibleIds,
    handleInputChange,
    handleSave,
    handleDelete,
    handleCancel,
    handleUpdatePayment,
    handleUpdateInscription,
    handleResponsiblesChange,
    getNewResponsibleIds,
  } = useFormEditEvent(event);

  // Buscar contas para obter os nomes dos responsáveis
  const { accounts } = useAccount(isEditing);

  const {
    loading: typeInscriptionLoading,
    create,
    update,
    remove,
  } = useTypeInscriptions(event.id);

  const { remove: removeResponsible, loading: removingResponsible } =
    useEventResponsible();

  const [responsiblesDialogOpen, setResponsiblesDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteResponsibleDialog, setDeleteResponsibleDialog] = useState<{
    open: boolean;
    responsibleId: string | null;
    responsibleName: string | null;
  }>({
    open: false,
    responsibleId: null,
    responsibleName: null,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getEventStatus = () => {
    const today = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);

    if (today < start) return { label: "Agendado", color: "bg-green-600" };
    if (today > end) return { label: "Realizado", color: "bg-red-600" };
    return { label: "Em Andamento", color: "bg-blue-600" };
  };

  const statusBadge = getEventStatus();
  const totalRevenue = event.amountCollected;
  const hasTypeInscriptions = event.typesInscriptions.length > 0;

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
        refetch(); // Recarrega os dados do evento
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  };

  const handleSubmitType = async (data: {
    description: string;
    value: number;
    specialType: boolean;
  }) => {
    try {
      if (currentType) {
        // Edição
        await update(currentType.id, data);
      } else {
        // Criação
        await create({ ...data, eventId: event.id });
      }
      // Invalidar cache do evento para recarregar os tipos de inscrição
      invalidateDetail(event.id);
      refetch(); // Recarrega os dados do evento
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/super/events/manager">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciar Evento
              </h1>
              <p className="text-muted-foreground mt-1">
                Edite e visualize os detalhes do evento
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing ? (
              <>
                <Button
                  variant={event.status === "OPEN" ? "destructive" : "outline"}
                  onClick={() =>
                    handleUpdateInscription(
                      event.status === "OPEN" ? "CLOSE" : "OPEN"
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
                  onClick={handleDelete}
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

            {/* Card de Localização */}
            <div className="bg-white/95 dark:bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-gray-200/80 dark:border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Localização
                </h2>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (event.latitude && event.longitude) {
                        params.append("lat", event.latitude.toString());
                        params.append("lng", event.longitude.toString());
                      }
                      if (event.location) {
                        params.append("address", event.location);
                      }
                      router.push(
                        `/super/events/${event.id}/location?${params.toString()}`
                      );
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    {event.latitude && event.longitude
                      ? "Editar Localização"
                      : "Definir Localização"}
                  </Button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endereço
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location || "Local não definido"}</span>
                </div>
              </div>

              {/* Mapa */}
              {event.latitude && event.longitude ? (
                <div className="mt-4 rounded-lg overflow-hidden border border-gray-200/60 dark:border-white/10">
                  <EventMap
                    lat={event.latitude}
                    lng={event.longitude}
                    height="300px"
                    zoom={15}
                    markerTitle={event.name}
                  />
                </div>
              ) : (
                <div className="mt-4 h-48 bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200/60 dark:border-white/10 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nenhuma localização definida
                  </p>
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
                            (r) => r.id === id
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
                          (r): r is { id: string; name: string } => r !== null
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
                                    }
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
                  {event.typesInscriptions.length} tipos
                </Badge>
              </div>

              {!hasTypeInscriptions ? (
                <div className="text-center py-8">
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
                  {event.typesInscriptions.map((type) => (
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
                          {formatCurrency(type.value)}
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
                      {showAmount ? "****" : formatCurrency(totalRevenue)}
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Imagem do Evento
              </h2>

              <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Sem imagem
                    </p>
                  </div>
                )}
              </div>

              {isEditing && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setImageDialogOpen(true)}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "Enviando..." : "Alterar Imagem"}
                </Button>
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

        {/* Diálogo de crop de imagem 16:9 para salvar em 1920x1080 */}
        {isEditing && (
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
                // Atualizar caches
                invalidateDetail(event.id);
                await refetch();
              } catch (err) {
                toast.error("Falha ao atualizar imagem do evento");
              } finally {
                setUploadingImage(false);
              }
            }}
          />
        )}

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
                  refetch();
                  handleResponsiblesChange(
                    formData.responsibleIds.filter(
                      (id) => id !== deleteResponsibleDialog.responsibleId
                    )
                  );
                  setDeleteResponsibleDialog({
                    open: false,
                    responsibleId: null,
                    responsibleName: null,
                  });
                }
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
