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

export type MemberSingleOption = {
  label: string;
  value: string;
  birthDate?: Date;
  gender?: string;
  registered?: boolean;
};

export type ComboboxMemberSingleProps = {
  eventId: string;
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string, member?: MemberSingleOption) => void;
  loading?: boolean;
  className?: string;
  modal?: boolean;
  disabledValues?: string[];
};

export function ComboboxMemberSingle({
  eventId,
  id,
  label,
  value,
  onChange,
  loading: loadingProp,
  className,
  modal = true,
  disabledValues = [],
}: ComboboxMemberSingleProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const shouldFetch = true;
  const {
    members: fetched,
    loading: internalLoading,
    error,
  } = useMember(eventId, shouldFetch);
  const loading = loadingProp ?? internalLoading;

  // Busca sempre da API e monta opções
  const allMembers = React.useMemo<MemberSingleOption[]>(() => {
    if (fetched && fetched.length > 0) {
      return fetched.map((m) => ({
        label: m.name.toUpperCase(),
        value: m.id,
        birthDate: m.birthDate,
        gender: m.gender,
        registered: m.registered,
      }));
    }
    return [];
  }, [fetched]);

  // Filtrar membros pelo termo de busca (nome)
  const filteredMembers = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return allMembers;
    }
    const term = searchTerm.toLowerCase().trim();
    return allMembers.filter((member) =>
      member.label.toLowerCase().includes(term)
    );
  }, [allMembers, searchTerm]);

  const selectedMember = React.useMemo(() => {
    if (!value) return null;
    return allMembers.find((m) => m.value === value);
  }, [value, allMembers]);

  const buttonLabel = React.useMemo(() => {
    if (!selectedMember) {
      if (loading) return "Carregando membros...";
      if (allMembers.length === 0) return "Nenhum membro encontrado";
      return label ?? "Selecione um membro...";
    }

    return selectedMember.label;
  }, [selectedMember, loading, allMembers.length, label]);

  const handleSelect = (memberValue: string) => {
    const member = allMembers.find((m) => m.value === memberValue);
    if (member?.registered || disabledValues.includes(memberValue)) {
      return;
    }
    onChange(memberValue, member);
    setOpen(false);
    setSearchTerm(""); // Limpar busca após selecionar
  };

  // Função para lidar com a busca
  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between relative overflow-hidden",
            className
          )}
        >
          <span
            className={
              selectedMember
                ? "relative z-10 text-blue-700 dark:text-blue-300 font-semibold px-2 py-1"
                : "text-gray-700 dark:text-gray-200"
            }
          >
            {buttonLabel}
          </span>
          <ChevronsUpDown
            className={
              selectedMember
                ? "relative z-10 text-blue-700 opacity-80"
                : "opacity-50"
            }
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={5}
        avoidCollisions={true}
        collisionPadding={16}
        className="w-[--radix-popover-trigger-width] p-0"
        style={{
          width: "var(--radix-popover-trigger-width)",
          maxHeight: "300px",
          overflow: "hidden",
        }}
      >
        <Command shouldFilter={false}>
          {" "}
          {/* Desativa filtro automático */}
          <CommandInput
            placeholder={
              loading ? "Carregando membros..." : "Buscar pelo nome..."
            }
            value={searchTerm}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>
              {loading
                ? "Carregando..."
                : error
                  ? "Falha ao carregar membros."
                  : "Nenhum membro encontrado com esse nome."}
            </CommandEmpty>
            {filteredMembers.length > 0 && (
              <CommandGroup className="max-h-[250px] overflow-y-auto">
                {filteredMembers.map((member) => {
                  const isSelected = selectedMember?.value === member.value;
                  const isRegistered = Boolean(member.registered);
                  const isDisabled = disabledValues.includes(member.value);

                  return (
                    <CommandItem
                      key={member.value}
                      value={member.label}
                      onSelect={() => handleSelect(member.value)}
                      disabled={isRegistered || isDisabled}
                    >
                      <div className="flex flex-1 min-w-0 items-center justify-start gap-5">
                        <span
                          className={cn(
                            "text-sm font-semibold truncate",
                            isSelected
                              ? "text-blue-600 dark:text-blue-400"
                              : "",
                            (isRegistered || isDisabled) &&
                              "text-gray-400 dark:text-gray-500"
                          )}
                        >
                          {member.label}
                        </span>
                        {isRegistered && (
                          <span className="text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                            já inscrito
                          </span>
                        )}
                        {isDisabled && !isRegistered && (
                          <span className="text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-100 text-green-600 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                            selecionado
                          </span>
                        )}
                      </div>
                      <Check
                        className={cn(
                          "ml-2 flex-shrink-0",
                          isSelected ? "opacity-100 text-blue-600" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
