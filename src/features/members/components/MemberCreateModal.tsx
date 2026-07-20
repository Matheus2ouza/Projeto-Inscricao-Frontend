'use client';

import { LocalityToAccountCombobox } from '@/features/locality/components/LocalityToAccountCombobox';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { AlertCircle, ThumbsUp, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { toast } from 'sonner';
import useFormCreateMember from '../hook/createMember/useFormCreateMember';

interface MemberCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MemberCreateModal({
  open,
  onClose,
  onSuccess,
}: MemberCreateModalProps) {
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { form, onSubmit, isLoading } = useFormCreateMember(selectedLocalityId);

  // Função para formatar CPF (máscara)
  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }
  };

  // Função para remover máscara (apenas números)
  const unformatCPF = (value: string) => {
    return value.replace(/\D/g, '');
  };

  // Handler para mudança do CPF com máscara
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    form.setValue('cpf', formatted);
    form.trigger('cpf');
  };

  // Função para lidar com o submit
  const handleSubmit = async (event?: React.BaseSyntheticEvent) => {
    if (event?.preventDefault) event.preventDefault();

    // Limpa erro anterior
    setSubmitError(null);

    const isValid = await form.trigger();
    if (!isValid) return;

    // Pega os valores atuais do formulário
    const values = form.getValues();

    // Remove a máscara do CPF antes de enviar
    if (values.cpf) {
      form.setValue('cpf', unformatCPF(values.cpf));
    }

    // Chama o onSubmit do hook e aguarda o resultado
    const result = await onSubmit(event);

    // Se foi bem-sucedido, fecha o modal e chama onSuccess
    if (result.success) {
      toast.success('Membro criado!', {
        description: 'Membro criado com sucesso e já pode ser utilizado',
        icon: <ThumbsUp />,
        className: 'z-[9999]',
      });

      form.reset();
      setSelectedLocalityId('');
      setSubmitError(null);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } else {
      // Se deu erro, exibe no modal
      setSubmitError(result.error || 'Erro ao criar membro. Tente novamente.');
    }
  };

  // Função para fechar o modal e resetar o estado
  const handleClose = () => {
    form.reset();
    setSelectedLocalityId('');
    setSubmitError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[640px]">
        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-riodavida/10 dark:bg-riodavida/20 rounded-lg p-1">
                    <UserPlus className="text-riodavida h-5 w-5" />
                  </div>
                  <div>
                    <DialogTitle className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-semibold">
                      Criar Membro
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm font-normal">
                      Preencha os dados para cadastrar um novo membro
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="mt-3 space-y-4">
                {/* Localidade */}
                <div className="space-y-2">
                  <Label htmlFor="locality" className="text-base font-medium">
                    Localidade <span className="text-red-500">*</span>
                  </Label>
                  <LocalityToAccountCombobox
                    value={selectedLocalityId}
                    onChange={setSelectedLocalityId}
                    placeholder="Selecione a localidade"
                    disabled={false}
                  />
                  {!selectedLocalityId && (
                    <p className="text-muted-foreground text-sm">
                      Selecione uma localidade para criar o membro
                    </p>
                  )}
                </div>

                {/* Nome */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Nome <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome completo"
                          {...field}
                          className="focus:border-riodavida focus:ring-riodavida/20 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CPF com máscara */}
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        CPF{' '}
                        <span className="text-muted-foreground text-sm font-normal">
                          (opcional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          {...field}
                          onChange={handleCPFChange}
                          maxLength={14}
                          className="focus:border-riodavida focus:ring-riodavida/20 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data de Nascimento com DatePicker do Ant Design */}
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Data de Nascimento{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
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
                          status={fieldState.error ? 'error' : ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gênero com shadcn RadioGroup */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Gênero <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          className="flex flex-col sm:flex-row sm:space-y-0 sm:space-x-6"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem
                              value="MASCULINO"
                              id="masculino"
                              className="border-riodavida/40 text-riodavida focus:ring-riodavida/20"
                            />
                            <Label
                              htmlFor="masculino"
                              className="cursor-pointer text-base font-normal"
                            >
                              Masculino
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem
                              value="FEMININO"
                              id="feminino"
                              className="border-riodavida/40 text-riodavida focus:ring-riodavida/20"
                            />
                            <Label
                              htmlFor="feminino"
                              className="cursor-pointer text-base font-normal"
                            >
                              Feminino
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mensagem de erro do submit */}
                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-950/20">
                    <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
                      <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">
                          {submitError}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer com botões */}
              <DialogFooter className="border-riodavida/10 mt-6 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full sm:w-auto"
                  >
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-riodavida hover:bg-riodavida-dark w-full text-white sm:w-auto"
                  disabled={isLoading || !selectedLocalityId}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Salvando...
                    </span>
                  ) : (
                    'Salvar Membro'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
