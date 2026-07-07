'use client';

import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Check, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
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

import type {
  CategoryExpense,
  GenerateListeExpensesPdfInput,
  PaymentMethod,
} from '../../../types/actions/reports/generateListeExpensesPdfTypes';

type DatePreset = '1h' | '24h' | '7d' | null;

type ReportFilters = {
  categories: CategoryExpense[];
  paymentMethods: PaymentMethod[];
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  datePreset: DatePreset;
};

type ExportOption = {
  id: string;
  title: string;
  description?: string;
  defaultFilters?: ReportFilters;
  onGenerate: (filters: ReportFilters) => Promise<boolean | void>;
};

type SheetListExpensesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onGeneratePdf: (input: GenerateListeExpensesPdfInput) => Promise<void>; // Alterado para void
  generating?: boolean;
};

const FILTER_BLOCK_CLASS =
  'rounded-lg border border-primary/20 bg-primary/5 p-3 backdrop-blur-md';

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
        <span className="text-muted-foreground">{`${step + 1}/${steps.length}`}</span>
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

export default function SheetListExpenses({
  open,
  onOpenChange,
  eventId,
  onGeneratePdf,
  generating = false,
}: SheetListExpensesProps) {
  const baseFilters = React.useMemo<ReportFilters>(
    () => ({
      categories: [],
      paymentMethods: [],
      startDate: null,
      endDate: null,
      datePreset: null,
    }),
    [],
  );

  const buildReportInput = React.useCallback(
    (filters: ReportFilters): GenerateListeExpensesPdfInput => {
      return {
        eventId,
        category:
          filters.categories.length > 0 ? filters.categories : undefined,
        paymentMethod:
          filters.paymentMethods.length > 0
            ? filters.paymentMethods
            : undefined,
        startCreatedAt: filters.startDate?.toISOString(),
        endCreatedAt: filters.endDate?.toISOString(),
      };
    },
    [eventId],
  );

  const options = React.useMemo<ExportOption[]>(
    () => [
      {
        id: 'expenses-pdf',
        title: 'Relatório de gastos (PDF)',
        description:
          'Exporta a lista de gastos do evento com filtros opcionais.',
        defaultFilters: baseFilters,
        onGenerate: async (filters) => {
          // Apenas chama a função, o download é feito pelo hook
          await onGeneratePdf(buildReportInput(filters));
          return true; // Fecha o drawer após gerar
        },
      },
    ],
    [baseFilters, buildReportInput, onGeneratePdf],
  );

  const steps = React.useMemo(
    () => [{ title: 'Selecionar relatório' }, { title: 'Filtros' }],
    [],
  );

  const [step, setStep] = React.useState(0);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string>('');
  const [filtersByOption, setFiltersByOption] = React.useState<
    Record<string, ReportFilters>
  >({});

  const selectedOption = React.useMemo(() => {
    return options.find((o) => o.id === selectedOptionId) ?? options[0];
  }, [options, selectedOptionId]);

  const selectedFilters = React.useMemo(() => {
    const optionId = selectedOption?.id;
    if (!optionId) return baseFilters;

    return (
      filtersByOption[optionId] ?? selectedOption.defaultFilters ?? baseFilters
    );
  }, [baseFilters, filtersByOption, selectedOption]);

  const setSelectedFilters = React.useCallback(
    (next: ReportFilters) => {
      const optionId = selectedOption?.id;
      if (!optionId) return;

      setFiltersByOption((prev) => ({ ...prev, [optionId]: next }));
    },
    [selectedOption?.id],
  );

  React.useEffect(() => {
    if (!open) return;

    setStep(0);

    const firstId = options[0]?.id ?? '';
    setSelectedOptionId((prev) => prev || firstId);

    setFiltersByOption((prev) => {
      const next = { ...prev };
      for (const option of options) {
        if (!next[option.id]) {
          next[option.id] = option.defaultFilters ?? baseFilters;
        }
      }
      return next;
    });
  }, [baseFilters, open, options]);

  const toggleArrayValue = <T extends string>(
    current: T[],
    value: T,
    checked: boolean,
  ) => {
    if (checked) {
      if (current.includes(value)) return current;
      return [...current, value];
    }
    return current.filter((item) => item !== value);
  };

  const applyPreset = (preset: Exclude<DatePreset, null>) => {
    const now = dayjs();
    const start =
      preset === '7d'
        ? now.subtract(7, 'day')
        : preset === '24h'
          ? now.subtract(24, 'hour')
          : now.subtract(1, 'hour');

    setSelectedFilters({
      ...selectedFilters,
      datePreset: preset,
      startDate: start,
      endDate: now,
    });
  };

  const handleGenerate = async () => {
    if (!selectedOption) return;

    const shouldClose = await selectedOption.onGenerate(selectedFilters);
    if (shouldClose !== false) {
      onOpenChange(false);
    }
  };

  const canGoNext = Boolean(selectedOption?.id);

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
                disabled={generating}
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
                {options.map((option) => (
                  <Label
                    key={option.id}
                    className="border-primary/20 bg-primary/5 hover:bg-primary/10 flex cursor-pointer items-start gap-3 rounded-lg border p-3 backdrop-blur-md transition-colors"
                  >
                    <RadioGroupItem value={option.id} className="mt-1" />
                    <div className="min-w-0">
                      <div className="text-sm leading-none font-medium">
                        {option.title}
                      </div>
                      {option.description && (
                        <div className="text-muted-foreground mt-1 text-xs">
                          {option.description}
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

              <div className="space-y-3">
                {/* Categorias */}
                <div className={`space-y-3 ${FILTER_BLOCK_CLASS}`}>
                  <div className="text-sm font-medium">Categorias</div>
                  <div className="grid gap-2">
                    {[
                      { label: 'Brindes', value: 'BRINDES' as CategoryExpense },
                      { label: 'Cozinha', value: 'COZINHA' as CategoryExpense },
                      {
                        label: 'Decoração',
                        value: 'DECORACAO' as CategoryExpense,
                      },
                      {
                        label: 'Decoração Estação',
                        value: 'DECORACAO_ESTACAO' as CategoryExpense,
                      },
                      {
                        label: 'Decoração Comperadores',
                        value: 'DECORACAO_COMPERADORES' as CategoryExpense,
                      },
                      { label: 'Mídia', value: 'MIDIA' as CategoryExpense },
                      { label: 'Som', value: 'SOM' as CategoryExpense },
                      {
                        label: 'Manutenção',
                        value: 'MANUTENCAO' as CategoryExpense,
                      },
                      {
                        label: 'Segurança',
                        value: 'SEGURANCA' as CategoryExpense,
                      },
                      { label: 'Outros', value: 'OUTROS' as CategoryExpense },
                    ].map((item) => (
                      <Label
                        key={item.value}
                        className="hover:bg-primary/10 flex items-center gap-2 rounded-md p-1 text-sm font-normal transition-colors"
                      >
                        <Checkbox
                          className="border-foreground/35 bg-background"
                          checked={selectedFilters.categories.includes(
                            item.value,
                          )}
                          onCheckedChange={(checked) =>
                            setSelectedFilters({
                              ...selectedFilters,
                              categories: toggleArrayValue(
                                selectedFilters.categories,
                                item.value,
                                Boolean(checked),
                              ),
                            })
                          }
                          disabled={generating}
                        />
                        {item.label}
                      </Label>
                    ))}
                  </div>
                </div>

                {/* Métodos de pagamento */}
                <div className={`space-y-3 ${FILTER_BLOCK_CLASS}`}>
                  <div className="text-sm font-medium">Método de pagamento</div>
                  <div className="grid gap-2">
                    {[
                      { label: 'Dinheiro', value: 'DINHEIRO' as PaymentMethod },
                      { label: 'PIX', value: 'PIX' as PaymentMethod },
                      { label: 'Cartão', value: 'CARTAO' as PaymentMethod },
                    ].map((item) => (
                      <Label
                        key={item.value}
                        className="hover:bg-primary/10 flex items-center gap-2 rounded-md p-1 text-sm font-normal transition-colors"
                      >
                        <Checkbox
                          className="border-foreground/35 bg-background"
                          checked={selectedFilters.paymentMethods.includes(
                            item.value,
                          )}
                          onCheckedChange={(checked) =>
                            setSelectedFilters({
                              ...selectedFilters,
                              paymentMethods: toggleArrayValue(
                                selectedFilters.paymentMethods,
                                item.value,
                                Boolean(checked),
                              ),
                            })
                          }
                          disabled={generating}
                        />
                        {item.label}
                      </Label>
                    ))}
                  </div>
                </div>

                {/* Período */}
                <div className={`space-y-3 ${FILTER_BLOCK_CLASS}`}>
                  <div className="text-sm font-medium">Período</div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <DatePicker
                      className="w-full"
                      value={selectedFilters.startDate}
                      onChange={(value) =>
                        setSelectedFilters({
                          ...selectedFilters,
                          datePreset: null,
                          startDate: value,
                        })
                      }
                      showTime={{ format: 'HH:mm' }}
                      format="DD/MM/YYYY HH:mm"
                      placeholder="Data/hora inicial"
                      allowClear
                      disabled={generating}
                    />
                    <DatePicker
                      className="w-full"
                      value={selectedFilters.endDate}
                      onChange={(value) =>
                        setSelectedFilters({
                          ...selectedFilters,
                          datePreset: null,
                          endDate: value,
                        })
                      }
                      showTime={{ format: 'HH:mm' }}
                      format="DD/MM/YYYY HH:mm"
                      placeholder="Data/hora final"
                      allowClear
                      disabled={generating}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={
                        selectedFilters.datePreset === '1h'
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => applyPreset('1h')}
                      disabled={generating}
                    >
                      Última 1h
                    </Button>
                    <Button
                      type="button"
                      variant={
                        selectedFilters.datePreset === '24h'
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => applyPreset('24h')}
                      disabled={generating}
                    >
                      Últimas 24h
                    </Button>
                    <Button
                      type="button"
                      variant={
                        selectedFilters.datePreset === '7d'
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => applyPreset('7d')}
                      disabled={generating}
                    >
                      Últimos 7 dias
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-white/15" />

        <DrawerFooter className="flex-row justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 0 ? onOpenChange(false) : setStep(0))}
            disabled={generating}
          >
            {step === 0 ? 'Cancelar' : 'Voltar'}
          </Button>

          {step === 0 ? (
            <Button
              type="button"
              onClick={() => setStep(1)}
              disabled={!canGoNext || generating}
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Gerando...' : 'Gerar'}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
