'use client';

import { MemberDisplayData } from '@/features/inscriptions/types/individualInscription/individualInscriptionTypes';
import { LocalityToAccountCombobox } from '@/features/locality/components/LocalityToAccountCombobox';
import { ComboboxMemberSingle } from '@/features/members/components/membersCombobox/ComboboxMemberSingle';
import { ComboboxTypeInscription } from '@/features/typeInscription/components/ComboboxTypeInscription';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
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
import {
  HelpCircle,
  Lock,
  Phone,
  Trash2,
  User,
  UserSearch,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFormIndividualInscription } from '../../hooks/inscriptionIndiv/useFormCreateIndividualInscription';
import { IncompleteMembersAlert } from '../inscriptionGrup/IncompleteMembersAlert';

interface IndividualInscriptionFormProps {
  eventId: string;
}

export default function IndividualInscriptionForm({
  eventId,
}: IndividualInscriptionFormProps) {
  // Estado para armazenar o ID da localidade selecionada
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('');

  // Estado local para controle do membro selecionado no Combobox
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  const {
    form,
    member,
    addMember,
    removeMember,
    onSubmit,
    isLoading,
    incompleteMembers,
    clearIncompleteMembers,
  } = useFormIndividualInscription(eventId, selectedLocalityId);

  // Função para formatar telefone (máscara)
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) {
      return numbers ? `(${numbers}` : '';
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Função para remover máscara (apenas números)
  const unformatPhone = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    form.setValue('phone', formatted);
    form.trigger('phone');
  };

  const handleMemberSelect = (
    memberId: string,
    memberData?: {
      label: string;
      member?: { birthDate?: Date | string; gender?: string };
    },
  ) => {
    setSelectedMemberId(memberId);

    if (memberId && memberData) {
      // Converte a string para Date se necessário
      let birthDate: Date | undefined = undefined;
      if (memberData.member?.birthDate) {
        if (typeof memberData.member.birthDate === 'string') {
          birthDate = new Date(memberData.member.birthDate);
        } else {
          birthDate = memberData.member.birthDate;
        }
      }

      const newMember: MemberDisplayData = {
        accountParticipantId: memberId,
        typeInscriptionId: '', // Será preenchido quando o tipo for selecionado
        name: memberData.label,
        birthDate,
        gender: memberData.member?.gender,
        typeInscriptionName: '',
      };

      // Salva o membro no estado do hook
      addMember(newMember);
    } else {
      // Remove o membro se não tiver selecionado
      removeMember();
    }
  };

  const handleTypeChange = (selectedValue: string) => {
    if (member && selectedValue) {
      // Atualiza o membro com o tipo selecionado
      const updatedMember: MemberDisplayData = {
        ...member,
        typeInscriptionId: selectedValue,
      };
      addMember(updatedMember);
    }
  };

  const formatBirthDate = (date?: Date | string) => {
    if (!date) return '-';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  // Handler customizado para submit
  const handleFormSubmit = async (event?: React.BaseSyntheticEvent) => {
    // Pega os valores atuais do formulário
    const values = form.getValues();

    // Remove a máscara do telefone antes de enviar
    if (values.phone) {
      form.setValue('phone', unformatPhone(values.phone));
    }

    // Chama o onSubmit do hook
    await onSubmit(event);

    // Restaura a máscara após o submit
    if (values.phone) {
      form.setValue('phone', formatPhone(values.phone));
    }
  };

  const isMemberSelected = !!member;

  return (
    <div className="space-y-6">
      <IncompleteMembersAlert
        open={!!incompleteMembers?.length}
        incompleteMembers={incompleteMembers ?? []}
        members={member!}
        onClose={clearIncompleteMembers}
      />
      {/* Versão Desktop - Card com mais informações */}
      <Card className="border-riodavida/20 from-riodavida/5 dark:border-riodavida/20 dark:from-riodavida/10 dark:to-background hidden w-full bg-gradient-to-r to-white md:block">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-riodavida/10 dark:bg-riodavida/20 rounded-lg p-3">
                <HelpCircle className="text-riodavida dark:text-riodavida h-6 w-6" />
              </div>
              <div>
                <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-semibold">
                  Precisa de ajuda com a inscrição individual?
                </h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Consulte nossa documentação para aprender como registrar
                  inscrições individuais de forma eficiente.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:border-riodavida/30 dark:text-riodavida dark:hover:bg-riodavida/20 dark:hover:text-riodavida-light"
            >
              <Link href="/documentation/inscription/individual">
                Ver Documentação
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Versão Mobile - Card simplificado */}
      <Card className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 w-full md:hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-riodavida dark:text-riodavida h-5 w-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-riodavida dark:text-riodavida truncate text-sm font-medium">
                Precisa de ajuda com a inscrição?
              </p>
              <p className="text-muted-foreground mt-0.5 truncate text-xs">
                Consulte nossa documentação
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 dark:hover:text-riodavida-light h-auto px-2 py-1"
            >
              <Link href="/documentation/inscription/individual">Ver</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card do Responsável */}
      <Card className="liquid-card w-full">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <User className="text-riodavida h-5 w-5 sm:h-6 sm:w-6" />
                Dados do Responsável
              </CardTitle>
              <CardDescription className="mt-1 text-sm sm:text-base">
                Preencha seus dados para contato sobre a inscrição
              </CardDescription>
            </div>
            <div className="text-muted-foreground border-riodavida/20 bg-riodavida/5 rounded-md border px-3 py-1.5 text-xs sm:text-sm">
              Campos com * são obrigatórios
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Localidade - Seleciona a localidade para buscar membros */}
                <div className="space-y-3 sm:col-span-2">
                  <Label htmlFor="locality" className="text-base font-medium">
                    Localidade *
                  </Label>
                  <LocalityToAccountCombobox
                    value={selectedLocalityId}
                    onChange={setSelectedLocalityId}
                    placeholder="Selecione a localidade"
                    disabled={false}
                  />
                </div>

                {/* Responsável */}
                <FormField
                  control={form.control}
                  name="responsible"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel className="text-base font-medium">
                        Nome do Responsável *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome completo do responsável"
                          {...field}
                          className="focus:border-riodavida focus:ring-riodavida/20 text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* E-mail e Telefone - Lado a lado */}
                <div className="sm:col-span-2">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    {/* E-mail */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            E-mail do Responsável
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="exemplo@dominio.com"
                              {...field}
                              value={field.value ?? ''}
                              className="focus:border-riodavida focus:ring-riodavida/20 text-base"
                            />
                          </FormControl>
                          <p className="text-muted-foreground text-xs sm:text-[13px]">
                            Opcional — usado apenas para atualizações da
                            inscrição.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Telefone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">
                            <Phone className="text-riodavida mr-2 inline h-4 w-4" />
                            Telefone do Responsável *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(99) 9XXXX-XXXX"
                              {...field}
                              onChange={handlePhoneChange}
                              maxLength={15}
                              className="border-glass bg-background/50 backdrop-blur-sm"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Card da Inscrição */}
      <Card className="liquid-card w-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <UserSearch className="text-riodavida h-5 w-5 sm:h-6 sm:w-6" />
            Dados da Inscrição
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Selecione o membro e o tipo de inscrição
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6">
            {/* Busca de Membro */}
            <div className="space-y-3">
              <Label htmlFor="memberSelect" className="text-base font-medium">
                Buscar Membro *
              </Label>
              <ComboboxMemberSingle
                eventId={eventId}
                requireLocalityId={true}
                localityId={selectedLocalityId}
                id="memberSelect"
                value={selectedMemberId}
                onChange={(memberId, memberData) =>
                  handleMemberSelect(memberId, memberData)
                }
              />
              {!isMemberSelected && (
                <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-xs sm:text-sm">
                  <Lock className="text-riodavida h-3 w-3 flex-shrink-0" />
                  Selecione um membro para liberar os campos abaixo
                </p>
              )}
            </div>

            {/* Dados Readonly do Membro */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              <div className="space-y-3">
                <Label className="text-muted-foreground text-base font-medium">
                  Nome Completo
                </Label>
                <Input
                  value={member?.name ?? ''}
                  readOnly
                  placeholder="—"
                  className="bg-riodavida/5 dark:bg-riodavida/10 h-11 text-base sm:h-12"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-muted-foreground text-base font-medium">
                  Data de Nascimento
                </Label>
                <Input
                  value={formatBirthDate(member?.birthDate)}
                  readOnly
                  placeholder="—"
                  className="bg-riodavida/5 dark:bg-riodavida/10 h-11 text-base sm:h-12"
                />
              </div>
              <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                <Label className="text-muted-foreground text-base font-medium">
                  Gênero
                </Label>
                <Input
                  value={
                    member?.gender
                      ? member.gender === 'masculino'
                        ? 'Masculino'
                        : 'Feminino'
                      : '—'
                  }
                  readOnly
                  placeholder="—"
                  className="bg-riodavida/5 dark:bg-riodavida/10 h-11 text-base sm:h-12"
                />
              </div>
            </div>

            {/* Tipo de Inscrição */}
            <div className="space-y-3">
              <Label
                htmlFor="typeInscriptionId"
                className="text-base font-medium"
              >
                Tipo de Inscrição *
              </Label>
              <div>
                <ComboboxTypeInscription
                  eventId={eventId}
                  value={member?.typeInscriptionId ?? ''}
                  onChange={handleTypeChange}
                  disabled={!isMemberSelected}
                />
              </div>
              {!member?.typeInscriptionId && isMemberSelected && (
                <p className="mt-1 text-sm text-red-500">
                  Selecione um tipo de inscrição
                </p>
              )}
            </div>

            {/* Botão Remover Membro - aparece quando tem membro selecionado */}
            {isMemberSelected && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeMember}
                  className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover Membro
                </Button>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="order-2 sm:order-1">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full sm:w-auto sm:text-sm"
              >
                <Link href="/documentation/inscription/individual">
                  Precisa de ajuda? Consulte o guia
                </Link>
              </Button>
            </div>
            <div className="order-1 w-full sm:order-2 sm:w-auto">
              <Button
                type="button"
                onClick={handleFormSubmit}
                className="bg-riodavida hover:bg-riodavida-dark h-11 w-full py-3 text-sm text-white sm:h-12 sm:px-8 sm:text-base"
                disabled={
                  isLoading ||
                  !isMemberSelected ||
                  !member?.typeInscriptionId ||
                  !!form.formState.errors.responsible ||
                  !!form.formState.errors.phone
                }
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
                    Processando...
                  </span>
                ) : (
                  'Finalizar Inscrição'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
