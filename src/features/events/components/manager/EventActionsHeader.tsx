// features/events/components/manager/EventActionsHeader.tsx (versão melhorada)
'use client';

import { useFormEditEvent } from '@/features/events/hooks/manager/useFormEditEvent';
import { Event } from '@/features/events/types/manager/eventDetailsManager/eventDetailsManagerTypes';
import { Separator } from '@/shared/components/ui';
import { Button } from '@/shared/components/ui/button';
import { Trash2 } from 'lucide-react';

interface EventActionsHeaderProps {
  event: Event;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void; // Nova prop para cancelar a edição
  onSave: () => void; // Nova prop para salvar e sair da edição
  onDelete: () => void;
}

export function EventActionsHeader({
  event,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: EventActionsHeaderProps) {
  const {
    loading,
    handleCancel,
    handleUpdatePayment,
    handleUpdateAllowCard,
    handleUpdateInscription,
    getNewResponsibleIds,
  } = useFormEditEvent(event);

  const handleSaveAndClose = async () => {
    onSave(); // Notifica o pai que salvou e sai do modo de edição
  };

  const handleCancelAndClose = () => {
    handleCancel();
    onCancel(); // Notifica o pai que cancelou e sai do modo de edição
  };

  return (
    <div className="mb-8 flex items-center justify-end">
      <div className="flex items-center gap-3">
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
            {event.status === 'OPEN' ? 'Fechar Inscrições' : 'Abrir Inscrições'}
          </Button>
          <Separator orientation={'vertical'} />
          <Button
            variant={event.paymentEnebled ? 'destructive' : 'outline'}
            onClick={() => handleUpdatePayment(!event.paymentEnebled)}
            className="flex items-center gap-2"
            disabled={loading}
          >
            {event.paymentEnebled ? 'Fechar Pagamentos' : 'Abrir Pagamentos'}
          </Button>
          <Separator orientation={'vertical'} />
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4" />
            Excluir Evento
          </Button>
        </>
      </div>
    </div>
  );
}
