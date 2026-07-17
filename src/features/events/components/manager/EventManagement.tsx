'use client';

import ImageCropDialog from '@/features/events/components/manager/ImageCropDialog';
import { useFormEditEvent } from '@/features/events/hooks/manager/useFormEditEvent';
import {
  Event,
  InscriptionMode,
} from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { TypeInscription } from '@/features/typeInscription/types/listTypeInscriptionsToManager/listTypeInscriptionsManagerTypes';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import { AspectRatio } from '@/shared/components/ui/aspect-ratio';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { DollarSign, Eye, EyeClosed, User, Users } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useInvalidateEventDetailsManagerQuery } from '../../hooks/manager/eventDetailsManager/useEventDetailsManagerQuery';

import { deleteImageEventAction } from '../../actions/manager/deleteImageEvent/deleteImageEventAction';
import { deleteLogoEventAction } from '../../actions/manager/deleteLogoEvent/deleteLogoEventAction';
import { updateEventImageAction } from '../../actions/manager/updateEventImage/updateEventImageAction';
import { updateEventLogoAction } from '../../actions/manager/updateEventLogo/updateEventLogoAction';
import { EventActionsHeader } from './EventActionsHeader';
import { EventInfoCard } from './EventInfoCard';
import InscriptionModesManager from './InscriptionModesManager';
import ParticipantFieldsManager from './ParticipantFieldsManager';
import PaymentModesManager from './PaymentModesManager';
import { ResponsiblesSection } from './ResponsiblesSection';
import { TypesInscriptionSection } from './TypesInscriptionSection';

interface EventManagementProps {
  event: Event | null;
  typeInscriptions: TypeInscription[] | null;
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
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-4 text-2xl font-bold">
            Evento não encontrado
          </h2>
          <p className="text-muted-foreground">
            O evento que você está tentando acessar não existe ou não foi
            carregado.
          </p>
        </div>
      </div>
    );
  }

  const [showAmount, setShowAmount] = useState(false);

  // Hook para outras funcionalidades (delete, allow card, payment, inscriptions, etc)
  const {
    isEditing,
    setIsEditing,
    loading,
    formData,
    handleDelete,
    handleInscriptionModesChange,
  } = useFormEditEvent(event);

  const { invalidateDetail } = useInvalidateEventDetailsManagerQuery();

  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);
  const [deleteLogo, setDeleteLogo] = useState(false);
  const [isDeleteImageOpen, setIsDeleteImageOpen] = useState(false);
  const [isDeleteLogoOpen, setIsDeleteLogoOpen] = useState(false);
  const [isDeleteEventOpen, setIsDeleteEventOpen] = useState(false);

  const handleConfirmDeleteImage = useCallback(async () => {
    if (!event) return;
    try {
      setDeleteImage(true);
      await deleteImageEventAction(event.id);
      toast.success('Imagem deletada com sucesso!');
      setIsDeleteImageOpen(false);
      refreshEvent();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha ao tentar deletar a imagem do evento';
      toast.error(message);
    } finally {
      setDeleteImage(false);
    }
  }, [event, refreshEvent]);

  const handleConfirmDeleteLogo = useCallback(async () => {
    if (!event) return;
    try {
      setDeleteLogo(true);
      await deleteLogoEventAction(event.id);
      toast.success('Logo deletada com sucesso!');
      setIsDeleteLogoOpen(false);
      refreshEvent();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Falha ao tentar deletar o logo do evento';
      toast.error(message);
    } finally {
      setDeleteLogo(false);
    }
  }, [event, refreshEvent]);

  const totalRevenue = event?.amountCollected || 0;

  const handleConfirmDelete = useCallback(async () => {
    const success = await handleDelete();
    if (success) {
      setIsDeleteEventOpen(false);
    }
  }, [handleDelete]);

  // Função para adicionar um modo de inscrição
  const handleAddInscriptionMode = (mode: InscriptionMode) => {
    const currentModes = formData.allowedInscriptionModes || [];
    if (!currentModes.includes(mode)) {
      handleInscriptionModesChange([...currentModes, mode]);
    }
  };

  // Função para remover um modo de inscrição
  const handleRemoveInscriptionMode = (mode: InscriptionMode) => {
    const currentModes = formData.allowedInscriptionModes || [];
    handleInscriptionModesChange(currentModes.filter((m) => m !== mode));
  };

  // Handler para sucesso do update
  const handleUpdateSuccess = () => {
    invalidateDetail(event.id);
    refreshEvent();
  };

  return (
    <div className="bg-background min-h-screen rounded-lg">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header com ações principais */}
        <EventActionsHeader
          event={event}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={() => {
            setIsEditing(false);
          }}
          onSave={() => {
            setIsEditing(false);
            refreshEvent();
            invalidateDetail(event.id);
          }}
          onDelete={() => setIsDeleteEventOpen(true)}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Coluna Principal */}
          <div className="space-y-6 lg:col-span-2">
            {/* Card de Informações do Evento - Independente */}
            <EventInfoCard event={event} />

            {/* Card de Modos de Inscrição */}
            <div className="liquid-card rounded-xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-semibold">
                  Modos de Inscrição
                </h2>
                <Badge
                  variant="outline"
                  className="border-riodavida/20 bg-riodavida/5 text-riodavida dark:border-riodavida/20 dark:bg-riodavida/10 dark:text-riodavida flex items-center gap-1"
                >
                  <User className="h-3 w-3" />
                  {event.allowedInscriptionModes?.length || 0} modos
                </Badge>
              </div>

              <InscriptionModesManager
                eventId={event.id}
                selectedModes={event.allowedInscriptionModes || []}
              />
            </div>

            {/* Card de Modos de Pagamento */}
            <div className="liquid-card rounded-xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-semibold">
                  Modos de Pagamento
                </h2>
                <Badge
                  variant="outline"
                  className="border-riodavida/20 bg-riodavida/5 text-riodavida dark:border-riodavida/20 dark:bg-riodavida/10 dark:text-riodavida flex items-center gap-1"
                >
                  <DollarSign className="h-3 w-3" />
                  {event.allowedPaymentModes?.length || 0} modos
                </Badge>
              </div>

              <PaymentModesManager
                eventId={event.id}
                selectedModes={event.allowedPaymentModes || []}
              />
            </div>

            {/* Card de Campos do Participante */}
            <ParticipantFieldsManager
              eventId={event.id}
              participanteConfig={event.participanteConfig}
            />

            {/* Card de Responsáveis */}
            <ResponsiblesSection
              event={event}
              responsibleIds={formData.responsibleIds}
              refreshEvent={refreshEvent}
            />

            <TypesInscriptionSection
              eventId={event.id}
              eventStartDate={event.startDate}
              typeInscriptions={typeInscriptions}
              isEditing={isEditing}
              refreshEvent={refreshEvent}
              refreshTypeInscriptions={refreshTypeInscriptions}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card de Estatísticas */}
            <div className="liquid-card rounded-xl p-6">
              <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-6 text-xl font-semibold">
                Estatísticas
              </h2>

              <div className="space-y-4">
                <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 flex items-center justify-between rounded-lg border p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <Users className="text-riodavida h-5 w-5" />
                    <span className="text-sm font-medium">Participantes</span>
                  </div>
                  <span className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-bold">
                    {event.quantityParticipants}
                  </span>
                </div>

                <div className="border-riodavida-secondary/20 bg-riodavida-secondary/5 dark:border-riodavida-secondary/20 dark:bg-riodavida-secondary/10 flex items-center justify-between rounded-lg border p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-riodavida-secondary h-5 w-5" />
                    <span className="text-sm font-medium">Arrecadado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-riodavida-secondary dark:text-riodavida-muted-light text-lg font-bold">
                      {showAmount ? '****' : getFormatCurrency(totalRevenue)}
                    </span>
                    <button
                      onClick={() => setShowAmount(!showAmount)}
                      className="focus:outline-none"
                    >
                      {showAmount ? (
                        <EyeClosed className="text-riodavida-secondary h-4 w-4" />
                      ) : (
                        <Eye className="text-riodavida-secondary h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card de Imagem do Evento */}
            <div className="liquid-card rounded-xl p-6">
              <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-4 text-xl font-semibold">
                Imagem do Evento
              </h2>
              <AspectRatio
                ratio={16 / 9}
                className="bg-riodavida/5 mx-auto w-full max-w-[640px] overflow-hidden rounded-lg"
              >
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={`Capa do evento ${event.name}`}
                    fill
                    className="object-cover" // ou object-contain
                    sizes="(max-width: 640px) 100vw, 640px"
                    loading="eager"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Sem imagem
                    </p>
                  </div>
                )}
              </AspectRatio>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark flex-1"
                  onClick={() => setImageDialogOpen(true)}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? 'Enviando...' : 'Alterar Imagem'}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setIsDeleteImageOpen(true)}
                  disabled={deleteImage || !event.image}
                >
                  {deleteImage ? 'Deletando...' : 'Deletar Imagem'}
                </Button>
              </div>
            </div>

            {/* Card de Logo do Evento */}
            <div className="liquid-card rounded-xl p-6">
              <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-4 text-xl font-semibold">
                Logo do Evento
              </h2>
              <div className="flex justify-center">
                <div className="w-[180px]">
                  <AspectRatio
                    ratio={1}
                    className="bg-riodavida/5 overflow-hidden rounded-lg"
                  >
                    {event.logo ? (
                      <Image
                        src={event.logo}
                        alt={`Logo do evento ${event.name}`}
                        fill
                        className="object-contain"
                        loading="eager"
                        priority
                        sizes="(max-width: 768px) 100px, (max-width: 1200px) 150px, 200px"
                      />
                    ) : (
                      <span className="text-riodavida-gray-dark dark:text-riodavida-gray flex h-full w-full items-center justify-center text-sm font-medium">
                        SEM LOGO
                      </span>
                    )}
                  </AspectRatio>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark flex-1"
                  onClick={() => setLogoDialogOpen(true)}
                  disabled={uploadingLogo}
                >
                  {uploadingLogo ? 'Enviando...' : 'Alterar Logo'}
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setIsDeleteLogoOpen(true)}
                  disabled={deleteLogo || !event.logo}
                >
                  {deleteLogo ? 'Deletando...' : 'Deletar Logo'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <ImageCropDialog
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          eventId={event.id}
          imageType="capa"
          action={updateEventImageAction}
          onSuccess={() => {
            invalidateDetail(event.id);
            refreshEvent();
          }}
        />
        <ImageCropDialog
          open={logoDialogOpen}
          onOpenChange={setLogoDialogOpen}
          eventId={event.id}
          imageType="logo"
          action={updateEventLogoAction}
          onSuccess={() => {
            invalidateDetail(event.id);
            refreshEvent();
          }}
        />

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
          onOpenChange={setIsDeleteEventOpen}
          onConfirm={handleConfirmDelete}
          title="Excluir evento?"
          message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
          confirmText="Excluir evento"
          cancelText="Cancelar"
          isLoading={loading}
          variant="destructive"
        />
      </div>
    </div>
  );
}
