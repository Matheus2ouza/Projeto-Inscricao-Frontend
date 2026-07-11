// features/events/components/manager/EventActionsHeader.tsx
'use client';

import { useFormEditEvent } from '@/features/events/hooks/manager/useFormEditEvent';
import { Event } from '@/features/events/types/manager/eventManagerTypes';
import { Button } from '@/shared/components/ui/button';
import { CreditCard, Edit3, Save, Trash2 } from 'lucide-react';

interface EventActionsHeaderProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventActionsHeader({
  event,
  onEdit,
  onDelete,
}: EventActionsHeaderProps) {
  const {
    isEditing,
    loading,
    handleSave,
    handleCancel,
    handleUpdatePayment,
    handleUpdateAllowCard,
    handleUpdateInscription,
    getNewResponsibleIds,
  } = useFormEditEvent(event);

  return (
    <div className="mb-8 flex items-center justify-end">
      <div className="flex items-center gap-3">
        {!isEditing ? (
          <>
            <Button
              variant={event.status === 'OPEN' ? 'destructive' : 'default'}
              onClick={() =>
                handleUpdateInscription(
                  event.status === 'OPEN' ? 'CLOSE' : 'OPEN',
                )
              }
              className="flex items-center gap-2"
              disabled={loading}
            >
              {event.status === 'OPEN'
                ? 'Fechar Inscrições'
                : 'Abrir Inscrições'}
            </Button>
            <Button
              variant={event.paymentEnebled ? 'destructive' : 'outline'}
              onClick={() => handleUpdatePayment(!event.paymentEnebled)}
              className="flex items-center gap-2"
              disabled={loading}
            >
              {event.paymentEnebled ? 'Fechar Pagamentos' : 'Abrir Pagamentos'}
            </Button>
            <Button
              variant={event.allowCard ? 'destructive' : 'outline'}
              onClick={() => handleUpdateAllowCard(!event.allowCard)}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <CreditCard className="h-4 w-4" />
              {event.allowCard ? 'Desabilitar Cartão' : 'Habilitar Cartão'}
            </Button>
            <Button
              variant="default"
              onClick={onEdit}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <Edit3 className="h-4 w-4" />
              Editar Evento
            </Button>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={onDelete}
              disabled={loading}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={handleCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button
              onClick={() => handleSave(getNewResponsibleIds())}
              className="flex items-center gap-2 dark:text-white"
              disabled={loading}
            >
              <Save className="h-4 w-4" />
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
