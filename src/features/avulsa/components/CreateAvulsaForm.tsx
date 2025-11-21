"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, DollarSign, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CreateAvulsaFormData,
  createAvulsaFormSchema,
  ParticipantFormData,
} from "../schema/avulsaSchema";

interface CreateAvulsaFormProps {
  onSubmit: (data: CreateAvulsaFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

interface AddParticipantDialogProps {
  onAddParticipant: (participant: ParticipantFormData) => void;
}

function AddParticipantDialog({ onAddParticipant }: AddParticipantDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<ParticipantFormData>({
    resolver: zodResolver(createAvulsaFormSchema.shape.participants.element),
    defaultValues: {
      name: "",
      gender: "MASCULINO",
      payments: [{ paymentMethod: "DINHEIRO", value: "0" }],
    },
  });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control: form.control,
    name: "payments",
  });

  const onSubmit = (data: ParticipantFormData) => {
    onAddParticipant(data);
    form.reset({
      name: "",
      gender: "MASCULINO",
      payments: [{ paymentMethod: "DINHEIRO", value: "0" }],
    });
    setOpen(false);
  };

  const handleDialogSubmit = form.handleSubmit(onSubmit);

  const addPayment = () => {
    if (paymentFields.length < 3) {
      appendPayment({ paymentMethod: "DINHEIRO", value: "0" });
    }
  };

  const removePaymentFromParticipant = (paymentIndex: number) => {
    if (paymentFields.length > 1) {
      removePayment(paymentIndex);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="border-gray-200 dark:border-gray-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Participante
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Participante</DialogTitle>
          <DialogDescription>
            Preencha os dados do participante e suas formas de pagamento.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleDialogSubmit();
            }}
            className="space-y-6"
          >
            {/* Dados do Participante */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome completo"
                        className="border-gray-200 dark:border-gray-600"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Gênero
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? "MASCULINO"}
                      defaultValue={field.value ?? "MASCULINO"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o gênero" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MASCULINO">Masculino</SelectItem>
                        <SelectItem value="FEMININO">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Formas de Pagamento */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Formas de Pagamento
                </h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addPayment}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  disabled={paymentFields.length >= 3}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-3">
                {paymentFields.map((payment, paymentIndex) => (
                  <div
                    key={payment.id}
                    className="flex gap-3 items-end p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                  >
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`payments.${paymentIndex}.paymentMethod`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-gray-600 dark:text-gray-400">
                              Método
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Método" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="DINHEIRO">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-3 w-3" />
                                    Dinheiro
                                  </div>
                                </SelectItem>
                                <SelectItem value="PIX">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" />
                                    PIX
                                  </div>
                                </SelectItem>
                                <SelectItem value="CARTÃO">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" />
                                    Cartão
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <FormField
                        control={form.control}
                        name={`payments.${paymentIndex}.value`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm text-gray-600 dark:text-gray-400">
                              Valor (R$)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                className="border-gray-200 dark:border-gray-600 text-sm"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {paymentFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removePaymentFromParticipant(paymentIndex)
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="border-gray-200 dark:border-gray-600"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={() => handleDialogSubmit()}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900"
              >
                Adicionar Participante
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function CreateAvulsaForm({
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: CreateAvulsaFormProps) {
  const defaultFormValues = useMemo<CreateAvulsaFormData>(
    () => ({
      responsible: "",
      phone: "",
      status: "PENDING",
      participants: [],
    }),
    []
  );

  const form = useForm<CreateAvulsaFormData>({
    resolver: zodResolver(createAvulsaFormSchema),
    defaultValues: defaultFormValues,
  });

  const {
    fields: participantFields,
    append: appendParticipant,
    remove: removeParticipant,
  } = useFieldArray({
    control: form.control,
    name: "participants",
  });

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }),
    []
  );

  const participantSummaries = participantFields.map((participant, index) => {
    const participantData = form.getValues(`participants.${index}`);
    const payments = participantData?.payments ?? [];
    const total = payments.reduce((sum, payment) => {
      return sum + Number(payment?.value || 0);
    }, 0);

    return {
      index,
      name: participantData?.name || "",
      payments,
      total,
    };
  });

  const overallTotal = participantSummaries.reduce(
    (sum, participant) => sum + participant.total,
    0
  );

  const handleAddParticipant = (participant: ParticipantFormData) => {
    appendParticipant(participant);
  };

  const handleFormSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <Form {...form}>
          <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* Informações do Responsável */}
            <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                  Informações do Responsável
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="responsible"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Nome do Responsável
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome completo"
                            className="border-gray-200 dark:border-gray-600"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Telefone (opcional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="(00) 00000-0000"
                            className="border-gray-200 dark:border-gray-600"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? "PENDING"}
                          defaultValue={field.value ?? "PENDING"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                Pendente
                              </div>
                            </SelectItem>
                            <SelectItem value="PAID">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Pago
                              </div>
                            </SelectItem>
                            <SelectItem value="CANCELLED">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                Cancelado
                              </div>
                            </SelectItem>
                            <SelectItem value="UNDER_REVIEW">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                Em análise
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              {/* Lista de Participantes */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                          Participantes
                        </CardTitle>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {participantFields.length} participante
                          {participantFields.length !== 1 ? "s" : ""} adicionado
                          {participantFields.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <AddParticipantDialog
                      onAddParticipant={handleAddParticipant}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {participantFields.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum participante adicionado ainda</p>
                      <p className="text-sm">
                        Clique em "Adicionar Participante" para começar
                      </p>
                    </div>
                  ) : (
                    participantFields.map((participant, participantIndex) => {
                      const participantData = form.getValues(
                        `participants.${participantIndex}`
                      );
                      const payments = participantData?.payments || [];
                      const total = payments.reduce(
                        (sum, payment) => sum + Number(payment?.value || 0),
                        0
                      );

                      return (
                        <div
                          key={participant.id}
                          className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  {participantIndex + 1}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {participantData?.name ||
                                    `Participante ${participantIndex + 1}`}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {participantData?.gender === "MASCULINO"
                                    ? "Masculino"
                                    : participantData?.gender === "FEMININO"
                                      ? "Feminino"
                                      : "Não informado"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {currencyFormatter.format(total)}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  removeParticipant(participantIndex)
                                }
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {payments.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Formas de Pagamento:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {payments.map((payment, paymentIndex) => (
                                  <Badge
                                    key={paymentIndex}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {payment.paymentMethod}:{" "}
                                    {currencyFormatter.format(
                                      Number(payment.value || 0)
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>

              {/* Resumo Financeiro */}
              <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    Resumo Financeiro
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Valores atualizados conforme os pagamentos informados.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Total Geral
                      </span>
                      <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {currencyFormatter.format(overallTotal || 0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Soma de todos os pagamentos dos participantes.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {participantSummaries.length > 0 ? (
                      participantSummaries.map((participant) => (
                        <div
                          key={`summary-${participant.index}`}
                          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/60"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {participant.name?.trim()
                                  ? participant.name
                                  : `Participante ${participant.index + 1}`}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {participant.payments.length} pagamento
                                {participant.payments.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {currencyFormatter.format(participant.total)}
                            </span>
                          </div>

                          {participant.payments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {participant.payments.map((payment, index) => (
                                <div
                                  key={`payment-${participant.index}-${index}`}
                                  className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300"
                                >
                                  <span>{payment.paymentMethod}</span>
                                  <span>
                                    {currencyFormatter.format(
                                      Number(payment.value || 0)
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Adicione participantes para visualizar o resumo.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-200 dark:border-gray-600"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || participantFields.length === 0}
                className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900"
              >
                {isSubmitting ? "Criando..." : "Criar Inscrição"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
