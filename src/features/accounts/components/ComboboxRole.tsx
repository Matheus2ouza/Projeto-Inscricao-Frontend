'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

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

type RoleOption = { label: string; value: string; color?: string };

type ComboboxRoleProps = {
  value: string;
  onChange: (value: string) => void;
  options?: RoleOption[];
};
// Função utilitária para gradientes inline
function getGradient(role: string | undefined) {
  switch (role) {
    case 'SUPER':
      return 'linear-gradient(to right, #a21caf, #ec4899)';
    case 'ADMIN':
      return 'linear-gradient(to right, #3b82f6, #06b6d4)';
    case 'MANAGER':
      return 'linear-gradient(to right, #22c55e, #a3e635)';
    case 'USER':
      return 'linear-gradient(to right, #9ca3af, #4b5563)';
    default:
      return undefined;
  }
}

export function ComboboxRole({ value, onChange, options }: ComboboxRoleProps) {
  const [open, setOpen] = React.useState(false);
  const roles = options || [
    {
      label: 'SUPER',
      value: 'SUPER',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    },
    {
      label: 'ADMIN',
      value: 'ADMIN',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    },
    {
      label: 'MANAGER',
      value: 'MANAGER',
      color: 'bg-gradient-to-r from-green-500 to-lime-400 text-white',
    },
    {
      label: 'USER',
      value: 'USER',
      color: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
    },
  ];

  // ...existing code...
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="relative w-full justify-between overflow-hidden"
        >
          {value ? (
            <span
              className="pointer-events-none absolute inset-0 z-0 rounded-md"
              style={{
                background: getGradient(
                  roles.find((r) => r.value === value)?.value,
                ),
              }}
            />
          ) : null}
          <span
            className={
              value
                ? 'relative z-10 px-2 py-1 font-semibold text-white'
                : 'text-gray-700 dark:text-gray-200'
            }
          >
            {value
              ? roles.find((r) => r.value === value)?.label
              : 'Selecione o papel...'}
          </span>
          <ChevronsUpDown
            className={
              value ? 'relative z-10 text-white opacity-80' : 'opacity-50'
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[180px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>Nenhum papel encontrado.</CommandEmpty>
            <CommandGroup>
              {roles.map((role) => (
                <CommandItem
                  key={role.value}
                  value={role.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <span
                    className={cn(
                      role.color,
                      'rounded px-2 py-1 text-xs font-semibold',
                      value === role.value ? 'ring-2 ring-pink-400' : '',
                    )}
                  >
                    {role.label}
                  </span>
                  <Check
                    className={cn(
                      'ml-auto',
                      value === role.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
