import { ListInscriptionsPending } from '@/features/payments/types/adminRegisterPayment/adminRegisterPaymentTypes';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import type { TableColumnsType } from 'antd';
import { InputNumber } from 'antd';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import type { Key } from 'react';
import { useMemo } from 'react';
import { TableTransfer, type DataType } from './TableTransfer';

interface InscriptionSelectionStepProps {
  listInscriptions: ListInscriptionsPending[] | null;
  selectedIds: string[];
  setSelectedIds: (value: string[]) => void;
  amounts: Record<string, number>;
  setAmounts: (value: Record<string, number>) => void;
  paymentAmount: number;
  totalPayment: number;
  handleTransferChange: (nextTargetKeys: Key[]) => void;
  handleRemoveInscription: (id: string) => void;
  handleMoveInscription: (id: string, direction: 'up' | 'down') => void;
  handleAmountChange: (id: string, value: number | null) => void;
}

export default function InscriptionSelectionStep({
  listInscriptions,
  selectedIds,
  amounts,
  paymentAmount,
  totalPayment,
  handleTransferChange,
  handleRemoveInscription,
  handleMoveInscription,
  handleAmountChange,
}: InscriptionSelectionStepProps) {
  const toCents = (value: number) => Math.round(Number(value || 0) * 100);

  const transferDataSource = useMemo<DataType[]>(
    () =>
      listInscriptions?.map((inscription) => ({
        ...inscription,
        key: inscription.id,
      })) ?? [],
    [listInscriptions],
  );

  const leftColumns: TableColumnsType<DataType> = [
    {
      dataIndex: 'responsible',
      title: 'Responsável',
    },
    {
      dataIndex: 'status',
      title: 'Status',
    },
    {
      dataIndex: 'totalValue',
      title: 'Valor total',
      render: (value: number) => getFormatCurrency(value),
    },
    {
      dataIndex: 'totalPaid',
      title: 'Pago',
      render: (value: number) => getFormatCurrency(value),
    },
  ];

  const rightColumns: TableColumnsType<DataType> = leftColumns;

  const filterOption = (input: string, item: DataType) =>
    item.responsible.toLowerCase().includes(input.toLowerCase()) ||
    item.status.toLowerCase().includes(input.toLowerCase());

  const selectedInscriptions = useMemo(
    () =>
      selectedIds
        .map((id) =>
          listInscriptions?.find((inscription) => inscription.id === id),
        )
        .filter((inscription): inscription is ListInscriptionsPending =>
          Boolean(inscription),
        ),
    [listInscriptions, selectedIds],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold">Resumo do Pagamento</p>
            <p className="text-muted-foreground text-sm">
              Valor total: {getFormatCurrency(paymentAmount)}
            </p>
          </div>
          <div className="text-muted-foreground text-sm">
            Total alocado: {getFormatCurrency(totalPayment)}
            {toCents(totalPayment) !== toCents(paymentAmount) && (
              <span className="ml-2 text-red-600">
                (Diferença:{' '}
                {getFormatCurrency(
                  (toCents(paymentAmount) - toCents(totalPayment)) / 100,
                )}
                )
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <TableTransfer
          dataSource={transferDataSource}
          targetKeys={selectedIds}
          showSearch
          showSelectAll={false}
          onChange={handleTransferChange}
          filterOption={filterOption}
          rowKey={(record) => record.key}
          leftColumns={leftColumns}
          rightColumns={rightColumns}
        />
        <p className="text-muted-foreground text-sm">
          Selecione as inscrições à esquerda para mover para a direita e definir
          os valores de pagamento. A ordem de seleção define a sequência de
          alocação.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-3 text-base font-semibold">
          Inscrições selecionadas
        </h3>
        {selectedInscriptions.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma inscrição selecionada. Use a busca acima para adicionar
            inscrições.
          </p>
        ) : (
          <div className="space-y-4">
            {selectedInscriptions.map((inscription, index) => {
              const remaining = Number(
                (inscription.totalValue - inscription.totalPaid).toFixed(2),
              );
              return (
                <div
                  key={inscription.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold">{inscription.responsible}</p>
                      <div className="text-muted-foreground flex flex-wrap gap-2 text-sm">
                        <span>Status: {inscription.status}</span>
                        <span>
                          Valor total:{' '}
                          {getFormatCurrency(inscription.totalValue)}
                        </span>
                        <span>
                          Pago: {getFormatCurrency(inscription.totalPaid)}
                        </span>
                        <span>Faltante: {getFormatCurrency(remaining)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleMoveInscription(inscription.id, 'up')
                        }
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-slate-300"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleMoveInscription(inscription.id, 'down')
                        }
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-slate-300"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveInscription(inscription.id)}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-red-600 transition hover:bg-red-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Valor para essa inscrição
                      </label>
                      <InputNumber
                        min={0}
                        max={remaining}
                        step={0.01}
                        value={amounts[inscription.id] ?? 0}
                        onChange={(value) =>
                          handleAmountChange(inscription.id, value)
                        }
                        stringMode
                        className="w-full"
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                        }
                        parser={(value) =>
                          Number(value?.replace(/\D/g, '') ?? 0)
                        }
                      />
                      <p className="text-muted-foreground mt-1 text-sm">
                        Máximo permitido: {getFormatCurrency(remaining)}.
                      </p>
                    </div>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          Posição de alocação
                        </p>
                        <p className="text-lg font-semibold">{index + 1}</p>
                      </div>
                      <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-zinc-800 dark:text-slate-200">
                        Ordem
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
