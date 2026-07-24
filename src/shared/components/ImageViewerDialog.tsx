'use client';

import { Button } from '@/shared/components/ui/button';
import { Carousel, Modal } from 'antd';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export enum ImageViewerDownloadExtension {
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
  WEBP = 'webp',
}

interface ImageViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrls: string | string[]; // Aceita string única ou array
  title?: string;
  description?: string;
  downloadFileName?: string;
  downloadFileExtension?: ImageViewerDownloadExtension;
}

export default function ImageViewerDialog({
  isOpen,
  onClose,
  imageUrls,
  title = 'Visualizar Imagem',
  description,
  downloadFileName,
  downloadFileExtension = ImageViewerDownloadExtension.JPG,
}: ImageViewerDialogProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const carouselRef = useRef<any>(null);

  // Normalizar para array
  const imageArray = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  const currentImageUrl = imageArray[currentIndex] || '';
  const isMultiple = imageArray.length > 1;

  useEffect(() => {
    if (!isOpen) return;
    setImageLoading(true);
    setImageDimensions(null);
    setCurrentIndex(0);
  }, [imageUrls, isOpen]);

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

      const response = await fetch(currentImageUrl);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = resolveDownloadFileName();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erro ao fazer download da imagem:', error);
      window.open(currentImageUrl, '_blank');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleClose = () => {
    setZoom(1);
    setImageLoading(true);
    setImageDimensions(null);
    setCurrentIndex(0);
    onClose();
  };

  // Navegação do carousel
  const goToPrevious = () => {
    const newIndex =
      currentIndex === 0 ? imageArray.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setZoom(1);
    setImageDimensions(null);
    setImageLoading(true);
    carouselRef.current?.goTo(newIndex);
  };

  const goToNext = () => {
    const newIndex =
      currentIndex === imageArray.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setZoom(1);
    setImageDimensions(null);
    setImageLoading(true);
    carouselRef.current?.goTo(newIndex);
  };

  // Cálculo responsivo
  const dialogWidth = (() => {
    if (!viewportSize.width) return undefined;
    const isMobile = viewportSize.width < 640;
    const horizontalAllowance = isMobile ? 48 : 96;
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
    const verticalAllowance = isMobile ? 240 : 300; // Aumentado para acomodar navegação
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
      const viewportLimit = viewportSize.height * (isMobile ? 0.55 : 0.6);

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
          {isMultiple && (
            <div className="text-muted-foreground mt-1 text-xs">
              Imagem {currentIndex + 1} de {imageArray.length}
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
        {/* Controles */}
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

        {/* Container da Imagem com Carousel */}
        <div
          className="relative flex-1 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800"
          style={{
            minHeight: imageAreaMinHeight,
            maxHeight: imageAreaMaxHeight,
          }}
        >
          {imageArray.length > 0 ? (
            <>
              <Carousel
                ref={carouselRef}
                dots={isMultiple}
                fade={true}
                initialSlide={currentIndex}
                afterChange={(index) => {
                  setCurrentIndex(index);
                  setZoom(1);
                  setImageDimensions(null);
                  setImageLoading(true);
                }}
                className="h-full w-full"
              >
                {imageArray.map((url, index) => (
                  <div
                    key={index}
                    className="flex h-full items-center justify-center p-2 sm:p-4"
                  >
                    <div className="relative flex h-full w-full items-center justify-center">
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin sm:h-8 sm:w-8" />
                        </div>
                      )}
                      <Image
                        src={url}
                        alt={`Imagem ${index + 1}`}
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
                          if (index === currentIndex) {
                            setImageDimensions({
                              width: img.naturalWidth,
                              height: img.naturalHeight,
                            });
                            setImageLoading(false);
                          }
                        }}
                        onError={() => {
                          if (index === currentIndex) {
                            setImageLoading(false);
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Carousel>

              {/* Controles de navegação do carousel */}
              {isMultiple && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70 sm:left-3 sm:p-2"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white transition-colors hover:bg-black/70 sm:right-3 sm:p-2"
                    aria-label="Próxima imagem"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Nenhuma imagem disponível
              </p>
            </div>
          )}
        </div>

        {/* Instruções */}
        <div className="text-muted-foreground border-t pt-2 text-center text-xs text-[10px] sm:text-xs">
          {isMultiple && 'Use as setas para navegar entre as imagens • '}
          Use os botões de zoom para ampliar ou reduzir
          {viewportSize.width < 640 &&
            ' • Arraste para mover a imagem ampliada'}
        </div>
      </div>
    </Modal>
  );
}
