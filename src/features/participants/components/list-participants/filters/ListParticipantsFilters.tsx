'use client';

import {
  InscriptionsStatus,
  TypeInscription,
} from '@/features/participants/types/list-participants/listParticipantsTypes';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Separator } from '@/shared/components/ui/separator';
import { getConvertStatusInscription } from '@/shared/utils/getConvertStatus';
import { useEffect, useMemo, useState } from 'react';

export type ListParticipantsFiltersValue = {
  inscriptionStatus: InscriptionsStatus[];
  typeInscriptions: string[]; // Array de IDs
  orderByName: 'asc' | 'desc';
};

type ListParticipantsFiltersProps = {
  value: ListParticipantsFiltersValue;
  onApply: (value: ListParticipantsFiltersValue) => void;
  onClear: () => void;
  typeInscriptionsOptions?: TypeInscription[];
};

const DEFAULT_FILTERS: ListParticipantsFiltersValue = {
  inscriptionStatus: [],
  typeInscriptions: [],
  orderByName: 'asc',
};

export default function ListParticipantsFilters({
  value,
  onApply,
  onClear,
  typeInscriptionsOptions = [],
}: ListParticipantsFiltersProps) {
  const [draft, setDraft] = useState<ListParticipantsFiltersValue>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const statusOptions = useMemo(
    () => [
      InscriptionsStatus.PAID,
      InscriptionsStatus.PENDING,
      InscriptionsStatus.UNDER_REVIEW,
      InscriptionsStatus.EXPIRED,
      InscriptionsStatus.CANCELLED,
    ],
    [],
  );

  const isStatusSelected = (status: InscriptionsStatus) =>
    draft.inscriptionStatus.includes(status);

  const toggleStatus = (status: InscriptionsStatus) => {
    setDraft((prev) => {
      const next = new Set(prev.inscriptionStatus);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return { ...prev, inscriptionStatus: Array.from(next) };
    });
  };

  const isTypeSelected = (typeId: string) =>
    draft.typeInscriptions.includes(typeId);

  const toggleType = (typeId: string) => {
    setDraft((prev) => {
      const next = new Set(prev.typeInscriptions);
      if (next.has(typeId)) {
        next.delete(typeId);
      } else {
        next.add(typeId);
      }
      return { ...prev, typeInscriptions: Array.from(next) };
    });
  };

  const clearAllStatus = () => {
    setDraft((prev) => ({ ...prev, inscriptionStatus: [] }));
  };

  const clearAllTypes = () => {
    setDraft((prev) => ({ ...prev, typeInscriptions: [] }));
  };

  return (
    <div className="w-[980px] max-w-[calc(100vw-2rem)]">
      <div className="grid grid-cols-1 gap-0 p-0 md:grid-cols-3">
        {/* Status Filter */}
        <div className="border-border space-y-5 p-6 md:border-r">
          <h4 className="text-foreground text-base font-semibold">
            Filtrar por status
          </h4>
          <div className="space-y-3">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={clearAllStatus}
              aria-pressed={draft.inscriptionStatus.length === 0}
            >
              <span className="border-primary/55 bg-primary/20 relative h-4 w-4 shrink-0 rounded-full border">
                {draft.inscriptionStatus.length === 0 && (
                  <span className="bg-primary absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                )}
              </span>
              <span className="text-foreground text-sm font-medium">TODAS</span>
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                className="flex items-center gap-3 text-left"
                onClick={() => toggleStatus(status)}
                aria-pressed={isStatusSelected(status)}
              >
                <span className="border-primary/55 bg-primary/20 relative h-4 w-4 shrink-0 rounded-full border">
                  {isStatusSelected(status) && (
                    <span className="bg-primary absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  )}
                </span>
                <span className="text-foreground text-sm uppercase">
                  {getConvertStatusInscription(status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Type Inscriptions Filter */}
        <div className="border-border space-y-5 p-6 md:border-r">
          <h4 className="text-foreground text-base font-semibold">
            Filtrar por tipo de inscrição
          </h4>
          <div className="space-y-3">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={clearAllTypes}
              aria-pressed={draft.typeInscriptions.length === 0}
            >
              <span className="border-primary/55 bg-primary/20 relative h-4 w-4 shrink-0 rounded-full border">
                {draft.typeInscriptions.length === 0 && (
                  <span className="bg-primary absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                )}
              </span>
              <span className="text-foreground text-sm font-medium">TODOS</span>
            </button>
            {typeInscriptionsOptions.map((type) => (
              <button
                key={type.id}
                type="button"
                className="flex items-center gap-3 text-left"
                onClick={() => toggleType(type.id)}
                aria-pressed={isTypeSelected(type.id)}
              >
                <span className="border-primary/55 bg-primary/20 relative h-4 w-4 shrink-0 rounded-full border">
                  {isTypeSelected(type.id) && (
                    <span className="bg-primary absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  )}
                </span>
                <span className="text-foreground text-sm uppercase">
                  {type.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Order By Name */}
        <div className="space-y-5 p-6">
          <h4 className="text-foreground text-base font-semibold">
            Ordenar por nome
          </h4>

          <RadioGroup
            value={draft.orderByName}
            onValueChange={(next) =>
              setDraft((prev) => ({
                ...prev,
                orderByName: next as 'asc' | 'desc',
              }))
            }
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="asc" id="order-asc" />
              <Label htmlFor="order-asc" className="text-sm">
                A-Z
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <RadioGroupItem value="desc" id="order-desc" />
              <Label htmlFor="order-desc" className="text-sm">
                Z-A
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-3 p-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDraft(DEFAULT_FILTERS);
            onClear();
          }}
        >
          Limpar
        </Button>
        <Button type="button" onClick={() => onApply(draft)}>
          Aplicar
        </Button>
      </div>
    </div>
  );
}
