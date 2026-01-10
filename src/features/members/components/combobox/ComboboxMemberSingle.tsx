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
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export type MemberSingleOption = {
  label: string;
  value: string;
  birthDate?: Date;
  gender?: string;
};

export type ComboboxMemberSingleProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string, member?: MemberSingleOption) => void;
  loading?: boolean;
  className?: string;
  usePortal?: boolean; // Nova prop para controlar portal
};

export function ComboboxMemberSingle({
  id,
  label,
  value,
  onChange,
  loading: loadingProp,
  className,
  usePortal = true, // Por padrão usa portal (recomendado para dialogs)
}: ComboboxMemberSingleProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const shouldFetch = true;
  const {
    members: fetched,
    loading: internalLoading,
    error,
  } = useMember(shouldFetch);
  const loading = loadingProp ?? internalLoading;

  // Busca sempre da API e monta opções
  const allMembers = React.useMemo<MemberSingleOption[]>(() => {
    if (fetched && fetched.length > 0) {
      return fetched.map((m) => ({
        label: m.name.toUpperCase(),
        value: m.id,
        birthDate: m.birthDate,
        gender: m.gender,
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
    onChange(memberValue, member);
    setOpen(false);
    setSearchTerm(""); // Limpar busca após selecionar
  };

  // Função para lidar com a busca
  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  // Criar um componente de conteúdo com ou sem portal
  const CustomPopoverContent = React.useMemo(() => {
    if (!usePortal) {
      return PopoverContent;
    }

    // Componente com portal
    const PortalPopoverContent = React.forwardRef<
      React.ElementRef<typeof PopoverPrimitive.Content>,
      React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
    >((props, ref) => (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          {...props}
          className={cn(
            "w-[var(--radix-popover-trigger-width)] min-w-[240px] p-0 z-50",
            props.className
          )}
        />
      </PopoverPrimitive.Portal>
    ));

    PortalPopoverContent.displayName = "PortalPopoverContent";
    return PortalPopoverContent;
  }, [usePortal]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
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
      <CustomPopoverContent
        align="start"
        side="bottom"
        sideOffset={5}
        avoidCollisions={true}
        collisionPadding={16}
        style={{
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
                {filteredMembers.map((member) => (
                  <CommandItem
                    key={member.value}
                    value={member.label}
                    onSelect={() => handleSelect(member.value)}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          selectedMember?.value === member.value
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
                        selectedMember?.value === member.value
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
      </CustomPopoverContent>
    </Popover>
  );
}
