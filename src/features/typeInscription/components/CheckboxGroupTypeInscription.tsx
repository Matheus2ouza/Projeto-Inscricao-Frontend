'use client';

import * as React from 'react';

import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { useTypeInscriptionsQuery } from '../hook/useTypeInscriptionsQuery';

export type CheckboxGroupTypeInscriptionItem = {
  id: string;
  description: string;
  price: number;
};

export type CheckboxGroupTypeInscriptionProps = {
  eventId: string;
  value: string[];
  onChange: (next: string[]) => void;
  options?: CheckboxGroupTypeInscriptionItem[];
  loading?: boolean;
  disabled?: boolean;
};

export function CheckboxGroupTypeInscription({
  eventId,
  value,
  onChange,
  options,
  loading: loadingProp,
  disabled = false,
}: CheckboxGroupTypeInscriptionProps) {
  const {
    data: fetched,
    isLoading: internalLoading,
    error,
  } = useTypeInscriptionsQuery(eventId);
  const loading = loadingProp ?? internalLoading;

  const typeInscriptions = React.useMemo<
    CheckboxGroupTypeInscriptionItem[]
  >(() => {
    if (options) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((t) => ({
        id: t.id,
        description: t.description,
        price: t.value,
      }));
    }
    return [];
  }, [options, fetched]);

  const handleToggle = (id: string, checked: boolean) => {
    if (disabled) return;
    const current = Array.isArray(value) ? value : [];
    const next = checked
      ? Array.from(new Set([...current, id]))
      : current.filter((v) => v !== id);
    onChange(next);
  };

  if (disabled) {
    return (
      <div className="text-muted-foreground text-sm">
        Selecione um evento primeiro.
      </div>
    );
  }

  if (error) {
    return <div className="text-sm text-red-500">Falha ao carregar tipos.</div>;
  }

  if (loading) {
    return <div className="text-muted-foreground text-sm">Carregando...</div>;
  }

  if (typeInscriptions.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        Nenhum tipo encontrado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {typeInscriptions.map((type) => {
        const checked = value?.includes(type.id) ?? false;
        return (
          <Label
            key={type.id}
            className="hover:bg-muted/40 flex cursor-pointer items-start gap-2 rounded-md p-2"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(ch) => handleToggle(type.id, Boolean(ch))}
              disabled={disabled}
              className="mt-0.5"
            />
            <div className="min-w-0">
              <div className="text-sm leading-none font-medium uppercase">
                {type.description}
              </div>
              <div className="text-muted-foreground mt-1 text-xs">
                R$ {type.price.toFixed(2)}
              </div>
            </div>
          </Label>
        );
      })}
    </div>
  );
}
