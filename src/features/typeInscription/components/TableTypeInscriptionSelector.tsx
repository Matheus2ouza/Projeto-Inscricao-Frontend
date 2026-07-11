'use client';

import { useListTypeInscriptionsToManager } from '@/features/typeInscription/hook/listTypeInscriptionsToManager/useListTypeInscriptionsToManager';
import { TypeInscription } from '@/features/typeInscription/types/listTypeInscriptionsToManager/listTypeInscriptionsManagerTypes';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { Checkbox, Empty, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

export type TableTypeInscriptionSelectorProps = {
  eventId: string;
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export function TableTypeInscriptionSelector({
  eventId,
  value,
  onChange,
  disabled = false,
}: TableTypeInscriptionSelectorProps) {
  const { typeInscriptions, loading, error, fetched, refresh } =
    useListTypeInscriptionsToManager({ eventId });

  const handleToggle = (id: string, checked: boolean) => {
    if (disabled) return;

    const current = Array.isArray(value) ? value : [];

    const next = checked
      ? Array.from(new Set([...current, id]))
      : current.filter((v) => v !== id);

    onChange(next);
  };

  const columns: ColumnsType<TypeInscription> = [
    {
      title: (
        <Checkbox
          checked={
            typeInscriptions.length > 0 &&
            value.length === typeInscriptions.length
          }
          indeterminate={
            value.length > 0 && value.length < typeInscriptions.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              onChange(typeInscriptions.map((t) => t.id));
            } else {
              onChange([]);
            }
          }}
          disabled={disabled}
        />
      ),
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={value.includes(record.id)}
          onChange={(e) => handleToggle(record.id, e.target.checked)}
          disabled={disabled}
        />
      ),
    },
    {
      title: 'Descrição',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Valor',
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      width: 120,
      render: (value: number) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {getFormatCurrency(value)}
        </span>
      ),
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Limite',
      dataIndex: 'participantLimit',
      key: 'participantLimit',
      align: 'center',
      width: 100,
      render: (limit: number, record: TypeInscription) => (
        <span className="font-medium">
          {limit}
          {record.limitIsStrict && (
            <span className="ml-1 text-xs text-orange-600 dark:text-orange-400">
              ✓ Restrito
            </span>
          )}
        </span>
      ),
      sorter: (a, b) => a.participantLimit - b.participantLimit,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (active: boolean) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            active
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {active ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
  ];

  if (disabled) {
    return (
      <div className="text-muted-foreground text-sm">
        Selecione um evento primeiro.
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        Falha ao carregar tipos de inscrição.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[180px] items-center justify-center">
        <Spin />
      </div>
    );
  }

  if (typeInscriptions.length === 0) {
    return <Empty description="Nenhum tipo de inscrição encontrado" />;
  }

  return (
    <Table
      columns={columns}
      dataSource={typeInscriptions}
      rowKey="id"
      pagination={false}
      size="small"
      className="glass-surface rounded-lg"
      rowClassName={(_, index) =>
        index % 2 === 0 ? 'glass-row-even' : 'glass-row-odd'
      }
    />
  );
}
