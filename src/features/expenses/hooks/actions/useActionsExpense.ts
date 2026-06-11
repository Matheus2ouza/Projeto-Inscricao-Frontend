import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  deleteExpense,
  DeleteExpenseRequest,
} from '../../api/actions/deleteExpense';
import {
  deleteReceiptExpense,
  DeleteReceiptExpenseReponse,
  DeleteReceiptExpenseRequest,
} from '../../api/actions/deleteReceiptExpense';
import {
  updateExpense,
  UpdateExpenseRequest,
  UpdateExpenseResponse,
} from '../../api/actions/updateExpense';
import {
  updateReceiptExpense,
  UpdateReceiptExpenseRequest,
  UpdateReceiptExpenseResponse,
} from '../../api/actions/updateReceiptExpense';
import { useInvalidateDetailsExpenseQuery } from '../detailsExpense/useDetailsExpenseQuery';
import { useInvalidateListExpensesQuery } from '../listExpenses/useListExpensesQuery';

export function useActionsExpense() {
  const { invalidateLists: invalidateLists } = useInvalidateListExpensesQuery();
  const { invalidateList: invalidateDetail, removeList: removeDetail } =
    useInvalidateDetailsExpenseQuery();

  const { mutateAsync: updateExpenseMutation, isPending: isUpdateExpense } =
    useMutation<UpdateExpenseResponse, Error, UpdateExpenseRequest>({
      mutationFn: updateExpense,
      onSuccess: (data, variables) => {
        toast.success('Gasto atualizado com sucesso');
        invalidateLists();
        invalidateDetail(variables.expenseId);
      },
      onError: (error) => {
        toast.error(`Erro ao atualizar o gasto: ${error.message}`);
      },
    });

  const {
    mutateAsync: updateReceiptExpenseMutation,
    isPending: isUpdateReceiptExpense,
  } = useMutation<
    UpdateReceiptExpenseResponse,
    Error,
    UpdateReceiptExpenseRequest
  >({
    mutationFn: updateReceiptExpense,
    onSuccess: (data, variables) => {
      toast.success('Comprovante atualizado com sucesso.');
      invalidateDetail(variables.expenseId);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar o comprovante: ${error.message}`);
    },
  });

  const { mutateAsync: deleteExpenseMutation, isPending: isDeleteExpense } =
    useMutation<void, Error, DeleteExpenseRequest>({
      mutationFn: deleteExpense,
      onSuccess: (data, variables) => {
        toast.success('Gasto deletado com sucesso');
        removeDetail(variables.id);
        invalidateLists();
      },
      onError: (error) => {
        toast.error(`Erro ao deletar o gasto: ${error.message}`);
      },
    });

  const {
    mutateAsync: deleteReceiptExpenseMutation,
    isPending: isDeleteReceiptExpense,
  } = useMutation<
    DeleteReceiptExpenseReponse,
    Error,
    DeleteReceiptExpenseRequest
  >({
    mutationFn: deleteReceiptExpense,
    onSuccess: (data, variables) => {
      toast.success(
        `Comprovante deletado com sucesso. ${data.remainingReceipts} comprovante(s) restante(s).`,
      );
      invalidateDetail(variables.id);
    },
    onError: (error) => {
      toast.error(`Erro ao deletar o comprovante: ${error.message}`);
    },
  });

  return {
    updateExpense: {
      execute: async (data: UpdateExpenseRequest) =>
        updateExpenseMutation(data),
      loading: isUpdateExpense,
    },

    deleteExpense: {
      execute: async (expenseId: string) =>
        deleteExpenseMutation({ id: expenseId }),
      loading: isDeleteExpense,
    },

    updateReceipt: {
      execute: async (data: UpdateReceiptExpenseRequest) =>
        updateReceiptExpenseMutation(data),
      loading: isUpdateReceiptExpense,
    },

    deleteReceipt: {
      execute: async (receiptId: string, receiptIndex: number) =>
        deleteReceiptExpenseMutation({ id: receiptId, receiptIndex }),
      loading: isDeleteReceiptExpense,
    },
  };
}
