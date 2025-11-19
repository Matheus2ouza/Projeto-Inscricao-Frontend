"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { useTypeInscriptionsQuery } from "../hook/useTypeInscriptionsQuery";

export type TypeInscriptionOption = {
  label: string;
  value: string;
  description: string;
  price: number;
};

export type ComboboxTypeInscriptionProps = {
  eventId: string;
  value: string;
  onChange: (value: string) => void;
  options?: TypeInscriptionOption[];
  loading?: boolean;
};

export function ComboboxTypeInscription({
  eventId,
  value,
  onChange,
  options,
  loading: loadingProp,
}: ComboboxTypeInscriptionProps) {
  const [open, setOpen] = React.useState(false);
  const shouldFetch = options === undefined;
  const {
    data: fetched,
    isLoading: internalLoading,
    error,
  } = useTypeInscriptionsQuery(eventId, { enabled: shouldFetch });
  const loading = loadingProp ?? internalLoading;

  const typeInscriptions = React.useMemo<TypeInscriptionOption[]>(() => {
    if (options) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((t) => ({
        label: `${t.description} - R$ ${t.value.toFixed(2)}`,
        value: t.id,
        description: t.description,
        price: t.value,
      }));
    }
    return [];
  }, [options, fetched]);

  const selectedTypeInscription = React.useMemo(() => {
    return typeInscriptions.find((t) => t.value === value);
  }, [typeInscriptions, value]);

  const buttonLabel = React.useMemo(() => {
    if (loading) return "Carregando tipos...";
    if (typeInscriptions.length === 0) return "Nenhum tipo encontrado";
    if (selectedTypeInscription) {
      return selectedTypeInscription.label;
    }
    return "Selecione o tipo de inscrição";
  }, [selectedTypeInscription, loading, typeInscriptions.length]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between relative overflow-hidden"
        >
          <span
            className={
              value
                ? "relative z-10 text-blue-700 dark:text-blue-300 font-semibold px-2 py-1"
                : "text-gray-700 dark:text-gray-200"
            }
          >
            {buttonLabel}
          </span>
          <ChevronsUpDown
            className={
              value ? "relative z-10 text-blue-700 opacity-80" : "opacity-50"
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>
              {loading
                ? "Carregando..."
                : error
                  ? "Falha ao carregar tipos de inscrição."
                  : "Nenhum tipo encontrado."}
            </CommandEmpty>
            {typeInscriptions.length > 0 && (
              <CommandGroup>
                {typeInscriptions.map((type) => (
                  <CommandItem
                    key={type.value}
                    value={type.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-semibold",
                        value === type.value ? "ring-2 ring-blue-400" : ""
                      )}
                    >
                      {type.label}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === type.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
