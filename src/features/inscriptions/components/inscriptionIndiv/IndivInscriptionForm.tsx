"use client";

import { ComboboxMemberSingle } from "@/features/members/components/combobox/ComboboxMemberSingle";
import { ComboboxTypeInscription } from "@/features/typeInscription/components/ComboboxTypeInscription";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { HelpCircle, Lock, Phone, User, UserSearch } from "lucide-react";
import Link from "next/link";
import { useFormCreateIndividualInscription } from "../../hooks/inscriptionIndiv/useFormCreateIndividualInscription";

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
      <Card className="hidden md:block w-full border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/30 dark:to-background">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg">
                <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300">
                  Precisa de ajuda com a inscrição individual?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Consulte nossa documentação para aprender como registrar
                  inscrições individuais de forma eficiente.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              <Link href="/documentation/inscription/individual">
                Ver Documentação
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Versão Mobile - Card simplificado */}
      <Card className="md:hidden w-full border-blue-100 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-blue-700 dark:text-blue-300 truncate">
                Precisa de ajuda com a inscrição?
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Consulte nossa documentação
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-2 py-1 h-auto"
            >
              <Link href="/documentation/inscription/individual">Ver</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Card do Responsável */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
                Dados do Responsável
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Preencha seus dados para contato sobre a inscrição
              </CardDescription>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
              Campos com * são obrigatórios
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-3 sm:col-span-2">
              <Label htmlFor="responsible" className="text-base font-medium">
                Nome do Responsável *
              </Label>
              <Input
                id="responsible"
                {...register("responsible")}
                value={formData.responsible}
                onChange={handleInputChange}
                placeholder="Digite o nome completo do responsável"
                className={cn(
                  "h-11 sm:h-12 text-base",
                  formErrors.responsible &&
                    "border-red-500 focus:border-red-500",
                )}
              />
              {formErrors.responsible && (
                <p className="text-red-500 text-sm mt-1">
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
                {...register("email")}
                value={formData.email ?? ""}
                onChange={handleInputChange}
                placeholder="exemplo@dominio.com"
                className={cn(
                  "h-11 sm:h-12 text-base",
                  formErrors.email && "border-red-500 focus:border-red-500",
                )}
              />
              <p className="text-xs sm:text-[13px] text-muted-foreground">
                Opcional — usado apenas para atualizações da inscrição.
              </p>
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="phone" className="text-base font-medium">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefone do Responsável *
              </Label>
              <Input
                id="phone"
                {...register("phone")}
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(11) 99999-9999"
                maxLength={15}
                className={cn(
                  "h-11 sm:h-12 text-base",
                  formErrors.phone && "border-red-500 focus:border-red-500",
                )}
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.phone.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card da Inscrição */}
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
            <UserSearch className="h-5 w-5 sm:h-6 sm:w-6" />
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
                value={selectedMemberId}
                onChange={(memberId, member) =>
                  handleMemberSelect(memberId, member)
                }
                className={cn(
                  "h-11 sm:h-12",
                  formErrors.participantName &&
                    "[&_button]:border-red-500 [&_button]:focus:border-red-500",
                )}
              />
              {!isMemberSelected && (
                <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1.5 mt-2">
                  <Lock className="h-3 w-3 flex-shrink-0" />
                  Selecione um membro para liberar os campos abaixo
                </p>
              )}
            </div>

            {/* Dados Readonly do Membro */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium text-muted-foreground">
                  Nome Completo
                </Label>
                <Input
                  value={formData.participantName}
                  readOnly
                  placeholder="—"
                  className="h-11 sm:h-12 text-base bg-gray-50/50 dark:bg-white/5"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base font-medium text-muted-foreground">
                  Data de Nascimento
                </Label>
                <Input
                  value={formData.birthDate}
                  readOnly
                  placeholder="—"
                  className="h-11 sm:h-12 text-base bg-gray-50/50 dark:bg-white/5"
                />
              </div>
              <div className="space-y-3 sm:col-span-2 lg:col-span-1">
                <Label className="text-base font-medium text-muted-foreground">
                  Gênero
                </Label>
                <Input
                  value={
                    formData.gender
                      ? formData.gender === "masculino"
                        ? "Masculino"
                        : "Feminino"
                      : "—"
                  }
                  readOnly
                  placeholder="—"
                  className="h-11 sm:h-12 text-base bg-gray-50/50 dark:bg-white/5"
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
                    "[&_button]:border-red-500 [&_button]:focus:border-red-500",
                )}
              >
                <ComboboxTypeInscription
                  eventId={eventId}
                  value={formData.typeInscriptionId}
                  onChange={(selectedValue) => {
                    const event = {
                      target: {
                        name: "typeInscriptionId",
                        value: selectedValue,
                      },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleInputChange(event);
                  }}
                  disabled={!isMemberSelected}
                />
              </div>
              {formErrors.typeInscriptionId && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.typeInscriptionId.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mt-6 sm:mt-8">
            <div className="order-2 sm:order-1">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Link href="/documentation/inscription/individual">
                  Precisa de ajuda? Consulte o guia
                </Link>
              </Button>
            </div>
            <div className="order-1 sm:order-2 w-full sm:w-auto">
              <Button
                onClick={handleSubmit}
                className="w-full sm:px-8 py-3 text-sm sm:text-base transform uppercase dark:text-white h-11 sm:h-12"
                disabled={
                  isSubmitting ||
                  !isMemberSelected ||
                  Object.keys(formErrors).length > 0
                }
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                  "Finalizar Inscrição"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
