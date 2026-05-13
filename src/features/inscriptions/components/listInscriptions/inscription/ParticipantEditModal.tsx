'use client';

import type { Participant } from '@/features/inscriptions/types/listInscriptions/inscription/detailsInscriptionTypes';
import {
  GenderType,
  ShirtSizeType,
  ShirtType,
  UpdateParticipantInput,
} from '@/features/participants/types/actions/updateParticipantTypes';
import { DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';

interface ParticipantEditModalProps {
  open: boolean;
  participant: Participant | null;
  onClose: () => void;
  onSubmit: (input: UpdateParticipantInput) => Promise<void>;
  loading?: boolean;
}

const genderOptions: { label: string; value: GenderType }[] = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Feminino', value: 'FEMININO' },
];

const shirtSizeOptions: { label: string; value: ShirtSizeType }[] = [
  { label: 'PP', value: 'PP' },
  { label: 'P', value: 'P' },
  { label: 'M', value: 'M' },
  { label: 'G', value: 'G' },
  { label: 'GG', value: 'GG' },
  { label: 'XG', value: 'XG' },
];

const shirtTypeOptions: { label: string; value: ShirtType }[] = [
  { label: 'Tradicional', value: 'TRADICIONAL' },
  { label: 'Babylok', value: 'BABYLOOK' },
];

export default function ParticipantEditModal({
  open,
  participant,
  onClose,
  onSubmit,
  loading,
}: ParticipantEditModalProps) {
  const [form] = Form.useForm<{
    name: string;
    preferredName?: string;
    cpf: string;
    birthDate?: Dayjs | null;
    gender?: GenderType;
    shirtSize?: ShirtSizeType;
    shirtType?: ShirtType;
  }>();

  useEffect(() => {
    if (!participant) {
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      name: participant.name,
      preferredName:
        (participant as UpdateParticipantInput).preferredName ?? '',
      cpf: participant.cpf,
      birthDate: participant.birthDate ? dayjs(participant.birthDate) : null,
      gender: participant.gender as GenderType,
      shirtSize: (participant as UpdateParticipantInput).shirtSize,
      shirtType: (participant as UpdateParticipantInput).shirtType,
    });
  }, [participant, form]);

  const handleFinish = async (values: {
    name: string;
    preferredName?: string;
    cpf: string;
    birthDate?: Dayjs | null;
    gender?: GenderType;
    shirtSize?: ShirtSizeType;
    shirtType?: ShirtType;
  }) => {
    if (!participant) return;

    await onSubmit({
      id: participant.id,
      name: values.name,
      preferredName: values.preferredName,
      cpf: values.cpf,
      gender: values.gender,
      birthDate: values.birthDate?.toDate(),
      shirtSize: values.shirtSize,
      shirtType: values.shirtType,
    });
  };

  return (
    <Modal
      forceRender
      open={open}
      title="Editar participante"
      onCancel={onClose}
      okText="Salvar"
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item label="Nome" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Cpf" name="cpf">
            <Input />
          </Form.Item>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item label="Nome social" name="preferredName">
            <Input />
          </Form.Item>
          <Form.Item label="Nascimento" name="birthDate">
            <DatePicker
              format="DD/MM/YYYY"
              placeholder="Selecione a data de nascimento"
              className="w-full"
            />
          </Form.Item>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item label="Gênero" name="gender">
            <Select options={genderOptions} allowClear />
          </Form.Item>
          <Form.Item label="Tamanho da camisa" name="shirtSize">
            <Select options={shirtSizeOptions} allowClear />
          </Form.Item>
        </div>
        <Form.Item label="Tipo da camisa" name="shirtType">
          <Select options={shirtTypeOptions} allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}
