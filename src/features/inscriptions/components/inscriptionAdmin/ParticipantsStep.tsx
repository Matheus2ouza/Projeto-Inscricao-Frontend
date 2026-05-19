'use client';

import {
  genderEnum,
  shirtSizeEnum,
  shirtTypeEnum,
  type CreateInscriptionAdminForm,
} from '@/features/inscriptions/schema/inscriptionAdmin/createInscriptionAdminSchema';
import { ComboboxMemberSingle } from '@/features/members/components/combobox/ComboboxMemberSingle';
import type { Member } from '@/features/members/types/combobox/membersComboboxType';
import {
  ComboboxTypeInscription,
  TypeInscriptionOption,
} from '@/features/typeInscription/components/ComboboxTypeInscription';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import type { SelectProps } from 'antd';
import { Card, DatePicker, Descriptions, Form, Select, Tag } from 'antd';
import dayjs from 'dayjs';
import { MinusCircle, Plus, RotateCw, User } from 'lucide-react';
import {
  Controller,
  type FieldArrayWithId,
  type UseFieldArrayRemove,
  type UseFormReturn,
} from 'react-hook-form';
import { toast } from 'sonner';

const genderOptions: SelectProps['options'] = genderEnum.options.map(
  (value) => ({
    label: value === 'MASCULINO' ? 'Masculino' : 'Feminino',
    value,
  }),
);

const shirtSizeOptions: SelectProps['options'] = shirtSizeEnum.options.map(
  (value) => ({
    label: value,
    value,
  }),
);

const shirtTypeOptions: SelectProps['options'] = shirtTypeEnum.options.map(
  (value) => ({
    label: value === 'TRADICIONAL' ? 'Tradicional' : 'Baby Look',
    value,
  }),
);

const formatGender = (gender?: string): string => {
  if (!gender) return 'Não informado';
  return gender === 'MASCULINO' ? 'Masculino' : 'Feminino';
};

const formatDate = (date?: string): string => {
  if (!date) return 'Não informado';
  return dayjs(date).format('DD/MM/YYYY');
};

const formatCPF = (cpf?: string): string => {
  if (!cpf) return 'Não informado';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

type ParticipantField = FieldArrayWithId<
  CreateInscriptionAdminForm,
  'participants',
  'id'
>;

type ParticipantsStepProps = {
  form: UseFormReturn<CreateInscriptionAdminForm>;
  fields: ParticipantField[];
  remove: UseFieldArrayRemove;
  isGuest: boolean;
  eventId?: string;
  accountId?: string;
  refreshKey: number;
  isFetchingMembers: boolean;
  onRefreshMembers: () => void;
  onFetchingMembersChange: (fetching: boolean) => void;
  onAddManualParticipant: () => void;
  onMemberSelected: (memberId: string, fullMember?: Member) => void;
  onTypeChange: (
    index: number,
    typeId: string,
    typeOption?: TypeInscriptionOption,
  ) => void;
  onRemoveTypeValue: (typeId: string) => void;
};

export function ParticipantsStep({
  form,
  fields,
  remove,
  isGuest,
  eventId,
  accountId,
  refreshKey,
  isFetchingMembers,
  onRefreshMembers,
  onFetchingMembersChange,
  onAddManualParticipant,
  onMemberSelected,
  onTypeChange,
  onRemoveTypeValue,
}: ParticipantsStepProps) {
  const { control } = form;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Participantes</h2>
          <p className="text-muted-foreground text-sm">
            Adicione uma ou mais pessoas para esta inscrição.
          </p>
        </div>

        <Button
          type="button"
          variant="default"
          className="flex w-full items-center justify-center gap-2 sm:w-auto"
          onClick={onAddManualParticipant}
        >
          <Plus className="h-4 w-4" />
          Adicionar Participante
        </Button>
      </div>

      {!isGuest && eventId && accountId && (
        <div className="glass-surface-strong flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Form.Item label="Adicionar membro existente" className="mb-0">
              <ComboboxMemberSingle
                key={refreshKey}
                eventId={eventId}
                accountId={accountId}
                requireAccountId
                value=""
                onChange={onMemberSelected}
                placeholder="Buscar membro..."
                disabledValues={fields.map(
                  (field) => field.accountParticipantId || '',
                )}
                onRefresh={onRefreshMembers}
                onFetchingChange={onFetchingMembersChange}
              />
            </Form.Item>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={onRefreshMembers}
            disabled={isFetchingMembers}
          >
            {isFetchingMembers ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <RotateCw className="h-4 w-4" />
                Recarregar
              </>
            )}
          </Button>
        </div>
      )}

      {!isGuest && eventId && !accountId && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50/80 p-4 text-yellow-800 backdrop-blur-sm dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
          <p className="text-sm">
            Selecione uma conta para poder adicionar membros.
          </p>
        </div>
      )}

      {fields.length === 0 && (
        <div className="glass-surface-strong flex flex-col items-center gap-3 rounded-lg px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Nenhum participante adicionado ainda.
          </p>
          <Button
            type="button"
            className="flex items-center gap-2"
            onClick={onAddManualParticipant}
          >
            <Plus className="h-4 w-4" />
            Adicionar Participante
          </Button>
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex flex-col gap-4">
          {fields.map((field, index) => {
            const hasAccountParticipant = !!field.accountParticipantId;

            return (
              <Card
                key={field.id}
                size="small"
                className="glass-surface relative overflow-hidden rounded-lg"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500"
                  onClick={() => {
                    if (field.typeInscriptionId) {
                      onRemoveTypeValue(field.typeInscriptionId);
                    }
                    remove(index);
                    toast.info('Participante removido');
                  }}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>

                <div className="mt-8 space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Controller
                      control={control}
                      name={`participants.${index}.typeInscriptionId`}
                      render={({ field: typeField, fieldState }) => (
                        <Form.Item
                          label="Tipo de inscrição"
                          validateStatus={fieldState.error ? 'error' : ''}
                          help={fieldState.error?.message}
                          required
                        >
                          <ComboboxTypeInscription
                            eventId={eventId || ''}
                            value={typeField.value}
                            onChange={(value, option) => {
                              typeField.onChange(value);
                              onTypeChange(index, value, option);
                            }}
                            disabled={!eventId}
                          />
                        </Form.Item>
                      )}
                    />
                  </div>

                  {!isGuest && hasAccountParticipant && (
                    <div className="rounded-lg border border-blue-200/50 bg-blue-50/50 p-4 dark:border-blue-800/30 dark:bg-blue-900/10">
                      <div className="mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          Dados do membro selecionado
                        </span>
                      </div>
                      <Descriptions
                        bordered
                        size="small"
                        column={2}
                        className="bg-white/50 dark:bg-gray-800/50"
                      >
                        <Descriptions.Item label="Nome" span={2}>
                          {field.name || 'Não informado'}
                        </Descriptions.Item>

                        {field.preferredName && (
                          <Descriptions.Item label="Nome preferido" span={2}>
                            {field.preferredName}
                          </Descriptions.Item>
                        )}

                        <Descriptions.Item label="CPF">
                          {formatCPF(field.cpf)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Data de nascimento">
                          {formatDate(field.birthDate)}
                        </Descriptions.Item>

                        <Descriptions.Item label="Gênero">
                          <Tag
                            color={
                              field.gender === 'MASCULINO' ? 'blue' : 'pink'
                            }
                          >
                            {formatGender(field.gender)}
                          </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Tamanho">
                          {field.shirtSize || 'Não informado'}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tipo de camiseta">
                          {field.shirtType === 'TRADICIONAL'
                            ? 'Tradicional'
                            : field.shirtType === 'BABYLOOK'
                              ? 'Baby Look'
                              : 'Não informado'}
                        </Descriptions.Item>
                      </Descriptions>
                    </div>
                  )}

                  {(isGuest || !hasAccountParticipant) && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Controller
                        control={control}
                        name={`participants.${index}.name`}
                        render={({ field, fieldState }) => (
                          <Form.Item
                            label="Nome"
                            validateStatus={fieldState.error ? 'error' : ''}
                            help={fieldState.error?.message}
                          >
                            <Input
                              {...field}
                              placeholder="Nome"
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`participants.${index}.preferredName`}
                        render={({ field }) => (
                          <Form.Item label="Nome preferido">
                            <Input
                              {...field}
                              placeholder="Nome preferido"
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`participants.${index}.cpf`}
                        render={({ field, fieldState }) => (
                          <Form.Item
                            label="CPF"
                            validateStatus={fieldState.error ? 'error' : ''}
                            help={fieldState.error?.message}
                          >
                            <Input
                              {...field}
                              placeholder="00000000000"
                              maxLength={11}
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`participants.${index}.birthDate`}
                        render={({ field, fieldState }) => (
                          <Form.Item
                            label="Data de nascimento"
                            validateStatus={fieldState.error ? 'error' : ''}
                            help={fieldState.error?.message}
                          >
                            <DatePicker
                              {...field}
                              style={{ width: '100%' }}
                              placeholder="Selecione a data de nascimento"
                              format="DD/MM/YYYY"
                              value={field.value ? dayjs(field.value) : null}
                              onChange={(date) => {
                                field.onChange(
                                  date ? date.format('YYYY-MM-DD') : '',
                                );
                              }}
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`participants.${index}.gender`}
                        render={({ field, fieldState }) => (
                          <Form.Item
                            label="Gênero"
                            validateStatus={fieldState.error ? 'error' : ''}
                            help={fieldState.error?.message}
                          >
                            <Select
                              {...field}
                              options={genderOptions}
                              placeholder="Selecione"
                              allowClear
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`participants.${index}.shirtSize`}
                        render={({ field }) => (
                          <Form.Item label="Tamanho da camiseta">
                            <Select
                              {...field}
                              options={shirtSizeOptions}
                              placeholder="Selecione"
                              allowClear
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                      />

                      <Controller
                        control={control}
                        name={`participants.${index}.shirtType`}
                        render={({ field }) => (
                          <Form.Item label="Tipo da camiseta">
                            <Select
                              {...field}
                              options={shirtTypeOptions}
                              placeholder="Selecione"
                              allowClear
                              className="w-full"
                            />
                          </Form.Item>
                        )}
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
