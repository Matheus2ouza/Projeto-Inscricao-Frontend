"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { ImageIcon, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

type TicketPaymentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalValue: number;
  onSubmitPayment: (payload: {
    value: number;
    image: string;
  }) => Promise<void> | void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function TicketPaymentDialog({
  open,
  onOpenChange,
  totalValue,
  onSubmitPayment,
}: TicketPaymentDialogProps) {
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollYRef = useRef<number>(0);

  const handleFileSelect = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Tipo de arquivo inválido", {
        description: "Envie uma imagem JPG, PNG ou WebP",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Arquivo muito grande", {
        description: "O tamanho máximo permitido é 5MB",
      });
      return;
    }

    setReceiptFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!receiptPreview) {
      toast.error("Selecione o comprovante", {
        description: "Envie a imagem do pagamento antes de continuar.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitPayment({ value: totalValue, image: receiptPreview });
      setReceiptFile(null);
      setReceiptPreview(null);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao registrar o pagamento";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFile = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        onOpenAutoFocus={(event) => {
          scrollYRef.current =
            typeof window !== "undefined" ? window.scrollY : 0;
          event.preventDefault();
          if (typeof window !== "undefined") {
            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollYRef.current });
            });
          }
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (typeof window !== "undefined") {
            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollYRef.current });
            });
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Envie o comprovante</DialogTitle>
          <DialogDescription>
            Para concluir o pedido, envie o comprovante do pagamento no valor
            exato de {getFormatCurrency(totalValue)}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium">Valor devido</Label>
            <p className="text-2xl font-semibold mt-1">
              {getFormatCurrency(totalValue)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              O valor é definido pelo sistema. Pagamentos parciais não são
              aceitos.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Comprovante de pagamento*
            </Label>
            {receiptPreview ? (
              <div className="space-y-3">
                <div className="relative border rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={receiptPreview}
                    alt="Comprovante"
                    width={400}
                    height={220}
                    className="object-contain w-full h-52"
                    unoptimized
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={resetFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {receiptFile?.name} •{" "}
                  {(receiptFile?.size ?? 0) / 1024 ** 2 < 1
                    ? `${((receiptFile?.size ?? 0) / 1024).toFixed(1)} KB`
                    : `${((receiptFile?.size ?? 0) / 1024 ** 2).toFixed(1)} MB`}
                </p>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragOver ? "border-primary bg-primary/5" : "border-muted"
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDragOver(false);
                }}
                onDrop={handleDrop}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Clique para selecionar o arquivo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ou arraste e solte o comprovante aqui (JPG, PNG, WebP –
                      máx. 5MB)
                    </p>
                  </div>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !receiptPreview}>
              {isSubmitting ? (
                <>
                  <UploadCloud className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Anexar comprovante"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
