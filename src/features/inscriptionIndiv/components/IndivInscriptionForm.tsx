"use client";

import { ComboboxMemberSingle } from "@/features/members/components/combobox/ComboboxMemberSingle";
import { ComboboxTypeInscription } from "@/features/typeInscription/components/ComboboxTypeInscription";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Popover, PopoverTrigger } from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Lock, UserSearch } from "lucide-react";
import { useFormCreateIndividualInscription } from "../hooks/useFormCreateIndividualInscription";

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
    <Card className="border-2 border-primary/10">
      <CardHeader className="from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
        <div className="flex items-center gap-3">
          <UserSearch className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Formulário de Inscrição</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Selecione um membro para preencher automaticamente os dados
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção 1: Seleção do Membro */}
          <div className="space-y-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-700/30">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">1. Selecione um Membro</h3>
              <Badge
                variant="outline"
                className="text-xs bg-blue-100 dark:bg-blue-900"
              >
                Obrigatório
              </Badge>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Busque um membro cadastrado no sistema. Todos os dados pessoais
              serão preenchidos automaticamente.
            </p>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="memberSelect" className="text-base">
                  Buscar membro *
                </Label>
                <Badge variant="secondary" className="text-xs">
                  <UserSearch className="h-3 w-3 mr-1" />
                  Busque pelo nome
                </Badge>
              </div>
              <ComboboxMemberSingle
                id="memberSelect"
                value={selectedMemberId}
                onChange={(memberId, member) =>
                  handleMemberSelect(memberId, member)
                }
                className={cn(
                  formErrors.typeInscriptionId &&
                    "[&_button]:border-red-500 [&_button]:focus:border-red-500",
                  isMemberSelected && "border-2 border-green-500"
                )}
                usePortal={true}
              />
              {!isMemberSelected && (
                <p className="text-amber-600 dark:text-amber-400 text-sm mt-2 flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Selecione um membro para liberar os campos abaixo
                </p>
              )}
              {isMemberSelected && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    Membro selecionado! Dados preenchidos automaticamente.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Seção 2: Dados do Inscrito (Somente Leitura) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">2. Dados do Inscrito</h3>
              <Badge variant="outline" className="text-xs">
                Somente leitura
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Nome do Inscrito */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="participantName">
                    Nome completo do inscrito *
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    Automático
                  </Badge>
                </div>
                <div className="relative">
                  <Input
                    id="participantName"
                    {...register("participantName")}
                    value={formData.participantName}
                    onChange={handleInputChange}
                    placeholder="Selecione um membro primeiro"
                    readOnly
                    className={cn(
                      "bg-gray-50 dark:bg-gray-900/50",
                      formErrors.participantName &&
                        "border-red-500 focus:border-red-500",
                      isMemberSelected &&
                        "border-green-200 bg-green-50/50 dark:bg-green-900/10"
                    )}
                  />
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {formErrors.participantName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.participantName.message}
                  </p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="birthDate">Data de nascimento *</Label>
                  <Badge variant="secondary" className="text-xs">
                    Automático
                  </Badge>
                </div>
                <div className="relative">
                  <Input
                    id="birthDate"
                    {...register("birthDate")}
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    placeholder="DD/MM/AAAA"
                    maxLength={10}
                    readOnly
                    className={cn(
                      "bg-gray-50 dark:bg-gray-900/50",
                      formErrors.birthDate &&
                        "border-red-500 focus:border-red-500",
                      isMemberSelected &&
                        "border-green-200 bg-green-50/50 dark:bg-green-900/10"
                    )}
                  />
                  <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                {formErrors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.birthDate.message}
                  </p>
                )}
              </div>

              {/* Gênero */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gender">Gênero *</Label>
                  <Badge variant="secondary" className="text-xs">
                    Automático
                  </Badge>
                </div>
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild disabled>
                      <Button
                        id="gender"
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between bg-gray-50 dark:bg-gray-900/50",
                          formErrors.gender &&
                            "border-red-500 focus:border-red-500",
                          isMemberSelected &&
                            "border-green-200 bg-green-50/50 dark:bg-green-900/10"
                        )}
                        aria-expanded={false}
                      >
                        <span
                          className={cn(
                            formData.gender
                              ? "text-gray-700 dark:text-gray-200"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {formData.gender
                            ? formData.gender === "masculino"
                              ? "Masculino"
                              : "Feminino"
                            : "Selecione um membro"}
                        </span>
                        <Lock className="h-4 w-4 text-gray-400" />
                      </Button>
                    </PopoverTrigger>
                  </Popover>
                </div>
                {formErrors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Seção 3: Tipo de Inscrição */}
          <div className="space-y-4 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">3. Tipo de Inscrição</h3>
              <Badge
                variant="outline"
                className="text-xs bg-amber-100 dark:bg-amber-900"
              >
                Escolha obrigatória
              </Badge>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Selecione o tipo de inscrição para o membro escolhido.
            </p>

            <div className="space-y-2">
              <Label htmlFor="typeInscriptionId">Tipo de inscrição *</Label>
              <div
                className={cn(
                  formErrors.typeInscriptionId &&
                    "[&_button]:border-red-500 [&_button]:focus:border-red-500"
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
              {!isMemberSelected && (
                <p className="text-amber-600 dark:text-amber-400 text-sm mt-2">
                  Selecione um membro primeiro para escolher o tipo de inscrição
                </p>
              )}
              {formErrors.typeInscriptionId && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.typeInscriptionId.message}
                </p>
              )}
            </div>
          </div>

          {/* Seção 4: Dados do Responsável */}
          <div className="space-y-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-700/30">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">4. Dados do Responsável</h3>
              <Badge
                variant="outline"
                className="text-xs bg-purple-100 dark:bg-purple-900"
              >
                Preenchimento manual
              </Badge>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Preencha seus dados para contato sobre a inscrição.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible">
                  Nome completo do responsável *
                </Label>
                <Input
                  id="responsible"
                  {...register("responsible")}
                  value={formData.responsible}
                  onChange={handleInputChange}
                  placeholder="Ex: João Silva"
                  className={cn(
                    "bg-white dark:bg-gray-900",
                    formErrors.responsible &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.responsible && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.responsible.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone do responsável *</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                  className={cn(
                    "bg-white dark:bg-gray-900",
                    formErrors.phone && "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail do responsável</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  value={formData.email ?? ""}
                  onChange={handleInputChange}
                  placeholder="exemplo@dominio.com"
                  className={cn(
                    "bg-white dark:bg-gray-900",
                    formErrors.email && "border-red-500 focus:border-red-500"
                  )}
                />
                <p className="text-[13px] text-muted-foreground">
                  Opcional — usado apenas para atualizações da inscrição.
                </p>
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !isMemberSelected ||
                Object.keys(formErrors).length > 0
              }
              className={cn(
                "w-full md:w-auto px-8 py-3 text-base transform uppercase transition-all duration-300",
                isMemberSelected
                  ? "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  : "bg-gray-400 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Enviando...
                </span>
              ) : !isMemberSelected ? (
                "Selecione um membro primeiro"
              ) : (
                "Finalizar Inscrição"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
