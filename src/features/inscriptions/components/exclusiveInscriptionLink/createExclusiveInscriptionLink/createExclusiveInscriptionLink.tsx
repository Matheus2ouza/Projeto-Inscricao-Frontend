'use client';

import { useCreateExclusiveInscriptionLink } from '@/features/inscriptions/hooks/exclusiveInscriptionLink/createExclusiveInscriptionLink/useCreateExclusiveInscriptionLink';
import { TableTypeInscriptionSelector } from '@/features/typeInscription/components/TableTypeInscriptionSelector';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Alert, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

export type CreateExclusiveInscriptionLinkProps = {
  eventId: string;
};

export function CreateExclusiveInscriptionLink({
  eventId,
}: CreateExclusiveInscriptionLinkProps) {
  const [name, setName] = React.useState('');
  const [typeInscriptionIds, setTypeInscriptionIds] = React.useState<string[]>(
    [],
  );
  const [expiresAt, setExpiresAt] = React.useState<Dayjs | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const { mutate: createLink, isPending } = useCreateExclusiveInscriptionLink();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (typeInscriptionIds.length === 0) {
      newErrors.typeInscriptionIds =
        'Selecione pelo menos um tipo de inscrição';
    }

    if (!expiresAt) {
      newErrors.expiresAt = 'Data de expiração é obrigatória';
    } else if (expiresAt.isBefore(dayjs(), 'day')) {
      newErrors.expiresAt = 'A data de expiração não pode ser no passado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    createLink({
      eventId,
      name: name.trim(),
      typeInscriptionIds,
      expiresAt: expiresAt!.toDate(),
    });
  };

  return (
    <div className="glass-surface space-y-8 rounded-lg p-8">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold">
          Nome do Link
        </Label>
        <Input
          id="name"
          placeholder="Ex: Link para alunos de informática"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: '' }));
            }
          }}
          disabled={isPending}
          className="glass-input"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      {/* Tipos de Inscrição */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          Tipos de Inscrição Permitidos
        </Label>
        {errors.typeInscriptionIds && (
          <Alert
            message={errors.typeInscriptionIds}
            type="error"
            showIcon
            className="mb-3"
          />
        )}
        <div className="glass-border rounded-lg border p-4">
          <TableTypeInscriptionSelector
            eventId={eventId}
            value={typeInscriptionIds}
            onChange={(ids) => {
              setTypeInscriptionIds(ids);
              if (errors.typeInscriptionIds) {
                setErrors((prev) => ({ ...prev, typeInscriptionIds: '' }));
              }
            }}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Data de Expiração */}
      <div className="space-y-2">
        <Label htmlFor="expiresAt" className="text-sm font-semibold">
          Data de Expiração
        </Label>
        <DatePicker
          id="expiresAt"
          value={expiresAt}
          onChange={setExpiresAt}
          disabled={isPending}
          placeholder="Selecione a data"
          className="w-full"
          disabledDate={(current) => {
            return current && current.isBefore(dayjs(), 'day');
          }}
        />
        {errors.expiresAt && (
          <p className="text-xs text-red-500">{errors.expiresAt}</p>
        )}
      </div>

      {/* Resumo */}
      {typeInscriptionIds.length > 0 && (
        <div className="glass-surface-strong space-y-2 rounded-lg p-4 text-sm">
          <p className="font-semibold">Resumo:</p>
          <ul className="text-muted-foreground list-inside list-disc space-y-1">
            <li>
              Nome:{' '}
              <span className="text-foreground font-medium">{name || '—'}</span>
            </li>
            <li>
              Tipos selecionados:{' '}
              <span className="text-foreground font-medium">
                {typeInscriptionIds.length}
              </span>
            </li>
            <li>
              Expira em:{' '}
              <span className="text-foreground font-medium">
                {expiresAt ? expiresAt.format('DD/MM/YYYY') : '—'}
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* Botões */}
      <div className="flex items-start justify-end gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="min-w-40"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando...
            </>
          ) : (
            'Criar Link'
          )}
        </Button>
      </div>
    </div>
  );
}
