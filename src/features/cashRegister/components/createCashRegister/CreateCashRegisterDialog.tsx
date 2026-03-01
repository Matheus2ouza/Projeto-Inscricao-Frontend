"use client";

import { CreateCashRegisterSchema } from "@/features/cashRegister/schema/createCashRegister/createCashRegisterSchema";
import {
  CashRegisterStatus,
  type CreateCashInput,
} from "@/features/cashRegister/types/createCashRegister/createCashRegisterTypes";
import { ComboboxEvent } from "@/features/events/components/combobox/ComboBoxEvent";
import { ComboboxRegion } from "@/features/regions/components/ComboboxRegion";
import { useCurrentUser } from "@/shared/context/user-context";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form as AntForm,
  Button,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type CreateCashRegisterFormValues = z.infer<typeof CreateCashRegisterSchema>;

interface CreateCashRegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCashRegister: (input: CreateCashInput) => Promise<unknown>;
  isSubmitting?: boolean;
}

export default function CreateCashRegisterDialog({
  open,
  onOpenChange,
  onCreateCashRegister,
  isSubmitting = false,
}: CreateCashRegisterDialogProps) {
  const { user } = useCurrentUser();
  const form = useForm<CreateCashRegisterFormValues>({
    resolver: zodResolver(CreateCashRegisterSchema),
    defaultValues: {
      name: "",
      regionId: undefined,
      status: CashRegisterStatus.OPEN,
      balance: 0,
      allocationEvent: "",
    },
    mode: "onChange",
  });

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: CreateCashInput = {
      ...values,
      status: values.status as CashRegisterStatus,
    };
    await onCreateCashRegister(payload);
    handleClose(false);
  });

  return (
    <Modal
      title="Criar Caixa"
      open={open}
      onCancel={() => handleClose(false)}
      footer={null}
      destroyOnHidden
      mask={{ closable: !isSubmitting }}
      closable={!isSubmitting}
      keyboard={!isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AntForm layout="vertical" component={false}>
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Nome"
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <Input
                  {...field}
                  placeholder="Nome do caixa"
                  disabled={isSubmitting}
                />
              </AntForm.Item>
            )}
          />

          {user.role === "SUPER" && (
            <Controller
              control={form.control}
              name="regionId"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Região (opcional)"
                  validateStatus={fieldState.error ? "error" : undefined}
                  help={fieldState.error?.message}
                >
                  <ComboboxRegion
                    value={field.value ?? ""}
                    onChange={(nextValue) => {
                      field.onChange(nextValue ? nextValue : undefined);
                    }}
                  />
                </AntForm.Item>
              )}
            />
          )}

          <Controller
            control={form.control}
            name="allocationEvent"
            render={({ field, fieldState }) => (
              <AntForm.Item
                label="Evento"
                validateStatus={fieldState.error ? "error" : undefined}
                help={fieldState.error?.message}
              >
                <ComboboxEvent
                  value={field.value}
                  onChange={(nextValue) => field.onChange(nextValue)}
                />
              </AntForm.Item>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Controller
              control={form.control}
              name="status"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Status"
                  validateStatus={fieldState.error ? "error" : undefined}
                  help={fieldState.error?.message}
                >
                  <Select
                    value={field.value as CashRegisterStatus}
                    onChange={(value) => field.onChange(value)}
                    options={[
                      { value: CashRegisterStatus.OPEN, label: "Aberto" },
                      { value: CashRegisterStatus.CLOSED, label: "Fechado" },
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
              name="balance"
              render={({ field, fieldState }) => (
                <AntForm.Item
                  label="Saldo"
                  validateStatus={fieldState.error ? "error" : undefined}
                  help={fieldState.error?.message}
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    value={Number.isFinite(field.value) ? field.value : 0}
                    disabled={isSubmitting}
                    onChange={(value) => {
                      field.onChange(typeof value === "number" ? value : 0);
                    }}
                    style={{ width: "100%" }}
                  />
                </AntForm.Item>
              )}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 pt-2">
            <Button onClick={() => handleClose(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Criar
            </Button>
          </div>
        </AntForm>
      </form>
    </Modal>
  );
}
