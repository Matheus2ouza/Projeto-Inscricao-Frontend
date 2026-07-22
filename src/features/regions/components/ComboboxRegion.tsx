'use client';

import { useListRegions } from '@/features/regions/hooks/listRegions/useListRegions';
import { Select } from 'antd';
import * as React from 'react';

export type RegionOption = { label: string; value: string };

export type ComboboxRegionProps = {
  value: string;
  onChange: (value: string) => void;
  options?: RegionOption[];
  loading?: boolean;
};

export function ComboboxRegion({
  value,
  onChange,
  options,
  loading: loadingProp,
}: ComboboxRegionProps) {
  const shouldFetch = options === undefined;
  const {
    regions: fetched,
    loading: internalLoading,
    error,
  } = useListRegions(shouldFetch);
  const loading = loadingProp ?? internalLoading;

  // Preferência: props.options > API; fallback: []
  const regions = React.useMemo<RegionOption[]>(() => {
    if (options) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((r) => ({
        label: r.name.toUpperCase(),
        value: r.id,
      }));
    }
    return [];
  }, [options, fetched]);

  const placeholder = React.useMemo(() => {
    if (loading) return 'Carregando regiões...';
    if (regions.length === 0) return 'Nenhuma região encontrada';
    return 'Selecione a região...';
  }, [loading, regions.length]);

  const notFoundContent = React.useMemo(() => {
    if (loading) return 'Carregando...';
    if (error) return 'Falha ao carregar regiões.';
    return 'Nenhuma região encontrada.';
  }, [loading, error]);

  return (
    <Select
      value={value || undefined}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      options={regions}
      placeholder={placeholder}
      loading={loading}
      notFoundContent={notFoundContent}
      showSearch
      allowClear
      className="w-full"
      optionFilterProp="label"
      filterOption={(input, option) =>
        String(option?.label ?? '')
          .toLowerCase()
          .includes(input.toLowerCase())
      }
      getPopupContainer={(triggerNode) =>
        (triggerNode?.parentElement as HTMLElement) ?? document.body
      }
    />
  );
}
