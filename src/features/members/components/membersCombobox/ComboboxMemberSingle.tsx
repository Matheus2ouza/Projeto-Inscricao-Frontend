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
  localityId?: string;
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
  localityId,
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

  // Só busca quando tem evento E localidade
  const canFetchMembers = Boolean(eventId && localityId);

  const {
    members: fetched,
    loading: internalLoading,
    fetching: internalFetching,
    error,
  } = useMember({
    eventId,
    localityId,
    autoFetch: canFetchMembers,
  });

  const loading = loadingProp ?? internalLoading;
  const fetching = fetchingProp ?? internalFetching;

  useEffect(() => {
    if (onFetchingChange) {
      onFetchingChange(fetching);
    }
  }, [fetching, onFetchingChange]);

  useEffect(() => {
    if (!canFetchMembers && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.warning('Selecione um evento e uma localidade primeiro', {
        description: 'Escolha o evento e a localidade antes de buscar membros',
      });
    }
  }, [canFetchMembers]);

  useEffect(() => {
    if (canFetchMembers) toastShownRef.current = false;
  }, [canFetchMembers]);

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

  const options = useMemo<AutoCompleteProps['options']>(() => {
    if (normalizedMembers.length === 0) {
      return [];
    }

    const query = searchText.trim().toLowerCase();

    const membersToShow = !query
      ? normalizedMembers.slice(0, 50)
      : normalizedMembers.filter((member) => member.nameLower.includes(query));

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

  const handleSearch = (text: string) => {
    if (!canFetchMembers) return;
    setSearchText(text);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !canFetchMembers) return;
    setOpen(isOpen);
  };

  const handleSelect = (selectedValue: string, option: any) => {
    const member = option?.member;
    if (member?.registered) return;

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
              : 'Selecione uma localidade para buscar membros'}
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
