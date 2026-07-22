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

// Função utilitária para gradientes inline com cores Riodavida
function getGradient(role: string | undefined) {
  switch (role) {
    case 'SUPER':
      return 'linear-gradient(135deg, #2E8F8A, #3FB5AE)'; // Teal escuro -> Turquesa
    case 'ADMIN':
      return 'linear-gradient(135deg, #8AA02E, #A8BE3C)'; // Oliva escuro -> Verde-oliva
    case 'MANAGER':
      return 'linear-gradient(135deg, #5FCFC7, #C4D766)'; // Teal claro -> Oliva claro
    case 'USER':
      return 'linear-gradient(135deg, #6B7280, #9CA3AF)'; // Cinza
    default:
      return undefined;
  }
}

// Função para obter cores baseadas no role
function getRoleColors(role: string) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    SUPER: {
      bg: 'bg-riodavida/20 dark:bg-riodavida/30',
      text: 'text-riodavida dark:text-riodavida-light',
      border: 'border-riodavida/30 dark:border-riodavida/20',
    },
    ADMIN: {
      bg: 'bg-riodavida-secondary/20 dark:bg-riodavida-secondary/30',
      text: 'text-riodavida-secondary dark:text-riodavida-muted-light',
      border:
        'border-riodavida-secondary/30 dark:border-riodavida-secondary/20',
    },
    MANAGER: {
      bg: 'bg-riodavida-light/20 dark:bg-riodavida-light/30',
      text: 'text-riodavida-light dark:text-riodavida-light',
      border: 'border-riodavida-light/30 dark:border-riodavida-light/20',
    },
    USER: {
      bg: 'bg-gray-500/20 dark:bg-gray-500/30',
      text: 'text-gray-600 dark:text-gray-400',
      border: 'border-gray-500/30 dark:border-gray-500/20',
    },
  };
  return colors[role] || colors.USER;
}

export function ComboboxRole({ value, onChange, options }: ComboboxRoleProps) {
  const [open, setOpen] = React.useState(false);
  const roles = options || [
    {
      label: 'SUPER',
      value: 'SUPER',
    },
    {
      label: 'ADMIN',
      value: 'ADMIN',
    },
    {
      label: 'MANAGER',
      value: 'MANAGER',
    },
    {
      label: 'USER',
      value: 'USER',
    },
  ];

  const selectedRole = roles.find((r) => r.value === value);
  const roleColors = selectedRole
    ? getRoleColors(selectedRole.value)
    : getRoleColors('USER');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="border-riodavida/20 hover:border-riodavida/30 relative w-full justify-between overflow-hidden"
        >
          {value ? (
            <span
              className="pointer-events-none absolute inset-0 z-0 rounded-md opacity-10"
              style={{
                background: getGradient(selectedRole?.value),
              }}
            />
          ) : null}
          <span
            className={cn(
              'relative z-10',
              value
                ? cn('px-2 py-1 font-semibold', roleColors.text)
                : 'text-riodavida-gray-dark dark:text-riodavida-gray',
            )}
          >
            {value ? selectedRole?.label : 'Selecione o papel...'}
          </span>
          <ChevronsUpDown
            className={cn(
              'relative z-10 h-4 w-4 shrink-0 opacity-50',
              value
                ? roleColors.text
                : 'text-riodavida-gray-dark dark:text-riodavida-gray',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-riodavida/20 w-[var(--radix-popover-trigger-width)] min-w-[180px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty className="text-riodavida-gray-dark dark:text-riodavida-gray py-2 text-center text-sm">
              Nenhum papel encontrado.
            </CommandEmpty>
            <CommandGroup>
              {roles.map((role) => {
                const colors = getRoleColors(role.value);
                return (
                  <CommandItem
                    key={role.value}
                    value={role.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                    className="hover:bg-riodavida/5 dark:hover:bg-riodavida/10 cursor-pointer"
                  >
                    <span
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-semibold',
                        colors.bg,
                        colors.text,
                        colors.border,
                        'border',
                        value === role.value ? 'ring-riodavida ring-2' : '',
                      )}
                    >
                      {role.label}
                    </span>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        value === role.value
                          ? 'text-riodavida opacity-100'
                          : 'opacity-0',
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
