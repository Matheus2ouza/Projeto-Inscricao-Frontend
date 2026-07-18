'use client';

import { LocalityToAccountCombobox } from '@/features/locality/components/LocalityToAccountCombobox';
import { Button } from '@/shared/components/ui/button';
import { formatDateTime } from '@/shared/utils/formatDate';
import type { SelectProps } from 'antd';
import {
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { AlertCircle, Eye, ThumbsUp } from 'lucide-react';
import React, { useState } from 'react';
import { Controller, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import useFormCreateMember from '../hook/createMember/useFormCreateMember';
import { useMembers } from '../hook/useMembers';
import { Member, genderType } from '../types/membersType';

type MembersTableProps = {
  onViewDetailsMember: (memberId: string) => void;
};

// Função para formatar CPF
const formatCPF = (cpf?: string): string => {
  if (!cpf) return '-';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para formatar gênero
const formatGender = (gender: genderType): string => {
  return gender === 'MASCULINO' ? 'Masculino' : 'Feminino';
};

// Função para obter cor do badge de gênero
const getGenderColor = (gender: genderType): string => {
  return gender === 'MASCULINO' ? 'blue' : 'pink';
};

// Opções para tamanho de camiseta
const shirtSizeOptions: SelectProps['options'] = [
  { label: 'PP', value: 'PP' },
  { label: 'P', value: 'P' },
  { label: 'M', value: 'M' },
  { label: 'G', value: 'G' },
  { label: 'GG', value: 'GG' },
  { label: 'XG', value: 'XG' },
];

// Opções para tipo de camiseta
const shirtTypeOptions: SelectProps['options'] = [
  { label: 'Tradicional', value: 'TRADICIONAL' },
  { label: 'Baby Look', value: 'BABYLOOK' },
];

export default function MembersTable({
  onViewDetailsMember,
}: MembersTableProps) {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('');

  const { form, onSubmit } = useFormCreateMember();

  // Hook de membros com filtro por localidade
  const { members, total, page, pageCount, loading, error, setPage, refresh } =
    useMembers({
      initialPage: 1,
      pageSize: 10,
      localityId: selectedLocalityId || undefined,
      autoFetch: !!selectedLocalityId,
    });

  // Função para calcular o índice global
  const calculateGlobalIndex = (index: number): number => {
    return (page - 1) * 10 + index + 1;
  };

  // Função para dividir os erros por vírgula e criar um array
  const parseErrorMessages = (errorMessage: string): string[] => {
    return errorMessage.split(', ').map((err) => err.trim());
  };

  // Função para lidar com o submit e abrir o modal de sucesso
  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    if (event?.preventDefault) event.preventDefault();

    setSubmitError(null);

    const isValid = await form.trigger();
    if (!isValid) return false;

    const result = await onSubmit(event);

    if (result.success) {
      toast.success('Membro criado!', {
        description: 'Membro criado com sucesso e já pode ser utilizado',
        icon: <ThumbsUp />,
      });
      setOpen(false);
      refresh();
      return true;
    } else {
      setSubmitError(result.error || 'Não foi possível criar o membro.');
      toast.error(result.error || 'Não foi possível criar o membro.');
      return false;
    }
  };

  // Colunas da tabela
  const columns: ColumnsType<Member> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => calculateGlobalIndex(index),
    },
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'CPF',
      key: 'cpf',
      render: (_, record) => formatCPF(record.cpf),
    },
    {
      title: 'Gênero',
      key: 'gender',
      align: 'center',
      render: (_, record) => (
        <Tag color={getGenderColor(record.gender)}>
          {formatGender(record.gender)}
        </Tag>
      ),
      filters: [
        { text: 'Masculino', value: 'MASCULINO' },
        { text: 'Feminino', value: 'FEMININO' },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Criado em',
      key: 'createdAt',
      align: 'center',
      render: (_, record) => formatDateTime(record.createdAt),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button
          variant="link"
          size="sm"
          className="bg-riodavida hover:bg-riodavida-dark flex h-6 w-6 items-center justify-center rounded-lg border-0 p-0 text-white"
          onClick={() => onViewDetailsMember(record.id)}
          aria-label="Detalhes"
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Filtro de localidade e botão criar membro */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full max-w-sm">
            <label className="text-riodavida-gray-dark dark:text-riodavida-gray mb-2 block text-sm font-medium">
              Filtrar por Localidade
            </label>
            <LocalityToAccountCombobox
              value={selectedLocalityId}
              onChange={setSelectedLocalityId}
              placeholder="Selecione uma localidade"
            />
            {!selectedLocalityId && (
              <p className="text-muted-foreground mt-2 text-sm">
                Selecione uma localidade para visualizar os membros.
              </p>
            )}
          </div>
          <Button
            variant="default"
            className="bg-riodavida hover:bg-riodavida-dark shrink-0 text-white"
            onClick={() => {
              setOpen(true);
              setSubmitError(null);
            }}
          >
            Criar Membro
          </Button>
        </div>

        {/* Tabela */}
        <div className="liquid-card overflow-hidden rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="border-riodavida/30 border-t-riodavida h-8 w-8 animate-spin rounded-full border-4" />
            </div>
          ) : error ? (
            <div className="text-destructive p-6 text-center">
              <p>Erro ao carregar membros: {error.message}</p>
              <Button
                onClick={refresh}
                className="bg-riodavida hover:bg-riodavida-dark mt-4 text-white"
              >
                Tentar Novamente
              </Button>
            </div>
          ) : members.length === 0 ? (
            <div className="text-muted-foreground p-12 text-center">
              {selectedLocalityId
                ? 'Nenhum membro encontrado para esta localidade.'
                : 'Selecione uma localidade para visualizar os membros.'}
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={members}
              rowKey="id"
              pagination={{
                current: page,
                pageSize: 10,
                total: total,
                onChange: setPage,
                showSizeChanger: false,
                showTotal: (total) => `Total de ${total} membros`,
              }}
              size="middle"
              className="w-full"
              scroll={{ x: 'max-content' }}
            />
          )}
        </div>

        {/* Modal de criação com Ant Design */}
        <Modal
          open={open}
          onCancel={() => {
            setOpen(false);
            setSubmitError(null);
            form.reset();
          }}
          title="Criar Membro"
          width="600px"
          footer={null}
          className="[&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-mask]:!backdrop-blur-sm"
        >
          <div className="liquid-card border-0 shadow-none">
            <FormProvider {...form}>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Nome */}
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="Nome"
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                      required
                    >
                      <Input
                        {...field}
                        placeholder="Digite o nome"
                        className="w-full"
                      />
                    </Form.Item>
                  )}
                />

                {/* Nome Preferido */}
                <Controller
                  control={form.control}
                  name="preferredName"
                  render={({ field }) => (
                    <Form.Item label="Nome Preferido (opcional)">
                      <Input
                        {...field}
                        placeholder="Digite o nome preferido"
                        className="w-full"
                      />
                    </Form.Item>
                  )}
                />

                {/* CPF */}
                <Controller
                  control={form.control}
                  name="cpf"
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="CPF (opcional)"
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                    >
                      <Input
                        {...field}
                        placeholder="Digite o CPF (apenas números)"
                        className="w-full"
                        maxLength={11}
                      />
                    </Form.Item>
                  )}
                />

                {/* Data de Nascimento com DatePicker do Ant Design */}
                <Controller
                  control={form.control}
                  name="birthDate"
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="Data de Nascimento"
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                      required
                    >
                      <DatePicker
                        {...field}
                        style={{ width: '100%' }}
                        placeholder="Selecione a data de nascimento"
                        format="DD/MM/YYYY"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(date) => {
                          field.onChange(date ? date.format('YYYY-MM-DD') : '');
                        }}
                        className="w-full"
                      />
                    </Form.Item>
                  )}
                />

                {/* Gênero */}
                <Controller
                  control={form.control}
                  name="gender"
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="Gênero"
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                      required
                    >
                      <Radio.Group
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value}
                      >
                        <Space>
                          <Radio value="MASCULINO">Masculino</Radio>
                          <Radio value="FEMININO">Feminino</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  )}
                />

                {/* Tamanho da Camiseta */}
                <Controller
                  control={form.control}
                  name="shirtSize"
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="Tamanho da Camiseta (opcional)"
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                    >
                      <Select
                        {...field}
                        style={{ width: '100%' }}
                        placeholder="Selecione o tamanho"
                        options={shirtSizeOptions}
                        value={field.value || undefined}
                        onChange={(value) => field.onChange(value)}
                        allowClear
                      />
                    </Form.Item>
                  )}
                />

                {/* Tipo da Camiseta */}
                <Controller
                  control={form.control}
                  name="shirtType"
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="Tipo da Camiseta (opcional)"
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                    >
                      <Select
                        {...field}
                        style={{ width: '100%' }}
                        placeholder="Selecione o tipo"
                        options={shirtTypeOptions}
                        value={field.value || undefined}
                        onChange={(value) => field.onChange(value)}
                        allowClear
                      />
                    </Form.Item>
                  )}
                />

                {/* Mensagem de erro do submit */}
                {submitError && (
                  <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 rounded-lg border p-3">
                    <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        {parseErrorMessages(submitError).map(
                          (errorLine, index) => (
                            <span key={index} className="text-sm font-medium">
                              • {errorLine}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer com botões */}
                <div className="border-riodavida/10 flex justify-end gap-3 border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false);
                      setSubmitError(null);
                      form.reset();
                    }}
                    className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-riodavida hover:bg-riodavida-dark text-white"
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </Modal>
      </div>
    </div>
  );
}
