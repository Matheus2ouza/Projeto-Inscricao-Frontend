"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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
import { useAccount } from "../hooks/useAccount";

export type AccountOption = { label: string; value: string };

export type ComboboxAccountProps = {
  value: string[];
  onChange: (value: string[]) => void;
  options?: AccountOption[];
  loading?: boolean;
};

export function ComboboxAccount({
  value,
  onChange,
  options,
  loading: loadingProp,
}: ComboboxAccountProps) {
  const [open, setOpen] = React.useState(false);
  const shouldFetch = options === undefined;
  const {
    accounts: fetched,
    loading: internalLoading,
    error,
  } = useAccount(shouldFetch);
  const loading = loadingProp ?? internalLoading;

  // Preferência: props.options > API; fallback: []
  const accounts = React.useMemo<AccountOption[]>(() => {
    if (options) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((r) => ({
        label: r.username.toUpperCase(),
        value: r.id,
      }));
    }
    return [];
  }, [options, fetched]);

  const toggleSelection = (optionValue: string) => {
    const isSelected = value.includes(optionValue);
    if (isSelected) {
      onChange(value.filter((selected) => selected !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = React.useMemo(() => {
    if (!value || value.length === 0) return [];
    return value
      .map((selected) => accounts.find((r) => r.value === selected)?.label)
      .filter((label): label is string => Boolean(label));
  }, [value, accounts]);

  const buttonLabel = React.useMemo(() => {
    if (selectedLabels.length === 0) {
      if (loading) return "Carregando usuários...";
      if (accounts.length === 0) return "Nenhum usuário encontrado";
      return "Selecione um ou mais usuários...";
    }

    if (selectedLabels.length === 1) return selectedLabels[0];

    return selectedLabels.join(", ");
  }, [selectedLabels, loading, accounts.length]);

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
              value.length > 0
                ? "relative z-10 text-blue-700 dark:text-blue-300 font-semibold px-2 py-1"
                : "text-gray-700 dark:text-gray-200"
            }
          >
            {buttonLabel}
          </span>
          <ChevronsUpDown
            className={
              value.length > 0
                ? "relative z-10 text-blue-700 opacity-80"
                : "opacity-50"
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[180px] p-0">
        <Command>
          <CommandInput
            placeholder={
              loading ? "Carregando usuários..." : "Buscar usuário..."
            }
          />
          <CommandList>
            <CommandEmpty>
              {loading
                ? "Carregando..."
                : error
                  ? "Falha ao carregar usuários."
                  : "Nenhum usuário encontrado."}
            </CommandEmpty>
            {accounts.length > 0 && (
              <CommandGroup>
                {accounts.map((account) => (
                  <CommandItem
                    key={account.value}
                    value={account.value}
                    onSelect={(currentValue) => {
                      toggleSelection(currentValue);
                    }}
                  >
                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-semibold",
                        value.includes(account.value)
                          ? "ring-2 ring-blue-400"
                          : ""
                      )}
                    >
                      {account.label}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto",
                        value.includes(account.value)
                          ? "opacity-100"
                          : "opacity-0"
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
