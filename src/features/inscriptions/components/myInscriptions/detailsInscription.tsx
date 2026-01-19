import { useFormUpdateInscription } from "@/features/inscriptions/hooks/myInscriptions/useFormUpdateInscription";
import {
  Inscription,
  Participant,
  Payment,
} from "@/features/inscriptions/types/MyInscriptions/detailsInscriptionTypes";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatDate, formatDateTime } from "@/shared/utils/formatDate";
import { formatPhone } from "@/shared/utils/formatPhone";
import { getConvertStatusInscription } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
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
} from "lucide-react";
import { useState } from "react";

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
    inscriptionId: inscription?.id ?? "",
    initialValues: inscription
      ? {
          responsible: inscription.responsible,
          email: inscription.email ?? "",
          phone: inscription.phone ?? "",
        }
      : undefined,
    onSuccess: () => setIsEditDialogOpen(false),
    onDeleteSuccess: onDeleted,
  });

  if (!inscription) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Inscrição não encontrada</h3>
        <p className="text-muted-foreground">
          Não foi possível carregar os detalhes desta inscrição.
        </p>
      </div>
    );
  }

  // Calcular total pago
  const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);

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
      MALE: "Masculino",
      FEMALE: "Feminino",
      OTHER: "Outro",
      male: "Masculino",
      female: "Feminino",
      other: "Outro",
    };

    return genderMap[gender] || gender;
  };

  return (
    <div className="space-y-8">
      {/* Card da Inscrição */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes da Inscrição
                </h1>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1 mt-2">
                  <FileText className="h-4 w-4" />
                  <code className="font-mono bg-muted px-2 py-1 rounded">
                    {inscription.id.substring(0, 12)}...
                  </code>
                </div>

                <div className="text-xs text-muted-foreground">
                  Criada em: {formatDateTime(inscription.createdAt)}
                </div>
              </div>

              {/* Informações do Responsável */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Responsável</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {inscription.responsible}
                  </p>
                </div>

                {inscription.email && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Email</span>
                    </div>
                    <p className="text-sm font-medium break-all">
                      {inscription.email}
                    </p>
                  </div>
                )}

                {inscription.phone && (
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Telefone</span>
                    </div>
                    <p className="text-sm font-medium">{inscription.phone}</p>
                  </div>
                )}

                {/* Card de Status */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      inscription.status,
                    )}`}
                  >
                    {getConvertStatusInscription(inscription.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto">
              <Button
                type="button"
                className="gap-2"
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
                {isDeleting ? "Deletando..." : "Deletar Inscrição"}
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
            <DialogTitle>Editar dados da inscrição</DialogTitle>
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
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(event) => {
                          const formatted = formatPhone(event.target.value);
                          field.onChange(formatted);
                        }}
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
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
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
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </span>
                  ) : (
                    "Salvar alterações"
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Participantes
            </h2>
            <p className="text-muted-foreground">
              {participants.length} participante
              {participants.length !== 1 ? "s" : ""} nesta inscrição
            </p>
          </div>
        </div>

        {/* Participantes - Versão Mobile */}
        <div className="block sm:hidden">
          {participants.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
              Nenhum participante encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {/* Primeira linha: Nome e Ações */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">{participant.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        onClick={() => setSelectedParticipant(participant)}
                        title="Visualizar Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Excluir Participante"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Informações do Participante */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Tipo</p>
                      <p className="text-sm font-medium">
                        {participant.typeInscription || "Não informado"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Idade</p>
                      <p className="text-sm font-medium">
                        {calculateAge(participant.birthDate)} anos
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Gênero</p>
                      <p className="text-sm font-medium">
                        {formatGender(participant.gender)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
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
        <div className="hidden sm:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[140px]">Tipo</TableHead>
                <TableHead className="w-[100px]">Idade</TableHead>
                <TableHead className="w-[120px]">Gênero</TableHead>
                <TableHead className="w-[140px]">Nascimento</TableHead>
                <TableHead className="w-[100px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {participant.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {participant.typeInscription || "Não informado"}
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
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        onClick={() => setSelectedParticipant(participant)}
                        title="Visualizar Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Informações financeiras */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Resumo Financeiro
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Pago */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total pago
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {getFormatCurrency(inscription.totalPaid)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {payments.length} pagamento
                    {payments.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Valor Total */}
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Valor total
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
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
                        ? "text-amber-600 dark:text-amber-500"
                        : "text-green-600 dark:text-green-500"
                    }`}
                  >
                    {getFormatCurrency(inscription.totalDebt)}
                  </p>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
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
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((inscription.totalPaid / inscription.totalValue) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 min-w-[200px]">
              {onViewPayment && (
                <Button
                  variant="outline"
                  className="gap-2 w-full justify-center"
                  onClick={onViewPayment}
                >
                  <Eye className="h-4 w-4" />
                  Ver todos pagamentos
                </Button>
              )}
              {onRegisterPayment && (
                <Button
                  className="gap-2 w-full justify-center"
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
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Histórico de Pagamentos
            </h2>
            <p className="text-muted-foreground">
              {payments.length} pagamento{payments.length !== 1 ? "s" : ""}{" "}
              registrado{payments.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Pagamentos - Versão Mobile */}
        <div className="block sm:hidden">
          {payments.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
              Nenhum pagamento registrado
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment, index) => (
                <div
                  key={payment.id}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {/* Primeira linha: Número e Ações */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        #
                      </span>
                      <span className="font-semibold">{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
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
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="text-base font-bold text-green-600 dark:text-green-400">
                        {getFormatCurrency(payment.value)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">ID</p>
                      <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {payment.id.substring(0, 8)}...
                      </code>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <p className="text-xs text-muted-foreground">Data</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
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
        <div className="hidden sm:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead className="w-[200px]">ID</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="w-[200px]">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment, index) => (
                <TableRow key={payment.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {payment.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-semibold text-green-600 dark:text-green-400">
                    {getFormatCurrency(payment.value)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDateTime(payment.createdAt)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
