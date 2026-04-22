'use client';

import { useEventsCombobox } from '@/features/events/hooks/combobox/useEventsCombobox';
import { StatusEvent } from '@/features/events/types/combobox/comboboxEventTypes';
import { Select } from 'antd';
import * as React from 'react';

export type EventOption = { label: string; value: string };

export type ComboboxEventProps = {
  value: string;
  onChange: (value: string) => void;
  options?: EventOption[];
  statuses?: StatusEvent[];
};

export function ComboboxEvent({
  value,
  onChange,
  options,
  statuses = [StatusEvent.OPEN, StatusEvent.CLOSE, StatusEvent.FINALIZED],
}: ComboboxEventProps) {
  const { events: fetched, loading, error } = useEventsCombobox(statuses);

  // Preferência: props.options > API; fallback: []
  const events = React.useMemo<EventOption[]>(() => {
    if (options && options.length > 0) return options;
    if (fetched && fetched.length > 0) {
      return fetched.map((e) => ({
        label: e.name.toUpperCase(),
        value: e.id,
      }));
    }
    return [];
  }, [fetched, options]);

  const placeholder = React.useMemo(() => {
    if (loading) return 'Carregando eventos...';
    if (events.length === 0) return 'Nenhum evento encontrado';
    return 'Selecione o evento...';
  }, [loading, events.length]);

  const notFoundContent = React.useMemo(() => {
    if (loading) return 'Carregando...';
    if (error) return 'Falha ao carregar os eventos.';
    return 'Nenhum evento encontrado.';
  }, [loading, error]);

  return (
    <Select
      value={value || undefined}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      options={events}
      placeholder={placeholder}
      loading={loading}
      notFoundContent={notFoundContent}
      showSearch
      allowClear
      className="w-full max-w-[520px] min-w-[280px]"
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
