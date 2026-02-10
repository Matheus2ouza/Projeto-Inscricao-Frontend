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

export type EventStatusOption = {
  value: boolean;
  label: string;
};

export const EVENT_STATUS_OPTIONS: EventStatusOption[] = [
  { value: true, label: "Pagamentos Liberados" },
  { value: false, label: "Pagamentos Bloqueados" },
];

type EventStatusFilterProps = {
  options?: EventStatusOption[];
  value: boolean[];
  onChange: (value: boolean[]) => void;
  onClear?: () => void;
  className?: string;
};

export default function EventSPaymentStatusFilter({
  options = EVENT_STATUS_OPTIONS,
  value,
  onChange,
  onClear,
  className,
}: EventStatusFilterProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label);

  const cleanLabel = (label: string) =>
    label.replace(/^Pagamentos\s+/i, "").trim();

  const displayText =
    selectedLabels.length > 0
      ? selectedLabels.map((label) => cleanLabel(label)).join(", ")
      : "";

  const toggleStatus = (statusValue: boolean) => {
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
                const optionValueKey = option.value ? "true" : "false";
                return (
                  <CommandItem
                    key={optionValueKey}
                    value={optionValueKey}
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
          <div className="p-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={value.length === 0}
              onClick={() => {
                onClear?.();
                setOpen(false);
              }}
            >
              Limpar
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
