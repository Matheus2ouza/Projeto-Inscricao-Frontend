"use client";

import { useTypeInscriptionsQuery } from "@/features/inscriptionIndiv/hooks/useTypeInscriptionsQuery";
import { TypeInscription } from "@/features/inscriptionIndiv/types/individualInscriptionTypes";
import {
  ComboboxMemberSingle,
  MemberSingleOption,
} from "@/features/members/components/combobox/ComboboxMemberSingle";
import { ComboboxTypeInscription } from "@/features/typeInscription/components/ComboboxTypeInscription";
import { Badge } from "@/shared/components/ui/badge";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { Phone, Plus, Trash2, User, Users } from "lucide-react";
import { useState } from "react";
import {
  MemberDisplayData,
  UseFormInscriptionGrupReturn,
} from "../types/inscriptionGrupTypes";

interface GroupInscriptionFormProps {
  hookData: UseFormInscriptionGrupReturn;
  eventId: string;
}

export function GroupInscriptionForm({
  hookData,
  eventId,
}: GroupInscriptionFormProps) {
  const {
    formData,
    members,
    isSubmitting,
    formErrors,
    handleInputChange,
    addMember,
    removeMember,
    handleSubmit,
    register,
  } = hookData;

  // Busca os tipos de inscrição para obter o nome quando selecionado
  const { data: typeInscriptions } = useTypeInscriptionsQuery(eventId);

  // Estado local para o sheet de adição de membro
  const [tempMemberId, setTempMemberId] = useState("");
  const [tempMemberData, setTempMemberData] = useState<
    MemberSingleOption | undefined
  >(undefined);
  const [tempTypeId, setTempTypeId] = useState("");
  const [tempTypeName, setTempTypeName] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenSheet = () => {
    setTempMemberId("");
    setTempMemberData(undefined);
    setTempTypeId("");
    setTempTypeName("");
    setIsSheetOpen(true);
  };

  const handleAddMember = () => {
    if (tempMemberId && tempTypeId && tempMemberData) {
      const newMember: MemberDisplayData = {
        accountParticipantId: tempMemberId,
        typeInscriptionId: tempTypeId,
        name: tempMemberData.label,
        birthDate: tempMemberData.birthDate,
        gender: tempMemberData.gender,
        typeInscriptionName: tempTypeName,
      };

      addMember(newMember);
      // Fechar o sheet após adicionar
      setIsSheetOpen(false);
      // Limpar os campos temporários
      setTempMemberId("");
      setTempMemberData(undefined);
      setTempTypeId("");
      setTempTypeName("");
    }
  };

  const formatBirthDate = (dateString?: string | Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <div className="space-y-6">
        {/* Card do Responsável */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="h-6 w-6" />
              Dados do Responsável
            </CardTitle>
            <CardDescription className="text-base">
              Preencha os dados do responsável pelas inscrições
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Responsável */}
              <div className="space-y-3 md:col-span-2">
                <Label htmlFor="responsible" className="text-base font-medium">
                  Nome do Responsável *
                </Label>
                <Input
                  id="responsible"
                  {...register("responsible")}
                  value={formData.responsible}
                  onChange={handleInputChange}
                  placeholder="Digite o nome completo do responsável"
                  required
                  className={cn(
                    "h-12 text-base",
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

              {/* E-mail */}
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
                    "h-12 text-base",
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

              {/* Telefone */}
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
                  required
                  maxLength={15}
                  className={cn(
                    "h-12 text-base",
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
          </CardContent>
        </Card>

        {/* Card dos Membros */}
        <Card className="w-full">
          <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Users className="h-6 w-6" />
                Membros da Inscrição
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Adicione os membros que farão parte desta inscrição em grupo
              </CardDescription>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2 w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Adicionar Membro
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-[500px] w-full overflow-y-auto">
                <div className="flex flex-col h-full">
                  <SheetHeader className="px-6 pt-6 pb-4">
                    <SheetTitle className="text-xl">
                      Adicionar Membro
                    </SheetTitle>
                    <SheetDescription className="text-sm">
                      Busque um membro e selecione o tipo de inscrição.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto px-6">
                    <div className="space-y-6 py-2">
                      <div className="space-y-3">
                        <Label
                          htmlFor="memberSelect"
                          className="text-sm font-medium"
                        >
                          Buscar Membro
                        </Label>
                        <ComboboxMemberSingle
                          id="memberSelect"
                          value={tempMemberId}
                          onChange={(id, member) => {
                            setTempMemberId(id);
                            setTempMemberData(member);
                          }}
                        />
                      </div>

                      {tempMemberData && (
                        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                Nome
                              </Label>
                              <p className="text-sm font-medium break-words">
                                {tempMemberData.label}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                Nascimento
                              </Label>
                              <p className="text-sm font-medium">
                                {formatBirthDate(tempMemberData.birthDate)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                Gênero
                              </Label>
                              <p className="text-sm font-medium capitalize">
                                {tempMemberData.gender || "-"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Label
                          htmlFor="typeSelect"
                          className="text-sm font-medium"
                        >
                          Tipo de Inscrição
                        </Label>
                        <ComboboxTypeInscription
                          eventId={eventId}
                          value={tempTypeId}
                          onChange={(selectedValue) => {
                            setTempTypeId(selectedValue);
                            // Encontrar o nome do tipo selecionado para exibição na tabela
                            if (Array.isArray(typeInscriptions)) {
                              const selectedType = typeInscriptions.find(
                                (t: TypeInscription) => t.id === selectedValue
                              );
                              if (selectedType) {
                                setTempTypeName(
                                  `${selectedType.description} - R$ ${selectedType.value.toFixed(
                                    2
                                  )}`
                                );
                              }
                            }
                          }}
                          disabled={!tempMemberId}
                        />
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="px-6 py-4 border-t mt-6">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <Button
                        variant="outline"
                        onClick={() => setIsSheetOpen(false)}
                        className="w-full sm:w-1/2"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddMember}
                        disabled={!tempMemberId || !tempTypeId}
                        className="w-full sm:w-1/2"
                      >
                        Adicionar
                      </Button>
                    </div>
                  </SheetFooter>
                </div>
              </SheetContent>
            </Sheet>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <Users className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Nenhum membro adicionado
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 mb-4 px-4">
                  Clique no botão "Adicionar Membro" para começar.
                </p>
                <Button variant="outline" onClick={handleOpenSheet}>
                  Adicionar Membro
                </Button>
              </div>
            ) : (
              <>
                {/* Versão Desktop - Tabela Completa */}
                <div className="hidden md:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Nascimento</TableHead>
                        <TableHead>Gênero</TableHead>
                        <TableHead>Tipo de Inscrição</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {member.name}
                          </TableCell>
                          <TableCell>
                            {formatBirthDate(member.birthDate)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {member.gender || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {member.typeInscriptionName || "Selecionado"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMember(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Versão Mobile - Lista Simplificada */}
                <div className="md:hidden space-y-3">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 space-y-3 bg-card"
                    >
                      {/* Linha 1: Nome e Ação */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-sm">{member.name}</p>
                          <div className="flex flex-wrap gap-1 items-center">
                            <Badge
                              variant="secondary"
                              className="text-xs font-normal"
                            >
                              {member.typeInscriptionName || "Selecionado"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Linha 2: Detalhes Adicionais */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">Nascimento:</span>
                          <p className="mt-0.5">
                            {formatBirthDate(member.birthDate)}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Gênero:</span>
                          <p className="mt-0.5 capitalize">
                            {member.gender || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={() => handleSubmit({} as any)}
                className="w-full md:w-auto px-8 py-3 text-base transform uppercase dark:text-white"
                disabled={
                  isSubmitting ||
                  members.length === 0 ||
                  !!formErrors.responsible ||
                  !!formErrors.phone
                }
              >
                {isSubmitting
                  ? "Processando..."
                  : "Finalizar Inscrição em Grupo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
