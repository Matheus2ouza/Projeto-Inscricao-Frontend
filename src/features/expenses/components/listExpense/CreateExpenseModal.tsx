'use client';

import ImageUpload from '@/shared/components/ImageUpload';
import type { UploadFile } from 'antd';
import {
  Button as AntButton,
  Form as AntForm,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import type { BaseSyntheticEvent } from 'react';
import { useState } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import { expenseFormData } from '../../schema/createExpense/createExpenseSchema';
import {
  CategoryExpense,
  PaymentMethod,
} from '../../types/listExpenses/expensesTypes';

interface CreateExpenseModalProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<expenseFormData>;
  onSubmit: (
    event?: BaseSyntheticEvent,
  ) => Promise<boolean | void> | boolean | void;
  submitting: boolean;
}

const paymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: 'PIX',
  CARTAO: 'Cartão',
  DINHEIRO: 'Dinheiro',
};

const categoryLabels: Record<CategoryExpense, string> = {
  BRINDES: 'Brindes',
  COZINHA: 'Cozinha',
  DECORACAO: 'Decoração',
  DECORACAO_ESTACAO: 'Decoração Estação',
  DECORACAO_COMPERADORES: 'Decoração Comperadores',
  MIDIA: 'Mídia',
  SOM: 'Som',
  MANUTENCAO: 'Manutenção',
  SEGURANCA: 'Segurança',
  OUTROS: 'Outros',
};

export default function CreateExpenseModal({
  open,
  onClose,
  form,
  onSubmit,
  submitting,
}: CreateExpenseModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);

  const handleDialogClose = () => {
    onClose();
    form.reset();
    setUploadedFiles([]);
  };

  const handleFormSubmit = async (event?: BaseSyntheticEvent) => {
    const result = await onSubmit(event);
    if (result) {
      handleDialogClose();
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleDialogClose}
      title="Novo Gasto"
      footer={null}
      destroyOnHidden
      width={760}
      centered
    >
      <AntForm layout="vertical" component={false}>
        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Descrição"
                validateStatus={fieldState.error ? 'error' : undefined}
                help={fieldState.error?.message}
                className="mb-0 md:col-span-3"
              >
                <Input placeholder="Descrição do gasto" {...field} />
              </AntForm.Item>
            )}
          />

          <Controller
            control={form.control}
            name="value"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Valor (R$)"
                validateStatus={fieldState.error ? 'error' : undefined}
                help={fieldState.error?.message}
                className="mb-0"
              >
                <InputNumber
                  min={0}
                  step={0.01}
                  precision={2}
                  placeholder="0,00"
                  value={field.value}
                  onChange={(value) => field.onChange(value ?? 0)}
                  className="w-full"
                  style={{ width: '100%' }}
                  formatter={(value) => {
                    if (value === undefined || value === null) return '';
                    const normalized = `${value}`.replace('.', ',');
                    return `R$ ${normalized}`;
                  }}
                  parser={(value) => {
                    if (!value) return 0;
                    const cleaned = value
                      .replace('R$', '')
                      .replace(/\s/g, '')
                      .replace(/\./g, '')
                      .replace(',', '.');
                    const parsed = Number(cleaned);
                    return Number.isNaN(parsed) ? 0 : parsed;
                  }}
                />
              </AntForm.Item>
            )}
          />

          <Controller
            control={form.control}
            name="paymentMethod"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Método de Pagamento"
                validateStatus={fieldState.error ? 'error' : undefined}
                help={fieldState.error?.message}
                className="mb-0"
              >
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  options={Object.entries(paymentMethodLabels).map(
                    ([value, label]) => ({
                      value,
                      label,
                    }),
                  )}
                  placeholder="Selecione o método"
                />
              </AntForm.Item>
            )}
          />

          <Controller
            control={form.control}
            name="createAt"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Data do gasto"
                validateStatus={fieldState.error ? 'error' : undefined}
                help={fieldState.error?.message}
                className="mb-0"
              >
                <DatePicker
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    field.onChange(date ? date.toISOString() : undefined)
                  }
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  placeholder="Selecione a data e hora"
                  disabled={submitting}
                  className="w-full"
                  style={{ width: '100%' }}
                />
              </AntForm.Item>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:col-span-3 md:grid-cols-2">
            <Controller
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Categoria"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0"
                >
                  <Select
                    value={field.value ?? CategoryExpense.OUTROS}
                    onChange={(value) => field.onChange(value)}
                    options={Object.entries(categoryLabels).map(
                      ([value, label]) => ({
                        value,
                        label,
                      }),
                    )}
                    placeholder="Selecione a categoria"
                  />
                </AntForm.Item>
              )}
            />

            <Controller
              control={form.control}
              name="responsible"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Responsável"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0"
                >
                  <Input placeholder="Nome do responsável" {...field} />
                </AntForm.Item>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="images"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Imagem (opcional)"
                validateStatus={fieldState.error ? 'error' : undefined}
                help={fieldState.error?.message}
                className="mb-0 md:col-span-3"
              >
                <ImageUpload
                  value={uploadedFiles}
                  onChange={setUploadedFiles}
                  maxCount={10}
                  title="Adicionar imagem"
                  onDataUrlsChange={(dataUrls) => {
                    field.onChange(dataUrls);
                  }}
                />
              </AntForm.Item>
            )}
          />

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:gap-3 md:col-span-3 lg:justify-end">
            <AntButton onClick={handleDialogClose} disabled={submitting}>
              Cancelar
            </AntButton>
            <AntButton type="primary" htmlType="submit" loading={submitting}>
              {submitting ? 'Registrando...' : 'Registrar Gasto'}
            </AntButton>
          </div>
        </form>
      </AntForm>
    </Modal>
  );
}
