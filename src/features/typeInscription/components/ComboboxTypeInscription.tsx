'use client';

import type { SelectProps } from 'antd';
import { Select, Space, Spin, Tag } from 'antd';
import * as React from 'react';
import { useListTypeInscriptions } from '../hook/listTypeInscriptions/useListTypeInscriptions';

export type TypeInscriptionOption = {
  label: string;
  value: string;
  description: string;
  price: number;
};

export type ComboboxTypeInscriptionProps = {
  eventId: string;
  value: string;
  onChange: (value: string, option?: TypeInscriptionOption) => void;
  options?: TypeInscriptionOption[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export function ComboboxTypeInscription({
  eventId,
  value,
  onChange,
  options,
  loading: loadingProp,
  disabled = false,
  placeholder = 'Selecione o tipo de inscrição',
}: ComboboxTypeInscriptionProps) {
  const {
    typeInscriptions: fetched,
    loading,
    error,
  } = useListTypeInscriptions({ eventId });

  const typeInscriptions = React.useMemo<TypeInscriptionOption[]>(() => {
    if (options) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((t) => ({
        label: `${t.description} - R$ ${t.value.toFixed(2)}`,
        value: t.id,
        description: t.description,
        price: t.value,
      }));
    }
    return [];
  }, [options, fetched]);

  // Configuração das opções para o Select
  const selectOptions: SelectProps['options'] = typeInscriptions.map(
    (type) => ({
      label: type.label,
      value: type.value,
      disabled: disabled,
    }),
  );

  // Função para renderizar cada opção personalizada
  const renderOption = (option: any) => {
    const type = typeInscriptions.find((t) => t.value === option.value);
    if (!type) return option.label;

    return (
      <Space className="w-full justify-between">
        <span>{type.label}</span>
        {value === type.value && (
          <Tag color="blue" className="ml-2">
            Selecionado
          </Tag>
        )}
      </Space>
    );
  };

  // Placeholder baseado no estado
  const getPlaceholder = () => {
    if (disabled) return 'Selecione um evento primeiro';
    if (loading) return 'Carregando tipos...';
    if (typeInscriptions.length === 0) return 'Nenhum tipo encontrado';
    return placeholder;
  };

  return (
    <Select
      showSearch
      allowClear
      placeholder={getPlaceholder()}
      value={value || undefined}
      onChange={(selectedValue, option) => {
        const selectedOption = Array.isArray(option) ? option[0] : option;
        const type = typeInscriptions.find((t) => t.value === selectedValue);
        onChange(selectedValue || '', type);
      }}
      loading={loading}
      options={selectOptions}
      optionRender={(option) => renderOption(option.data)}
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      disabled={disabled || typeInscriptions.length === 0}
      notFoundContent={
        error ? (
          <div className="py-2 text-center">
            <p className="text-sm text-red-500">Falha ao carregar tipos</p>
          </div>
        ) : loading ? (
          <Spin size="small" />
        ) : (
          'Nenhum tipo encontrado'
        )
      }
      className="w-full"
      style={{ width: '100%' }}
      virtual={false}
      listHeight={250}
    />
  );
}
