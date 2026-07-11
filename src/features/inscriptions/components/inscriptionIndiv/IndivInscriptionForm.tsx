'use client';

import { ComboboxMemberSingle } from '@/features/members/components/membersCombobox/ComboboxMemberSingle';
import { ComboboxTypeInscription } from '@/features/typeInscription/components/ComboboxTypeInscription';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { HelpCircle, Lock, Phone, User, UserSearch } from 'lucide-react';
import Link from 'next/link';
import { useFormCreateIndividualInscription } from '../../hooks/inscriptionIndiv/useFormCreateIndividualInscription';

interface IndividualInscriptionFormProps {
  eventId: string;
}

export default function IndividualInscriptionForm({
  eventId,
}: IndividualInscriptionFormProps) {
  const {
    formData,
    isSubmitting,
    formErrors,
    handleInputChange,
    handleSubmit,
    handleMemberSelect,
    selectedMemberId,
    register,
  } = useFormCreateIndividualInscription({ eventId });

  // Verifica se um membro foi selecionado
  const isMemberSelected = !!selectedMemberId;

  return (
    <div className="space-y-6">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="space-y-3 sm:col-span-2">
              <Label htmlFor="responsible" className="text-base font-medium">
                Nome do Responsável *
              </Label>
              <Input
                id="responsible"
                {...register('responsible')}
                value={formData.responsible}
                onChange={handleInputChange}
                placeholder="Digite o nome completo do responsável"
                className={cn(
                  'focus:border-riodavida focus:ring-riodavida/20 h-11 text-base sm:h-12',
                  formErrors.responsible &&
                    'border-red-500 focus:border-red-500',
                )}
              />
              {formErrors.responsible && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.responsible.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium">
                E-mail do Responsável
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                value={formData.email ?? ''}
                onChange={handleInputChange}
                placeholder="exemplo@dominio.com"
                className={cn(
                  'focus:border-riodavida focus:ring-riodavida/20 h-11 text-base sm:h-12',
                  formErrors.email && 'border-red-500 focus:border-red-500',
                )}
              />
              <p className="text-muted-foreground text-xs sm:text-[13px]">
                Opcional — usado apenas para atualizações da inscrição.
              </p>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-base font-medium">
                <Phone className="text-riodavida mr-2 inline h-4 w-4" />
                Telefone do Responsável *
              </Label>
              <Input
                id="phone"
                {...register('phone')}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className={cn(
                  'focus:border-riodavida focus:ring-riodavida/20 h-11 text-base sm:h-12',
                  formErrors.phone && 'border-red-500 focus:border-red-500',
                )}
              />
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.phone.message}
                </p>
              )}
            </div>
          </div>
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
                id="memberSelect"
                value={selectedMemberId ?? ''}
                onChange={(memberId, member) =>
                  handleMemberSelect(memberId, member)
                }
                className={cn(
                  'h-11 sm:h-12',
                  formErrors.participantName &&
                    '[&_button]:border-red-500 [&_button]:focus:border-red-500',
                )}
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
                  value={formData.participantName ?? ''}
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
                  value={formData.birthDate ?? ''}
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
                    formData.gender
                      ? formData.gender === 'masculino'
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
              <div
                className={cn(
                  formErrors.typeInscriptionId &&
                    '[&_button]:border-red-500 [&_button]:focus:border-red-500',
                )}
              >
                <ComboboxTypeInscription
                  eventId={eventId}
                  value={formData.typeInscriptionId}
                  onChange={(selectedValue) => {
                    const event = {
                      target: {
                        name: 'typeInscriptionId',
                        value: selectedValue,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleInputChange(event);
                  }}
                  disabled={!isMemberSelected}
                />
              </div>
              {formErrors.typeInscriptionId && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.typeInscriptionId.message}
                </p>
              )}
            </div>
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
                onClick={handleSubmit}
                className="bg-riodavida hover:bg-riodavida-dark h-11 w-full py-3 text-sm text-white sm:h-12 sm:px-8 sm:text-base"
                disabled={
                  isSubmitting ||
                  !isMemberSelected ||
                  Object.keys(formErrors).length > 0
                }
              >
                {isSubmitting ? (
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
