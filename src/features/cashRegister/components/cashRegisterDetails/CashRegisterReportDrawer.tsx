'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/components/ui/drawer';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Separator } from '@/shared/components/ui/separator';
import { Switch } from '@/shared/components/ui/switch';
import { Check, X } from 'lucide-react';
import * as React from 'react';
import type { generatePdfResponse } from '../../types/cashRegisterDetails/actions/generatePdfTypes';

const FILTER_BLOCK_CLASS =
  'rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur-md';

type CashRegisterReportDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  generatingReport: boolean;
  onGenerateReport: (params: {
    listExpenseCategory: boolean;
    moviments: boolean;
    favorite: boolean;
  }) => Promise<generatePdfResponse>;
};

type ReportOption = {
  id: string;
  title: string;
  description?: string;
  defaultFilters: {
    listExpenseCategory: boolean;
    moviments: boolean;
    favorite: boolean;
  };
  onGenerate: (filters: {
    listExpenseCategory: boolean;
    moviments: boolean;
    favorite: boolean;
  }) => Promise<boolean | void>;
};

function Stepper({
  step,
  steps,
}: {
  step: number;
  steps: { title: string }[];
}) {
  return (
    <>
      <div className="hidden items-center justify-between sm:flex">
        {steps.map((s, index) => {
          const isActive = index === step;
          const isDone = index < step;

          return (
            <React.Fragment key={s.title}>
              <div className="flex items-center gap-2">
                <div
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-muted text-muted-foreground',
                  ].join(' ')}
                >
                  {isDone ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={[
                    'text-sm',
                    isActive ? 'font-medium' : 'text-muted-foreground',
                  ].join(' ')}
                >
                  {s.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="bg-muted mx-4 h-0.5 flex-1" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm font-medium sm:hidden">
        <span>{`Passo ${step + 1}: ${steps[step]?.title ?? ''}`}</span>
        <span className="text-muted-foreground">{`${step + 1}/${
          steps.length
        }`}</span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full sm:hidden">
        <div
          className="bg-primary h-full transition-all duration-300 ease-in-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </>
  );
}

export default function CashRegisterReportDrawer({
  open,
  onOpenChange,
  generatingReport,
  onGenerateReport,
}: CashRegisterReportDrawerProps) {
  const steps = React.useMemo(
    () => [{ title: 'Selecionar relatório' }, { title: 'Filtros' }],
    [],
  );

  const [step, setStep] = React.useState(0);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string>('');

  const options = React.useMemo<ReportOption[]>(
    () => [
      {
        id: 'cash-register-report',
        title: 'Relatório do caixa (PDF)',
        description: 'Gera um PDF com os dados do caixa.',
        defaultFilters: {
          listExpenseCategory: false,
          moviments: false,
          favorite: false,
        },
        onGenerate: async (filters) => {
          await onGenerateReport(filters);
          return true;
        },
      },
    ],
    [onGenerateReport],
  );

  const [filtersByOption, setFiltersByOption] = React.useState<
    Record<
      string,
      { listExpenseCategory: boolean; moviments: boolean; favorite: boolean }
    >
  >({});

  React.useEffect(() => {
    if (!open) return;
    setStep(0);

    const firstId = options[0]?.id ?? '';
    setSelectedOptionId((prev) => prev || firstId);

    setFiltersByOption((prev) => {
      const next = { ...prev };
      for (const opt of options) {
        if (!next[opt.id]) {
          next[opt.id] = opt.defaultFilters;
        }
      }
      return next;
    });
  }, [open, options]);

  const selectedOption = React.useMemo(() => {
    return options.find((o) => o.id === selectedOptionId) ?? options[0];
  }, [options, selectedOptionId]);

  const selectedFilters = React.useMemo(() => {
    const optionId = selectedOption?.id;
    if (!optionId) {
      return { listExpenseCategory: false, moviments: false, favorite: false };
    }

    return filtersByOption[optionId] ?? selectedOption.defaultFilters;
  }, [filtersByOption, selectedOption]);

  const setSelectedFilters = React.useCallback(
    (next: {
      listExpenseCategory: boolean;
      moviments: boolean;
      favorite: boolean;
    }) => {
      const optionId = selectedOption?.id;
      if (!optionId) return;

      setFiltersByOption((prev) => ({ ...prev, [optionId]: next }));
    },
    [selectedOption?.id],
  );

  const canGoNext = Boolean(selectedOption?.id);

  const handleGenerate = async () => {
    if (!selectedOption) return;
    const shouldClose = await selectedOption.onGenerate(selectedFilters);
    if (shouldClose !== false) {
      onOpenChange(false);
    }
  };

  const renderFilters = ({
    filters,
    setFilters,
    disabled,
  }: {
    filters: {
      listExpenseCategory: boolean;
      moviments: boolean;
      favorite: boolean;
    };
    setFilters: (next: {
      listExpenseCategory: boolean;
      moviments: boolean;
      favorite: boolean;
    }) => void;
    disabled?: boolean;
  }) => (
    <div className="space-y-3">
      <div className={FILTER_BLOCK_CLASS}>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">
              Adicionar relatório de gastos
            </div>
            <div className="text-muted-foreground text-xs">
              Adiciona uma tabela listando os gastos por categoria.
            </div>
          </div>
          <Switch
            checked={filters.listExpenseCategory}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, listExpenseCategory: checked })
            }
            disabled={disabled}
          />
        </div>
      </div>

      <div className={FILTER_BLOCK_CLASS}>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Incluir movimentações</div>
            <div className="text-muted-foreground text-xs">
              Adiciona as movimentações do caixa ao relatório.
            </div>
          </div>
          <Switch
            checked={filters.moviments}
            onCheckedChange={(checked) => {
              setFilters({
                ...filters,
                moviments: checked,
                favorite: checked ? filters.favorite : false,
              });
            }}
            disabled={disabled}
          />
        </div>
      </div>

      <div className={FILTER_BLOCK_CLASS}>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Somente favoritas</div>
            <div className="text-muted-foreground text-xs">
              Inclui apenas as movimentações marcadas como favoritas.
            </div>
          </div>
          <Switch
            checked={filters.favorite}
            disabled={!filters.moviments || disabled}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, favorite: checked })
            }
          />
        </div>
        {!filters.moviments && (
          <p className="text-muted-foreground mt-3 text-xs">
            Ative "Incluir movimentações" para escolher somente favoritas.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full sm:max-w-lg">
        <DrawerHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DrawerTitle className="text-lg">Exportar relatório</DrawerTitle>
              <DrawerDescription className="mt-1">
                Selecione o modelo e configure os filtros antes de exportar.
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={generatingReport}
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>

          <Stepper step={step} steps={steps} />
        </DrawerHeader>

        <Separator className="bg-white/15" />

        <div className="flex-1 overflow-auto p-4">
          {step === 0 ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">
                  Relatórios disponíveis
                </h3>
                <p className="text-muted-foreground text-sm">
                  Escolha qual relatório deseja exportar.
                </p>
              </div>

              <RadioGroup
                value={selectedOptionId}
                onValueChange={setSelectedOptionId}
                className="gap-2"
              >
                {options.map((opt) => (
                  <Label
                    key={opt.id}
                    className="border-primary/20 bg-primary/5 hover:bg-primary/10 flex cursor-pointer items-start gap-3 rounded-lg border p-3 backdrop-blur-md transition-colors"
                  >
                    <RadioGroupItem value={opt.id} className="mt-1" />
                    <div className="min-w-0">
                      <div className="text-sm leading-none font-medium">
                        {opt.title}
                      </div>
                      {opt.description && (
                        <div className="text-muted-foreground mt-1 text-xs">
                          {opt.description}
                        </div>
                      )}
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">Filtros</h3>
                <p className="text-muted-foreground text-sm">
                  Configure como deseja exportar o relatório selecionado.
                </p>
              </div>

              {renderFilters({
                filters: selectedFilters,
                setFilters: setSelectedFilters,
                disabled: generatingReport,
              })}
            </div>
          )}
        </div>

        <Separator className="bg-white/15" />

        <DrawerFooter className="flex-row justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 0 ? onOpenChange(false) : setStep(0))}
            disabled={generatingReport}
          >
            {step === 0 ? 'Cancelar' : 'Voltar'}
          </Button>

          {step === 0 ? (
            <Button
              type="button"
              onClick={() => setStep(1)}
              disabled={!canGoNext || generatingReport}
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generatingReport}
            >
              {generatingReport ? 'Gerando...' : 'Gerar'}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
