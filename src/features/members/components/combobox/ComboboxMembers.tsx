"use client";

import { useMember } from "@/features/members/hook/combobox/useMembers";
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

export type MemberOption = {
  label: string;
  value: string;
  role?: string;
};

export type ComboboxMemberProps = {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options?: MemberOption[];
  loading?: boolean;
  showRole?: boolean;
};

export function ComboboxMember({
  label,
  value,
  onChange,
  options,
  loading: loadingProp,
  showRole = true,
}: ComboboxMemberProps) {
  const [open, setOpen] = React.useState(false);
  const shouldFetch = true;
  const {
    members: fetched,
    loading: internalLoading,
    error,
  } = useMember(shouldFetch);
  const loading = loadingProp ?? internalLoading;

  // Busca sempre da API e monta opções
  const members = React.useMemo<MemberOption[]>(() => {
    if (fetched && fetched.length > 0) {
      return fetched.map((m) => ({
        label: m.name.toUpperCase(),
        value: m.id,
      }));
    }
    return [];
  }, [fetched]);

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
      .map((selected) => {
        const member = members.find((r) => r.value === selected);
        if (!member) return null;

        if (showRole && member.role) {
          return `${member.label} (${formatRole(member.role)})`;
        }
        return member.label;
      })
      .filter((label): label is string => Boolean(label));
  }, [value, members, showRole]);

  const buttonLabel = React.useMemo(() => {
    if (selectedLabels.length === 0) {
      if (loading) return "Carregando usuários...";
      if (members.length === 0) return "Nenhum usuário encontrado";
      return label ?? "Selecione um ou mais usuários...";
    }

    if (selectedLabels.length === 1) return selectedLabels[0];

    return selectedLabels.join(", ");
  }, [selectedLabels, loading, members.length, label]);

  // Função para formatar o role para exibição
  const formatRole = (role?: string) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

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
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0">
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
                  ? "Falha ao carregar membros."
                  : "Nenhum membro encontrado."}
            </CommandEmpty>
            {members.length > 0 && (
              <CommandGroup>
                {members.map((member) => (
                  <CommandItem
                    key={member.value}
                    value={member.value}
                    onSelect={() => {
                      toggleSelection(member.value);
                    }}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          value.includes(member.value)
                            ? "text-blue-600 dark:text-blue-400"
                            : ""
                        )}
                      >
                        {member.label}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-2 flex-shrink-0",
                        value.includes(member.value)
                          ? "opacity-100 text-blue-600"
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
