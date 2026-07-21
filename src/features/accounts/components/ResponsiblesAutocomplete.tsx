'use client';

import type { AutoCompleteProps } from 'antd';
import { AutoComplete, Checkbox, Empty, Space, Spin, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useAccount } from '../hooks/listAccountsCombobox/uselistAccountsCombobox';
import type { AccountRole } from '../types/accounts.types';

type ResponsiblesAutocompleteProps = {
  value?: string[];
  onChange: (value: string[]) => void;
  roles?: AccountRole[];
  placeholder?: string;
  disabled?: boolean;
};

export function ResponsiblesAutocomplete({
  value = [],
  onChange,
  roles,
  placeholder = 'Pesquise pelo nome da conta',
  disabled = false,
}: ResponsiblesAutocompleteProps) {
  const [searchText, setSearchText] = useState('');
  const [open, setOpen] = useState(false);
  const { accounts, loading, error } = useAccount(true, roles);

  const normalizedAccounts = useMemo(() => {
    return accounts.map((account) => ({
      id: account.id,
      name: account.username.toUpperCase(),
      nameLower: account.username.toLowerCase(),
      role: account.role,
    }));
  }, [accounts]);

  const selectedAccounts = useMemo(() => {
    const selectedIds = new Set(value);
    return normalizedAccounts.filter((account) => selectedIds.has(account.id));
  }, [normalizedAccounts, value]);

  const visibleAccounts = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return normalizedAccounts
      .filter((account) => !query || account.nameLower.includes(query))
      .slice(0, 100);
  }, [normalizedAccounts, searchText]);

  const options = useMemo<AutoCompleteProps['options']>(() => {
    const query = searchText.trim().toLowerCase();
    const selectedIds = new Set(value);

    return normalizedAccounts
      .filter((account) => !selectedIds.has(account.id))
      .filter((account) => !query || account.nameLower.includes(query))
      .slice(0, 50)
      .map((account) => ({
        value: account.id,
        label: (
          <Space className="w-full justify-between">
            <span className="font-medium">{account.name}</span>
            <Tag color="blue" className="m-0 text-xs">
              {account.role}
            </Tag>
          </Space>
        ),
      }));
  }, [normalizedAccounts, searchText, value]);

  const handleSelect = (accountId: string) => {
    if (!value.includes(accountId)) {
      onChange([...value, accountId]);
    }

    setSearchText('');
    setOpen(false);
  };

  const handleRemove = (accountId: string) => {
    onChange(value.filter((id) => id !== accountId));
  };

  const handleToggle = (accountId: string) => {
    if (value.includes(accountId)) {
      handleRemove(accountId);
      return;
    }

    onChange([...value, accountId]);
  };

  const notFoundContent = error ? (
    <div className="py-4 text-center text-red-500">
      Falha ao carregar contas.
    </div>
  ) : loading ? (
    <div className="py-4 text-center">
      <Spin size="small" />
    </div>
  ) : normalizedAccounts.length === 0 ? (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Nenhuma conta" />
  ) : (
    'Nenhuma conta encontrada com esse nome'
  );

  return (
    <div className="space-y-3">
      <AutoComplete
        open={open}
        onOpenChange={setOpen}
        onFocus={() => setOpen(true)}
        value={searchText}
        options={options}
        placeholder={loading ? 'Carregando contas...' : placeholder}
        disabled={disabled || loading}
        onSearch={setSearchText}
        onSelect={handleSelect}
        onChange={setSearchText}
        notFoundContent={notFoundContent}
        filterOption={false}
        allowClear
        style={{ width: '100%' }}
      />

      {selectedAccounts.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-md border border-gray-200 bg-gray-50 p-3 dark:border-white/10 dark:bg-white/5">
          {selectedAccounts.map((account) => (
            <Tag
              key={account.id}
              color="geekblue"
              closable
              onClose={(event) => {
                event.preventDefault();
                handleRemove(account.id);
              }}
              className="m-0 px-2 py-1"
            >
              <span className="font-medium">{account.name}</span>
              <span className="ml-2">{account.role}</span>
            </Tag>
          ))}
        </div>
      )}

      <div className="max-h-72 overflow-y-auto rounded-md border border-gray-200 dark:border-white/10">
        {loading ? (
          <div className="flex justify-center p-6">
            <Spin size="small" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            Falha ao carregar contas.
          </div>
        ) : visibleAccounts.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Nenhuma conta encontrada"
          />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/10">
            {visibleAccounts.map((account) => {
              const checked = value.includes(account.id);

              return (
                <button
                  type="button"
                  key={account.id}
                  onClick={() => handleToggle(account.id)}
                  className="block w-full cursor-pointer px-4 py-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <Space className="w-full justify-between">
                    <Space>
                      <Checkbox checked={checked} />
                      <span className="font-medium">{account.name}</span>
                    </Space>
                    <Tag color={checked ? 'green' : 'blue'} className="m-0">
                      {account.role}
                    </Tag>
                  </Space>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
