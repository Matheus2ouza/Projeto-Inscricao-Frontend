'use client';

import { ComboboxAccountSingle } from '@/features/accounts/components/ComboboxAccount';
import { ComboboxEvent } from '@/features/events/components/combobox/ComboBoxEvent';
import { useFormCreateInscriptionAdmin } from '@/features/inscriptions/hooks/inscriptionAdmin/useFormCreateInscriptionAdmin';
import {
  genderEnum,
  inscriptionStatusEnum,
  paymentMethodEnum,
  shirtSizeEnum,
  shirtTypeEnum,
  statusPaymentEnum,
} from '@/features/inscriptions/schema/inscriptionAdmin/createInscriptionAdminSchema';
import { ComboboxMemberSingle } from '@/features/members/components/combobox/ComboboxMemberSingle';
import {
  ComboboxTypeInscription,
  TypeInscriptionOption,
} from '@/features/typeInscription/components/ComboboxTypeInscription';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  getConvertStatusInscription,
  getConvertStatusPayment,
} from '@/shared/utils/getConvertStatus';
import type { SelectProps } from 'antd';
import {
  Card,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  InputNumber,
  Radio,
  Select,
  Space,
  Switch,
  Tag,
} from 'antd';
import dayjs from 'dayjs';
import {
  FileText,
  ImageIcon,
  MinusCircle,
  Plus,
  RotateCw,
  User,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  Controller,
  FormProvider,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';

// Opções para selects baseadas nos enums
const statusOptions: SelectProps['options'] = inscriptionStatusEnum.options.map(
  (value) => ({
    label: getConvertStatusInscription(value),
    value,
  }),
);

const paymentMethodOptions: SelectProps['options'] =
  paymentMethodEnum.options.map((value) => ({
    label: value,
    value,
  }));

const paymentStatusOptions: SelectProps['options'] =
  statusPaymentEnum.options.map((value) => ({
    label: getConvertStatusPayment(value),
    value,
  }));

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

// Funções auxiliares para formatação
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileTypeName = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG',
    'image/png': 'PNG',
    'image/webp': 'WebP',
  };
  return typeMap[type] || type;
};

export default function CreateInscriptionAdmin() {
  const [showPayment, setShowPayment] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFetchingMembers, setIsFetchingMembers] = useState(false);
  const [typeValues, setTypeValues] = useState<Record<string, number>>({});
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { form, onSubmit } = useFormCreateInscriptionAdmin();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isGuest = watch('isGuest');
  const eventId = watch('eventId');
  const accountId = watch('accountId');

  // Observar os participantes para recalcular total quando mudarem
  const participants = useWatch({
    control,
    name: 'participants',
  });

  // Efeito para calcular o total sempre que os participantes ou typeValues mudarem
  useEffect(() => {
    if (!participants || participants.length === 0) {
      setValue('totalValue', 0);
      // Se o pagamento estiver visível, atualizar também o payment.totalValue
      if (showPayment) {
        setValue('payment.totalValue', 0);
      }
      return;
    }

    let total = 0;
    participants.forEach((participant: any) => {
      if (
        participant?.typeInscriptionId &&
        typeValues[participant.typeInscriptionId]
      ) {
        total += typeValues[participant.typeInscriptionId];
      }
    });

    setValue('totalValue', total);

    // Se o pagamento estiver visível, atualizar também o payment.totalValue
    if (showPayment) {
      setValue('payment.totalValue', total);
    }
  }, [participants, typeValues, setValue, showPayment]);

  // Função para recarregar a lista de membros
  const handleRefreshMembers = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Field array para participantes
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'participants',
  });

  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();

    // Atualizar o campo payment.image com o arquivo selecionado
    if (receiptFile) {
      setValue('payment.image', receiptFile);
    }

    const result = await onSubmit(event);
    if (result.success) {
      toast.success('Inscrição criada com sucesso!');
      // Limpar o arquivo após submit bem-sucedido
      setReceiptFile(null);
      setReceiptPreview(null);
    } else {
      toast.error(result.error || 'Erro ao criar inscrição');
    }
  };

  // Função para adicionar membro selecionado como participante
  const handleMemberSelected = (memberId: string, fullMember?: any) => {
    if (!memberId || !fullMember) return;

    // Verificar se o membro já foi adicionado
    const alreadyAdded = fields.some(
      (f) => f.accountParticipantId === memberId,
    );
    if (alreadyAdded) {
      toast.warning('Membro já adicionado', {
        description: 'Este membro já está na lista de participantes',
      });
      return;
    }

    // Adiciona um novo participante com todos os dados do membro
    append({
      accountParticipantId: memberId,
      typeInscriptionId: '',
      name: fullMember.name ?? '',
      preferredName: fullMember.preferredName ?? '',
      cpf: fullMember.cpf ?? '',
      birthDate: fullMember.birthDate
        ? new Date(fullMember.birthDate).toISOString().split('T')[0]
        : '',
      gender: fullMember.gender,
      shirtSize: fullMember.shirtSize,
      shirtType: fullMember.shirtType,
    });

    toast.success('Membro adicionado!', {
      description: 'Selecione o tipo de inscrição para este participante',
    });
  };

  // Função para adicionar participante manualmente com validação
  const handleAddManualParticipant = () => {
    if (!isGuest && !eventId) {
      toast.warning('Selecione um evento primeiro', {
        description: 'Escolha o evento antes de adicionar um participante',
      });
      return;
    }

    if (!isGuest && !accountId) {
      toast.warning('Selecione uma conta primeiro', {
        description: 'Escolha a conta antes de adicionar um participante',
      });
      return;
    }

    append({
      typeInscriptionId: '',
      name: '',
      preferredName: '',
      cpf: '',
      birthDate: '',
      gender: undefined,
      shirtSize: undefined,
      shirtType: undefined,
    });
  };

  // Função para lidar com a seleção do tipo de inscrição
  const handleTypeChange = (
    index: number,
    typeId: string,
    typeOption?: TypeInscriptionOption,
  ) => {
    if (typeOption) {
      // Armazenar o valor do tipo selecionado
      setTypeValues((prev) => ({
        ...prev,
        [typeId]: typeOption.price,
      }));
    } else if (!typeId && fields[index]?.typeInscriptionId) {
      // Se limpou a seleção, remover o valor
      const oldTypeId = fields[index].typeInscriptionId;
      if (oldTypeId) {
        setTypeValues((prev) => {
          const newValues = { ...prev };
          delete newValues[oldTypeId];
          return newValues;
        });
      }
    }
  };

  // Funções para upload de imagem
  const validateFile = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('Tipo de arquivo não permitido', {
        description: 'Por favor, selecione uma imagem JPG, PNG ou WebP.',
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('Arquivo muito grande', {
        description: 'O tamanho máximo permitido é 5MB.',
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Atualizar o valor no formulário
      setValue('payment.image', file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    setValue('payment.image', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6">
      <Card title="Registrar Inscrição" className="w-full">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event ID - Agora usando ComboboxEvent */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="eventId"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Evento"
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                    required
                  >
                    <ComboboxEvent
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Form.Item>
                )}
              />

              <Controller
                control={control}
                name="status"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Status da Inscrição"
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                    required
                  >
                    <Select
                      {...field}
                      options={statusOptions}
                      placeholder="Selecione o status"
                    />
                  </Form.Item>
                )}
              />
            </div>

            {/* Tipo de inscrição: Normal vs Guest */}
            <Controller
              control={control}
              name="isGuest"
              render={({ field }) => (
                <Form.Item label="Tipo de inscrição">
                  <Radio.Group
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value}
                  >
                    <Radio value={false}>Normal (com conta)</Radio>
                    <Radio value={true}>Sem Conta vinculada</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
            />

            {/* Dados do responsável */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Controller
                control={control}
                name="responsible"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Responsável"
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                    required
                  >
                    <Input
                      {...field}
                      placeholder="Nome do responsável"
                      className="w-full"
                    />
                  </Form.Item>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Email"
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      type="email"
                      placeholder="email@exemplo.com"
                      className="w-full"
                    />
                  </Form.Item>
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Telefone"
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      placeholder="(00) 00000-0000"
                      className="w-full"
                    />
                  </Form.Item>
                )}
              />
            </div>

            {/* Campos condicionais conforme isGuest */}
            {isGuest ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Controller
                  control={control}
                  name="guestLocality"
                  render={({ field, fieldState }) => (
                    <Form.Item
                      label="Localidade"
                      validateStatus={fieldState.error ? 'error' : ''}
                      help={fieldState.error?.message}
                    >
                      <Input
                        {...field}
                        placeholder="Cidade/UF"
                        className="w-full"
                      />
                    </Form.Item>
                  )}
                />
              </div>
            ) : (
              <Controller
                control={control}
                name="accountId"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Conta"
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <ComboboxAccountSingle
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Selecione uma conta..."
                      showRole={true}
                    />
                  </Form.Item>
                )}
              />
            )}

            {/* Valor total - READONLY E CALCULADO AUTOMATICAMENTE */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                control={control}
                name="totalValue"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Valor total"
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                    required
                  >
                    <InputNumber
                      {...field}
                      style={{ width: '100%' }}
                      min={0}
                      step={0.01}
                      precision={2}
                      placeholder="0,00"
                      disabled={true}
                      className="w-full cursor-not-allowed bg-gray-50"
                      formatter={(value) => {
                        const numValue = Number(value);
                        if (isNaN(numValue)) return 'R$ 0,00';
                        return `R$ ${numValue.toFixed(2).replace('.', ',')}`;
                      }}
                      parser={(value) => {
                        if (!value) return 0;
                        const parsed = value
                          .replace(/R\$\s?/g, '')
                          .replace(/\./g, '')
                          .replace(',', '.');
                        return Number(parsed) || 0;
                      }}
                    />
                  </Form.Item>
                )}
              />

              <Controller
                control={control}
                name="totalPaid"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Valor pago"
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <InputNumber<number>
                      {...field}
                      style={{ width: '100%' }}
                      min={0}
                      placeholder="0,00"
                      formatter={(value) => {
                        if (!value && value !== 0) return '';
                        const [intPart, decPart] = `${value}`.split('.');
                        const formatted = intPart.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          '.',
                        );
                        return `R$ ${decPart ? `${formatted},${decPart}` : formatted}`;
                      }}
                      parser={(value) =>
                        value
                          ?.replace(/R\$\s?/g, '')
                          .replace(/\./g, '')
                          .replace(',', '.') as unknown as number
                      }
                      onBlur={field.onBlur}
                    />
                  </Form.Item>
                )}
              />
            </div>

            <Divider>Participantes</Divider>

            {/* Seletor de membros para inscrição normal */}
            {!isGuest && eventId && accountId && (
              <div className="mb-4 flex items-end gap-2">
                <div className="flex-1">
                  <Form.Item label="Adicionar membro existente">
                    <ComboboxMemberSingle
                      key={refreshKey}
                      eventId={eventId}
                      accountId={accountId}
                      requireAccountId={true}
                      value=""
                      onChange={handleMemberSelected}
                      placeholder="Buscar membro..."
                      disabledValues={fields.map(
                        (f) => f.accountParticipantId || '',
                      )}
                      onRefresh={handleRefreshMembers}
                      onFetchingChange={setIsFetchingMembers}
                    />
                  </Form.Item>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mb-6 flex items-center gap-2"
                  onClick={handleRefreshMembers}
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

            {/* Mensagem informativa quando falta selecionar conta */}
            {!isGuest && eventId && !accountId && (
              <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
                <p className="text-sm">
                  Selecione uma conta para poder adicionar membros.
                </p>
              </div>
            )}

            {/* Lista de participantes */}
            {fields.map((field, index) => {
              const hasAccountParticipant = !!field.accountParticipantId;

              return (
                <Card key={field.id} size="small" className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => {
                      // Ao remover, limpar o valor do tipo do state
                      if (field.typeInscriptionId) {
                        setTypeValues((prev) => {
                          const newValues = { ...prev };
                          delete newValues[field.typeInscriptionId];
                          return newValues;
                        });
                      }
                      remove(index);
                    }}
                  >
                    <MinusCircle className="h-4 w-4" />
                  </Button>

                  <div className="mt-8 space-y-4">
                    {/* Tipo de inscrição do participante (obrigatório) */}
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
                                handleTypeChange(index, value, option);
                              }}
                              disabled={!eventId}
                            />
                          </Form.Item>
                        )}
                      />
                    </div>

                    {/* Para inscrições normais com membro existente - mostrar dados como informação */}
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

                    {/* Para inscrições guest ou participantes manuais - mostrar inputs */}
                    {(isGuest || !hasAccountParticipant) && (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* Nome */}
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

                        {/* Nome preferido */}
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

                        {/* CPF */}
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

                        {/* Data de nascimento - Agora usando DatePicker do Ant Design */}
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

                        {/* Gênero */}
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

                        {/* Tamanho da camiseta */}
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

                        {/* Tipo da camiseta */}
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

            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center gap-2"
              onClick={handleAddManualParticipant}
            >
              <Plus className="h-4 w-4" />
              Adicionar Participante
            </Button>

            <Divider>Pagamento (opcional)</Divider>

            {/* Toggle para habilitar pagamento */}
            <div className="mb-4 flex items-center gap-4">
              <Switch checked={showPayment} onChange={setShowPayment} />
              <span>Incluir dados de pagamento</span>
            </div>

            {showPayment && (
              <Space
                orientation="vertical"
                size="middle"
                style={{ width: '100%' }}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    control={control}
                    name="payment.status"
                    render={({ field, fieldState }) => (
                      <Form.Item
                        label="Status do pagamento"
                        validateStatus={fieldState.error ? 'error' : ''}
                        help={fieldState.error?.message}
                        required
                      >
                        <Select
                          {...field}
                          options={paymentStatusOptions}
                          placeholder="Selecione"
                          className="w-full"
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    control={control}
                    name="payment.methodPayment"
                    render={({ field, fieldState }) => (
                      <Form.Item
                        label="Método de pagamento"
                        validateStatus={fieldState.error ? 'error' : ''}
                        help={fieldState.error?.message}
                        required
                      >
                        <Select
                          {...field}
                          options={paymentMethodOptions}
                          placeholder="Selecione"
                          className="w-full"
                        />
                      </Form.Item>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    control={control}
                    name="payment.totalValue"
                    render={({ field, fieldState }) => (
                      <Form.Item
                        label="Valor total do pagamento"
                        validateStatus={fieldState.error ? 'error' : ''}
                        help={fieldState.error?.message}
                      >
                        <InputNumber
                          {...field}
                          style={{ width: '100%' }}
                          min={0}
                          step={0.01}
                          precision={2}
                          placeholder="0,00"
                          disabled={true}
                          className="w-full cursor-not-allowed bg-gray-50"
                          formatter={(value) => {
                            const numValue = Number(value);
                            if (isNaN(numValue)) return 'R$ 0,00';
                            return `R$ ${numValue.toFixed(2).replace('.', ',')}`;
                          }}
                          parser={(value) => {
                            if (!value) return 0;
                            const parsed = value
                              .replace(/R\$\s?/g, '')
                              .replace(/\./g, '')
                              .replace(',', '.');
                            return Number(parsed) || 0;
                          }}
                        />
                      </Form.Item>
                    )}
                  />

                  <Controller
                    control={control}
                    name="payment.totalPaid"
                    render={({ field, fieldState }) => (
                      <Form.Item
                        label="Valor pago"
                        validateStatus={fieldState.error ? 'error' : ''}
                        help={fieldState.error?.message}
                      >
                        <InputNumber<number>
                          {...field}
                          style={{ width: '100%' }}
                          min={0}
                          placeholder="0,00"
                          formatter={(value) => {
                            if (!value && value !== 0) return '';
                            const [intPart, decPart] = `${value}`.split('.');
                            const formatted = intPart.replace(
                              /\B(?=(\d{3})+(?!\d))/g,
                              '.',
                            );
                            return `R$ ${decPart ? `${formatted},${decPart}` : formatted}`;
                          }}
                          parser={(value) =>
                            value
                              ?.replace(/R\$\s?/g, '')
                              .replace(/\./g, '')
                              .replace(',', '.') as unknown as number
                          }
                          onBlur={field.onBlur}
                        />
                      </Form.Item>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Controller
                    control={control}
                    name="payment.installment"
                    render={({ field, fieldState }) => (
                      <Form.Item
                        label="Número de parcelas"
                        validateStatus={fieldState.error ? 'error' : ''}
                        help={fieldState.error?.message}
                      >
                        <InputNumber
                          {...field}
                          min={1}
                          style={{ width: '100%' }}
                          placeholder="1"
                        />
                      </Form.Item>
                    )}
                  />
                </div>

                {/* Comprovante de Pagamento - Posicionado acima e à esquerda */}
                <div className="w-full">
                  <Form.Item
                    label="Comprovante de Pagamento"
                    required={watch('payment.methodPayment') === 'PIX'}
                    className="w-full"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <div className="w-full space-y-3">
                      {receiptFile ? (
                        <div className="w-full space-y-4">
                          {/* Preview da imagem */}
                          {receiptPreview && (
                            <div className="group relative w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                              <div className="relative aspect-video">
                                <img
                                  src={receiptPreview}
                                  alt="Preview do comprovante"
                                  className="h-full w-full object-contain p-4"
                                />
                                {/* Overlay com botão de remover */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-200 group-hover:bg-black/10">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="h-9 w-9 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                                    onClick={handleRemoveFile}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Informações do arquivo */}
                              <div className="absolute right-3 bottom-3 left-3">
                                <div className="rounded-lg bg-black/70 p-3 text-white backdrop-blur-sm">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4" />
                                      <span className="truncate text-sm font-medium">
                                        {receiptFile.name}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-300">
                                      {formatFileSize(receiptFile.size)}
                                    </div>
                                  </div>
                                  <div className="mt-1 text-xs text-gray-300">
                                    {getFileTypeName(receiptFile.type)} •
                                    Enviado
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Botão para trocar arquivo */}
                          <div className="flex items-center justify-start">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleRemoveFile}
                              className="gap-2"
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Trocar Comprovante
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`w-full cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                            isDragOver
                              ? 'border-primary bg-primary/5 scale-[1.02]'
                              : 'hover:border-primary hover:bg-primary/5 border-gray-300 dark:border-gray-700'
                          }`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="flex flex-col items-center gap-4">
                            {/* Ícone animado para drag and drop */}
                            <div className="relative">
                              <div
                                className={`rounded-full p-4 transition-all ${isDragOver ? 'bg-primary/20 scale-110' : 'bg-primary/10'}`}
                              >
                                {isDragOver ? (
                                  <svg
                                    className="text-primary h-8 w-8 animate-bounce"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <ImageIcon className="text-primary h-8 w-8" />
                                )}
                              </div>
                              {isDragOver && (
                                <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-green-500" />
                              )}
                            </div>

                            <div>
                              <p className="mb-1 font-medium text-gray-900 dark:text-white">
                                {isDragOver
                                  ? 'Solte o arquivo aqui'
                                  : 'Clique para fazer upload'}
                              </p>
                              <p className="text-sm text-gray-500">
                                ou arraste e solte o arquivo aqui
                              </p>
                            </div>

                            {/* Informações de formato */}
                            <div className="mt-2 flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-xs text-gray-500">
                                  JPG
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-xs text-gray-500">
                                  PNG
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <span className="text-xs text-gray-500">
                                  WebP
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                <span className="text-xs text-gray-500">
                                  5MB
                                </span>
                              </div>
                            </div>

                            {/* Dica visual */}
                            {!isDragOver && (
                              <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                                <svg
                                  className="h-4 w-4 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-xs text-gray-500">
                                  Caso seja PDF, tire um screenshot do
                                  comprovante e envie.
                                </span>
                              </div>
                            )}
                          </div>

                          <input
                            ref={fileInputRef}
                            id="receipt-upload"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                    </div>
                  </Form.Item>
                </div>
              </Space>
            )}

            {/* Botão de submit */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="dark:bg-secondary dark:text-secondary-foreground"
              >
                Criar Inscrição
              </Button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
}
