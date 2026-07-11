import { useFormUpdateInscription } from '@/features/inscriptions/hooks/myInscriptions/useFormUpdateInscription';
import {
  Inscription,
  Participant,
  Payment,
} from '@/features/inscriptions/types/myInscriptions/detailsInscription/detailsInscriptionTypes';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatDate, formatDateTime } from '@/shared/utils/formatDate';
import { formatPhone } from '@/shared/utils/formatPhone';
import { getConvertStatusInscription } from '@/shared/utils/getConvertStatus';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getStatusColor } from '@/shared/utils/getStatusColor';
import {
  Calendar,
  CreditCard,
  Edit,
  Eye,
  FileText,
  Loader2,
  Mail,
  Phone,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';

type DetailsInscriptionTableProps = {
  inscription: Inscription | null;
  participants: Participant[];
  payments: Payment[];
  onDeleted?: () => void;
  onRegisterPayment?: () => void;
  onViewPayment?: () => void;
};

export default function DetailsInscriptionTable({
  inscription,
  participants,
  payments,
  onDeleted,
  onRegisterPayment,
  onViewPayment,
}: DetailsInscriptionTableProps) {
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    form,
    handleSubmit: handleUpdateSubmit,
    isUpdating,
    handleDelete,
    isDeleting,
  } = useFormUpdateInscription({
    inscriptionId: inscription?.id ?? '',
    initialValues: inscription
      ? {
          responsible: inscription.responsible,
          email: inscription.email ?? '',
          phone: inscription.phone ?? '',
        }
      : undefined,
    onSuccess: () => setIsEditDialogOpen(false),
    onDeleteSuccess: onDeleted,
  });

  if (!inscription) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="bg-riodavida/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <FileText className="text-riodavida h-8 w-8" />
        </div>
        <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-2 text-lg font-semibold">
          Inscrição não encontrada
        </h3>
        <p className="text-muted-foreground">
          Não foi possível carregar os detalhes desta inscrição.
        </p>
      </div>
    );
  }

  // Função para calcular a idade a partir da data de nascimento
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Função para formatar gênero
  const formatGender = (gender: string) => {
    const genderMap: Record<string, string> = {
      MALE: 'Masculino',
      FEMALE: 'Feminino',
      OTHER: 'Outro',
      male: 'Masculino',
      female: 'Feminino',
      other: 'Outro',
    };

    return genderMap[gender] || gender;
  };

  return (
    <div className="space-y-8">
      {/* Card da Inscrição */}
      <div className="liquid-card overflow-hidden rounded-xl">
        <div className="p-6">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
                  Detalhes da Inscrição
                </h1>

                <div className="text-muted-foreground mt-2 mb-1 flex items-center gap-2 text-sm">
                  <FileText className="text-riodavida h-4 w-4" />
                  <code className="bg-riodavida/5 rounded px-2 py-1 font-mono">
                    {inscription.id.substring(0, 12)}...
                  </code>
                </div>

                <div className="text-muted-foreground text-xs">
                  Criada em: {formatDateTime(inscription.createdAt)}
                </div>
              </div>

              {/* Informações do Responsável */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-riodavida/5 rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <User className="text-riodavida h-4 w-4" />
                    <span className="text-sm font-medium">Responsável</span>
                  </div>
                  <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-semibold">
                    {inscription.responsible}
                  </p>
                </div>

                {inscription.email && (
                  <div className="bg-riodavida/5 rounded-lg p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Mail className="text-riodavida h-4 w-4" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium break-all">
                      {inscription.email}
                    </p>
                  </div>
                )}

                {inscription.phone && (
                  <div className="bg-riodavida/5 rounded-lg p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Phone className="text-riodavida h-4 w-4" />
                      <span className="text-sm font-medium">Telefone</span>
                    </div>
                    <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm font-medium">
                      {inscription.phone}
                    </p>
                  </div>
                )}

                {/* Card de Status */}
                <div className="bg-riodavida/5 rounded-lg p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <FileText className="text-riodavida h-4 w-4" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                      inscription.status,
                    )}`}
                  >
                    {getConvertStatusInscription(inscription.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:flex-col">
              <Button
                type="button"
                className="bg-riodavida hover:bg-riodavida-dark gap-2 text-white"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="gap-2"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deletando...' : 'Deletar Inscrição'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Excluir inscrição"
        message="Tem certeza que deseja excluir esta inscrição? Esta ação não pode ser desfeita e todos os participantes serão removidos."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
        variant="destructive"
      />

      {/* Dialog de edição dos dados do responsável */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-riodavida-gray-dark dark:text-riodavida-gray">
              Editar dados da inscrição
            </DialogTitle>
            <DialogDescription>
              Atualize as informações de contato do responsável.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                      Responsável
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="focus:border-riodavida focus:ring-riodavida/20"
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
                    <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                      Telefone
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(event) => {
                          const formatted = formatPhone(event.target.value);
                          field.onChange(formatted);
                        }}
                        className="focus:border-riodavida focus:ring-riodavida/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-riodavida-gray-dark dark:text-riodavida-gray">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="focus:border-riodavida focus:ring-riodavida/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-riodavida hover:bg-riodavida-dark text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    'Salvar alterações'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Seção de Participantes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-semibold">
              Participantes
            </h2>
            <p className="text-muted-foreground">
              {participants.length} participante
              {participants.length !== 1 ? 's' : ''} nesta inscrição
            </p>
          </div>
        </div>

        {/* Participantes - Versão Mobile */}
        <div className="block sm:hidden">
          {participants.length === 0 ? (
            <div className="border-riodavida/20 text-muted-foreground rounded-lg border px-4 py-8 text-center">
              Nenhum participante encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="border-riodavida/20 hover:bg-riodavida/5 rounded-lg border p-4 transition-colors"
                >
                  {/* Primeira linha: Nome e Ações */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="text-riodavida h-4 w-4" />
                      <h3 className="font-semibold">{participant.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-8 w-8 p-0"
                        onClick={() => setSelectedParticipant(participant)}
                        title="Visualizar Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Excluir Participante"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Informações do Participante */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Tipo</p>
                      <p className="text-sm font-medium">
                        {participant.typeInscription || 'Não informado'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Idade</p>
                      <p className="text-sm font-medium">
                        {calculateAge(participant.birthDate)} anos
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Gênero</p>
                      <p className="text-sm font-medium">
                        {formatGender(participant.gender)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">
                        Nascimento
                      </p>
                      <p className="text-sm font-medium">
                        {formatDate(participant.birthDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Participantes - Versão Desktop */}
        <div className="border-riodavida/10 liquid-card-solid hidden rounded-md border sm:block">
          <Table>
            <TableHeader className="bg-riodavida/5">
              <TableRow>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                  Nome
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[140px]">
                  Tipo
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[100px]">
                  Idade
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[120px]">
                  Gênero
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[140px]">
                  Nascimento
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[100px] text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id} className="hover:bg-riodavida/5">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="text-riodavida h-4 w-4" />
                      {participant.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {participant.typeInscription || 'Não informado'}
                  </TableCell>
                  <TableCell>
                    {calculateAge(participant.birthDate)} anos
                  </TableCell>
                  <TableCell>{formatGender(participant.gender)}</TableCell>
                  <TableCell>{formatDate(participant.birthDate)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-8 w-8 p-0"
                        onClick={() => setSelectedParticipant(participant)}
                        title="Visualizar Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Excluir Participante"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Total Pago */}
      <div className="space-y-6">
        <div className="liquid-card rounded-lg p-6">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            {/* Informações financeiras */}
            <div className="flex-1 space-y-4">
              <div className="mb-2 flex items-center gap-2">
                <CreditCard className="text-riodavida h-5 w-5" />
                <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-semibold">
                  Resumo Financeiro
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Total Pago */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total pago
                  </p>
                  <p className="text-riodavida-secondary dark:text-riodavida-muted-light text-2xl font-bold">
                    {getFormatCurrency(inscription.totalPaid)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {payments.length} pagamento
                    {payments.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Valor Total */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor total
                  </p>
                  <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
                    {getFormatCurrency(inscription.totalValue)}
                  </p>
                </div>

                {/* Saldo Pendente */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Saldo pendente
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      inscription.totalDebt > 0
                        ? 'text-amber-600 dark:text-amber-500'
                        : 'text-green-600 dark:text-green-500'
                    }`}
                  >
                    {getFormatCurrency(inscription.totalDebt)}
                  </p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="pt-2">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Progresso
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {Math.min(
                      Math.round(
                        (inscription.totalPaid / inscription.totalValue) * 100,
                      ),
                      100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="bg-riodavida-secondary h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((inscription.totalPaid / inscription.totalValue) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex min-w-[200px] flex-col gap-2 sm:flex-row lg:flex-col">
              {onViewPayment && (
                <Button
                  variant="outline"
                  className="border-riodavida/30 text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark w-full justify-center gap-2"
                  onClick={onViewPayment}
                >
                  <Eye className="h-4 w-4" />
                  Ver todos pagamentos
                </Button>
              )}
              {onRegisterPayment && (
                <Button
                  className="bg-riodavida hover:bg-riodavida-dark w-full justify-center gap-2 text-white"
                  onClick={onRegisterPayment}
                >
                  <CreditCard className="h-4 w-4" />
                  Registrar pagamento
                </Button>
              )}
            </div>
          </div>

          {/* Mensagem quando não há pagamentos */}
          {payments.length === 0 && (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
              <p className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-300">
                <CreditCard className="h-4 w-4" />
                Nenhum pagamento registrado ainda
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Seção de Pagamentos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-semibold">
              Histórico de Pagamentos
            </h2>
            <p className="text-muted-foreground">
              {payments.length} pagamento{payments.length !== 1 ? 's' : ''}{' '}
              registrado{payments.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Pagamentos - Versão Mobile */}
        <div className="block sm:hidden">
          {payments.length === 0 ? (
            <div className="border-riodavida/20 bg-riodavida/5 flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-12 text-center transition-colors">
              <div className="bg-riodavida/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <CreditCard className="text-riodavida h-8 w-8" />
              </div>
              <h4 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-1 text-base font-semibold">
                Nenhum pagamento registrado
              </h4>
              <p className="text-muted-foreground max-w-xs text-sm">
                Ainda não há pagamentos para esta inscrição. Registre o primeiro
                pagamento para começar.
              </p>
              {onRegisterPayment && (
                <Button
                  className="bg-riodavida hover:bg-riodavida-dark mt-4 text-white"
                  onClick={onRegisterPayment}
                  size="sm"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Registrar pagamento
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div
                  key={payment.id}
                  className="border-riodavida/20 hover:bg-riodavida/5 rounded-lg border p-4 transition-colors"
                >
                  {/* Primeira linha: Número e Ações */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm font-medium">
                        #
                      </span>
                      <span className="font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-8 w-8 p-0"
                        onClick={() => setSelectedPayment(payment)}
                        title="Visualizar Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Informações do Pagamento */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">Valor</p>
                      <p className="text-riodavida-secondary dark:text-riodavida-muted-light text-base font-bold">
                        {getFormatCurrency(payment.value)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-xs">ID</p>
                      <code className="bg-riodavida/5 rounded px-2 py-1 font-mono text-xs">
                        {payment.id.substring(0, 8)}...
                      </code>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-muted-foreground text-xs">Data</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="text-riodavida h-4 w-4" />
                        <p className="text-sm font-medium">
                          {formatDateTime(payment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagamentos - Versão Desktop */}
        <div className="border-riodavida/10 hidden rounded-md border sm:block">
          {payments.length === 0 ? (
            <div className="bg-riodavida/5 flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-riodavida/10 mb-4 flex h-20 w-20 items-center justify-center rounded-full">
                <CreditCard className="text-riodavida h-10 w-10" />
              </div>
              <h4 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-1 text-lg font-semibold">
                Nenhum pagamento registrado
              </h4>
              <p className="text-muted-foreground max-w-sm text-sm">
                Ainda não há pagamentos para esta inscrição. Registre o primeiro
                pagamento para começar.
              </p>
              {onRegisterPayment && (
                <Button
                  className="bg-riodavida hover:bg-riodavida-dark mt-4 text-white"
                  onClick={onRegisterPayment}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Registrar pagamento
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-riodavida/5">
                <TableRow>
                  <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-16">
                    #
                  </TableHead>
                  <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[200px]">
                    ID
                  </TableHead>
                  <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                    Valor
                  </TableHead>
                  <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[200px]">
                    Data
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment, index) => (
                  <TableRow key={payment.id} className="hover:bg-riodavida/5">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="text-riodavida-secondary dark:text-riodavida-muted-light font-semibold">
                      {getFormatCurrency(payment.value)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="text-riodavida h-4 w-4" />
                        {formatDateTime(payment.createdAt)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
