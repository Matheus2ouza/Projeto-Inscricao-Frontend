'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Calendar, Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

export type PeriodOption = {
  label: string;
  value: string;
  description?: string;
};

const defaultPeriods: PeriodOption[] = [
  {
    label: 'Todos os períodos',
    value: 'all',
    description: 'Mostrar todas as inscrições',
  },
  {
    label: 'Última Hora',
    value: '1h',
    description: 'Inscrições da última hora',
  },
  {
    label: 'Últimas 24 horas',
    value: '24h',
    description: 'Inscrições das últimas 24 horas',
  },
  {
    label: 'Últimos 7 dias',
    value: '7d',
    description: 'Inscrições dos últimos 7 dias',
  },
  {
    label: 'Últimos 30 dias',
    value: '30d',
    description: 'Inscrições dos últimos 30 dias',
  },
];

export type ComboboxPeriodProps = {
  value: string;
  onChange: (value: string) => void;
  options?: PeriodOption[];
  placeholder?: string;
};

export function ComboboxPeriod({
  value,
  onChange,
  options = defaultPeriods,
  placeholder = 'Selecione o período...',
}: ComboboxPeriodProps) {
  const [open, setOpen] = React.useState(false);

  const selectedPeriod = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="relative w-full min-w-[200px] justify-between overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 opacity-70" />
            <span
              className={cn(
                value
                  ? 'font-semibold text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-200',
              )}
            >
              {selectedPeriod?.label || placeholder}
            </span>
          </div>
          <ChevronsUpDown
            className={cn(
              'h-4 w-4 opacity-50',
              value ? 'text-blue-700 opacity-80' : 'opacity-50',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Buscar período..." />
          <CommandList>
            <CommandEmpty>Nenhum período encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((period) => (
                <CommandItem
                  key={period.value}
                  value={period.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="flex flex-col items-start py-3"
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={cn(
                        'font-medium',
                        value === period.value
                          ? 'text-blue-600 dark:text-blue-400'
                          : '',
                      )}
                    >
                      {period.label}
                    </span>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value === period.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </div>
                  {period.description && (
                    <p className="text-muted-foreground mt-1 text-left text-xs">
                      {period.description}
                    </p>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
