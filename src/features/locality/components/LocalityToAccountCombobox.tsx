'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useListLocalitiesToAccount } from '../hooks/listLocalitiesToAccount/useListLocalitiesToAccount';

interface LocalityToAccountComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function LocalityToAccountCombobox({
  value,
  onChange,
  placeholder = 'Selecione uma localidade',
  disabled = false,
}: LocalityToAccountComboboxProps) {
  const [open, setOpen] = useState(false);
  const { localities, loading } = useListLocalitiesToAccount();

  // Seleciona automaticamente quando apenas uma localidade for retornada
  useEffect(() => {
    if (!loading && localities.length === 1) {
      if (!value || value !== localities[0].id) {
        onChange(localities[0].id);
      }
    }
  }, [localities, loading, value, onChange]);

  const selectedLocality = value
    ? localities.find((locality) => locality.id === value)
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          type="button"
          className={cn(
            'border-glass bg-background/50 w-full justify-between backdrop-blur-sm',
            !value && 'text-muted-foreground',
          )}
          disabled={loading || disabled}
        >
          {loading
            ? 'Carregando...'
            : selectedLocality?.fullName || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-glass bg-background/95 w-[var(--radix-popover-trigger-width)] p-0 backdrop-blur-sm"
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command>
          <CommandList>
            <CommandEmpty>
              {loading ? 'Carregando...' : 'Nenhuma localidade encontrada.'}
            </CommandEmpty>
            <CommandGroup>
              {localities.map((locality) => (
                <CommandItem
                  key={locality.id}
                  value={locality.fullName}
                  onSelect={() => {
                    onChange(locality.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      locality.id === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {locality.fullName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
