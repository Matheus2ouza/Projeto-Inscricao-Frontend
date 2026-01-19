import { useRegisterPayment } from "@/features/payment/hook/registerPayment/useRegisterPayment";
import type { CreatePaymentResponse } from "@/features/payment/types/registerPayment/registerPaymentTypes";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { formatCurrency } from "@/shared/utils/formatCurrency";
import {
  ArrowBigRightDash,
  CheckCheck,
  Copy,
  CreditCard,
  FileText,
  ImageIcon,
  QrCode,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface RegisterPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInscriptions: { id: string }[];
  eventId: string;
  totalValue: number;
  onPaymentRegistered?: (payment: CreatePaymentResponse) => void;
  onSubmitPayment?: (payload: {
    value: number;
    image: string;
  }) => Promise<void> | void;
  autoRegisterOnExactAmount?: boolean;
  allowCustomValue?: boolean;
}

export default function RegisterPaymentDialog({
  open,
  onOpenChange,
  selectedInscriptions,
  eventId,
  totalValue,
  onPaymentRegistered,
  onSubmitPayment,
  autoRegisterOnExactAmount = false,
  allowCustomValue = true,
}: RegisterPaymentDialogProps) {
  const [paymentValue, setPaymentValue] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const registerPayment = useRegisterPayment();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB em bytes
  const ALLOWED_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const bankData = {
    beneficiary: "IGREJA EM CASTANHAL",
    bank: "Banco Bradesco",
    agency: "6667-2",
    account: "6779-2",
    pixKey: "ofertaigcastanhal@gmail.com",
  };

  const validateFile = (file: File): boolean => {
    // Validar tipo de arquivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Tipo de arquivo não permitido", {
        description: "Por favor, selecione uma imagem JPG, PNG ou WebP.",
      });
      return false;
    }

    // Validar tamanho do arquivo (5MB)
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Arquivo muito grande", {
        description: "O tamanho máximo permitido é 5MB.",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setReceiptFile(file);

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setReceiptPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    // Limpa o input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if ((!paymentValue && allowCustomValue) || !receiptFile) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const resolvedValue = allowCustomValue
      ? parseFloat(paymentValue)
      : totalValue;
    if (Number.isNaN(resolvedValue)) {
      toast.error("Valor inválido", {
        description: "Não foi possível identificar o valor pago.",
      });
      return;
    }

    if (allowCustomValue) {
      if (resolvedValue <= 0 || resolvedValue > totalValue) {
        toast.error("Valor inválido", {
          description: `Por favor, insira um valor entre R$ 0,01 e ${formatCurrency(totalValue)}.`,
        });
        return;
      }
    }

    setIsSubmitting(true);

    const imageData = receiptPreview as string;
    const isExactAmount = Math.abs(resolvedValue - totalValue) < 0.01;
    const shouldRegisterWithBackend =
      !onSubmitPayment || (autoRegisterOnExactAmount && isExactAmount);

    try {
      let paymentResult: CreatePaymentResponse | undefined;

      if (shouldRegisterWithBackend) {
        if (!selectedInscriptions || selectedInscriptions.length === 0) {
          throw new Error(
            "Nenhuma inscrição selecionada para registrar pagamento.",
          );
        }
        paymentResult = await registerPayment.mutateAsync({
          eventId,
          totalValue: resolvedValue,
          image: imageData,
          inscriptions: selectedInscriptions,
        });
      }

      if (onSubmitPayment) {
        await onSubmitPayment({ value: resolvedValue, image: imageData });
      }

      // Limpar formulário
      setPaymentValue("");
      setReceiptFile(null);
      setReceiptPreview(null);

      // Fechar dialog
      onOpenChange(false);

      // Callback opcional
      if (onPaymentRegistered && paymentResult) {
        onPaymentRegistered(paymentResult);
      }
    } catch (error) {
      console.error("Erro ao registrar pagamento:", error);
      const errorMessage = shouldRegisterWithBackend
        ? "Erro ao registrar pagamento"
        : "Erro ao processar comprovante";

      toast.error(errorMessage, {
        description: "Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileTypeName = (type: string) => {
    const typeMap: { [key: string]: string } = {
      "image/jpeg": "JPEG",
      "image/jpg": "JPG",
      "image/png": "PNG",
      "image/webp": "WebP",
    };
    return typeMap[type] || type;
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    if (open) {
      setIsFlipped(false);
      if (!allowCustomValue) {
        setPaymentValue(String(totalValue));
      }
    }
  }, [open, allowCustomValue, totalValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 border-0 bg-transparent overflow-visible">
        <DialogHeader className="sr-only">
          <DialogTitle>Registrar Pagamento</DialogTitle>
          <DialogDescription>
            {selectedInscriptions.length === 1
              ? `Registre um novo pagamento para a inscrição #${selectedInscriptions[0].id.slice(
                  0,
                  8,
                )}...`
              : `Registre um novo pagamento para ${selectedInscriptions.length} inscrições.`}
          </DialogDescription>
        </DialogHeader>

        {/* Container principal com efeito de moeda */}
        <div className="relative w-full h-[635px] [perspective:1000px]">
          {/* Card que gira */}
          <div
            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Frente - Dados Bancários */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
              <Card className="w-full h-full border-0 rounded-lg shadow-lg">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        Dados para Pagamento
                      </h3>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Valor Total da Inscrição */}
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-sm font-medium">
                        Valor Total da Inscrição
                      </Label>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(totalValue)}
                      </p>
                    </div>

                    <Separator />

                    {/* Dados Bancários */}
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">
                          Favorecido
                        </Label>
                        <div className="flex items-center justify-between">
                          <p className="text-sm">{bankData.beneficiary}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopyToClipboard(
                                bankData.beneficiary,
                                "beneficiary",
                              )
                            }
                          >
                            {copiedField === "beneficiary" ? (
                              <CheckCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Banco</Label>
                        <p className="text-sm">{bankData.bank}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Agência</Label>
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{bankData.agency}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopyToClipboard(bankData.agency, "agency")
                              }
                            >
                              {copiedField === "agency" ? (
                                <CheckCheck className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Conta</Label>
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{bankData.account}</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCopyToClipboard(
                                  bankData.account,
                                  "account",
                                )
                              }
                            >
                              {copiedField === "account" ? (
                                <CheckCheck className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Chave PIX</Label>
                        <div className="flex items-center justify-between">
                          <p className="text-sm break-all">{bankData.pixKey}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleCopyToClipboard(bankData.pixKey, "pix")
                            }
                          >
                            {copiedField === "pix" ? (
                              <CheckCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Botão Registrar Pagamento */}
                    <div className="pt-4 border-t">
                      <Button
                        type="button"
                        onClick={handleFlip}
                        className="w-full flex items-center justify-center gap-2 py-3 text-base font-semibold"
                      >
                        Registrar Pagamento
                        <ArrowBigRightDash className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Verso - Formulário de Registro */}
            <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <Card className="w-full h-full border-0 rounded-lg shadow-lg">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        Registrar Pagamento
                      </h3>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="flex-1 flex flex-col"
                  >
                    <div className="space-y-4 flex-1">
                      {/* Valor Pago */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="paymentValue"
                          className="text-sm font-medium"
                        >
                          Valor Pago*
                        </Label>
                        {allowCustomValue ? (
                          <>
                            <Input
                              id="paymentValue"
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={totalValue}
                              placeholder="0,00"
                              value={paymentValue}
                              onChange={(e) => setPaymentValue(e.target.value)}
                              required
                              className="text-lg font-medium"
                            />
                            <p className="text-xs text-muted-foreground">
                              Valor entre R$ 0,01 e {formatCurrency(totalValue)}
                            </p>
                          </>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between rounded-lg border px-4 py-2 text-lg font-semibold">
                              <span>{formatCurrency(totalValue)}</span>
                              <span className="text-xs text-muted-foreground">
                                Valor fixo
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              O valor é definido automaticamente para este
                              pedido.
                            </p>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Upload do Comprovante */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="receipt"
                          className="text-sm font-medium"
                        >
                          Comprovante de Pagamento* (Envie somente um
                          comprovante por vez)
                        </Label>

                        {receiptFile ? (
                          <div className="space-y-3">
                            {/* Preview da Imagem */}
                            {receiptPreview && (
                              <div className="relative border rounded-lg overflow-hidden">
                                <img
                                  src={receiptPreview}
                                  alt="Preview do comprovante"
                                  className="w-full h-40 object-contain bg-gray-50"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={handleRemoveFile}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}

                            {/* Informações do Arquivo */}
                            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                              <FileText className="h-6 w-6 text-green-500" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                  {receiptFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatFileSize(receiptFile.size)} •{" "}
                                  {getFileTypeName(receiptFile.type)}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemoveFile}
                              >
                                Trocar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                              isDragOver
                                ? "border-primary bg-primary/5"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50"
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <ImageIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-primary hover:underline">
                                  {isDragOver
                                    ? "Solte o arquivo aqui"
                                    : "Clique para fazer upload"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  ou arraste e solte o arquivo aqui
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                JPG, PNG, WebP (máx. 5MB)
                              </p>
                            </div>
                            <Input
                              ref={fileInputRef}
                              id="receipt-upload"
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Botão Registrar Pagamento (lado do formulário) */}
                    <div className="pt-4 border-t mt-auto">
                      <div className="flex justify-between gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => onOpenChange(false)}
                          disabled={isSubmitting}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            isSubmitting || !paymentValue || !receiptFile
                          }
                          className="flex-1 min-w-32 dark:text-white"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                              Registrando...
                            </>
                          ) : (
                            "Registrar Pagamento"
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
