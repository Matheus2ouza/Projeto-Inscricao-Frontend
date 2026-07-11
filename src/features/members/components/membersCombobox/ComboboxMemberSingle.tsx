'use client';

import { useMember } from '@/features/members/hook/combobox/useMembers';
import { Member } from '@/features/members/types/membersCombobox/membersComboboxTypes';
import type { AutoCompleteProps } from 'antd';
import { AutoComplete, Space, Spin, Tag } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export type MemberSingleOption = {
  label: string;
  value: string;
  registered: boolean;
  member?: Member;
};

export type ComboboxMemberSingleProps = {
  eventId: string;
  accountId?: string;
  requireAccountId?: boolean;
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string, member?: MemberSingleOption) => void;
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
  requireAccountId = false,
  id,
  label,
  onChange,
  loading: loadingProp,
  className,
  disabledValues = [],
  placeholder = 'Buscar membro...',
  onRefresh,
  fetching: fetchingProp,
  onFetchingChange,
}: ComboboxMemberSingleProps) {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const toastShownRef = useRef(false);

  // Verificar se pode buscar membros (precisa de eventId e accountId)
  const canFetchMembers = requireAccountId
    ? Boolean(eventId && accountId)
    : Boolean(eventId);

  const {
    members: fetched,
    loading: internalLoading,
    fetching: internalFetching,
    error,
  } = useMember({
    eventId,
    accountId,
    autoFetch: canFetchMembers,
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
      toast.warning('Selecione um evento primeiro', {
        description: 'Escolha o evento antes de buscar membros',
      });
    }
  }, [eventId]);

  useEffect(() => {
    if (requireAccountId && eventId && !accountId && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.warning('Selecione uma conta primeiro', {
        description: 'Escolha a conta antes de buscar membros',
      });
    }
  }, [eventId, accountId, requireAccountId]);

  // Resetar o controle de toast quando ambos estão presentes
  useEffect(() => {
    const shouldReset = requireAccountId
      ? Boolean(eventId && accountId)
      : Boolean(eventId);
    if (shouldReset) toastShownRef.current = false;
  }, [eventId, accountId, requireAccountId]);

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

  // Calcular options baseado no searchText e normalizedMembers
  const options = useMemo<AutoCompleteProps['options']>(() => {
    if (normalizedMembers.length === 0) {
      return [];
    }

    const query = searchText.trim().toLowerCase();

    // Se não houver query, mostra todos os membros (limitado a 50 para performance)
    const membersToShow = !query
      ? normalizedMembers.slice(0, 50)
      : normalizedMembers.filter((member) => {
          const matchesQuery = member.nameLower.includes(query);
          return matchesQuery;
        });

    return membersToShow.map((member) => ({
      value: member.id,
      label: (
        <Space className="w-full justify-between">
          <Space>
            <span className={member.registered ? 'text-gray-400' : ''}>
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
  }, [normalizedMembers, searchText, disabledValues]);

  // Função para lidar com a busca em tempo real
  const handleSearch = (text: string) => {
    if (!canFetchMembers) return;
    setSearchText(text);
  };

  // Função para abrir/fechar dropdown
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !canFetchMembers) {
      if (!eventId) {
        toast.warning('Selecione um evento primeiro', {
          description: 'Escolha o evento antes de buscar membros',
        });
      } else if (requireAccountId && !accountId) {
        toast.warning('Selecione uma conta primeiro', {
          description: 'Escolha a conta antes de buscar membros',
        });
      }
      return;
    }
    setOpen(isOpen);
  };

  // Lidar com a seleção de um membro

  const handleSelect = (selectedValue: string, option: any) => {
    const member = option?.member;
    // Verificar se o membro selecionado não está registrado
    if (member?.registered) {
      return; // Não permite selecionar membros já registrados
    }

    // Criar o objeto MemberSingleOption
    const memberOption: MemberSingleOption = {
      value: selectedValue,
      label: member?.name || '',
      registered: member?.registered || false,
      member: member,
    };

    onChange(selectedValue, memberOption);
    const selectedMember = normalizedMembers.find(
      (m) => m.id === selectedValue,
    );
    setSearchText(selectedMember?.name || '');
    setOpen(false);
  };

  // Lidar com a mudança de texto
  const handleChange = (text: string) => {
    setSearchText(text);
    if (!text) {
      onChange('', undefined);
    }
  };

  return (
    <AutoComplete
      id={id}
      open={open && canFetchMembers}
      onOpenChange={handleOpenChange}
      placeholder={placeholder}
      value={searchText}
      onSearch={handleSearch}
      onSelect={handleSelect}
      onChange={handleChange}
      options={options || []}
      disabled={loading || !canFetchMembers}
      className={className}
      style={{ width: '100%' }}
      notFoundContent={
        !canFetchMembers ? (
          <div className="py-4 text-center text-gray-500">
            {!eventId
              ? 'Selecione um evento para buscar membros'
              : 'Selecione uma conta para buscar membros'}
          </div>
        ) : loading ? (
          <Spin size="small" />
        ) : normalizedMembers.length === 0 ? (
          'Nenhum membro encontrado'
        ) : options?.length === 0 && searchText.trim() ? (
          'Nenhum membro encontrado com esse nome'
        ) : (
          'Digite para filtrar membros...'
        )
      }
      allowClear
      filterOption={false}
    />
  );
}
