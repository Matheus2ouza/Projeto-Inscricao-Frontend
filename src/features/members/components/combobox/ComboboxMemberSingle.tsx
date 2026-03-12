"use client";

import { useMember } from "@/features/members/hook/combobox/useMembers";
import { Member } from "@/features/members/types/combobox/membersComboboxType";
import type { AutoCompleteProps } from "antd";
import { AutoComplete, Space, Spin, Tag } from "antd";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export type MemberSingleOption = {
  label: string;
  value: string;
  registered: boolean;
  member?: Member;
};

export type ComboboxMemberSingleProps = {
  eventId: string;
  accountId?: string;
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string, member?: Member) => void;
  loading?: boolean;
  className?: string;
  disabledValues?: string[];
  placeholder?: string;
  onRefresh?: () => void;
  fetching?: boolean;
  onFetchingChange?: (fetching: boolean) => void;
};

export function ComboboxMemberSingle({
  eventId,
  accountId,
  id,
  label,
  value,
  onChange,
  loading: loadingProp,
  className,
  disabledValues = [],
  placeholder = "Buscar membro...",
  onRefresh,
  fetching: fetchingProp,
  onFetchingChange,
}: ComboboxMemberSingleProps) {
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  const toastShownRef = useRef(false);

  // Verificar se pode buscar membros (precisa de eventId e accountId)
  const canFetchMembers = Boolean(eventId && accountId);

  const {
    members: fetched,
    loading: internalLoading,
    fetching: internalFetching,
    error,
  } = useMember({
    eventId,
    accountId,
    autoFetch: canFetchMembers, // Só busca quando tem ambos
  });

  const loading = loadingProp ?? internalLoading;
  const fetching = fetchingProp ?? internalFetching;

  // Comunicar o estado de fetching para o componente pai
  useEffect(() => {
    if (onFetchingChange) {
      onFetchingChange(fetching);
    }
  }, [fetching, onFetchingChange]);

  // Mostrar toast quando não tem evento
  useEffect(() => {
    if (!eventId && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.warning("Selecione um evento primeiro", {
        description: "Escolha o evento antes de buscar membros",
      });
    }
  }, [eventId]);

  // Mostrar toast quando tem evento mas não tem conta
  useEffect(() => {
    if (eventId && !accountId && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.warning("Selecione uma conta primeiro", {
        description: "Escolha a conta antes de buscar membros",
      });
    }
  }, [eventId, accountId]);

  // Resetar o controle de toast quando ambos estão presentes
  useEffect(() => {
    if (eventId && accountId) {
      toastShownRef.current = false;
    }
  }, [eventId, accountId]);

  // Busca sempre da API e monta dados normalizados
  const normalizedMembers = useMemo(() => {
    if (fetched && fetched.length > 0) {
      return fetched.map((m) => ({
        id: m.id,
        name: m.name.toUpperCase(),
        nameLower: m.name.toLowerCase(),
        registered: m.registered || false,
        member: m,
      }));
    }
    return [];
  }, [fetched]);

  // Função para filtrar membros baseado no texto de busca - memoizada com useCallback
  const filterMembers = useCallback(
    (text: string) => {
      const query = text.trim().toLowerCase();

      // Se não houver query, mostra todos os membros (limitado a 50 para performance)
      const membersToShow = !query
        ? normalizedMembers.slice(0, 50)
        : normalizedMembers.filter((member) => {
            const matchesQuery = member.nameLower.includes(query);
            return matchesQuery;
          });

      const newOptions = membersToShow.map((member) => ({
        value: member.id,
        label: (
          <Space className="w-full justify-between">
            <Space>
              <span className={member.registered ? "text-gray-400" : ""}>
                {member.name}
              </span>
              {member.registered && (
                <Tag color="red" className="flex items-center gap-1 text-xs">
                  Já inscrito
                </Tag>
              )}
            </Space>
          </Space>
        ),
        disabled: member.registered || disabledValues.includes(member.id),
        member: member.member,
      }));

      setOptions(newOptions);
    },
    [normalizedMembers, disabledValues],
  );

  // Efeito para atualizar opções quando os dados mudam ou o searchText muda
  useEffect(() => {
    if (normalizedMembers.length > 0) {
      filterMembers(searchText);
    } else {
      setOptions((prev) => (prev?.length === 0 ? prev : []));
    }
  }, [normalizedMembers, searchText, filterMembers]);

  // Função para lidar com a busca em tempo real
  const handleSearch = (text: string) => {
    if (!canFetchMembers) return;
    setSearchText(text);
  };

  // Função para abrir/fechar dropdown
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !canFetchMembers) {
      if (!eventId) {
        toast.warning("Selecione um evento primeiro", {
          description: "Escolha o evento antes de buscar membros",
        });
      } else if (!accountId) {
        toast.warning("Selecione uma conta primeiro", {
          description: "Escolha a conta antes de buscar membros",
        });
      }
      return;
    }
    setOpen(isOpen);
  };

  return (
    <AutoComplete
      id={id}
      open={open && canFetchMembers}
      onOpenChange={handleOpenChange}
      placeholder={placeholder}
      value={searchText}
      onSearch={handleSearch}
      onSelect={(selectedValue, option) => {
        const member = (option as any)?.member;
        // Verificar se o membro selecionado não está registrado
        if (member?.registered) {
          return; // Não permite selecionar membros já registrados
        }
        onChange(selectedValue, member);
        const selectedMember = normalizedMembers.find(
          (m) => m.id === selectedValue,
        );
        setSearchText(selectedMember?.name || "");
        setOpen(false);
      }}
      onChange={(text) => {
        setSearchText(text);
        if (!text) {
          onChange("", undefined);
        }
      }}
      options={options || []}
      disabled={loading || !canFetchMembers}
      className={className}
      style={{ width: "100%" }}
      notFoundContent={
        error ? (
          <div className="text-center py-4">
            <p className="text-red-500">Falha ao carregar membros.</p>
          </div>
        ) : loading ? (
          <Spin size="small" />
        ) : !canFetchMembers ? (
          <div className="text-center py-4 text-gray-500">
            Selecione evento e conta para buscar membros
          </div>
        ) : normalizedMembers.length === 0 ? (
          "Nenhum membro encontrado"
        ) : options?.length === 0 && searchText.trim() ? (
          "Nenhum membro encontrado com esse nome"
        ) : (
          "Digite para filtrar membros..."
        )
      }
      allowClear
      filterOption={false}
    />
  );
}
