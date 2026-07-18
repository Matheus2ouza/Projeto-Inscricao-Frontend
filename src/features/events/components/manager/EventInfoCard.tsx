'use client';

import { useUpdateEvent } from '@/features/events/hooks/manager/updateEvent/useUpdateEvent';
import { Event } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import EventMap from '@/shared/components/EventMap';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/components/ui/alert';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { AlertCircle, Calendar, MapPin, Pencil, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';

interface EventInfoCardProps {
  event: Event;
}

export function EventInfoCard({ event }: EventInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Hook para update do evento
  const {
    form,
    onSubmit,
    isLoading: isUpdatingEvent,
    isSuccess,
  } = useUpdateEvent(event);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getEventStatus = () => {
    const now = new Date();
    const start = new Date(event?.startDate || '');
    const end = new Date(event?.endDate || '');

    if (now >= start && now <= end) {
      return { label: 'Em Andamento', color: 'bg-blue-600' };
    }

    switch (event?.status) {
      case 'OPEN':
        return { label: 'Inscrições Abertas', color: 'bg-green-600' };
      case 'CLOSE':
        return { label: 'Inscrições Fechadas', color: 'bg-amber-600' };
      case 'FINALIZED':
        return { label: 'Finalizado', color: 'bg-red-600' };
      default:
        return { label: 'Status desconhecido', color: 'bg-gray-600' };
    }
  };

  const statusBadge = getEventStatus();

  // Efeito para fechar o estado de edição quando o salvamento for bem-sucedido
  useEffect(() => {
    if (isSuccess && isEditing) {
      setIsEditing(false);
    }
  }, [isSuccess, isEditing]);

  // Handler para salvar o evento
  const handleSave = async (e?: React.BaseSyntheticEvent) => {
    try {
      await onSubmit(e);
      // O efeito acima vai cuidar de fechar o estado de edição
      // quando isSuccess for true
    } catch (error) {
      // O erro já é tratado dentro do useUpdateEvent com toast
      // Mantém o estado de edição aberto para o usuário corrigir
      console.error('Erro ao salvar evento:', error);
    }
  };

  // Handler para cancelar edição
  const handleCancel = () => {
    form.reset({
      name: event.name,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
      location: event.location || undefined,
      longitude: event.longitude || undefined,
      latitude: event.latitude || undefined,
    });
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border border-gray-200/80 bg-white/95 p-6 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-white/5">
      {/* Header com título, badge e botões de ação */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Informações do Evento
          </h2>
          <Badge className={statusBadge.color + ' text-white'}>
            {statusBadge.label}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isUpdatingEvent}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={isUpdatingEvent}
                className="flex items-center gap-1"
              >
                {isUpdatingEvent ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Nome do Evento */}
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nome do Evento
              </label>
              {isEditing ? (
                <>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Nome do evento"
                    className="rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  {event.name}
                </p>
              )}
            </div>
          )}
        />

        {/* Datas e Horários */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Controller
            control={form.control}
            name="startDate"
            render={({ field, fieldState }) => (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Início
                </label>
                {isEditing ? (
                  <>
                    <Input
                      {...field}
                      id="startDate"
                      type="date"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date);
                      }}
                      className="rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.startDate)}</span>
                  </div>
                )}
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="endDate"
            render={({ field, fieldState }) => (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Data de Término
                </label>
                {isEditing ? (
                  <>
                    <Input
                      {...field}
                      id="endDate"
                      type="date"
                      value={
                        field.value instanceof Date
                          ? field.value.toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        field.onChange(date);
                      }}
                      className="rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(event.endDate)}</span>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Localização */}
        <Controller
          control={form.control}
          name="location"
          render={({ field, fieldState }) => (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Endereço
              </label>
              {isEditing ? (
                <>
                  <Input
                    {...field}
                    id="location"
                    placeholder="Localização do evento"
                    className="rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location || 'Local não definido'}</span>
                </div>
              )}
            </div>
          )}
        />

        {/* Latitude e Longitude */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="latitude"
            render={({ field, fieldState }) => (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Latitude
                </label>
                {isEditing ? (
                  <>
                    <Input
                      {...field}
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="Latitude"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : undefined;
                        field.onChange(value);
                      }}
                      className="rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <MapPin className="h-4 w-4" />
                    <span>{event.latitude ?? 'não definido'}</span>
                  </div>
                )}
              </div>
            )}
          />

          <Controller
            control={form.control}
            name="longitude"
            render={({ field, fieldState }) => (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Longitude
                </label>
                {isEditing ? (
                  <>
                    <Input
                      {...field}
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="Longitude"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : undefined;
                        field.onChange(value);
                      }}
                      className="rounded-xl border-gray-300 bg-white/50 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                    />
                    {fieldState.error && (
                      <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <MapPin className="h-4 w-4" />
                    <span>{event.longitude ?? 'não definido'}</span>
                  </div>
                )}
              </div>
            )}
          />
        </div>

        {/* Alerta de coordenadas */}
        {isEditing && (
          <Alert className="border-yellow-500/50 bg-yellow-50 text-yellow-600 dark:border-yellow-500/30 dark:bg-yellow-950/20 dark:text-yellow-400">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Alterar a latitude e longitude afetará a posição do marcador no
              mapa. Certifique-se de usar coordenadas válidas. Caso tenha
              dúvidas sobre como obter as coordenadas, consulte no site do{' '}
              <a
                href={
                  form.watch('location')
                    ? `https://www.google.com.br/maps/search/${encodeURIComponent(
                        form.watch('location') || '',
                      )}`
                    : 'https://www.google.com.br/maps'
                }
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium no-underline underline-offset-4 hover:underline"
              >
                Google Maps
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* Mapa */}
        {!isEditing &&
          event.latitude &&
          event.longitude &&
          (event.latitude !== 0 || event.longitude !== 0) && (
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
              <EventMap
                lat={event.latitude as number}
                lng={event.longitude as number}
                height="300px"
                markerTitle={event.name}
              />
            </div>
          )}
      </div>
    </div>
  );
}
