"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { useCurrentUser } from "@/shared/context/user-context";
import { formatDateTime } from "@/shared/utils/formatDate";
import { AlertCircle, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import useFormCreateMembers from "../hook/useFormCreateMembers";
import { Member } from "../types/membersType";

type MembersTableProps = {
  members: Member[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
};

// Função para formatar apenas data (para birthDate)
const formatDateOnly = (dateString: string | Date): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Formata data: DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export default function MembersTable({
  members,
  total,
  page,
  pageCount,
  onPageChange,
  pageSize = 10, // Valor padrão de 10 itens por página
}: MembersTableProps) {
  const { user } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { form, onSubmit } = useFormCreateMembers();

  // Função para calcular o índice global
  const calculateGlobalIndex = (localIndex: number): number => {
    return (page - 1) * pageSize + localIndex + 1;
  };

  // Função para dividir os erros por vírgula e criar um array
  const parseErrorMessages = (errorMessage: string): string[] => {
    return errorMessage.split(", ").map((err) => err.trim());
  };

  // Função para lidar com o submit e abrir o modal de sucesso
  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    if (event?.preventDefault) event.preventDefault();

    // Limpar erro anterior
    setSubmitError(null);

    // Executar a validação do formulário
    const isValid = await form.trigger();
    if (!isValid) return false;

    // Executar o submit através do hook
    const result = await onSubmit(event);

    if (result.success) {
      toast.success("Membro criado!", {
        description: "Membro criado com sucesso e já pode ser utilizado",
        icon: <ThumbsUp />,
      });
      setOpen(false);
      return true;
    } else {
      // Exibir erro no formulário
      setSubmitError(result.error || "Não foi possível criar o membro.");
      toast.error(result.error || "Não foi possível criar o membro.");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-end mb-6">
          <Button
            variant="default"
            className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
            onClick={() => {
              setOpen(true);
              setSubmitError(null); // Limpar erro ao abrir o modal
            }}
          >
            Criar Membro
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-2 text-center font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">Nome</th>
                <th className="px-4 py-2 text-center font-semibold">
                  Data Nasc.
                </th>
                <th className="px-4 py-2 text-center font-semibold">
                  Criado em
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Nenhum membro encontrado
                  </td>
                </tr>
              ) : (
                members.map((member, idx) => (
                  <tr
                    key={member.id}
                    className="border-t hover:bg-muted/50 transition-colors"
                  >
                    <td className="w-12 px-4 py-2 text-center font-medium">
                      {calculateGlobalIndex(idx)}
                    </td>
                    <td className="px-4 py-2 uppercase">{member.name}</td>
                    <td className="px-4 py-2 text-center">
                      {formatDateOnly(member.birthDate)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {formatDateTime(member.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div className="flex justify-between items-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && onPageChange(page - 1)}
                  href={page > 1 ? "#" : undefined}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: pageCount }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    href="#"
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < pageCount && onPageChange(page + 1)}
                  href={page < pageCount ? "#" : undefined}
                  className={
                    page === pageCount ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Informações de paginação */}
        <div className="text-center text-sm text-muted-foreground mt-2">
          Página {page} de {pageCount} • {pageSize} itens por página
        </div>

        {/* Modal de criação */}
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setSubmitError(null); // Limpar erro ao fechar
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary">Criar Membro</DialogTitle>
            </DialogHeader>
            <FormProvider {...form}>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                {/* Nome */}
                <div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          Nome
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Digite o nome"
                            className="w-full rounded-xl border-gray-300 bg-white/50 dark:bg-gray-800/50 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-60 focus:shadow-md dark:border-gray-600 dark:text-white backdrop-blur-sm transition-all duration-300 pl-4 pr-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Data de Nascimento */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          htmlFor="birthDate"
                          className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center"
                        >
                          Data de Nascimento
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="birthDate"
                            type="date"
                            className="w-60 rounded-xl border-gray-300 bg-white/50 dark:bg-gray-800/50 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-60 focus:shadow-md dark:border-gray-600 dark:text-white backdrop-blur-sm transition-all duration-300 pl-4 pr-4 py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Gênero - CORREÇÃO: valor correto é "MASCULINO" */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Gênero
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex space-x-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="MASCULINO"
                                id="masculino"
                              />
                              <label
                                htmlFor="masculino"
                                className="text-sm text-gray-700 dark:text-gray-300"
                              >
                                Masculino
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="FEMININO" id="feminino" />
                              <label
                                htmlFor="feminino"
                                className="text-sm text-gray-700 dark:text-gray-300"
                              >
                                Feminino
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Mensagem de erro do submit - MODIFICADO para exibir cada erro em uma linha */}
                {submitError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        {parseErrorMessages(submitError).map(
                          (errorLine, index) => (
                            <span key={index} className="text-sm font-medium">
                              • {errorLine}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button
                    type="submit"
                    className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                  >
                    Salvar
                  </Button>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSubmitError(null)}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
