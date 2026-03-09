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
import React from "react";
import { CashRegisterStatus } from "../types/listCashRegisters";

export type CashRegisterStatusOption = {
  value: CashRegisterStatus;
  label: string;
};

export const CASH_REGISTER_STATUS_OPTIONS: CashRegisterStatusOption[] = [
  { value: CashRegisterStatus.OPEN, label: "Abertos" },
  { value: CashRegisterStatus.CLOSED, label: "Fechados" },
];

type CashRegisterStatusFilterProps = {
  options?: CashRegisterStatusOption[];
  value: CashRegisterStatus[];
  onChange: (value: CashRegisterStatus[]) => void;
  className?: string;
};

export default function CashRegisterStatusFilter({
  options = CASH_REGISTER_STATUS_OPTIONS,
  value,
  onChange,
  className,
}: CashRegisterStatusFilterProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  const displayText = selectedLabels.length > 0 ? selectedLabels.join(", ") : "";

  const toggleStatus = (statusValue: CashRegisterStatus) => {
    const isSelected = value.includes(statusValue);
    const nextSelection = isSelected
      ? value.filter((status) => status !== statusValue)
      : [...value, statusValue];

    onChange(nextSelection);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("min-w-[260px] justify-between", className)}
          type="button"
        >
          <div className="text-left">
            <p className="text-sm text-foreground truncate">
              {displayText || "Nenhum status selecionado"}
            </p>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhum status encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => toggleStatus(option.value)}
                  >
                    <span className="text-sm">{option.label}</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 text-blue-600 transition-opacity",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

