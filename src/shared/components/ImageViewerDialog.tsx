'use client';

import { Button } from '@/shared/components/ui/button';
import { Modal } from 'antd';
import { Download, Loader2, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export enum ImageViewerDownloadExtension {
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
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
  title = 'Visualizar Imagem',
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
    if (!isOpen) return;
    setImageLoading(true);
    setImageDimensions(null);
  }, [imageUrl, isOpen]);

  useEffect(() => {
    const updateViewportSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewportSize();
    window.addEventListener('resize', updateViewportSize);
    return () => window.removeEventListener('resize', updateViewportSize);
  }, []);

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
      const link = document.createElement('a');
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
      console.error('Erro ao fazer download da imagem:', error);
      // Fallback: abrir em nova aba se o download falhar
      window.open(imageUrl, '_blank');
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

  // Cálculo responsivo para o dialog
  const dialogWidth = (() => {
    if (!viewportSize.width) return undefined;

    const isMobile = viewportSize.width < 640;
    const horizontalAllowance = isMobile ? 48 : 96; // paddings + controls
    const maxWidthPercentage = isMobile ? 0.98 : 0.95;

    if (!imageDimensions) {
      return Math.min(960, viewportSize.width * maxWidthPercentage);
    }

    const maxWidth = Math.min(
      imageDimensions.width + horizontalAllowance,
      viewportSize.width * maxWidthPercentage,
    );

    return isMobile ? Math.max(280, maxWidth) : maxWidth;
  })();

  const dialogHeight = (() => {
    if (!viewportSize.height) return undefined;

    const isMobile = viewportSize.width < 640;
    const verticalAllowance = isMobile ? 200 : 260; // header + actions + paddings
    const maxHeightPercentage = isMobile ? 0.95 : 0.9;

    if (!imageDimensions) {
      return Math.min(720, viewportSize.height * maxHeightPercentage);
    }

    return Math.min(
      imageDimensions.height + verticalAllowance,
      viewportSize.height * maxHeightPercentage,
    );
  })();

  const imageAreaMaxHeight = (() => {
    if (viewportSize.height) {
      const isMobile = viewportSize.width < 640;
      const viewportLimit = viewportSize.height * (isMobile ? 0.65 : 0.7);

      if (!imageDimensions) {
        return viewportLimit;
      }

      return Math.min(imageDimensions.height, viewportLimit);
    }

    return imageDimensions?.height ?? 480;
  })();

  const imageAreaMinHeight = Math.min(300, imageAreaMaxHeight ?? 300);

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      mask={{ closable: true }}
      keyboard={true}
      closable={true}
      centered
      width={dialogWidth}
      styles={{ body: { padding: 0 } }}
      title={
        <div className="space-y-1 px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="text-lg leading-none font-semibold sm:text-xl">
            {title}
          </div>
          {description && (
            <div className="text-muted-foreground text-xs sm:text-sm">
              {description}
            </div>
          )}
        </div>
      }
    >
      <div
        className="flex flex-col px-4 pb-4 sm:px-6 sm:pb-6"
        style={{
          maxWidth: viewportSize.width
            ? viewportSize.width * (viewportSize.width < 640 ? 0.98 : 0.95)
            : undefined,
          maxHeight: dialogHeight,
          minWidth: viewportSize.width < 640 ? 280 : 450,
        }}
      >
        {/* Controles de Zoom e Download */}
        <div className="flex flex-col items-start justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center sm:gap-2">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              title="Reduzir zoom"
            >
              <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <span className="min-w-[50px] text-center text-xs font-medium sm:min-w-[60px] sm:text-sm">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
              title="Aumentar zoom"
            >
              <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetZoom}
              className="h-8 px-2 text-xs sm:h-9 sm:px-3"
            >
              Resetar
            </Button>
          </div>

          <Button
            onClick={handleDownloadImage}
            disabled={downloadLoading}
            size="sm"
            className="h-8 w-full text-xs sm:h-9 sm:w-auto sm:text-sm"
          >
            {downloadLoading ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin sm:mr-2 sm:h-4 sm:w-4" />
            ) : (
              <Download className="mr-1 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
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
          <div className="flex items-start justify-center p-2 sm:p-4">
            {imageLoading && (
              <div className="flex h-64 w-full items-center justify-center sm:h-96">
                <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8" />
              </div>
            )}
            <div className="relative">
              <Image
                key={imageUrl}
                src={imageUrl}
                alt="Imagem ampliada"
                width={imageDimensions?.width ?? 800}
                height={imageDimensions?.height ?? 600}
                className={`rounded-lg transition-transform duration-200 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  maxWidth: 'none',
                  cursor: zoom > 1 ? 'move' : 'default',
                }}
                onLoadingComplete={(img) => {
                  setImageDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  });
                  setImageLoading(false);
                }}
                onError={() => setImageLoading(false)}
              />
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="text-muted-foreground border-t pt-2 text-center text-xs text-[10px] sm:text-xs">
          Use os botões de zoom para ampliar ou reduzir a imagem
          {viewportSize.width < 640 &&
            ' • Arraste para mover a imagem ampliada'}
        </div>
      </div>
    </Modal>
  );
}
