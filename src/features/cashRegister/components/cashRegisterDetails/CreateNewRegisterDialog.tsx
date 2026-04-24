'use client';

import { CreateNewRegisterSchema } from '@/features/cashRegister/schema/createNewRegister/createNewRegisterSchema';
import {
  CashEntryType,
  PaymentMethod,
  type CreateNewRegisterInput,
} from '@/features/cashRegister/types/createNewRegister/createNewRegisterTypes';
import ImageUpload from '@/shared/components/ImageUpload';
import { useCurrentUser } from '@/shared/context/user-context';
import { zodResolver } from '@hookform/resolvers/zod';
import type { InputNumberProps, UploadFile } from 'antd';
import {
  Form as AntForm,
  Button,
  Input,
  InputNumber,
  Modal,
  Select,
} from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { AllocationEvent } from '../../types/cashRegisterDetails/cashRegisterDetailsType';

type CreateNewRegisterFormValues = z.infer<typeof CreateNewRegisterSchema>;

interface CreateNewRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cashRegisterId: string;
  allocationEvents?: AllocationEvent[];
  onCreateNewRegister: (input: CreateNewRegisterInput) => Promise<unknown>;
  isSubmitting?: boolean;
}

export default function CreateNewRegisterDialog({
  open,
  onOpenChange,
  cashRegisterId,
  allocationEvents = [],
  onCreateNewRegister,
  isSubmitting = false,
}: CreateNewRegisterDialogProps) {
  const { user } = useCurrentUser();
  const isSuperUser = user.role === 'SUPER';
  const [uploadedFiles, setUploadedFiles] = useState<UploadFile[]>([]);
  const [modalWidth, setModalWidth] = useState(900);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setModalWidth(width - 32);
      } else if (width < 1024) {
        setModalWidth(Math.min(width - 48, 700));
      } else {
        setModalWidth(900);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (allocationEvents.length === 1) {
      form.setValue('eventId', allocationEvents[0].id);
    }
  }, [allocationEvents]);

  const formatter: InputNumberProps<number>['formatter'] = (value) => {
    if (value === undefined || value === null) return '';
    const [start, end] = `${value}`.split('.');
    const integer = start.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `R$ ${end ? `${integer},${end}` : integer}`;
  };

  const schema = CreateNewRegisterSchema.superRefine((values, ctx) => {
    if (isSuperUser && !values.eventId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Evento é obrigatório',
        path: ['eventId'],
      });
    }
  });

  const form = useForm<CreateNewRegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: CashEntryType.INCOME,
      method: PaymentMethod.DINHEIRO,
      value: 0,
      description: '',
      responsible: user.username,
      image: '',
      eventId:
        allocationEvents.length === 1 ? allocationEvents[0].id : undefined,
    },
    mode: 'onChange',
  });

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset({
        type: CashEntryType.INCOME,
        method: PaymentMethod.DINHEIRO,
        value: 0,
        description: '',
        responsible: user.username,
        image: '',
        eventId:
          allocationEvents.length === 1 ? allocationEvents[0].id : undefined,
      });
      setUploadedFiles([]);
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: CreateNewRegisterInput = {
      cashRegisterId,
      type: values.type as CashEntryType,
      method: values.method as PaymentMethod,
      value: values.value,
      description: values.description,
      responsible: values.responsible,
      image: values.image ? values.image : undefined,
      eventId: values.eventId ? values.eventId : undefined,
    };

    await onCreateNewRegister(payload);
    handleClose(false);
  });

  return (
    <Modal
      title="Nova movimentação"
      open={open}
      onCancel={() => handleClose(false)}
      footer={null}
      destroyOnHidden
      mask={{ closable: !isSubmitting }}
      closable={!isSubmitting}
      keyboard={!isSubmitting}
      width={modalWidth}
      centered
    >
      <form onSubmit={handleSubmit}>
        <AntForm layout="vertical" component={false}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Controller
              control={form.control}
              name="eventId"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Evento"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={
                    allocationEvents.length === 0
                      ? 'Nenhum evento disponível para este caixa.'
                      : fieldState.error?.message
                  }
                >
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    options={allocationEvents.map((e) => ({
                      value: e.id,
                      label: e.name,
                    }))}
                    placeholder="Selecione um evento"
                    disabled={isSubmitting || allocationEvents.length === 0}
                    className="w-full"
                    getPopupContainer={(triggerNode) =>
                      (triggerNode?.parentElement as HTMLElement) ??
                      document.body
                    }
                    showSearch
                    optionFilterProp="label"
                  />
                </AntForm.Item>
              )}
            />
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Tipo"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0"
                >
                  <Select
                    value={field.value as CashEntryType}
                    onChange={(value) => field.onChange(value)}
                    options={[
                      { value: CashEntryType.INCOME, label: 'Entrada' },
                      { value: CashEntryType.EXPENSE, label: 'Despesa' },
                    ]}
                    placeholder="Selecione"
                    disabled={isSubmitting}
                    className="w-full"
                    getPopupContainer={(triggerNode) =>
                      (triggerNode?.parentElement as HTMLElement) ??
                      document.body
                    }
                  />
                </AntForm.Item>
              )}
            />

            <Controller
              control={form.control}
              name="method"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Método"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0"
                >
                  <Select
                    value={field.value as PaymentMethod}
                    onChange={(value) => field.onChange(value)}
                    options={[
                      { value: PaymentMethod.DINHEIRO, label: 'Dinheiro' },
                      { value: PaymentMethod.PIX, label: 'Pix' },
                      { value: PaymentMethod.CARTAO, label: 'Cartão' },
                    ]}
                    placeholder="Selecione"
                    disabled={isSubmitting}
                    className="w-full"
                    getPopupContainer={(triggerNode) =>
                      (triggerNode?.parentElement as HTMLElement) ??
                      document.body
                    }
                  />
                </AntForm.Item>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Controller
              control={form.control}
              name="value"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Valor"
                  validateStatus={fieldState.error ? 'error' : undefined}
                  help={fieldState.error?.message}
                  className="mb-0"
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    value={Number.isFinite(field.value) ? field.value : 0}
                    disabled={isSubmitting}
                    onChange={(value) => {
                      field.onChange(value ?? 0);
                    }}
                    style={{ width: '100%' }}
                    formatter={formatter}
                    parser={(value) => {
                      if (!value) return 0;
                      const cleaned = value
                        .replace('R$', '')
                        .replace(/\s/g, '')
                        .replace(/\./g, '')
                        .replace(',', '.');
                      const parsed = parseFloat(cleaned);
                      return Number.isNaN(parsed) ? 0 : parsed;
                    }}
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
                  <Input
                    {...field}
                    placeholder="Nome do responsável"
                    disabled={isSubmitting}
                  />
                </AntForm.Item>
              )}
            />
          </div>

          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Descrição"
                validateStatus={fieldState.error ? 'error' : undefined}
                help={fieldState.error?.message}
                className="mb-0"
              >
                <Input.TextArea
                  {...field}
                  rows={2}
                  placeholder="Descreva a movimentação"
                  disabled={isSubmitting}
                  style={{ resize: 'none' }}
                />
              </AntForm.Item>
            )}
          />
          <Controller
            control={form.control}
            name="image"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Comprovante (opcional)"
                validateStatus={fieldState.error ? 'error' : undefined}
                help={fieldState.error?.message}
              >
                <ImageUpload
                  value={uploadedFiles}
                  onChange={setUploadedFiles}
                  maxCount={1}
                  disabled={isSubmitting}
                  title="Selecione o comprovante"
                  description="ou arraste e solte"
                  onDataUrlChange={(dataUrl) => {
                    field.onChange(dataUrl || '');
                  }}
                  className="hover:border-primary hover:bg-primary/5 dark:hover:border-primary rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-3 text-center transition-colors dark:border-zinc-700 dark:bg-zinc-900"
                />
              </AntForm.Item>
            )}
          />

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
            <Button onClick={() => handleClose(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={
                isSubmitting || (isSuperUser && allocationEvents.length === 0)
              }
            >
              Registrar
            </Button>
          </div>
        </AntForm>
      </form>
    </Modal>
  );
}
