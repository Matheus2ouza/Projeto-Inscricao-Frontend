"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/lib/utils";
import { Modal } from "antd";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

type ImageUpdateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onSubmit: (imageDataUrl: string) => Promise<void> | void;
  isSubmitting?: boolean;
};

const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
    reader.readAsDataURL(file);
  });
};

const validateFile = (file: File): boolean => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    toast.error("Tipo de arquivo não permitido", {
      description: "Por favor, selecione uma imagem JPG, PNG ou WebP.",
    });
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    toast.error("Arquivo muito grande", {
      description: "O tamanho máximo permitido é 5MB.",
    });
    return false;
  }

  return true;
};

export default function ImageUpdateDialog({
  open,
  onOpenChange,
  title = "Atualizar imagem",
  description = "Selecione ou arraste uma imagem para atualizar.",
  onSubmit,
  isSubmitting = false,
}: ImageUpdateDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = async (nextFile: File) => {
    if (!validateFile(nextFile)) {
      return;
    }
    setFile(nextFile);
    try {
      const url = await readFileAsDataURL(nextFile);
      setPreview(url);
    } catch {
      toast.error("Não foi possível ler o arquivo.");
      clearFile();
    }
  };

  const handleClose = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      clearFile();
    }
  };

  const handleSend = async () => {
    if (!file) {
      toast.error("Selecione uma imagem para enviar.");
      return;
    }
    const imageData =
      preview && preview.length > 0 ? preview : await readFileAsDataURL(file);
    await onSubmit(imageData);
    handleClose(false);
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={() => handleClose(false)}
      footer={null}
      destroyOnHidden
      mask={{ closable: !isSubmitting }}
      closable={!isSubmitting}
      keyboard={!isSubmitting}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="space-y-3">
          {preview ? (
            <div className="relative overflow-hidden rounded-lg border bg-muted/20">
              <div className="relative aspect-video w-full">
                <Image
                  src={preview}
                  alt="Pré-visualização"
                  fill
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-background/80 border shadow-sm"
                onClick={clearFile}
                aria-label="Remover imagem"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={cn(
                "w-full rounded-lg border-2 border-dashed p-6 transition-colors",
                isDragOver
                  ? "border-blue-500 bg-blue-50/60 dark:bg-blue-950/20"
                  : "border-muted-foreground/30 hover:bg-muted/20",
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const dropped = e.dataTransfer.files?.[0];
                if (dropped) {
                  void handleFileSelect(dropped);
                }
              }}
              disabled={isSubmitting}
            >
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {isDragOver
                      ? "Solte a imagem aqui"
                      : "Clique para selecionar"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ou arraste e solte a imagem aqui
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>JPG</span>
                  <span>PNG</span>
                  <span>WebP</span>
                  <span>até 5MB</span>
                </div>
              </div>
            </button>
          )}

          <Input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => {
              const nextFile = e.target.files?.[0];
              if (nextFile) {
                void handleFileSelect(nextFile);
              }
            }}
          />
        </div>

        <div className="pt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSend}
            disabled={!file || isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
