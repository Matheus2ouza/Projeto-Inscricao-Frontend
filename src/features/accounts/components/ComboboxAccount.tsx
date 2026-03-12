"use client";

import type { AutoCompleteProps } from "antd";
import { AutoComplete, Space, Spin, Tag } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "../hooks/useAccount";

export type AccountOption = {
  label: string;
  value: string;
  role?: string;
};

export type ComboboxAccountSingleProps = {
  id?: string;
  label?: string;
  value?: string;
  onChange: (value: string, account?: AccountOption) => void;
  loading?: boolean;
  className?: string;
  placeholder?: string;
  showRole?: boolean;
};

export function ComboboxAccountSingle({
  id,
  label,
  value,
  onChange,
  loading: loadingProp,
  className,
  placeholder = "Selecione uma conta...",
  showRole = true,
}: ComboboxAccountSingleProps) {
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<AutoCompleteProps["options"]>([]);
  const shouldFetch = true;
  const {
    accounts: fetched,
    loading: internalLoading,
    error,
  } = useAccount(shouldFetch);
  const loading = loadingProp ?? internalLoading;

  // Busca sempre da API e monta dados normalizados
  const normalizedAccounts = useMemo(() => {
    if (fetched && fetched.length > 0) {
      return fetched.map((account) => ({
        id: account.id,
        name: account.username.toUpperCase(),
        nameLower: account.username.toLowerCase(),
        role: account.role,
        account: {
          label: account.username.toUpperCase(),
          value: account.id,
          role: account.role,
        },
      }));
    }
    return [];
  }, [fetched]);

  // Função para filtrar contas baseado no texto de busca
  const filterAccounts = useCallback(
    (text: string) => {
      const query = text.trim().toLowerCase();

      // Se não houver query, mostra todas as contas (limitado a 50 para performance)
      const accountsToShow = !query
        ? normalizedAccounts.slice(0, 50)
        : normalizedAccounts.filter((account) => {
            const matchesQuery = account.nameLower.includes(query);
            return matchesQuery;
          });

      const newOptions = accountsToShow.map((account) => ({
        value: account.id,
        label: (
          <Space className="w-full justify-between">
            <Space orientation="vertical" size={0} className="w-full">
              <span className="font-medium">{account.name}</span>
              {showRole && account.role && (
                <Tag color="blue" className="text-xs mt-1">
                  {account.role}
                </Tag>
              )}
            </Space>
          </Space>
        ),
        account: account.account,
      }));

      setOptions(newOptions);
    },
    [normalizedAccounts, showRole],
  );

  // Efeito para atualizar opções quando os dados mudam ou o searchText muda
  useEffect(() => {
    if (normalizedAccounts.length > 0) {
      filterAccounts(searchText);
    } else {
      setOptions((prev) => (prev?.length === 0 ? prev : []));
    }
  }, [normalizedAccounts, searchText, filterAccounts]);

  // Função para lidar com a busca em tempo real
  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  // Encontrar a conta selecionada para exibir no campo
  const selectedAccount = useMemo(() => {
    if (!value) return null;
    return normalizedAccounts.find((acc) => acc.id === value);
  }, [value, normalizedAccounts]);

  return (
    <AutoComplete
      id={id}
      open={open}
      onOpenChange={setOpen}
      placeholder={loading ? "Carregando contas..." : placeholder}
      value={searchText || (selectedAccount ? selectedAccount.name : "")}
      onSearch={handleSearch}
      onSelect={(selectedValue, option) => {
        const account = (option as any)?.account;
        onChange(selectedValue, account);
        const selectedAccount = normalizedAccounts.find(
          (acc) => acc.id === selectedValue,
        );
        setSearchText(selectedAccount?.name || "");
        setOpen(false);
      }}
      onChange={(text) => {
        setSearchText(text);
        if (!text) {
          onChange("", undefined);
        }
      }}
      options={options || []}
      disabled={loading}
      className={className}
      style={{ width: "100%" }}
      notFoundContent={
        error ? (
          <div className="text-center py-4">
            <p className="text-red-500">Falha ao carregar contas.</p>
          </div>
        ) : loading ? (
          <Spin size="small" />
        ) : normalizedAccounts.length === 0 ? (
          "Nenhuma conta encontrada"
        ) : options?.length === 0 && searchText.trim() ? (
          "Nenhuma conta encontrada com esse nome"
        ) : (
          "Digite para filtrar contas..."
        )
      }
      allowClear
      filterOption={false}
    />
  );
}
