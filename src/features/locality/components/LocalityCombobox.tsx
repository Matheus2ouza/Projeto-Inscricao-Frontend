'use client';

import { useListLocalities } from '@/features/locality/hooks/listLocalities/useListLocalities';
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
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface LocalityComboboxProps {
  eventId: string;
  form: UseFormReturn<any>;
  name: string;
  placeholder?: string;
  glassSurfaceClass?: string;
  disabled?: boolean;
}

export function LocalityCombobox({
  eventId,
  form,
  name,
  placeholder = 'Selecione uma localidade',
  disabled = false,
}: LocalityComboboxProps) {
  const [open, setOpen] = useState(false);
  const { localities, loading } = useListLocalities({ eventId });

  // Monitora o valor do campo para debug
  const fieldValue = form.watch(name);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Encontra a localidade selecionada
        const selectedLocality = field.value
          ? localities.find((locality) => locality.id === field.value)
          : null;

        return (
          <FormItem className="flex flex-col">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    type="button"
                    className={cn(
                      'border-glass bg-background/50 w-full justify-between backdrop-blur-sm',
                      !field.value && 'text-muted-foreground',
                    )}
                    disabled={loading || disabled}
                  >
                    {loading
                      ? 'Carregando...'
                      : selectedLocality?.fullName || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="border-glass bg-background/95 w-[var(--radix-popover-trigger-width)] p-0 backdrop-blur-sm"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command>
                  <CommandList>
                    <CommandEmpty>
                      {loading
                        ? 'Carregando...'
                        : 'Nenhuma localidade encontrada.'}
                    </CommandEmpty>
                    <CommandGroup>
                      {localities.map((locality) => (
                        <CommandItem
                          key={locality.id}
                          value={locality.fullName}
                          onSelect={() => {
                            field.onChange(locality.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              locality.id === field.value
                                ? 'opacity-100'
                                : 'opacity-0',
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
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
