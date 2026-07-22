'use client';

import {
  MemberDisplayData,
  TypeInscription,
} from '@/features/inscriptions/types/groupInscription/inscriptionGrupTypes';
import { LocalityToAccountCombobox } from '@/features/locality/components/LocalityToAccountCombobox';
import {
  ComboboxMemberSingle,
  MemberSingleOption,
} from '@/features/members/components/membersCombobox/ComboboxMemberSingle';
import { ComboboxTypeInscription } from '@/features/typeInscription/components/ComboboxTypeInscription';
import { useListTypeInscriptions } from '@/features/typeInscription/hook/listTypeInscriptions/useListTypeInscriptions';
import { Badge } from '@/shared/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Drawer } from 'antd';
import { HelpCircle, Phone, Plus, Trash2, User, Users } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useFormInscriptionGrup } from '../../hooks/inscriptionGrup/useFormInscriptionGrup';
import { IncompleteMembersAlert } from './IncompleteMembersAlert';

interface GroupInscriptionFormProps {
  eventId: string;
}

export function GroupInscriptionForm({ eventId }: GroupInscriptionFormProps) {
  // Estado local para o drawer de adição de membro
  const [tempMemberId, setTempMemberId] = useState('');
  const [tempMemberData, setTempMemberData] = useState<
    MemberSingleOption | undefined
  >(undefined);
  const [tempTypeId, setTempTypeId] = useState('');
  const [tempTypeName, setTempTypeName] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Estado para armazenar o ID da localidade selecionada
  const [selectedLocalityId, setSelectedLocalityId] = useState<string>('');

  const {
    form,
    members,
    addMember,
    removeMember,
    onSubmit,
    isLoading,
    incompleteMembers,
    clearIncompleteMembers,
  } = useFormInscriptionGrup(eventId, selectedLocalityId);
  // Busca os tipos de inscrição para obter o nome quando selecionado
  const { typeInscriptions } = useListTypeInscriptions({ eventId });

  // IDs dos membros já adicionados à lista (para desabilitar no combobox)
  const addedMemberIds = members.map((m) => m.accountParticipantId);

  const handleOpenDrawer = () => {
    setTempMemberId('');
    setTempMemberData(undefined);
    setTempTypeId('');
    setTempTypeName('');
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
      setTempMemberId('');
      setTempMemberData(undefined);
      setTempTypeId('');
      setTempTypeName('');
    }
  };

  const formatBirthDate = (dateString?: string | Date) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Funções para máscara de telefone (apenas exibição)
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

    // Restaura a máscara após o submit (opcional, pois o form pode resetar)
  };

  return (
    <>
      <IncompleteMembersAlert
        open={!!incompleteMembers?.length}
        incompleteMembers={incompleteMembers ?? []}
        members={members}
        onClose={clearIncompleteMembers}
      />
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
                    Precisa de ajuda com inscrições em grupo?
                  </h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Aprenda a gerenciar inscrições em grupo de forma eficiente
                    com nossa documentação.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:border-riodavida/30 dark:text-riodavida dark:hover:bg-riodavida/20 dark:hover:text-riodavida-light"
              >
                <Link href="/documentation/inscription/in-group">
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
              <div className="min-w-0 flex-1">
                <p className="text-riodavida dark:text-riodavida truncate text-sm font-medium">
                  Precisa de ajuda com inscrições em grupo?
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
                <Link href="/documentation/inscription/in-group">Ver</Link>
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
                  Preencha os dados do responsável pelas inscrições
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
                                onChange={(e) => {
                                  const formatted = formatPhone(e.target.value);
                                  field.onChange(formatted);
                                }}
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

        {/* Card dos Membros */}
        <Card className="liquid-card w-full">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                  <Users className="text-riodavida h-5 w-5 sm:h-6 sm:w-6" />
                  Membros da Inscrição
                </CardTitle>
                <CardDescription className="mt-1 text-sm sm:text-base">
                  Adicione os membros que farão parte desta inscrição em grupo
                </CardDescription>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <div className="border-riodavida/20 bg-riodavida/5 dark:border-riodavida/20 dark:bg-riodavida/10 flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 shadow-sm sm:w-auto sm:justify-start sm:px-4">
                    <div className="bg-riodavida/10 dark:bg-riodavida/20 rounded-full p-1.5 sm:p-2">
                      <Users className="text-riodavida dark:text-riodavida h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase sm:text-[10px]">
                        Total de Inscritos
                      </span>
                      <span className="text-riodavida-gray-dark dark:text-riodavida-gray text-base leading-none font-bold sm:text-lg">
                        {members.length}
                      </span>
                    </div>
                  </div>

                  <div className="border-riodavida-secondary/20 bg-riodavida-secondary/5 dark:border-riodavida-secondary/20 dark:bg-riodavida-secondary/10 flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 shadow-sm sm:w-auto sm:justify-start sm:px-4">
                    <div className="bg-riodavida-secondary/10 dark:bg-riodavida-secondary/20 flex h-6 w-6 items-center justify-center rounded-full p-1.5 sm:h-8 sm:w-8 sm:p-2">
                      <span className="text-riodavida-secondary dark:text-riodavida-muted-light text-xs font-bold sm:text-sm">
                        R$
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase sm:text-[10px]">
                        Valor Total
                      </span>
                      <span className="text-riodavida-secondary dark:text-riodavida-muted-light text-base leading-none font-bold sm:text-lg">
                        {totalValue.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant={'primary'}
                className="bg-riodavida hover:bg-riodavida-dark flex gap-2"
                onClick={handleOpenDrawer}
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                Adicionar Membro
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
                  padding: '16px 24px',
                  overflowY: 'auto',
                },
                header: {
                  padding: '16px 24px',
                  borderBottom: '1px solid #e5e7eb',
                },
                footer: {
                  padding: '12px 24px',
                  borderTop: '1px solid #e5e7eb',
                },
              }}
              footer={
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
                  <Button
                    onClick={handleAddMember}
                    disabled={!tempMemberId || !tempTypeId}
                    className="bg-riodavida hover:bg-riodavida-dark w-full text-white sm:w-1/2"
                    size="lg"
                    type="button"
                  >
                    Adicionar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full sm:w-1/2"
                    type="button"
                    size="lg"
                  >
                    Cancelar
                  </Button>
                </div>
              }
            >
              <div className="space-y-4 py-2 sm:space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="memberSelect" className="text-sm font-medium">
                    Buscar Membro
                  </Label>
                  <ComboboxMemberSingle
                    eventId={eventId}
                    localityId={selectedLocalityId}
                    id="memberSelect"
                    value={tempMemberId}
                    onChange={(id, member) => {
                      setTempMemberId(id);
                      if (member && id) {
                        setTempMemberData({
                          label: member.label || '',
                          value: id,
                          registered: member.registered || false,
                          member: member.member,
                        });
                      } else {
                        setTempMemberData(undefined);
                      }
                    }}
                    disabledValues={addedMemberIds}
                  />
                </div>

                {tempMemberData && (
                  <div className="border-riodavida/20 bg-riodavida/5 dark:bg-riodavida/10 space-y-3 rounded-lg border p-3 sm:p-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground text-xs">
                          Nome
                        </Label>
                        <p className="text-sm font-medium break-words">
                          {tempMemberData.label}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground text-xs">
                          Nascimento
                        </Label>
                        <p className="text-sm font-medium">
                          {formatBirthDate(tempMemberData.member?.birthDate)}
                        </p>
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <Label className="text-muted-foreground text-xs">
                          Gênero
                        </Label>
                        <p className="text-sm font-medium capitalize">
                          {tempMemberData.member?.gender || '-'}
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
              <div className="border-riodavida/20 bg-riodavida/5 dark:bg-riodavida/10 rounded-lg border-2 border-dashed py-8 text-center sm:py-10">
                <Users className="text-riodavida/50 mx-auto mb-2 h-8 w-8 sm:mb-3 sm:h-10 sm:w-10" />
                <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray text-base font-medium sm:text-lg">
                  Nenhum membro adicionado
                </h3>
                <p className="mt-1 mb-3 px-4 text-xs text-gray-500 sm:mb-4 sm:text-sm dark:text-gray-400">
                  Selecione uma conta e clique no botão "Adicionar Membro" para
                  começar.
                </p>
                <Button
                  variant="outline"
                  onClick={handleOpenDrawer}
                  type="button"
                  size="sm"
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark h-9 sm:h-10"
                >
                  Adicionar Membro
                </Button>
              </div>
            ) : (
              <>
                <div className="border-riodavida/10 hidden rounded-md border md:block">
                  <Table>
                    <TableHeader className="bg-riodavida/5">
                      <TableRow>
                        <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Nome
                        </TableHead>
                        <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Nascimento
                        </TableHead>
                        <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Gênero
                        </TableHead>
                        <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                          Tipo de Inscrição
                        </TableHead>
                        <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[100px]">
                          Ações
                        </TableHead>
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
                            {member.gender || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-riodavida/10 text-riodavida dark:bg-riodavida/20 dark:text-riodavida"
                            >
                              {member.typeInscriptionName || 'Selecionado'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMember(index)}
                              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-3 md:hidden">
                  {members.map((member, index) => (
                    <div
                      key={index}
                      className="bg-card border-riodavida/10 space-y-2 rounded-lg border p-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-1">
                          <p className="truncate text-sm font-medium">
                            {member.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-1">
                            <Badge
                              variant="secondary"
                              className="bg-riodavida/10 text-riodavida dark:bg-riodavida/20 dark:text-riodavida text-xs font-normal"
                            >
                              {member.typeInscriptionName || 'Selecionado'}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(index)}
                          className="ml-2 h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      <div className="text-muted-foreground border-riodavida/10 grid grid-cols-1 gap-2 border-t pt-2 text-xs sm:grid-cols-2">
                        <div>
                          <span className="font-medium">Nascimento:</span>
                          <p className="mt-0.5">
                            {formatBirthDate(member.birthDate)}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium">Gênero:</span>
                          <p className="mt-0.5 capitalize">
                            {member.gender || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="order-2 sm:order-1">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark h-9 w-full sm:w-auto sm:text-sm"
                >
                  <Link href="/documentation/inscription/in-group">
                    Precisa de ajuda? Consulte o guia
                  </Link>
                </Button>
              </div>
              <div className="order-1 w-full sm:order-2 sm:w-auto">
                <Button
                  type="button"
                  onClick={handleFormSubmit}
                  className="bg-riodavida hover:bg-riodavida-dark h-11 w-full text-white"
                  size={'lg'}
                  disabled={
                    isLoading ||
                    members.length === 0 ||
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
                    'Finalizar Inscrição em Grupo'
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
