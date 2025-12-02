"use client";

import ImageViewerDialog from "@/shared/components/ImageViewerDialog";
import { AspectRatio } from "@/shared/components/ui/aspect-ratio";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Label } from "@/shared/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  CheckCircle,
  CircleOff,
  CreditCard,
  DollarSign,
  Frown,
  Loader2,
  Mail,
  OctagonX,
  Phone,
  RefreshCcw,
  Trash2,
  User,
  ZoomIn,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePaymentActions } from "../hooks/usePaymentActions";
import { AnalysisPaymentResponse } from "../types/analysisTypes";

interface PaymentDetailAnalysisProps {
  eventStatus: string;
  paymentData: AnalysisPaymentResponse | null;
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function PaymentDetailAnalysis({
  eventStatus,
  paymentData,
  page,
  pageCount,
  total,
  onPageChange,
}: PaymentDetailAnalysisProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    paymentId: string;
  } | null>(null);

  // Resetar página quando o status do evento mudar
  useEffect(() => {
    onPageChange(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventStatus]); // Resetar página quando o status do evento mudar

  const {
    approvePayment,
    refusePayment,
    reviewPayment,
    deletePayment,
    isApproving,
    isRefusing,
    isReviewing,
    isDeleting,
  } = usePaymentActions();

  const [refusalDialog, setRefusalDialog] = useState<{
    paymentId: string;
    reason: string;
  } | null>(null);
  const [refusalError, setRefusalError] = useState<string | null>(null);
  const [deleteDialogPaymentId, setDeleteDialogPaymentId] = useState<
    string | null
  >(null);
  const [imageLoadingState, setImageLoadingState] = useState<
    Record<string, boolean>
  >({});
  const [manualReviewState, setManualReviewState] = useState<
    Record<string, boolean>
  >({});
  const [discardedPayments, setDiscardedPayments] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    if (!paymentData) {
      return;
    }

    setImageLoadingState((prev) => {
      const next = { ...prev };

      paymentData.inscription.payments.forEach((payment) => {
        if (payment.image && !(payment.id in next)) {
          next[payment.id] = true;
        }
      });

      return next;
    });
  }, [paymentData]);

  useEffect(() => {
    if (!paymentData) {
      return;
    }

    setDiscardedPayments(new Set());
  }, [paymentData?.inscription.id]);
  useEffect(() => {
    setManualReviewState({});
  }, [paymentData]);

  const visiblePayments = useMemo(() => {
    if (!paymentData) {
      return [];
    }

    return paymentData.inscription.payments.filter(
      (payment) => !discardedPayments.has(payment.id)
    );
  }, [discardedPayments, paymentData]);

  const markPaymentAsDiscarded = (paymentId: string | null) => {
    if (!paymentId) {
      return;
    }

    setDiscardedPayments((prev) => {
      if (prev.has(paymentId)) {
        return prev;
      }

      const next = new Set(prev);
      next.add(paymentId);

      return next;
    });
  };

  const handleApprovePayment = (paymentId: string) => {
    setManualReviewState((prev) => {
      const { [paymentId]: _omit, ...rest } = prev;
      return rest;
    });
    approvePayment(paymentId, {
      onSuccess: () => markPaymentAsDiscarded(paymentId),
    });
  };

  const handleRefusePayment = (paymentId: string) => {
    setRefusalDialog({ paymentId, reason: "" });
    setRefusalError(null);
  };

  const handleCloseRefusalDialog = () => {
    setRefusalDialog(null);
    setRefusalError(null);
  };

  const handleConfirmRefusal = () => {
    if (!refusalDialog) return;

    const trimmedReason = refusalDialog.reason.trim();
    const paymentId = refusalDialog.paymentId;

    if (!trimmedReason) {
      setRefusalError("Informe o motivo da reprovação.");
      return;
    }

    refusePayment(
      {
        paymentId,
        rejectionReason: trimmedReason,
      },
      {
        onSuccess: () => {
          handleCloseRefusalDialog();
          setManualReviewState((prev) => {
            const { [paymentId]: _omit, ...rest } = prev;
            return rest;
          });
          markPaymentAsDiscarded(paymentId);
        },
        onError: () => {
          // Keep dialog open so the reviewer can adjust the reason if needed
        },
      }
    );
  };

  const handleReviewPayment = (paymentId: string) => {
    setManualReviewState((prev) => ({
      ...prev,
      [paymentId]: true,
    }));
    reviewPayment(paymentId);
  };

  const handleDeletePayment = (paymentId: string) => {
    setDeleteDialogPaymentId(paymentId);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogPaymentId(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteDialogPaymentId) return;

    deletePayment(deleteDialogPaymentId, {
      onSuccess: () => {
        markPaymentAsDiscarded(deleteDialogPaymentId);
        handleCloseDeleteDialog();
      },
    });
  };

  const handleImageClick = (imageUrl: string, paymentId: string) => {
    setSelectedImage({ url: imageUrl, paymentId });
  };

  const handleCloseImageViewer = () => {
    setSelectedImage(null);
  };

  const markImageAsLoaded = (paymentId: string) => {
    setImageLoadingState((prev) => ({
      ...prev,
      [paymentId]: false,
    }));
  };

  const markImageAsErrored = (paymentId: string) => {
    setImageLoadingState((prev) => ({
      ...prev,
      [paymentId]: false,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "refused":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "APROVADO";
      case "under_review":
        return "EM ANÁLISE";
      case "refused":
        return "RECUSADO";
      default:
        return status.toUpperCase();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "refused":
        return <CircleOff className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getInscriptionStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "PAGO";
      case "UNDER_REVIEW":
        return "EM ANÁLISE";
      case "REFUSED":
        return "RECUSADO";
      case "PENDING":
        return "PENDENTE";
      case "PAID":
        return "PAGO";
      case "CANCELLED":
        return "CANCELADO";
      default:
        return status.toUpperCase();
    }
  };

  const getInscriptionStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
      case "PAID":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "UNDER_REVIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "REFUSED":
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (!paymentData) {
    return null;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Informações do Responsável */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {paymentData.inscription.responsible}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Responsável pela inscrição
                  </p>
                </div>
              </div>
              <Badge
                className={`self-start text-sm px-3 py-1.5 ${getInscriptionStatusColor(
                  paymentData.inscription.status
                )}`}
              >
                {getInscriptionStatusText(paymentData.inscription.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Telefone</p>
                  <p className="font-medium">{paymentData.inscription.phone}</p>
                </div>
              </div>

              {paymentData.inscription.email && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm break-all">
                      {paymentData.inscription.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Saldo devedor</p>
                  <p className="font-bold text-lg text-purple-600">
                    R$ {paymentData.inscription.totalValue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total de Pagamentos
                  </p>
                  <p className="text-2xl font-bold ml-4">{total}</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Aprovados
                  </p>
                  <p className="text-2xl font-bold text-green-600 ml-4">
                    {
                      paymentData.inscription.payments.filter(
                        (p) => p.status.toLowerCase() === "approved"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Em Análise
                  </p>
                  <p className="text-2xl font-bold text-blue-600 ml-4">
                    {
                      paymentData.inscription.payments.filter(
                        (p) => p.status.toLowerCase() === "under_review"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Recusados
                  </p>
                  <p className="text-2xl font-bold text-red-600 ml-4">
                    {
                      paymentData.inscription.payments.filter(
                        (p) => p.status.toLowerCase() === "refused"
                      ).length
                    }
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-red-900 rounded-full">
                  <CircleOff className="h-4 w-4 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Pagamentos */}
        <Card className="border-0 shadow-sm">
          <CardContent>
            <h3 className="text-xl font-bold mb-4">Pagamentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {visiblePayments.map((payment, index) => {
                const hasImage = Boolean(payment.image);
                const isUnderReview =
                  payment.status.toLowerCase() === "under_review";
                const disableStatusActions =
                  isApproving || isRefusing || isReviewing || isDeleting;
                const showStatusActions =
                  isUnderReview || manualReviewState[payment.id];
                const isFirstCard = index === 0;
                const isImageLoading =
                  imageLoadingState[payment.id] ?? Boolean(payment.image);

                return (
                  <Card
                    key={payment.id}
                    className="border shadow-sm hover:shadow-md transition-shadow py-1"
                  >
                    <CardContent className="p-4">
                      {/* Status */}
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(payment.status)}
                          {getStatusText(payment.status)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => handleDeletePayment(payment.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="sr-only">Deletar pagamento</span>
                        </Button>
                      </div>

                      {/* Imagem */}
                      <AspectRatio
                        ratio={4 / 3}
                        className={`relative mb-3 rounded-lg overflow-hidden ${
                          hasImage
                            ? "cursor-pointer group"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                        onClick={() =>
                          hasImage && payment.image
                            ? handleImageClick(payment.image, payment.id)
                            : undefined
                        }
                      >
                        {hasImage && payment.image ? (
                          <>
                            {isImageLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30 pointer-events-none">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                              </div>
                            )}
                            <Image
                              src={payment.image}
                              alt={`Comprovante ${index + 1}`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              priority={isFirstCard}
                              className="object-cover"
                              onLoad={() => markImageAsLoaded(payment.id)}
                              onError={() => markImageAsErrored(payment.id)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Frown className="w-10 h-10" />
                            <span className="text-sm font-medium">
                              Imagem indisponível
                            </span>
                          </div>
                        )}
                      </AspectRatio>

                      {/* Valor */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-muted-foreground">
                          Valor:
                        </span>
                        <span className="font-bold text-lg text-green-600">
                          R$ {payment.value.toFixed(2)}
                        </span>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {showStatusActions ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() => handleApprovePayment(payment.id)}
                              disabled={disableStatusActions}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleRefusePayment(payment.id)}
                              disabled={disableStatusActions}
                            >
                              <OctagonX className="w-4 h-4 mr-1" />
                              Recusar
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            onClick={() => handleReviewPayment(payment.id)}
                            disabled={disableStatusActions}
                          >
                            <RefreshCcw className="w-4 h-4 mr-1" />
                            Revisar status
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {visiblePayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Nenhum pagamento registrado
                </h3>
                <p className="text-muted-foreground">
                  Não há pagamentos para esta inscrição.
                </p>
              </div>
            )}

            {/* Paginação */}
            {pageCount > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) {
                            onPageChange(page - 1);
                          }
                        }}
                        href="#"
                        className={
                          page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: pageCount }, (_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={page === i + 1}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(i + 1);
                          }}
                          className="cursor-pointer"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < pageCount) {
                            onPageChange(page + 1);
                          }
                        }}
                        href="#"
                        className={
                          page === pageCount
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}

            {/* Informação de paginação */}
            {total > 0 && (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Mostrando {visiblePayments.length} de {total} pagamentos (Página{" "}
                {page} de {pageCount})
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Image Viewer Dialog */}
      {selectedImage && (
        <ImageViewerDialog
          isOpen={!!selectedImage}
          onClose={handleCloseImageViewer}
          imageUrl={selectedImage.url}
          title="Comprovante de Pagamento"
          description={`Comprovante do pagamento ${selectedImage.paymentId.slice(0, 8)}...`}
          downloadFileName={`comprovante-${selectedImage.paymentId}.jpg`}
        />
      )}

      <Dialog
        open={!!refusalDialog}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseRefusalDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar pagamento</DialogTitle>
            <DialogDescription>
              Descreva o motivo para reprovar este pagamento. Essa mensagem será
              exibida para o inscrito.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Motivo da reprovação</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Explique por que o pagamento foi reprovado"
              value={refusalDialog?.reason ?? ""}
              onChange={(event) => {
                if (!refusalDialog) {
                  return;
                }

                if (refusalError) {
                  setRefusalError(null);
                }

                setRefusalDialog({
                  ...refusalDialog,
                  reason: event.target.value,
                });
              }}
              disabled={isRefusing}
              rows={4}
            />
            {refusalError && (
              <p className="text-xs text-red-500">{refusalError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseRefusalDialog}
              disabled={isRefusing}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmRefusal}
              disabled={isRefusing}
            >
              {isRefusing ? "Enviando..." : "Recusar pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteDialogPaymentId}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseDeleteDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar pagamento</DialogTitle>
            <DialogDescription>
              Essa ação removerá permanentemente o pagamento{" "}
              {deleteDialogPaymentId
                ? `${deleteDialogPaymentId.slice(0, 8)}...`
                : ""}{" "}
              e não poderá ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deletando..." : "Deletar pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
