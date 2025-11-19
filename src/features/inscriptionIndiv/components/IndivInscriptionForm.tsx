"use client";

import { ComboboxTypeInscription } from "@/features/typeInscription/components/ComboboxTypeInscription";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useFormIndividualInscription } from "../hooks/useFormIndividualInscription";

interface IndividualInscriptionFormProps {
  eventId: string;
}

export default function IndividualInscriptionForm({
  eventId,
}: IndividualInscriptionFormProps) {
  const {
    formData,
    typeInscriptions,
    isSubmitting,
    formErrors,
    handleInputChange,
    handleSubmit,
    register,
  } = useFormIndividualInscription({ eventId });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Formulário de Inscrição</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção 1: Dados do Responsável */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Dados do Responsável
            </h3>

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
                <Label htmlFor="email">E-mail do responsável</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  value={formData.email ?? ""}
                  onChange={handleInputChange}
                  placeholder="exemplo@dominio.com"
                  className={cn(
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
                    formErrors.phone && "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Seção 2: Dados do Inscrito */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Dados do Inscrito
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participantName">
                  Nome completo do inscrito *
                </Label>
                <Input
                  id="participantName"
                  {...register("participantName")}
                  value={formData.participantName}
                  onChange={handleInputChange}
                  placeholder="Ex: Maria Santos"
                  className={cn(
                    formErrors.participantName &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.participantName && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.participantName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de nascimento *</Label>
                <Input
                  id="birthDate"
                  {...register("birthDate")}
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  placeholder="DD/MM/AAAA"
                  maxLength={10}
                  className={cn(
                    formErrors.birthDate &&
                      "border-red-500 focus:border-red-500"
                  )}
                />
                {formErrors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.birthDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="gender"
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        formErrors.gender &&
                          "border-red-500 focus:border-red-500"
                      )}
                      aria-expanded={false}
                    >
                      <span
                        className={cn(
                          formData.gender
                            ? "text-blue-700 dark:text-blue-300 font-semibold"
                            : "text-gray-700 dark:text-gray-200"
                        )}
                      >
                        {formData.gender
                          ? formData.gender === "masculino"
                            ? "Masculino"
                            : "Feminino"
                          : "Selecione o gênero"}
                      </span>
                      <ChevronsUpDown
                        className={cn(
                          "opacity-50",
                          formData.gender ? "text-blue-700" : ""
                        )}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[200px] p-0">
                    <Command>
                      <CommandList>
                        <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
                        <CommandGroup>
                          {[
                            { label: "Masculino", value: "masculino" },
                            { label: "Feminino", value: "feminino" },
                          ].map((opt) => (
                            <CommandItem
                              key={opt.value}
                              value={opt.value}
                              onSelect={(currentValue) => {
                                const event = {
                                  target: {
                                    name: "gender",
                                    value: currentValue,
                                  },
                                } as unknown as React.ChangeEvent<HTMLInputElement>;
                                handleInputChange(event);
                              }}
                            >
                              <span
                                className={cn(
                                  "px-2 py-1 rounded text-xs font-semibold",
                                  formData.gender === opt.value
                                    ? "ring-2 ring-blue-400"
                                    : ""
                                )}
                              >
                                {opt.label}
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto",
                                  formData.gender === opt.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {formErrors.gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.gender.message}
                  </p>
                )}
              </div>
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
                  />
                </div>
                {formErrors.typeInscriptionId && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.typeInscriptionId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || Object.keys(formErrors).length > 0}
              className="w-full md:w-auto px-8 py-3 text-base transform uppercase dark:text-white"
            >
              {isSubmitting ? "Enviando..." : "Finalizar Inscrição"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
