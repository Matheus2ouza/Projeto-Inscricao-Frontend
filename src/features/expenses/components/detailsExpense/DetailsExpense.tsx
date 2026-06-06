'use client';

import ImageGallery from '@/shared/components/ImageGallery';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DatePicker, Input, InputNumber, Select } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  Pencil,
  Save,
  Tag,
  Trash2,
  Undo2,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { Expense } from '../../types/detailsExpense/detailsExpenseTypes';
import {
  CategoryExpense,
  PaymentMethod,
} from '../../types/listExpenses/expensesTypes';

interface DetailsExpenseProps {
  expense: Expense;
  onEdit?: (expenseId: string, data: any) => Promise<void>;
  onDelete?: (expenseId: string) => Promise<void>;
  isEditing?: boolean;
  isDeleting?: boolean;
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

const paymentMethodColors: Record<PaymentMethod, string> = {
  PIX: 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300',
  CARTAO:
    'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
  DINHEIRO:
    'bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300',
};

export default function ({
  expense,
  onEdit,
  onDelete,
  isEditing: isEditingProp = false,
  isDeleting = false,
}: DetailsExpenseProps) {
  const { TextArea } = Input;
  const [isEditing, setIsEditing] = useState(isEditingProp);
  const [editedExpense, setEditedExpense] = useState({
    description: expense.description,
    value: expense.value,
    paymentMethod: expense.paymentMethod,
    category: expense.category,
    responsible: expense.responsible,
    createdAt: expense.createdAt,
    images: expense.images || [],
  });

  const images = editedExpense.images || [];

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  });

  const handleEdit = () => {
    console.log('Editando gasto:', expense.id);
    setIsEditing(true);
  };

  const handleDelete = () => {
    console.log('Deletando gasto:', expense.id);
    onDelete?.(expense.id);
  };

  const handleSave = async () => {
    console.log('Salvando alterações do gasto:', expense.id, editedExpense);
    if (onEdit) {
      await onEdit(expense.id, editedExpense);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log('Cancelando edição do gasto:', expense.id);
    setEditedExpense({
      description: expense.description,
      value: expense.value,
      paymentMethod: expense.paymentMethod,
      category: expense.category,
      responsible: expense.responsible,
      createdAt: expense.createdAt,
      images: expense.images || [],
    });
    setIsEditing(false);
  };

  const parseValueInput = (value: string) => {
    const cleaned = value
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const parsed = Number(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setEditedExpense({
        ...editedExpense,
        createdAt: date.toDate(),
      });
    }
  };

  const handleAddImages = (files: File[]) => {
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setEditedExpense((prev) => ({
      ...prev,
      images: [...(prev.images ?? []), ...fileUrls],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setEditedExpense((prev) => ({
      ...prev,
      images: prev.images?.filter((_, idx) => idx !== index) ?? [],
    }));
  };

  const ActionButtons = () => (
    <>
      {!isEditing ? (
        <Button
          type="button"
          variant="none"
          size="sm"
          className="flex items-center justify-center gap-1 bg-green-500 p-0 text-white transition-colors hover:bg-green-600"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
      ) : (
        <>
          <Button
            type="button"
            size="sm"
            variant="none"
            onClick={handleCancel}
            className="flex items-center justify-center gap-1 bg-red-500 text-white transition-colors hover:bg-red-600"
          >
            <Undo2 className="h-4 w-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="none"
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-1 text-white transition-colors"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Salvar</span>
          </Button>
        </>
      )}

      {!isEditing && (
        <Button
          type="button"
          variant="none"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center gap-1 bg-red-500 text-white transition-colors hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {isDeleting ? 'Deletando...' : 'Deletar'}
          </span>
        </Button>
      )}
    </>
  );

  return (
    <div className="space-y-8">
      {/* Card principal do gasto */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              {/* Primeira linha: Título à esquerda, botões à direita */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                  Detalhes do Gasto
                </h1>
                <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
                  <ActionButtons />
                </div>
              </div>

              {/* Segunda linha: ID e botões em telas menores */}
              <div className="text-muted-foreground mt-2 flex items-center justify-between gap-2 text-sm">
                <div className="flex min-w-0 flex-col gap-1">
                  <code className="bg-muted rounded px-2 py-1 font-mono text-xs sm:text-sm">
                    {expense.id.substring(0, 12)}...
                  </code>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 sm:hidden">
                  <ActionButtons />
                </div>
              </div>
            </div>

            {/* Cards de informações - versão responsiva */}
            {/* Versão para mobile */}
            <div className="block space-y-3 sm:hidden">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Valor</span>
                </div>
                {isEditing ? (
                  <InputNumber
                    min={0}
                    step={0.01}
                    precision={2}
                    placeholder="0,00"
                    value={editedExpense.value}
                    onChange={(value) =>
                      setEditedExpense({ ...editedExpense, value: value ?? 0 })
                    }
                    className="w-full"
                    style={{ width: '100%' }}
                    formatter={(value) => {
                      if (value === undefined || value === null) return '';
                      const normalized = `${value}`.replace('.', ',');
                      return `R$ ${normalized}`;
                    }}
                    parser={(value) => {
                      if (!value) return 0;
                      return parseValueInput(value);
                    }}
                  />
                ) : (
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {currencyFormatter.format(expense.value)}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">
                    Método de Pagamento
                  </span>
                </div>
                {isEditing ? (
                  <Select
                    value={editedExpense.paymentMethod}
                    onChange={(value) =>
                      setEditedExpense({
                        ...editedExpense,
                        paymentMethod: value,
                      })
                    }
                    options={Object.entries(paymentMethodLabels).map(
                      ([value, label]) => ({ value, label }),
                    )}
                    className="w-full"
                  />
                ) : (
                  <Badge className={paymentMethodColors[expense.paymentMethod]}>
                    {paymentMethodLabels[expense.paymentMethod]}
                  </Badge>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Tag className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Categoria</span>
                </div>
                {isEditing ? (
                  <Select
                    value={editedExpense.category}
                    onChange={(value) =>
                      setEditedExpense({ ...editedExpense, category: value })
                    }
                    options={Object.entries(categoryLabels).map(
                      ([value, label]) => ({ value, label }),
                    )}
                    className="w-full"
                  />
                ) : (
                  <p className="text-sm">{categoryLabels[expense.category]}</p>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Responsável</span>
                </div>
                {isEditing ? (
                  <Input
                    value={editedExpense.responsible}
                    onChange={(e) =>
                      setEditedExpense({
                        ...editedExpense,
                        responsible: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{expense.responsible}</p>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CalendarIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Data do Gasto</span>
                </div>
                {isEditing ? (
                  <DatePicker
                    value={dayjs(editedExpense.createdAt)}
                    onChange={handleDateChange}
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="text-muted-foreground h-4 w-4" />
                    <p className="text-sm">
                      {dateFormatter.format(new Date(expense.createdAt))}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Versão para desktop (grid) */}
            <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <DollarSign className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Valor</span>
                </div>
                {isEditing ? (
                  <InputNumber
                    min={0}
                    step={0.01}
                    precision={2}
                    placeholder="0,00"
                    value={editedExpense.value}
                    onChange={(value) =>
                      setEditedExpense({ ...editedExpense, value: value ?? 0 })
                    }
                    className="w-full"
                    style={{ width: '100%' }}
                    formatter={(value) => {
                      if (value === undefined || value === null) return '';
                      const normalized = `${value}`.replace('.', ',');
                      return `R$ ${normalized}`;
                    }}
                    parser={(value) => {
                      if (!value) return 0;
                      return parseValueInput(value);
                    }}
                  />
                ) : (
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {currencyFormatter.format(expense.value)}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">
                    Método de Pagamento
                  </span>
                </div>
                {isEditing ? (
                  <Select
                    value={editedExpense.paymentMethod}
                    onChange={(value) =>
                      setEditedExpense({
                        ...editedExpense,
                        paymentMethod: value,
                      })
                    }
                    options={Object.entries(paymentMethodLabels).map(
                      ([value, label]) => ({ value, label }),
                    )}
                    className="w-full"
                  />
                ) : (
                  <Badge className={paymentMethodColors[expense.paymentMethod]}>
                    {paymentMethodLabels[expense.paymentMethod]}
                  </Badge>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Tag className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Categoria</span>
                </div>
                {isEditing ? (
                  <Select
                    value={editedExpense.category}
                    onChange={(value) =>
                      setEditedExpense({ ...editedExpense, category: value })
                    }
                    options={Object.entries(categoryLabels).map(
                      ([value, label]) => ({ value, label }),
                    )}
                    className="w-full"
                  />
                ) : (
                  <p className="text-sm font-medium">
                    {categoryLabels[expense.category]}
                  </p>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Responsável</span>
                </div>
                {isEditing ? (
                  <Input
                    value={editedExpense.responsible}
                    onChange={(e) =>
                      setEditedExpense({
                        ...editedExpense,
                        responsible: e.target.value,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm font-medium">{expense.responsible}</p>
                )}
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CalendarIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm font-medium">Data do Gasto</span>
                </div>
                {isEditing ? (
                  <DatePicker
                    value={dayjs(editedExpense.createdAt)}
                    onChange={handleDateChange}
                    showTime
                    format="DD/MM/YYYY HH:mm"
                    className="w-full"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="text-muted-foreground h-4 w-4" />
                    <p className="text-sm font-medium">
                      {dateFormatter.format(new Date(expense.createdAt))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card da descrição separado */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="text-muted-foreground h-5 w-5" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Descrição
              </h2>
            </div>
            {isEditing ? (
              <TextArea
                value={editedExpense.description}
                onChange={(e) =>
                  setEditedExpense({
                    ...editedExpense,
                    description: e.target.value,
                  })
                }
                autoSize
                maxLength={300}
                showCount
                placeholder="Descrição do gasto"
                className="mb-3 w-full"
                style={{ resize: 'none' }}
              />
            ) : (
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {expense.description || 'Nenhuma descrição fornecida'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Imagens */}
      {(isEditing || images.length > 0) && (
        <ImageGallery
          images={images}
          editing={isEditing}
          maxCount={10}
          onAddImages={handleAddImages}
          onRemoveImage={handleRemoveImage}
          size="small"
          className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800"
        />
      )}
    </div>
  );
}
