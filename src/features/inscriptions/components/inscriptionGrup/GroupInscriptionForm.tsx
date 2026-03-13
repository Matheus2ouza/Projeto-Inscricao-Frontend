"use client";

import { useTypeInscriptionsQuery } from "@/features/inscriptions/hooks/inscriptionIndiv/useTypeInscriptionsQuery";
import {
  MemberDisplayData,
  UseFormInscriptionGrupReturn,
} from "@/features/inscriptions/types/inscriptionGrup/inscriptionGrupTypes";
import { TypeInscription } from "@/features/inscriptions/types/inscriptionIndiv/individualInscriptionTypes";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { Drawer } from "antd";
import { HelpCircle, Phone, Plus, Trash2, User, Users } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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

  // IDs dos membros já adicionados à lista (para desabilitar no combobox)
  const addedMemberIds = members.map((m) => m.accountParticipantId);

  // Estado local para o drawer de adição de membro
  const [tempMemberId, setTempMemberId] = useState("");
  const [tempMemberData, setTempMemberData] = useState<
    MemberSingleOption | undefined
  >(undefined);
  const [tempTypeId, setTempTypeId] = useState("");
  const [tempTypeName, setTempTypeName] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setTempMemberId("");
    setTempMemberData(undefined);
    setTempTypeId("");
    setTempTypeName("");
    setIsDrawerOpen(true);
  };

  // Calcular valor total das inscrições
  const totalValue = useMemo(() => {
    if (!members || !typeInscriptions) return 0;
    return members.reduce((acc, member) => {
      const type = typeInscriptions.find(
        (t: TypeInscription) => t.id === member.typeInscriptionId,
      );
      return acc + (type?.value || 0);
    }, 0);
  }, [members, typeInscriptions]);

  const handleAddMember = () => {
    if (tempMemberId && tempTypeId && tempMemberData) {
      const newMember: MemberDisplayData = {
        accountParticipantId: tempMemberId,
        typeInscriptionId: tempTypeId,
        name: tempMemberData.label,
        birthDate: tempMemberData.member?.birthDate,
        gender: tempMemberData.member?.gender,
        typeInscriptionName: tempTypeName,
      };

      addMember(newMember);
      // Fechar o drawer após adicionar
      setIsDrawerOpen(false);
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
                    Precisa de ajuda com inscrições em grupo?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Aprenda a gerenciar inscrições em grupo de forma eficiente
                    com nossa documentação.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50"
              >
                <Link href="/documentation/inscription/in-group">
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
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-blue-700 dark:text-blue-300 truncate">
                  Precisa de ajuda com inscrições em grupo?
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
                <Link href="/documentation/inscription/in-group">Ver</Link>
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
                  Preencha os dados do responsável pelas inscrições
                </CardDescription>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-md">
                Campos com * são obrigatórios
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Responsável */}
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
                  required
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

        {/* Card dos Membros */}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                  Membros da Inscrição
                </CardTitle>
                <CardDescription className="text-sm sm:text-base mt-1">
                  Adicione os membros que farão parte desta inscrição em grupo
                </CardDescription>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-50 dark:bg-slate-900 px-3 sm:px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto">
                    <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Total de Inscritos
                      </span>
                      <span className="text-base sm:text-lg font-bold leading-none text-slate-900 dark:text-slate-100">
                        {members.length}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-50 dark:bg-slate-900 px-3 sm:px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm w-full sm:w-auto">
                    <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center h-6 w-6 sm:h-8 sm:w-8">
                      <span className="text-green-600 dark:text-green-400 font-bold text-xs sm:text-sm">
                        R$
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Valor Total
                      </span>
                      <span className="text-base sm:text-lg font-bold leading-none text-green-600 dark:text-green-400">
                        {totalValue.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                className="flex items-center gap-2 w-full sm:w-auto h-10 sm:h-auto"
                onClick={handleOpenDrawer}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Adicionar Membro</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Drawer
              title="Adicionar Membro"
              placement="right"
              size={500}
              onClose={() => setIsDrawerOpen(false)}
              open={isDrawerOpen}
              styles={{
                body: {
                  padding: "16px 24px",
                  overflowY: "auto",
                },
                header: {
                  padding: "16px 24px",
                  borderBottom: "1px solid #e5e7eb",
                },
                footer: {
                  padding: "12px 24px",
                  borderTop: "1px solid #e5e7eb",
                },
              }}
              footer={
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full sm:w-1/2 h-10 sm:h-auto"
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleAddMember}
                    disabled={!tempMemberId || !tempTypeId}
                    className="w-full sm:w-1/2 h-10 sm:h-auto"
                    type="button"
                  >
                    Adicionar
                  </Button>
                </div>
              }
            >
              <div className="space-y-4 sm:space-y-6 py-2">
                <div className="space-y-3">
                  <Label htmlFor="memberSelect" className="text-sm font-medium">
                    Buscar Membro
                  </Label>
                  <ComboboxMemberSingle
                    eventId={eventId}
                    id="memberSelect"
                    value={tempMemberId}
                    onChange={(id, member) => {
                      setTempMemberId(id);
                      if (member && id) {
                        setTempMemberData({
                          label: member.name,
                          value: id,
                          registered: member.registered || false,
                          member,
                        });
                      } else {
                        setTempMemberData(undefined);
                      }
                    }}
                    disabledValues={addedMemberIds}
                  />
                </div>

                {tempMemberData && (
                  <div className="space-y-3 p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                          {formatBirthDate(tempMemberData.member?.birthDate)}
                        </p>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-xs text-muted-foreground">
                          Gênero
                        </Label>
                        <p className="text-sm font-medium capitalize">
                          {tempMemberData.member?.gender || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label htmlFor="typeSelect" className="text-sm font-medium">
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
                          (t: TypeInscription) => t.id === selectedValue,
                        );
                        if (selectedType) {
                          setTempTypeName(
                            `${selectedType.description} - R$ ${selectedType.value.toFixed(
                              2,
                            )}`,
                          );
                        }
                      }
                    }}
                    disabled={!tempMemberId}
                  />
                </div>
              </div>
            </Drawer>

            {members.length === 0 ? (
              <div className="text-center py-8 sm:py-10 border-2 border-dashed rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                  Nenhum membro adicionado
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3 sm:mb-4 px-4">
                  Selecione uma conta e clique no botão "Adicionar Membro" para
                  começar.
                </p>
                <Button
                  variant="outline"
                  onClick={handleOpenDrawer}
                  type="button"
                  size="sm"
                  className="h-9 sm:h-10"
                >
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
                            <Badge variant="secondary" className="text-xs">
                              {member.typeInscriptionName || "Selecionado"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMember(index)}
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
                      className="border rounded-lg p-3 space-y-2 bg-card"
                    >
                      {/* Linha 1: Nome e Ação */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium text-sm truncate">
                            {member.name}
                          </p>
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
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ml-2 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Linha 2: Detalhes Adicionais */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t text-xs text-muted-foreground">
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

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center mt-6">
              <div className="order-2 sm:order-1">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
                >
                  <Link href="/documentation/inscription/in-group">
                    Precisa de ajuda? Consulte o guia
                  </Link>
                </Button>
              </div>
              <div className="order-1 sm:order-2 w-full sm:w-auto">
                <Button
                  onClick={() => handleSubmit({} as any)}
                  className="w-full sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base transform uppercase dark:text-white h-11 sm:h-12"
                  disabled={
                    isSubmitting ||
                    members.length === 0 ||
                    !!formErrors.responsible ||
                    !!formErrors.phone
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
                    "Finalizar Inscrição em Grupo"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
