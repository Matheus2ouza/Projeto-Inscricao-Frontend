"use client";

import { DatePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Check, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/components/ui/drawer";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Separator } from "@/shared/components/ui/separator";
import { Switch } from "@/shared/components/ui/switch";
import type {
  DownloadListInscriptionsPdfInput,
  InscriptionStatus,
  PaymentMethod,
  StatusPayment,
} from "../../../types/actions/reports/generateListInscriptionsPdfTypes";
import type { DownloadListInscriptionsXlsxInput } from "../../../types/actions/reports/generateListInscriptionsXlsxTypes";

type DatePreset = "1h" | "24h" | "7d" | null;

type ReportFilters = {
  participants: boolean;
  payment: boolean;
  includeNotAllocated: boolean;
  status: InscriptionStatus[];
  statusPayment: StatusPayment[];
  methodPayment: PaymentMethod[];
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

type SheetListInscriptionsProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onDownloadPdf: (
    input: DownloadListInscriptionsPdfInput,
  ) => Promise<{ fileBase64?: string; filename?: string; contentType?: string }>;
  onDownloadXlsx: (
    input: DownloadListInscriptionsXlsxInput,
  ) => Promise<{ fileBase64?: string; filename?: string; contentType?: string }>;
  generatingPdf?: boolean;
  generatingXlsx?: boolean;
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
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((s, index) => {
          const isActive = index === step;
          const isDone = index < step;

          return (
            <React.Fragment key={s.title}>
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {isDone ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={[
                    "text-sm",
                    isActive ? "font-medium" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {s.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="h-0.5 flex-1 mx-4 bg-muted" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex sm:hidden items-center justify-between text-sm font-medium">
        <span>{`Passo ${step + 1}: ${steps[step]?.title ?? ""}`}</span>
        <span className="text-muted-foreground">{`${step + 1}/${steps.length}`}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden sm:hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </>
  );
}

export default function SheetListInscriptions({
  open,
  onOpenChange,
  eventId,
  onDownloadPdf,
  onDownloadXlsx,
  generatingPdf = false,
  generatingXlsx = false,
}: SheetListInscriptionsProps) {
  const generating = generatingPdf || generatingXlsx;

  const baseFilters = React.useMemo<ReportFilters>(
    () => ({
      participants: false,
      payment: false,
      includeNotAllocated: true,
      status: [],
      statusPayment: [],
      methodPayment: [],
      startDate: null,
      endDate: null,
      datePreset: null,
    }),
    [],
  );

  const buildReportInput = React.useCallback(
    (filters: ReportFilters): DownloadListInscriptionsPdfInput => {
      const isGuest = filters.includeNotAllocated ? undefined : false;

      return {
        eventId,
        participants: filters.participants,
        payment: filters.payment,
        status: filters.status.length ? filters.status : undefined,
        statusPayment: filters.statusPayment.length
          ? filters.statusPayment
          : undefined,
        methodPayment: filters.methodPayment.length
          ? filters.methodPayment
          : undefined,
        isGuest,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      };
    },
    [eventId],
  );

  const options = React.useMemo<ExportOption[]>(
    () => [
      {
        id: "list-inscriptions-pdf",
        title: "Lista de inscrições (PDF)",
        description: "Exporta a lista de inscrições em PDF.",
        defaultFilters: baseFilters,
        onGenerate: async (filters) => {
          const result = await onDownloadPdf(buildReportInput(filters));
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
        id: "list-inscriptions-xlsx",
        title: "Lista de inscrições (Excel)",
        description: "Exporta a lista de inscrições em arquivo .xlsx.",
        defaultFilters: baseFilters,
        onGenerate: async (filters) => {
          const result = await onDownloadXlsx(buildReportInput(filters));
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
    [baseFilters, buildReportInput, onDownloadPdf, onDownloadXlsx],
  );

  const steps = React.useMemo(
    () => [{ title: "Selecionar relatório" }, { title: "Filtros" }],
    [],
  );

  const [step, setStep] = React.useState(0);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string>("");
  const [filtersByOption, setFiltersByOption] = React.useState<
    Record<string, ReportFilters>
  >({});

  const selectedOption = React.useMemo(() => {
    return options.find((o) => o.id === selectedOptionId) ?? options[0];
  }, [options, selectedOptionId]);

  const selectedFilters = React.useMemo(() => {
    const optionId = selectedOption?.id;
    if (!optionId) return baseFilters;

    return filtersByOption[optionId] ?? selectedOption.defaultFilters ?? baseFilters;
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

    const firstId = options[0]?.id ?? "";
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
      preset === "7d"
        ? now.subtract(7, "day")
        : preset === "24h"
          ? now.subtract(24, "hour")
          : now.subtract(1, "hour");

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

        <Separator />

        <div className="flex-1 overflow-auto p-4">
          {step === 0 ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">
                  Relatórios disponíveis
                </h3>
                <p className="text-sm text-muted-foreground">
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
                    className="flex items-start gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40"
                  >
                    <RadioGroupItem value={option.id} className="mt-1" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-none">
                        {option.title}
                      </div>
                      {option.description && (
                        <div className="mt-1 text-xs text-muted-foreground">
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
                <p className="text-sm text-muted-foreground">
                  Configure como deseja exportar o relatório selecionado.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">
                        Incluir participantes
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Inclui a lista de participantes dentro de cada inscrição.
                      </div>
                    </div>
                    <Switch
                      checked={selectedFilters.participants}
                      onCheckedChange={(checked) =>
                        setSelectedFilters({
                          ...selectedFilters,
                          participants: checked,
                        })
                      }
                      disabled={generating}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">
                        Incluir pagamentos
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Inclui informações de pagamento no relatório.
                      </div>
                    </div>
                    <Switch
                      checked={selectedFilters.payment}
                      onCheckedChange={(checked) =>
                        setSelectedFilters({ ...selectedFilters, payment: checked })
                      }
                      disabled={generating}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-sm font-medium">
                        Incluir inscrições não alocadas
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Inclui participantes marcados como N/ Alocado.
                      </div>
                    </div>
                    <Switch
                      checked={selectedFilters.includeNotAllocated}
                      onCheckedChange={(checked) =>
                        setSelectedFilters({
                          ...selectedFilters,
                          includeNotAllocated: checked,
                        })
                      }
                      disabled={generating}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-3 space-y-3">
                  <div className="text-sm font-medium">Status da inscrição</div>
                  <div className="grid gap-2">
                    {[
                      { label: "Pendente", value: "PENDING" as InscriptionStatus },
                      {
                        label: "Em análise",
                        value: "UNDER_REVIEW" as InscriptionStatus,
                      },
                      { label: "Pago", value: "PAID" as InscriptionStatus },
                      { label: "Expirado", value: "EXPIRED" as InscriptionStatus },
                      {
                        label: "Cancelado",
                        value: "CANCELLED" as InscriptionStatus,
                      },
                    ].map((item) => (
                      <Label
                        key={item.value}
                        className="flex items-center gap-2 text-sm font-normal"
                      >
                        <Checkbox
                          checked={selectedFilters.status.includes(item.value)}
                          onCheckedChange={(checked) =>
                            setSelectedFilters({
                              ...selectedFilters,
                              status: toggleArrayValue(
                                selectedFilters.status,
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

                <div className="rounded-lg border p-3 space-y-3">
                  <div className="text-sm font-medium">Status do pagamento</div>
                  <div className="grid gap-2">
                    {[
                      { label: "Aprovado", value: "APPROVED" as StatusPayment },
                      {
                        label: "Em análise",
                        value: "UNDER_REVIEW" as StatusPayment,
                      },
                      { label: "Recusado", value: "REFUSED" as StatusPayment },
                    ].map((item) => (
                      <Label
                        key={item.value}
                        className="flex items-center gap-2 text-sm font-normal"
                      >
                        <Checkbox
                          checked={selectedFilters.statusPayment.includes(
                            item.value,
                          )}
                          onCheckedChange={(checked) =>
                            setSelectedFilters({
                              ...selectedFilters,
                              statusPayment: toggleArrayValue(
                                selectedFilters.statusPayment,
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

                <div className="rounded-lg border p-3 space-y-3">
                  <div className="text-sm font-medium">Método de pagamento</div>
                  <div className="grid gap-2">
                    {[
                      { label: "Dinheiro", value: "DINHEIRO" as PaymentMethod },
                      { label: "PIX", value: "PIX" as PaymentMethod },
                      { label: "Cartão", value: "CARTAO" as PaymentMethod },
                    ].map((item) => (
                      <Label
                        key={item.value}
                        className="flex items-center gap-2 text-sm font-normal"
                      >
                        <Checkbox
                          checked={selectedFilters.methodPayment.includes(
                            item.value,
                          )}
                          onCheckedChange={(checked) =>
                            setSelectedFilters({
                              ...selectedFilters,
                              methodPayment: toggleArrayValue(
                                selectedFilters.methodPayment,
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

                <div className="rounded-lg border p-3 space-y-3">
                  <div className="text-sm font-medium">Período</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      showTime={{ format: "HH:mm" }}
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
                      showTime={{ format: "HH:mm" }}
                      format="DD/MM/YYYY HH:mm"
                      placeholder="Data/hora final"
                      allowClear
                      disabled={generating}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={selectedFilters.datePreset === "1h" ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyPreset("1h")}
                      disabled={generating}
                    >
                      Última 1h
                    </Button>
                    <Button
                      type="button"
                      variant={selectedFilters.datePreset === "24h" ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyPreset("24h")}
                      disabled={generating}
                    >
                      Últimas 24h
                    </Button>
                    <Button
                      type="button"
                      variant={selectedFilters.datePreset === "7d" ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyPreset("7d")}
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

        <Separator />

        <DrawerFooter className="flex-row justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 0 ? onOpenChange(false) : setStep(0))}
            disabled={generating}
          >
            {step === 0 ? "Cancelar" : "Voltar"}
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
            <Button type="button" onClick={handleGenerate} disabled={generating}>
              {generating ? "Gerando..." : "Gerar"}
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
