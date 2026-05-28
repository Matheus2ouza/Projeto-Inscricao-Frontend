'use client';

import { InscriptionStatus } from '@/features/inscriptions/types/listInscriptions/listInscriptionsTypes';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Separator } from '@/shared/components/ui/separator';
import { getConvertStatusInscription } from '@/shared/utils/getConvertStatus';
import { useEffect, useMemo, useState } from 'react';

export type InscriptionsFiltersValue = {
  status: InscriptionStatus[];
  hideNotAllocated: boolean;
  orderByCreatedAt: 'asc' | 'desc';
  orderByResponsible: 'asc' | 'desc';
  period: 'all' | '1h' | '24h' | '7d' | '30d';
};

type InscriptionsFiltersProps = {
  value: InscriptionsFiltersValue;
  onApply: (value: InscriptionsFiltersValue) => void;
  onClear: () => void;
};

const DEFAULT_FILTERS: InscriptionsFiltersValue = {
  status: [],
  hideNotAllocated: false,
  orderByCreatedAt: 'asc',
  orderByResponsible: 'asc',
  period: 'all',
};

export default function InscriptionsFilters({
  value,
  onApply,
  onClear,
}: InscriptionsFiltersProps) {
  const [draft, setDraft] = useState<InscriptionsFiltersValue>(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const statusOptions = useMemo(
    () => [
      InscriptionStatus.PAID,
      InscriptionStatus.PENDING,
      InscriptionStatus.UNDER_REVIEW,
      InscriptionStatus.EXPIRED,
      InscriptionStatus.CANCELLED,
    ],
    [],
  );

  const isStatusSelected = (status: InscriptionStatus) =>
    draft.status.includes(status);

  const toggleStatus = (status: InscriptionStatus) => {
    setDraft((prev) => {
      const next = new Set(prev.status);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return { ...prev, status: Array.from(next) };
    });
  };

  return (
    <div className="w-[980px] max-w-[calc(100vw-2rem)]">
      <div className="grid grid-cols-1 gap-0 p-0 md:grid-cols-3">
        <div className="border-border space-y-5 p-6 md:border-r">
          <h4 className="text-foreground text-base font-semibold">
            Filtrar por status
          </h4>
          <div className="space-y-3">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={() => setDraft((prev) => ({ ...prev, status: [] }))}
              aria-pressed={draft.status.length === 0}
            >
              <span className="border-primary/55 bg-primary/20 relative h-4 w-4 shrink-0 rounded-full border">
                {draft.status.length === 0 && (
                  <span className="bg-primary absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                )}
              </span>
              <span className="text-foreground text-sm font-medium">Todas</span>
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
                <span className="text-foreground text-sm">
                  {getConvertStatusInscription(status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-border space-y-5 p-6 md:border-r">
          <h4 className="text-foreground text-base font-semibold">
            Filtrar por período
          </h4>
          <RadioGroup
            value={draft.period}
            onValueChange={(next) =>
              setDraft((prev) => ({
                ...prev,
                period: next as InscriptionsFiltersValue['period'],
              }))
            }
          >
            {[
              { value: 'all', label: 'Todos' },
              { value: '1h', label: 'Última 1h' },
              { value: '24h', label: 'Últimas 24h' },
              { value: '7d', label: 'Últimos 7 dias' },
              { value: '30d', label: 'Últimos 30 dias' },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center gap-3">
                <RadioGroupItem value={opt.value} id={`limit-${opt.value}`} />
                <Label htmlFor={`limit-${opt.value}`} className="text-sm">
                  {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-5 p-6">
          <h4 className="text-foreground text-base font-semibold">
            Outras opções
          </h4>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-foreground text-sm font-semibold">
                Ordenar por data
              </div>
              <RadioGroup
                value={draft.orderByCreatedAt}
                onValueChange={(next) =>
                  setDraft((prev) => ({
                    ...prev,
                    orderByCreatedAt:
                      next as InscriptionsFiltersValue['orderByCreatedAt'],
                  }))
                }
              >
                {[
                  { value: 'asc', label: 'Do mais Antigo' },
                  { value: 'desc', label: 'Do mais Novo' },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-3">
                    <RadioGroupItem
                      value={opt.value}
                      id={`order-${opt.value}`}
                    />
                    <Label htmlFor={`order-${opt.value}`} className="text-sm">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="text-foreground text-sm font-semibold">
                Ordenar responsável
              </div>
              <RadioGroup
                value={draft.orderByResponsible}
                onValueChange={(next) =>
                  setDraft((prev) => ({
                    ...prev,
                    orderByResponsible:
                      next as InscriptionsFiltersValue['orderByResponsible'],
                  }))
                }
              >
                {[
                  { value: 'asc', label: 'A-Z' },
                  { value: 'desc', label: 'Z-A' },
                ].map((opt) => (
                  <div key={opt.value} className="flex items-center gap-3">
                    <RadioGroupItem
                      value={opt.value}
                      id={`responsible-${opt.value}`}
                    />
                    <Label
                      htmlFor={`responsible-${opt.value}`}
                      className="text-sm"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                checked={draft.hideNotAllocated}
                onCheckedChange={(checked) =>
                  setDraft((prev) => ({ ...prev, hideNotAllocated: !!checked }))
                }
                id="hide-guests"
              />
              <Label htmlFor="hide-guests" className="text-sm">
                Ocultar inscrições não alocadas
              </Label>
            </div>
          </div>
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
