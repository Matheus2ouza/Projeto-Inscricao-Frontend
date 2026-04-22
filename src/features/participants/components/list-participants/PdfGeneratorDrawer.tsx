'use client';

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
import { Switch } from '@/shared/components/ui/switch';
import type {
  GenerateParticipantsByLocalityPdfResponse,
  ReportColumnPdf,
} from '../../api/actions/reports/generateListParticipantsByLocalityPdf';
import type {
  GenerateParticipantsByLocalityXlsxResponse,
  ReportColumnXlsx,
} from '../../api/actions/reports/generateListParticipantsByLocalityXlsx';

type ExportOption = {
  id: string;
  title: string;
  description?: string;
  defaultFilters?: Record<string, unknown>;
  renderFilters?: (params: {
    filters: Record<string, unknown>;
    setFilters: (next: Record<string, unknown>) => void;
    disabled?: boolean;
  }) => React.ReactNode;
  onGenerate: (filters: Record<string, unknown>) => Promise<boolean | void>;
};

type PdfGeneratorDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onGenerateParticipantsByLocalityPdf: (params: {
    separate: boolean;
    reduced: boolean;
    summary: boolean;
    columns?: ReportColumnPdf[];
  }) => Promise<GenerateParticipantsByLocalityPdfResponse>;
  onGenerateParticipantsByLocalityXlsx: (params: {
    separate: boolean;
    summary: boolean;
    columns?: ReportColumnXlsx[];
  }) => Promise<GenerateParticipantsByLocalityXlsxResponse>;

  generatingPdf?: boolean;
  generatingXlsx?: boolean;
  title?: string;
  description?: string;
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

export default function PdfGeneratorDrawer({
  open,
  onOpenChange,
  onGenerateParticipantsByLocalityPdf,
  onGenerateParticipantsByLocalityXlsx,
  generatingPdf = false,
  generatingXlsx = false,
  title = 'Exportar relatório',
  description = 'Selecione o modelo e configure os filtros antes de exportar.',
}: PdfGeneratorDrawerProps) {
  const generating = generatingPdf || generatingXlsx;

  const renderSeparateFilter = React.useCallback(
    ({
      filters,
      setFilters,
      disabled,
    }: {
      filters: Record<string, unknown>;
      setFilters: (next: Record<string, unknown>) => void;
      disabled?: boolean;
    }) => (
      <div className="rounded-lg border p-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Separar por localidade</div>
            <div className="text-muted-foreground text-xs">
              Gera um arquivo para cada localidade (zip).
            </div>
          </div>
          <Switch
            checked={Boolean(filters.separate)}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, separate: checked })
            }
            disabled={disabled}
          />
        </div>
      </div>
    ),
    [],
  );

  const renderSummaryFilter = React.useCallback(
    ({
      filters,
      setFilters,
      disabled,
    }: {
      filters: Record<string, unknown>;
      setFilters: (next: Record<string, unknown>) => void;
      disabled?: boolean;
    }) => (
      <div className="rounded-lg border p-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-medium">Incluir sumário</div>
            <div className="text-muted-foreground text-xs">
              Inclui um sumário no início do relatório com contagem de
              participantes por localidade.
            </div>
          </div>
          <Switch
            checked={Boolean(filters.summary)}
            onCheckedChange={(checked) =>
              setFilters({ ...filters, summary: checked })
            }
            disabled={disabled}
          />
        </div>
      </div>
    ),
    [],
  );

  const AVAILABLE_COLUMNS: Array<{
    id: ReportColumnPdf | ReportColumnXlsx;
    label: string;
  }> = [
    { id: 'name', label: 'Nome' },
    { id: 'preferredName', label: 'Nome preferencial' },
    { id: 'cpf', label: 'CPF' },
    { id: 'birthDate', label: 'Idade' },
    { id: 'gender', label: 'Gênero' },
    { id: 'shirtSize', label: 'Tamanho da camiseta' },
    { id: 'shirtType', label: 'Tipo de camiseta' },
    { id: 'typeInscription', label: 'Tipo de inscrição' },
  ];

  const renderColumnsFilter = React.useCallback(
    ({
      filters,
      setFilters,
      disabled,
    }: {
      filters: Record<string, unknown>;
      setFilters: (next: Record<string, unknown>) => void;
      disabled?: boolean;
    }) => (
      <div className="rounded-lg border p-3">
        <div className="mb-3 space-y-0.5">
          <div className="text-sm font-medium">Colunas a incluir</div>
          <div className="text-muted-foreground text-xs">
            Selecione quais dados deseja incluir no relatório.
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {AVAILABLE_COLUMNS.map((col) => (
            <Label
              key={col.id}
              className="hover:bg-muted/40 flex cursor-pointer items-center gap-2 rounded-md p-2"
            >
              <Checkbox
                checked={
                  (
                    filters.columns as
                      | (ReportColumnPdf | ReportColumnXlsx)[]
                      | undefined
                  )?.includes(col.id) ?? false
                }
                onCheckedChange={(checked) => {
                  const current =
                    (filters.columns as
                      | (ReportColumnPdf | ReportColumnXlsx)[]
                      | undefined) ?? [];
                  const next = checked
                    ? [...current, col.id]
                    : current.filter((c) => c !== col.id);
                  setFilters({ ...filters, columns: next });
                }}
                disabled={disabled}
              />
              <span className="text-sm">{col.label}</span>
            </Label>
          ))}
        </div>
      </div>
    ),
    [],
  );

  const renderPdfFilters = React.useCallback(
    ({
      filters,
      setFilters,
      disabled,
    }: {
      filters: Record<string, unknown>;
      setFilters: (next: Record<string, unknown>) => void;
      disabled?: boolean;
    }) => (
      <div className="space-y-3">
        {renderSeparateFilter({ filters, setFilters, disabled })}

        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Relatório reduzido</div>
              <div className="text-muted-foreground text-xs">
                Se ativado, gera uma versão mais compacta do PDF.
              </div>
            </div>
            <Switch
              checked={Boolean(filters.reduced)}
              onCheckedChange={(checked) =>
                setFilters({ ...filters, reduced: checked })
              }
              disabled={disabled}
            />
          </div>
        </div>

        {renderSummaryFilter({ filters, setFilters, disabled })}

        {renderColumnsFilter({ filters, setFilters, disabled })}
      </div>
    ),
    [renderSeparateFilter, renderSummaryFilter, renderColumnsFilter],
  );

  const renderXlsxFilters = React.useCallback(
    ({
      filters,
      setFilters,
      disabled,
    }: {
      filters: Record<string, unknown>;
      setFilters: (next: Record<string, unknown>) => void;
      disabled?: boolean;
    }) => (
      <div className="space-y-3">
        {renderSeparateFilter({ filters, setFilters, disabled })}

        {renderSummaryFilter({ filters, setFilters, disabled })}

        {renderColumnsFilter({ filters, setFilters, disabled })}
      </div>
    ),
    [renderSeparateFilter, renderSummaryFilter, renderColumnsFilter],
  );

  const options = React.useMemo<ExportOption[]>(
    () => [
      {
        id: 'participants-by-locality-pdf',
        title: 'Lista de participantes por localidade (PDF)',
        description:
          'Gera um PDF com a lista de participantes agrupada por localidade.',
        defaultFilters: {
          separate: false,
          reduced: false,
          summary: false,
          columns: [],
        },
        renderFilters: renderPdfFilters,
        onGenerate: async (filters) => {
          const result = await onGenerateParticipantsByLocalityPdf({
            separate: Boolean(filters.separate),
            reduced: Boolean(filters.reduced),
            summary: Boolean(filters.summary),
            columns:
              (filters.columns as
                | (ReportColumnPdf | ReportColumnXlsx)[]
                | undefined) || undefined,
          });

          if (
            !result?.fileBase64 ||
            !result?.filename ||
            !result?.contentType
          ) {
            return false;
          }
        },
      },
      {
        id: 'participants-by-locality-xlsx',
        title: 'Lista de participantes por localidade (Excel)',
        description:
          'Gera um Excel (.xlsx) com a lista de participantes agrupada por localidade.',
        defaultFilters: {
          separate: false,
          summary: false,
          columns: [],
        },
        renderFilters: renderXlsxFilters,
        onGenerate: async (filters) => {
          const result = await onGenerateParticipantsByLocalityXlsx({
            separate: Boolean(filters.separate),
            summary: Boolean(filters.summary),
            columns:
              (filters.columns as
                | (ReportColumnPdf | ReportColumnXlsx)[]
                | undefined) || undefined,
          });

          if (
            !result?.fileBase64 ||
            !result?.filename ||
            !result?.contentType
          ) {
            return false;
          }
        },
      },
    ],
    [
      onGenerateParticipantsByLocalityPdf,
      onGenerateParticipantsByLocalityXlsx,
      renderPdfFilters,
      renderXlsxFilters,
    ],
  );

  const steps = React.useMemo(
    () => [{ title: 'Selecionar relatório' }, { title: 'Filtros' }],
    [],
  );

  const [step, setStep] = React.useState(0);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string>(() => {
    return options[0]?.id ?? '';
  });
  const [filtersByOption, setFiltersByOption] = React.useState<
    Record<string, Record<string, unknown>>
  >({});

  const selectedOption = React.useMemo(() => {
    return options.find((o) => o.id === selectedOptionId) ?? options[0];
  }, [options, selectedOptionId]);

  const selectedFilters = React.useMemo(() => {
    const optionId = selectedOption?.id;
    if (!optionId) return {};

    return (
      filtersByOption[optionId] ??
      (selectedOption.defaultFilters as Record<string, unknown> | undefined) ??
      {}
    );
  }, [filtersByOption, selectedOption?.defaultFilters, selectedOption?.id]);

  const setSelectedFilters = React.useCallback(
    (next: Record<string, unknown>) => {
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
      for (const opt of options) {
        if (!next[opt.id]) {
          next[opt.id] =
            (opt.defaultFilters as Record<string, unknown> | undefined) ?? {};
        }
      }
      return next;
    });
  }, [open, options]);

  const canGoNext = Boolean(selectedOption?.id);

  const handleGenerate = async () => {
    if (!selectedOption) return;
    const shouldClose = await selectedOption.onGenerate(selectedFilters);
    if (shouldClose !== false) {
      onOpenChange(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full sm:max-w-lg">
        <DrawerHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DrawerTitle className="text-lg">{title}</DrawerTitle>
              <DrawerDescription className="mt-1">
                {description}
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

        <Separator />

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
                    className="hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-lg border p-3"
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

              {selectedOption?.renderFilters ? (
                selectedOption.renderFilters({
                  filters: selectedFilters,
                  setFilters: setSelectedFilters,
                  disabled: generating,
                })
              ) : (
                <div className="text-muted-foreground rounded-lg border p-3 text-sm">
                  Este modelo não possui filtros.
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

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
