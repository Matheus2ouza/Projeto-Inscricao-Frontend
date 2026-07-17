'use client';

import { useFormUpdateGuestInscription } from '@/features/guest/hook/updateGuestInscription/useFormUpdateGuestInscription';
import { InscriptionDetails } from '@/features/guest/types/detailsInscription/detailsInscriptionType';
import { LocalityCombobox } from '@/features/locality/components/LocalityCombobox';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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
      locality: inscription.locality.name,
    });
  };

  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    await onSubmit(event);
    setIsEditing(false);
  };

  const isEditingCurrentInscription = isEditing;
  const isLoadingState = isLoading || externalLoading;

  return (
    <Card className="liquid-card w-full overflow-hidden border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
              Detalhes da Inscrição
            </CardTitle>
            <div className="text-muted-foreground text-xs">
              Registrada em: {formatDateTime(inscription.createdAt)}
            </div>
          </div>
          {!isEditingCurrentInscription && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark gap-2 self-start sm:self-auto"
              onClick={handleStartEdit}
              disabled={isLoadingState}
            >
              <Pencil className="h-4 w-4" />
              Editar Inscrição
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isEditingCurrentInscription ? (
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  control={form.control}
                  name="guestName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Responsável <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoadingState}
                          className="focus:border-riodavida focus:ring-riodavida/20 h-10"
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
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Email <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoadingState}
                          className="focus:border-riodavida focus:ring-riodavida/20 h-10"
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
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Telefone <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoadingState}
                          className="focus:border-riodavida focus:ring-riodavida/20 h-10"
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
                      <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                        Localidade <span className="text-destructive">*</span>
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

                <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="text-riodavida h-4 w-4" />
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

              <div className="border-riodavida/10 mt-6 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isLoadingState}
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-riodavida hover:bg-riodavida-dark w-full gap-2 text-white sm:w-auto"
                  disabled={isLoadingState}
                >
                  {isLoadingState ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <User className="text-riodavida h-4 w-4" />
                <span className="text-sm font-medium">Responsável</span>
              </div>
              <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-semibold">
                {inscription.guestName}
              </p>
            </div>

            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="text-riodavida h-4 w-4" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium break-all">
                {inscription.guestEmail}
              </p>
            </div>

            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <Phone className="text-riodavida h-4 w-4" />
                <span className="text-sm font-medium">Telefone</span>
              </div>
              <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                {inscription.phone}
              </p>
            </div>

            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="text-riodavida h-4 w-4" />
                <span className="text-sm font-medium">Localidade</span>
              </div>
              <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium uppercase">
                {inscription.locality?.name || 'N/ Definido'}
              </p>
            </div>

            <div className="bg-riodavida/5 border-riodavida/20 rounded-lg border p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="text-riodavida h-4 w-4" />
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
      </CardContent>
    </Card>
  );
}
