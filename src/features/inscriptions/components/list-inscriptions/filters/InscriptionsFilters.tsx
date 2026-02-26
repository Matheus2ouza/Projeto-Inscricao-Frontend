"use client";

import { InscriptionStatus } from "@/features/inscriptions/types/list-inscriptions/listInscriptionsTypes";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Separator } from "@/shared/components/ui/separator";
import { getConvertStatusInscription } from "@/shared/utils/getConvertStatus";
import { useEffect, useMemo, useState } from "react";

export type InscriptionsFiltersValue = {
  status: InscriptionStatus[];
  hideNotAllocated: boolean;
  orderBy: "asc" | "desc";
  limitTime: "all" | "1h" | "24h" | "7d" | "30d";
};

type InscriptionsFiltersProps = {
  value: InscriptionsFiltersValue;
  onApply: (value: InscriptionsFiltersValue) => void;
  onClear: () => void;
};

const DEFAULT_FILTERS: InscriptionsFiltersValue = {
  status: [],
  hideNotAllocated: false,
  orderBy: "asc",
  limitTime: "all",
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 p-0">
        <div className="space-y-5 p-6 md:border-r border-border">
          <h4 className="text-base font-semibold text-foreground">
            Filtrar por status
          </h4>
          <div className="space-y-3">
            <button
              type="button"
              className="flex items-center gap-3 text-left"
              onClick={() => setDraft((prev) => ({ ...prev, status: [] }))}
              aria-pressed={draft.status.length === 0}
            >
              <span className="relative h-4 w-4 shrink-0 rounded-full border border-input">
                {draft.status.length === 0 && (
                  <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                )}
              </span>
              <span className="text-sm font-medium text-foreground">Todas</span>
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                className="flex items-center gap-3 text-left"
                onClick={() => toggleStatus(status)}
                aria-pressed={isStatusSelected(status)}
              >
                <span className="relative h-4 w-4 shrink-0 rounded-full border border-input">
                  {isStatusSelected(status) && (
                    <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />
                  )}
                </span>
                <span className="text-sm text-foreground">
                  {getConvertStatusInscription(status)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5 p-6 md:border-r border-border">
          <h4 className="text-base font-semibold text-foreground">
            Filtrar por período
          </h4>
          <RadioGroup
            value={draft.limitTime}
            onValueChange={(next) =>
              setDraft((prev) => ({
                ...prev,
                limitTime: next as InscriptionsFiltersValue["limitTime"],
              }))
            }
          >
            {[
              { value: "all", label: "Todos" },
              { value: "1h", label: "Última 1h" },
              { value: "24h", label: "Últimas 24h" },
              { value: "7d", label: "Últimos 7 dias" },
              { value: "30d", label: "Últimos 30 dias" },
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
          <h4 className="text-base font-semibold text-foreground">
            Outras opções
          </h4>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-foreground">
                Ordernar por
              </div>
              <RadioGroup
                value={draft.orderBy}
                onValueChange={(next) =>
                  setDraft((prev) => ({
                    ...prev,
                    orderBy: next as InscriptionsFiltersValue["orderBy"],
                  }))
                }
              >
                {[
                  { value: "asc", label: "Do mais Antigo" },
                  { value: "desc", label: "Do mais Novo" },
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
