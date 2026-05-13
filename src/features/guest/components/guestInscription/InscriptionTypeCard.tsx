"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import { AlertCircle, Check, Info } from "lucide-react";
import { useState } from "react";

interface InscriptionType {
  id?: string;
  description: string;
  value: number;
  rule?: Date;
  specialType: boolean;
}

interface InscriptionTypeSelectorProps {
  types: InscriptionType[];
  selectedTypeId: string;
  onSelect: (typeId: string) => void;
  hasBirthDate: boolean;
  calculateMaxAge: (ruleDate?: Date) => string | number;
  formatCurrency?: (value: number) => string;
}

const defaultFormatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function InscriptionTypeSelector({
  types,
  selectedTypeId,
  onSelect,
  hasBirthDate,
  calculateMaxAge,
  formatCurrency = defaultFormatCurrency,
}: InscriptionTypeSelectorProps) {
  const [popoverOpen, setPopoverOpen] = useState<Record<string, boolean>>({});

  const isTypeSelectable = (type: InscriptionType) => {
    // Se não tem data de nascimento, não pode selecionar nenhum
    if (!hasBirthDate) return false;

    const birthDate = new Date(hasBirthDate as unknown as string);
    if (Number.isNaN(birthDate.getTime())) return false;

    // Se não tem regra de idade, pode selecionar
    if (!type.rule) return true;

    const ruleDate = new Date(type.rule as unknown as string);
    if (Number.isNaN(ruleDate.getTime())) return true;

    // Verifica se a idade é maior ou igual à regra
    return birthDate.getTime() >= ruleDate.getTime();
  };

  const getAvailableTypes = () => {
    // Se não tem data de nascimento, mostra todos mas desabilitados
    if (!hasBirthDate) return types;
    // Se tem data, filtra apenas os que podem ser selecionados
    return types.filter((type) => isTypeSelectable(type));
  };

  const getDescription = (type: InscriptionType) => {
    if (!type.rule) return "";

    return `Disponível para pessoas com idade máxima de ${calculateMaxAge(type.rule)} anos`;
  };

  // Cores sólidas para os cards - MOVIDO PARA ANTES DO USO
  const getCardStyles = (type: InscriptionType, isSelected: boolean) => {
    if (type.specialType) {
      return {
        border: "border-amber-500",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        selectedBg: "bg-amber-100 dark:bg-amber-900/60",
        ring: "ring-amber-500/50",
        text: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-500 text-white",
        iconDefaultBg:
          "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
        badge:
          "border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
        actionText: "text-amber-600 dark:text-amber-400",
      };
    }

    if (isSelected) {
      return {
        border: "border-blue-500",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        selectedBg: "bg-blue-100 dark:bg-blue-900/60",
        ring: "ring-blue-500/50",
        text: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-500 text-white",
        iconDefaultBg:
          "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
        badge:
          "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
        actionText: "text-blue-600 dark:text-blue-400",
      };
    }

    return {
      border: "border-gray-200 dark:border-gray-700",
      bg: "bg-white dark:bg-gray-800",
      selectedBg: "bg-gray-50 dark:bg-gray-750",
      ring: "ring-blue-500/50",
      text: "text-gray-600 dark:text-gray-400",
      iconBg: "bg-gray-500 text-white",
      iconDefaultBg:
        "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
      badge:
        "border-gray-300 bg-gray-50 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400",
      actionText: "text-gray-700 dark:text-gray-300",
    };
  };

  const availableTypes = getAvailableTypes();

  // Mensagem quando não tem data de nascimento
  if (!hasBirthDate) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((type, index) => {
          const typeId = type.id || type.description;
          const isSelected = selectedTypeId === typeId;
          const styles = getCardStyles(type, isSelected);
          const description = getDescription(type);

          return (
            <div
              key={typeId}
              className={cn(
                "relative flex flex-col rounded-xl border p-4 text-left",
                "opacity-60 cursor-not-allowed",
                // Cores
                styles.bg,
                styles.border,
                // Animação de entrada
                "animate-in fade-in slide-in-from-left duration-500",
              )}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {type.specialType && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-3 top-3 h-8 w-8 shrink-0 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Informações</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-80 p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-500">
                        <AlertCircle className="h-4 w-4" />
                        <h4 className="font-semibold text-sm">
                          Inscrição Especial
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Esta é uma inscrição marcada como{" "}
                        <strong>&quot;Especial&quot;</strong> e necessita de
                        aprovação. Após a inscrição, os organizadores analisarão
                        sua solicitação.
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Você receberá uma notificação quando sua inscrição for
                        aprovada.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              {/* Conteúdo */}
              <div className="flex flex-col gap-3">
                {/* Cabeçalho */}
                <div className="flex items-start gap-3 pr-10">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold",
                      isSelected
                        ? styles.iconBg
                        : type.specialType
                          ? "bg-amber-500 text-white"
                          : styles.iconDefaultBg,
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-base">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold leading-tight text-gray-900 dark:text-white truncate">
                        {type.description}
                      </h3>
                      {type.specialType && (
                        <Badge
                          variant="outline"
                          className={cn("text-xs", styles.badge)}
                        >
                          Especial
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Valor */}
                <div className="flex items-end justify-between gap-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Valor
                  </span>
                  <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {formatCurrency(type.value)}
                  </span>
                </div>

                {/* Descrição */}
                {description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {description}
                  </p>
                )}

                {/* Mensagem de bloqueio */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>Preencha a data de nascimento</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (availableTypes.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 animate-in fade-in slide-in-from-left-4 duration-300">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm">Nenhum tipo disponível para esta idade.</p>
      </div>
    );
  }

  const handlePopoverChange = (open: boolean, typeId: string) => {
    setPopoverOpen((prev) => ({ ...prev, [typeId]: open }));
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {availableTypes.map((type, index) => {
        const typeId = type.id || type.description;
        const isSelected = selectedTypeId === typeId;
        const isSelectable = isTypeSelectable(type);
        const styles = getCardStyles(type, isSelected);
        const description = getDescription(type);

        return (
          <div
            key={typeId}
            onClick={() => {
              if (isSelectable) {
                onSelect(typeId);
              }
            }}
            className={cn(
              "relative flex flex-col rounded-xl border p-4 text-left transition-all duration-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              // Animação de entrada
              "animate-in fade-in slide-in-from-left duration-500",
              // Cores
              styles.bg,
              styles.border,
              // Estado selecionado
              isSelected && [styles.selectedBg, `ring-2 ${styles.ring}`],
              // Desabilitado
              !isSelectable && "cursor-not-allowed opacity-50",
              // Interatividade
              isSelectable && "cursor-pointer",
            )}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
            role="button"
            tabIndex={isSelectable ? 0 : -1}
            onKeyDown={(e) => {
              if (isSelectable && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelect(typeId);
              }
            }}
          >
            {type.specialType && (
              <Popover
                open={popoverOpen[typeId]}
                onOpenChange={(open) => handlePopoverChange(open, typeId)}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-3 top-3 h-8 w-8 shrink-0 p-0 text-amber-500 hover:text-amber-600 hover:bg-amber-500/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="h-8 w-8" />
                    <span className="sr-only">Informações</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-amber-500">
                      <AlertCircle className="h-4 w-4" />
                      <h4 className="font-semibold text-sm">
                        Inscrição Especial
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Esta é uma inscrição marcada como{" "}
                      <strong>&quot;Especial&quot;</strong> e necessita de
                      aprovação. Após a inscrição, os organizadores analisarão
                      sua solicitação.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Você receberá uma notificação quando sua inscrição for
                      aprovada.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Conteúdo */}
            <div className="flex flex-col gap-3">
              {/* Cabeçalho */}
              <div className="flex items-start gap-3 pr-10">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold",
                    isSelected
                      ? styles.iconBg
                      : type.specialType
                        ? "bg-amber-500 text-white"
                        : styles.iconDefaultBg,
                  )}
                >
                  {isSelected ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-base">{index + 1}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold leading-tight text-gray-900 dark:text-white truncate">
                      {type.description}
                    </h3>
                    {type.specialType && (
                      <Badge
                        variant="outline"
                        className={cn("text-xs", styles.badge)}
                      >
                        Especial
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Valor */}
              <div className="flex items-end justify-between gap-4">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Valor
                </span>
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {formatCurrency(type.value)}
                </span>
              </div>

              {/* Descrição */}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}

              {/* Linha divisória e ação */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <div
                  className={cn(
                    "flex items-center justify-end gap-2 text-sm font-medium transition-colors",
                    isSelected
                      ? styles.actionText
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {isSelected ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Selecionado</span>
                    </>
                  ) : (
                    <span>Selecionar</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
