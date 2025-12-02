"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Download, Loader2, ZoomIn, ZoomOut } from "lucide-react";
import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";

export enum ImageViewerDownloadExtension {
  JPG = "jpg",
  JPEG = "jpeg",
  PNG = "png",
  WEBP = "webp",
}

interface ImageViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  description?: string;
  downloadFileName?: string;
  downloadFileExtension?: ImageViewerDownloadExtension;
}

export default function ImageViewerDialog({
  isOpen,
  onClose,
  imageUrl,
  title = "Visualizar Imagem",
  description,
  downloadFileName,
  downloadFileExtension = ImageViewerDownloadExtension.JPG,
}: ImageViewerDialogProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewportSize();
    window.addEventListener("resize", updateViewportSize);
    return () => window.removeEventListener("resize", updateViewportSize);
  }, []);

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  const resolveDownloadFileName = () => {
    const sanitizedExtension =
      downloadFileExtension ?? ImageViewerDownloadExtension.JPG;
    const fallbackBaseName = `imagem-${Date.now()}`;

    if (downloadFileName?.trim()) {
      const trimmed = downloadFileName.trim();
      const hasExtension = /\.[^./\\]+$/.test(trimmed);
      if (hasExtension) {
        return trimmed;
      }
      return `${trimmed}.${sanitizedExtension}`;
    }

    return `${fallbackBaseName}.${sanitizedExtension}`;
  };

  const handleDownloadImage = async () => {
    try {
      setDownloadLoading(true);

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Criar um URL temporário para o blob
      const blobUrl = URL.createObjectURL(blob);

      // Criar um elemento link temporário
      const link = document.createElement("a");
      link.href = blobUrl;

      // Nome do arquivo
      link.download = resolveDownloadFileName();

      // Simular clique no link para iniciar o download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar o URL do blob
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao fazer download da imagem:", error);
      // Fallback: abrir em nova aba se o download falhar
      window.open(imageUrl, "_blank");
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3)); // Máximo 3x
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5)); // Mínimo 0.5x
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Resetar zoom quando fechar
  const handleClose = () => {
    setZoom(1);
    setImageLoading(true);
    setImageDimensions(null);
    onClose();
  };

  const dialogWidth = (() => {
    if (!viewportSize.width) {
      return undefined;
    }

    const horizontalAllowance = 96; // paddings + controls
    if (!imageDimensions) {
      return Math.min(960, viewportSize.width * 0.95);
    }

    return Math.min(
      imageDimensions.width + horizontalAllowance,
      viewportSize.width * 0.95
    );
  })();

  const dialogHeight = (() => {
    if (!viewportSize.height) {
      return undefined;
    }

    const verticalAllowance = 260; // header + actions + paddings
    if (!imageDimensions) {
      return Math.min(720, viewportSize.height * 0.95);
    }

    return Math.min(
      imageDimensions.height + verticalAllowance,
      viewportSize.height * 0.95
    );
  })();

  const imageAreaMaxHeight = (() => {
    if (viewportSize.height) {
      const viewportLimit = viewportSize.height * 0.7;
      if (!imageDimensions) {
        return viewportLimit;
      }

      return Math.min(imageDimensions.height, viewportLimit);
    }

    return imageDimensions?.height ?? 480;
  })();

  const imageAreaMinHeight = Math.min(400, imageAreaMaxHeight ?? 400);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="flex flex-col"
        style={{
          width: dialogWidth,
          maxWidth: viewportSize.width ? viewportSize.width * 0.95 : undefined,
          maxHeight: dialogHeight,
          minWidth: 450,
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Controles de Zoom e Download */}
        <div className="flex justify-between items-center gap-2 border-b pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetZoom}>
              Resetar
            </Button>
          </div>

          <Button
            onClick={handleDownloadImage}
            disabled={downloadLoading}
            size="sm"
            className="text-white"
          >
            {downloadLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download
          </Button>
        </div>

        {/* Container da Imagem com Scroll */}
        <div
          className="flex-1 overflow-auto rounded-lg bg-gray-100 dark:bg-gray-800"
          style={{
            minHeight: imageAreaMinHeight,
            maxHeight: imageAreaMaxHeight,
          }}
        >
          <div className="flex justify-center items-start p-4">
            {imageLoading && (
              <div className="flex items-center justify-center h-96 w-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            <img
              src={imageUrl}
              alt="Imagem ampliada"
              className={`rounded-lg transition-transform duration-200 ${imageLoading ? "hidden" : "block"}`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                maxWidth: "none",
                cursor: zoom > 1 ? "move" : "default",
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
        </div>

        {/* Instruções */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Use os botões de zoom para ampliar ou reduzir a imagem
        </div>
      </DialogContent>
    </Dialog>
  );
}
