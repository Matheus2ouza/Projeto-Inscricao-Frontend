"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { formatDateTime } from "@/shared/utils/formatDate";
import type { SelectProps } from "antd";
import {
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { AlertCircle, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import useFormCreateMembers from "../hook/useFormCreateMembers";
import { Member, genderType } from "../types/membersType";

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

// Função para formatar CPF
const formatCPF = (cpf?: string): string => {
  if (!cpf) return "-";
  // Formata CPF: XXX.XXX.XXX-XX
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para formatar gênero
const formatGender = (gender: genderType): string => {
  return gender === "MASCULINO" ? "Masculino" : "Feminino";
};

// Função para obter cor do badge de gênero
const getGenderColor = (gender: genderType): string => {
  return gender === "MASCULINO" ? "blue" : "pink";
};

// Opções para tamanho de camiseta
const shirtSizeOptions: SelectProps["options"] = [
  { label: "PP", value: "PP" },
  { label: "P", value: "P" },
  { label: "M", value: "M" },
  { label: "G", value: "G" },
  { label: "GG", value: "GG" },
  { label: "XG", value: "XG" },
];

// Opções para tipo de camiseta
const shirtTypeOptions: SelectProps["options"] = [
  { label: "Tradicional", value: "TRADICIONAL" },
  { label: "Baby Look", value: "BABYLOOK" },
];

// Opções para gênero
const genderOptions = [
  { label: "Masculino", value: "MASCULINO" },
  { label: "Feminino", value: "FEMININO" },
];

export default function MembersTable({
  members,
  total,
  page,
  pageCount,
  onPageChange,
  pageSize = 10,
}: MembersTableProps) {
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
              setSubmitError(null);
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
                <th className="px-4 py-2 text-left font-semibold">CPF</th>
                <th className="px-4 py-2 text-center font-semibold">Gênero</th>
                <th className="px-4 py-2 text-center font-semibold">
                  Criado em
                </th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
                    <td className="px-4 py-2 ">{member.name}</td>
                    <td className="px-4 py-2 ">{formatCPF(member.cpf)}</td>
                    <td className="px-4 py-2 text-center">
                      <Tag color={getGenderColor(member.gender)}>
                        {formatGender(member.gender)}
                      </Tag>
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
          className="dark:bg-white/5"
        >
          <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Nome */}
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Form.Item
                    label="Nome"
                    validateStatus={fieldState.error ? "error" : ""}
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
                    validateStatus={fieldState.error ? "error" : ""}
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
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                    required
                  >
                    <DatePicker
                      {...field}
                      style={{ width: "100%" }}
                      placeholder="Selecione a data de nascimento"
                      format="DD/MM/YYYY"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {
                        field.onChange(date ? date.format("YYYY-MM-DD") : "");
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
                    validateStatus={fieldState.error ? "error" : ""}
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
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                  >
                    <Select
                      {...field}
                      style={{ width: "100%" }}
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
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                  >
                    <Select
                      {...field}
                      style={{ width: "100%" }}
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
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
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
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setSubmitError(null);
                    form.reset();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                >
                  Salvar
                </Button>
              </div>
            </form>
          </FormProvider>
        </Modal>
      </div>
    </div>
  );
}
