'use client';

import { useFormUpdateGuestInscription } from '@/features/guest/hook/updateGuestInscription/useFormUpdateGuestInscription';
import { InscriptionDetails } from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { LocalityCombobox } from '@/features/locality/components/LocalityCombobox';
import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { formatDateTime } from '@/shared/utils/formatDate';
import { getConvertStatusInscription } from '@/shared/utils/getConvertStatus';
import { getStatusColor } from '@/shared/utils/getStatusColor';
import { FileText, Mail, MapPin, Pencil, Phone, User } from 'lucide-react';
import { useState } from 'react';

interface InscriptionDetailsCardProps {
  inscription: InscriptionDetails;
  eventId: string;
  loading?: boolean;
}

export function InscriptionDetailsCard({
  inscription,
  eventId,
  loading: externalLoading = false,
}: InscriptionDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { form, onSubmit, isLoading } =
    useFormUpdateGuestInscription(inscription);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset({
      guestName: inscription.guestName,
      guestEmail: inscription.guestEmail,
      phone: inscription.phone,
      locality: inscription.localityId,
    });
  };

  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    await onSubmit(event);
    setIsEditing(false);
  };

  const isEditingCurrentInscription = isEditing;
  const isLoadingState = isLoading || externalLoading;

  return (
    <div className="liquid-panel overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalhes da Inscrição
                  </h1>
                  <div className="text-muted-foreground text-xs">
                    Registrada em: {formatDateTime(inscription.createdAt)}
                  </div>
                </div>
                {!isEditingCurrentInscription && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleStartEdit}
                    disabled={isLoadingState}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar Inscrição
                  </Button>
                )}
              </div>
            </div>

            {isEditingCurrentInscription ? (
              <Form {...form}>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Responsável{' '}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoadingState}
                              className="h-10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guestEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Email <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoadingState}
                              className="h-10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Telefone <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isLoadingState}
                              className="h-10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            Localidade{' '}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <LocalityCombobox
                              eventId={eventId}
                              form={form}
                              name="locality"
                              placeholder="Selecione uma localidade"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="liquid-panel-strong rounded-lg p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <FileText className="text-muted-foreground h-4 w-4" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                          inscription.status,
                        )}`}
                      >
                        {getConvertStatusInscription(inscription.status)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 border-t pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      disabled={isLoadingState}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      className="gap-2"
                      disabled={isLoadingState}
                    >
                      {isLoadingState ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="liquid-panel-strong rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Responsável</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {inscription.guestName}
                  </p>
                </div>

                <div className="liquid-panel-strong rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-sm font-medium break-all">
                    {inscription.guestEmail}
                  </p>
                </div>

                <div className="liquid-panel-strong rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Telefone</span>
                  </div>
                  <p className="text-sm font-medium">{inscription.phone}</p>
                </div>

                <div className="liquid-panel-strong rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Localidade</span>
                  </div>
                  <p className="text-sm font-medium uppercase">
                    {inscription.locality?.name || 'N/ Definido'}
                  </p>
                </div>

                <div className="liquid-panel-strong rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                      inscription.status,
                    )}`}
                  >
                    {getConvertStatusInscription(inscription.status)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
