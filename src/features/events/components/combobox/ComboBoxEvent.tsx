"use client";

import { useEventsCombobox } from "@/features/events/hooks/combobox/useEventsCombobox";
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

export type EventOption = { label: string; value: string };

export type ComboboxEventProps = {
  value: string;
  onChange: (value: string) => void;
  options?: EventOption[];
};

export function ComboboxEvent({
  value,
  onChange,
  options,
}: ComboboxEventProps) {
  const [open, setOpen] = React.useState(false);
  const { events: fetched, loading, error } = useEventsCombobox();

  // Preferência: props.options > API; fallback: []
  const events = React.useMemo<EventOption[]>(() => {
    if (options && options.length > 0) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((e) => ({
        label: e.name.toUpperCase(),
        value: e.id,
      }));
    }
    return [];
  }, [fetched]);

  // Função para truncar texto muito longo
  const truncateText = (text: string, maxLength: number = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const selectedEvent = events.find((event) => event.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between relative overflow-hidden min-w-[200px] max-w-[300px]"
        >
          <span
            className={cn(
              "truncate text-left flex-1",
              value
                ? "text-blue-700 dark:text-blue-300 font-semibold"
                : "text-gray-700 dark:text-gray-200"
            )}
            title={selectedEvent?.label ?? "Selecione o evento..."} // Tooltip com texto completo
          >
            {value
              ? truncateText(selectedEvent?.label ?? "") ||
                "Selecione o evento..."
              : loading
                ? "Carregando eventos..."
                : events.length === 0
                  ? "Nenhum evento encontrado"
                  : "Selecione o evento..."}
          </span>
          <ChevronsUpDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-50",
              value ? "text-blue-700" : ""
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] min-w-[240px] max-w-[400px] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            autoFocus={false}
            placeholder={
              loading ? "Carregando eventos..." : "Buscar eventos..."
            }
          />
          <CommandList>
            <CommandEmpty>
              {loading
                ? "Carregando..."
                : error
                  ? "Falha ao carregar os eventos."
                  : "Nenhum evento encontrado."}
            </CommandEmpty>
            {events.length > 0 && (
              <CommandGroup>
                {events.map((event) => (
                  <CommandItem
                    key={event.value}
                    value={event.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <span
                      className="flex-1"
                      title={event.label} // Tooltip com texto completo
                    >
                      {event.label}
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4 ml-2 shrink-0",
                        value === event.value ? "opacity-100" : "opacity-0"
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
