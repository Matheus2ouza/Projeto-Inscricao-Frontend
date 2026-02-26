"use client";

import {
  ModifyReceiptPaymentInput,
  ModifyReceiptPaymentResponse,
} from "@/features/payment/types/analysisPayment/actions/modifyReceiptPaymentTypes";
import {
  Payment,
  PaymentMethod,
  StatusPayment,
} from "@/features/payment/types/analysisPayment/analysisPaymentDetails";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import ImageUpdateDialog from "@/shared/components/ImageUpdateDialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Textarea } from "@/shared/components/ui/textarea";
import { calculateGlobalIndex } from "@/shared/utils/calculateGlobalIndex";
import { formatDateTime } from "@/shared/utils/formatDate";
import { getConvertStatusPayment } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { Modal } from "antd";
import {
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSign,
  Eye,
  FileImage,
  ImageIcon,
  ImagePlus,
  Link,
  Receipt,
  Undo2,
  User,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  ApprovePaymentInput,
  ApprovePaymentResponse,
} from "../../types/analysisPayment/actions/approvePaymentTypes";
import {
  RejectedPaymentInput,
  RejectedPaymentResponse,
} from "../../types/analysisPayment/actions/rejectedPaymentTypes";
import {
  ReversePaymentInput,
  ReversePaymentResponse,
} from "../../types/analysisPayment/actions/reversePaymentTypes";

export interface DetailsPaymentTableProps {
  payment?: Payment;
  onApprovePayment?: ({
    paymentId,
  }: ApprovePaymentInput) => Promise<ApprovePaymentResponse>;
  isApproving?: boolean;
  onRejectPayment?: ({
    paymentId,
    rejectionReason,
  }: RejectedPaymentInput) => Promise<RejectedPaymentResponse>;
  isRejecting?: boolean;
  onRevertPayment?: ({
    paymentId,
  }: ReversePaymentInput) => Promise<ReversePaymentResponse>;
  isReversing?: boolean;
  onModifyReceiptPayment?: (
    input: ModifyReceiptPaymentInput,
  ) => Promise<ModifyReceiptPaymentResponse>;
  isModifingReceiptPayment?: boolean;
}

export default function DetailsPaymentTable({
  payment,
  onApprovePayment,
  isApproving,
  onRejectPayment,
  isRejecting,
  onRevertPayment,
  isReversing,
  onModifyReceiptPayment,
  isModifingReceiptPayment,
}: DetailsPaymentTableProps) {
  const [imageError, setImageError] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [revertDialogOpen, setRevertDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false);

  const handleApproveClick = () => setApproveDialogOpen(true);
  const handleRevertClick = () => setRevertDialogOpen(true);
  const handleRejectClick = () => {
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Pagamento não encontrado</h3>
        <p className="text-muted-foreground">
          Não foi possível carregar os detalhes do pagamento.
        </p>
      </div>
    );
  }

  const handleConfirmApprove = async () => {
    if (onApprovePayment) {
      await onApprovePayment({ paymentId: payment.id });
      setApproveDialogOpen(false);
    }
  };

  const handleConfirmRevert = async () => {
    if (onRevertPayment) {
      await onRevertPayment({ paymentId: payment.id });
      setRevertDialogOpen(false);
    }
  };

  const handleConfirmReject = async () => {
    if (onRejectPayment && rejectionReason.trim()) {
      await onRejectPayment({
        paymentId: payment.id,
        rejectionReason,
      });
      setRejectDialogOpen(false);
    }
  };

  // Função para obter ícone do método de pagamento
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const iconMap: Record<PaymentMethod, React.ReactNode> = {
      [PaymentMethod.DINHEIRO]: <DollarSign className="h-4 w-4" />,
      [PaymentMethod.PIX]: <Receipt className="h-4 w-4" />,
      [PaymentMethod.CARTAO]: <CreditCard className="h-4 w-4" />,
    };
    return iconMap[method] || <DollarSign className="h-4 w-4" />;
  };

  // Verificar se pode mostrar botão de reverter
  const statusUpper = String(payment.status).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Card Principal do Pagamento */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-4 flex-1">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes do Pagamento
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide truncate">
                    {payment.responsible || "-"}
                  </div>
                  {payment.isGuest && (
                    <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                      N/ Alocado
                    </Badge>
                  )}
                </div>
                <div className="mt-2 font-mono text-xs text-muted-foreground break-all">
                  {payment.id}
                </div>
              </div>

              {/* Informações do Pagamento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {/* Valor Total */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Valor Total</span>
                  </div>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {getFormatCurrency(payment.totalValue)}
                  </p>
                </div>

                {/* Status */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Status</span>
                  </div>
                  <Badge
                    className={`${getStatusColor(payment.status)} border-0 w-fit`}
                  >
                    {getConvertStatusPayment(payment.status)}
                  </Badge>
                </div>

                {/* Método de Pagamento */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {getPaymentMethodIcon(payment.methodPayment)}
                    <span className="text-sm font-medium">Método</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {payment.methodPayment}
                  </p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col gap-2 w-full lg:w-auto">
              <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                {/* Aprovar (só mostra se estiver em análise) */}

                {payment.status === StatusPayment.UNDER_REVIEW && (
                  <Button className="gap-2" onClick={handleApproveClick}>
                    <DollarSign className="h-4 w-4" />
                    Aprovar Pagamento
                  </Button>
                )}
                {/* Rejeitar (só mostra se estiver em análise) */}

                {payment.status === StatusPayment.UNDER_REVIEW && (
                  <Button
                    variant="destructive"
                    className="gap-2"
                    onClick={handleRejectClick}
                  >
                    <AlertCircle className="h-4 w-4" />
                    Rejeitar Pagamento
                  </Button>
                )}

                {/* Reverter (só mostra se estiver aprovado ou rejeitado) */}
                {payment.status !== StatusPayment.UNDER_REVIEW && (
                  <Button
                    variant="outline"
                    className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900/20"
                    onClick={handleRevertClick}
                  >
                    <Undo2 className="h-4 w-4" />
                    Reverter Status
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Alocações */}
      {payment.allocation && payment.allocation.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Alocações
              </h2>
              <p className="text-muted-foreground">
                {payment.allocation.length} alocação
                {payment.allocation.length !== 1 ? "ões" : ""} neste pagamento
              </p>
            </div>
          </div>

          {/* Alocações - Versão Desktop */}
          <div className="hidden sm:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead className="w-[250px]">ID da Inscrição</TableHead>
                  <TableHead className="w-[220px]">Responsável</TableHead>
                  <TableHead className="w-[140px] text-right">Valor</TableHead>
                  <TableHead className="w-[100px] text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payment.allocation.map((alloc, idx) => (
                  <TableRow
                    key={`${alloc.inscriptionId}-${idx}`}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium">
                      {calculateGlobalIndex(idx)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {alloc.inscriptionId.substring(0, 8)}...
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate">
                      {alloc.responsible || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {getFormatCurrency(alloc.value)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Visualizar Inscrição"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Alocações - Versão Mobile */}
          <div className="block sm:hidden">
            <div className="space-y-3">
              {payment.allocation.map((alloc, idx) => (
                <div
                  key={`${alloc.inscriptionId}-${idx}`}
                  className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      ID da Inscrição
                    </p>
                    <code className="font-mono text-xs bg-muted px-2 py-1 rounded block">
                      {alloc.inscriptionId.substring(0, 12)}...
                    </code>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-1">
                      Responsável
                    </p>
                    <p className="font-medium truncate">
                      {alloc.responsible || "-"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {getFormatCurrency(alloc.value)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      title="Visualizar Inscrição"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Card de Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card de Identificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Identificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  ID do Pagamento
                </span>
                <div className="mt-1">
                  <code className="font-mono text-sm bg-muted px-3 py-2 rounded block break-all">
                    {payment.id}
                  </code>
                </div>
              </div>

              <div className="pt-3 border-t">
                <span className="text-sm font-medium text-muted-foreground">
                  Responsável
                </span>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {payment.responsible || "-"}
                    </span>
                    {payment.isGuest && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-2 text-[10px]"
                      >
                        N/ Alocado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <span className="text-sm font-medium text-muted-foreground">
                  Método de Pagamento
                </span>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(payment.methodPayment)}
                    <span className="font-medium">{payment.methodPayment}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t">
                <span className="text-sm font-medium text-muted-foreground">
                  Status Atual
                </span>
                <div className="mt-2">
                  <Badge
                    className={`${getStatusColor(payment.status)} px-3 py-1 text-sm`}
                  >
                    {getConvertStatusPayment(payment.status)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Datas e Valores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Datas e Valores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Valor Total
                </span>
                <div className="mt-1">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {getFormatCurrency(payment.totalValue)}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t">
                <span className="text-sm font-medium text-muted-foreground">
                  Data de Criação
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatDateTime(payment.createdAt)}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t">
                <span className="text-sm font-medium text-muted-foreground">
                  Última Atualização
                </span>
                <div className="mt-1 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatDateTime(payment.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivo de Rejeição */}
      {getConvertStatusPayment(payment.status) === StatusPayment.REFUSED &&
        payment.rejectionReason && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Motivo da Rejeição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-white dark:bg-gray-800 border border-destructive/20 rounded-md">
                <p className="text-destructive">{payment.rejectionReason}</p>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Comprovante Visual */}
      {payment.imageUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Comprovante de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full sm:w-auto mr-2">
                <Link className="h-4 w-4" />
                Abrir em nova aba
              </Button>
              {onModifyReceiptPayment && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setModifyDialogOpen(true)}
                  disabled={!!isModifingReceiptPayment}
                >
                  <ImagePlus className="h-4 w-4" />
                  Modificar comprovante
                </Button>
              )}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                {!imageError ? (
                  <Image
                    src={payment.imageUrl}
                    alt="Comprovante de pagamento"
                    fill
                    className="object-contain"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">
                      Erro ao carregar imagem
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <ImageUpdateDialog
        open={modifyDialogOpen}
        onOpenChange={setModifyDialogOpen}
        title="Modificar comprovante"
        description="Selecione ou arraste uma imagem para atualizar o comprovante."
        onSubmit={async (imageDataUrl) => {
          if (!onModifyReceiptPayment) return;
          await onModifyReceiptPayment({
            paymentId: payment.id,
            image: imageDataUrl,
          });
        }}
        isSubmitting={!!isModifingReceiptPayment}
      />

      <ConfirmationDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        onConfirm={handleConfirmApprove}
        title="Aprovar Pagamento"
        message="Tem certeza que deseja aprovar este pagamento? Tenha certeza de que o pagamento foi realizado corretamente."
        confirmText="Aprovar"
        isLoading={isApproving}
      />

      <ConfirmationDialog
        open={revertDialogOpen}
        onOpenChange={setRevertDialogOpen}
        onConfirm={handleConfirmRevert}
        title="Reverter Status"
        message="Ao reverter o pagamento ele voltará para o status de 'Em Análise'."
        confirmText="Reverter"
        isLoading={isReversing}
        variant="destructive"
      />

      <Modal
        title="Rejeitar Pagamento"
        open={rejectDialogOpen}
        onCancel={() => setRejectDialogOpen(false)}
        footer={null}
        destroyOnHidden
        mask={{ closable: !isRejecting }}
        closable={!isRejecting}
        keyboard={!isRejecting}
      >
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Informe o motivo da rejeição deste pagamento. Esta ação notificará o
            usuário.
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Motivo</Label>
            <Textarea
              id="reason"
              placeholder="Digite o motivo da rejeição..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isRejecting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={!rejectionReason.trim() || isRejecting}
            >
              {isRejecting ? "Rejeitando..." : "Confirmar Rejeição"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
