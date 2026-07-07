'use client';

import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import ImageGallery from '@/shared/components/ImageGallery';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DatePicker, Input, InputNumber, Select } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  ImageIcon,
  Pencil,
  Save,
  Tag,
  Trash2,
  Undo2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DeleteReceiptExpenseReponse } from '../../api/actions/deleteReceiptExpense';
import {
  UpdateExpenseRequest,
  UpdateExpenseResponse,
} from '../../api/actions/updateExpense';
import {
  UpdateReceiptExpenseRequest,
  UpdateReceiptExpenseResponse,
} from '../../api/actions/updateReceiptExpense';
import { Expense } from '../../types/detailsExpense/detailsExpenseTypes';
import {
  CategoryExpense,
  PaymentMethod,
} from '../../types/listExpenses/expensesTypes';

interface DetailsExpenseProps {
  expense: Expense;

  updateExpense?: {
    execute: (data: UpdateExpenseRequest) => Promise<UpdateExpenseResponse>;
    loading: boolean;
  };

  deleteExpense?: {
    execute: (expenseId: string) => Promise<void>;
    loading: boolean;
  };

  updateReceipt?: {
    execute: (
      data: UpdateReceiptExpenseRequest,
    ) => Promise<UpdateReceiptExpenseResponse>;
    loading: boolean;
  };

  deleteReceipt?: {
    execute: (
      receiptId: string,
      receiptIndex: number,
    ) => Promise<DeleteReceiptExpenseReponse>;
    loading: boolean;
  };
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

export default function DetailsExpense({
  expense,
  updateExpense,
  updateReceipt,
  deleteExpense,
  deleteReceipt,
}: DetailsExpenseProps) {
  const { TextArea } = Input;
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingReceipt, setIsEditingReceipt] = useState(false);
  const [editedExpense, setEditedExpense] = useState({
    description: expense.description,
    value: expense.value,
    paymentMethod: expense.paymentMethod,
    category: expense.category,
    responsible: expense.responsible,
    createdAt: expense.createdAt,
  });
  const [images, setImages] = useState<string[]>(expense.images || []);
  const [newBase64Images, setNewBase64Images] = useState<string[]>([]);

  // Dialog states
  const [deleteExpenseDialogOpen, setDeleteExpenseDialogOpen] = useState(false);
  const [deleteReceiptDialogOpen, setDeleteReceiptDialogOpen] = useState(false);
  const [pendingReceiptIndex, setPendingReceiptIndex] = useState<number | null>(
    null,
  );

  // Reset images quando o expense mudar
  useEffect(() => {
    setImages(expense.images || []);
    setNewBase64Images([]);
  }, [expense.images]);

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDeleteExpenseClick = () => {
    setDeleteExpenseDialogOpen(true);
  };

  const handleConfirmDeleteExpense = async () => {
    if (deleteExpense) {
      await deleteExpense.execute(expense.id);
    }
    setDeleteExpenseDialogOpen(false);
  };

  const handleSave = async () => {
    if (updateExpense) {
      await updateExpense.execute({
        expenseId: expense.id,
        description: editedExpense.description,
        value: editedExpense.value,
        paymentMethod: editedExpense.paymentMethod,
        responsible: editedExpense.responsible,
        category: editedExpense.category,
        createdAt: editedExpense.createdAt,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedExpense({
      description: expense.description,
      value: expense.value,
      paymentMethod: expense.paymentMethod,
      category: expense.category,
      responsible: expense.responsible,
      createdAt: expense.createdAt,
    });
    setIsEditing(false);
  };

  const handleEditReceipt = () => {
    setIsEditingReceipt(true);
  };

  const handleSaveReceipt = async () => {
    if (updateReceipt && newBase64Images.length > 0) {
      await updateReceipt.execute({
        expenseId: expense.id,
        receipts: newBase64Images,
      });
    }

    setIsEditingReceipt(false);
    setNewBase64Images([]);
  };

  const handleCancelReceipt = () => {
    setImages(expense.images || []);
    setNewBase64Images([]);
    setIsEditingReceipt(false);
  };

  const handleAddImages = (files: File[], base64Images: string[]) => {
    setImages((prev) => [...prev, ...base64Images]);
    setNewBase64Images((prev) => [...prev, ...base64Images]);
  };

  const handleRemoveImage = (index: number) => {
    const originalImagesCount = expense.images?.length || 0;

    // Verificar se é uma imagem já existente no backend
    if (index < originalImagesCount) {
      // Imagem existente - não faz nada aqui, pois será tratada pelo onDeleteImage
      return;
    } else {
      // É uma imagem nova (base64), remover dos novos arrays
      const newImageIndex = index - originalImagesCount;
      setNewBase64Images((prev) =>
        prev.filter((_, idx) => idx !== newImageIndex),
      );
    }

    // Remover da lista visual
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDeleteImage = (index: number) => {
    setPendingReceiptIndex(index);
    setDeleteReceiptDialogOpen(true);
  };

  const handleConfirmDeleteReceipt = async () => {
    if (deleteReceipt && pendingReceiptIndex !== null) {
      await deleteReceipt.execute(expense.id, pendingReceiptIndex);
    }
    setDeleteReceiptDialogOpen(false);
    setPendingReceiptIndex(null);
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

  const ActionButtons = () => (
    <>
      {!isEditing ? (
        <Button
          type="button"
          size="sm"
          className="flex items-center justify-center gap-1 bg-green-500 p-0 text-white transition-colors hover:bg-green-600"
          onClick={handleEdit}
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Editar gasto</span>
        </Button>
      ) : (
        <>
          <Button
            type="button"
            size="sm"
            onClick={handleCancel}
            className="flex items-center justify-center gap-1 bg-red-500 text-white transition-colors hover:bg-red-600"
          >
            <Undo2 className="h-4 w-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={updateExpense?.loading}
            className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-1 text-white transition-colors"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">
              {updateExpense?.loading ? 'Salvando...' : 'Salvar gasto'}
            </span>
          </Button>
        </>
      )}

      {!isEditing && (
        <Button
          type="button"
          size="sm"
          onClick={handleDeleteExpenseClick}
          disabled={deleteExpense?.loading}
          className="flex items-center justify-center gap-1 bg-red-500 text-white transition-colors hover:bg-red-600"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">
            {deleteExpense?.loading ? 'Deletando...' : 'Deletar gasto'}
          </span>
        </Button>
      )}
    </>
  );

  const ReceiptActionButtons = () => (
    <div className="flex gap-2">
      {!isEditingReceipt ? (
        <Button
          type="button"
          size="sm"
          className="flex items-center justify-center gap-1 bg-green-500 p-0 text-white transition-colors hover:bg-green-600"
          onClick={handleEditReceipt}
        >
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Editar comprovantes</span>
        </Button>
      ) : (
        <>
          <Button
            type="button"
            size="sm"
            onClick={handleCancelReceipt}
            className="flex items-center justify-center gap-1 bg-red-500 text-white transition-colors hover:bg-red-600"
          >
            <Undo2 className="h-4 w-4" />
            <span className="hidden sm:inline">Cancelar</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSaveReceipt}
            disabled={updateReceipt?.loading || newBase64Images.length === 0}
            className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-1 text-white transition-colors"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">
              {updateReceipt?.loading ? 'Salvando...' : 'Salvar comprovantes'}
            </span>
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Confirmation Dialog para deletar gasto */}
      <ConfirmationDialog
        open={deleteExpenseDialogOpen}
        onOpenChange={setDeleteExpenseDialogOpen}
        onConfirm={handleConfirmDeleteExpense}
        title="Deletar gasto"
        message="Tem certeza que deseja deletar este gasto? Esta ação não pode ser desfeita."
        confirmText={deleteExpense?.loading ? 'Deletando...' : 'Deletar'}
        cancelText="Cancelar"
        isLoading={deleteExpense?.loading || false}
        variant="destructive"
      />

      {/* Confirmation Dialog para deletar comprovante */}
      <ConfirmationDialog
        open={deleteReceiptDialogOpen}
        onOpenChange={setDeleteReceiptDialogOpen}
        onConfirm={handleConfirmDeleteReceipt}
        title="Deletar comprovante"
        message="Tem certeza que deseja deletar este comprovante? Esta ação não pode ser desfeita."
        confirmText={deleteReceipt?.loading ? 'Deletando...' : 'Deletar'}
        cancelText="Cancelar"
        isLoading={deleteReceipt?.loading || false}
        variant="destructive"
      />

      {/* Card principal do gasto */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            <div>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                  Detalhes do Gasto
                </h1>
                <div className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
                  <ActionButtons />
                </div>
              </div>

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

            {/* Cards de informações - versão mobile */}
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
                    showCount
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
                    <p className="text-sm">
                      {dateFormatter.format(new Date(expense.createdAt))}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cards de informações - versão desktop */}
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

      {/* Card da descrição */}
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
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800">
        <div className="p-6">
          <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <ImageIcon className="text-muted-foreground h-5 w-5" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Comprovantes ({images.length})
              </h2>
            </div>
            <ReceiptActionButtons />
          </div>

          <ImageGallery
            images={images}
            editing={isEditingReceipt}
            maxCount={3}
            onAddImages={handleAddImages}
            onRemoveImage={handleRemoveImage}
            onDeleteImage={handleDeleteImage}
            size="small"
          />
        </div>
      </div>
    </div>
  );
}
