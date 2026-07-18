'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Slider } from '@/shared/components/ui/slider';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type ImageType = 'capa' | 'logo';

type ImageCropDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  imageType: ImageType;
  action: (params: { eventId: string; file: File }) => Promise<void>;
  onSuccess?: () => void;
};

export default function ImageCropDialog({
  open,
  onOpenChange,
  eventId,
  imageType,
  action,
  onSuccess,
}: ImageCropDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Transform controls (pan/zoom)
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastOffsetRef = useRef({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Configurações baseadas no tipo de imagem
  const config = {
    capa: {
      aspect: 16 / 9,
      targetWidth: 1280,
      targetHeight: 720,
      title: 'Alterar imagem do evento',
      description:
        'Arraste/solte sua imagem, ajuste o zoom e posição. Salvaremos em 1280x720.',
      confirmLabel: 'Salvar imagem',
      successMessage: 'Imagem atualizada com sucesso!',
      errorMessage: 'Falha ao atualizar imagem do evento',
    },
    logo: {
      aspect: 1,
      targetWidth: 500,
      targetHeight: 500,
      title: 'Alterar logo do evento',
      description:
        'Faça upload da logo, ajustando no formato quadrado. Salvaremos em 500x500.',
      confirmLabel: 'Salvar logo',
      successMessage: 'Logo atualizada com sucesso!',
      errorMessage: 'Falha ao atualizar logo do evento',
    },
  };

  const currentConfig = config[imageType];

  // Cleanup URL when closing
  useEffect(() => {
    if (!open) {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
      setFile(null);
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setIsPanning(false);
      panStartRef.current = null;
      lastOffsetRef.current = { x: 0, y: 0 };
    }
  }, [open, imageUrl]);

  const onFiles = (files: FileList | File[] | null) => {
    const f = files && (files instanceof FileList ? files[0] : files[0]);
    if (!f) return;
    if (!f.type.startsWith('image/')) return;
    const url = URL.createObjectURL(f);
    setFile(f);
    setImageUrl(url);
    // Reset transforms
    setScale(1);
    setOffset({ x: 0, y: 0 });
    lastOffsetRef.current = { x: 0, y: 0 };
  };

  const getBaseScale = (viewportWidth: number, viewportHeight: number) => {
    if (!imgRef.current) return 1;
    const imageAspect =
      imgRef.current.naturalWidth / imgRef.current.naturalHeight;
    const viewportAspect = viewportWidth / viewportHeight;
    if (imageAspect > viewportAspect) {
      return viewportWidth / imgRef.current.naturalWidth;
    }
    return viewportHeight / imgRef.current.naturalHeight;
  };

  const clampOffset = (
    candidate: { x: number; y: number },
    nextScale = scale,
  ) => {
    if (!imgRef.current || !containerRef.current) return candidate;
    const container = containerRef.current.getBoundingClientRect();
    const base = getBaseScale(container.width, container.height);
    const scaledWidth = imgRef.current.naturalWidth * base * nextScale;
    const scaledHeight = imgRef.current.naturalHeight * base * nextScale;
    const maxOffsetX = Math.max(0, (scaledWidth - container.width) / 2);
    const maxOffsetY = Math.max(0, (scaledHeight - container.height) / 2);
    return {
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, candidate.x)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, candidate.y)),
    };
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (!imageUrl) return;
    e.preventDefault();
    const delta = -e.deltaY;
    const zoomIntensity = 0.0015;
    const newScale = Math.min(5, Math.max(0.2, scale + delta * zoomIntensity));

    const rect = (
      containerRef.current as HTMLDivElement
    ).getBoundingClientRect();
    const cursorX = e.clientX - rect.left - rect.width / 2;
    const cursorY = e.clientY - rect.top - rect.height / 2;
    const scaleRatio = newScale / scale;
    const newOffset = clampOffset(
      {
        x: cursorX - (cursorX - offset.x) * scaleRatio,
        y: cursorY - (cursorY - offset.y) * scaleRatio,
      },
      newScale,
    );
    setScale(newScale);
    setOffset(newOffset);
    lastOffsetRef.current = newOffset;
  };

  const startPan: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!imageUrl) return;
    setIsPanning(true);
    panStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const onPan: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isPanning || !panStartRef.current) return;
    const dx = e.clientX - panStartRef.current.x;
    const dy = e.clientY - panStartRef.current.y;
    const newOffset = clampOffset({
      x: lastOffsetRef.current.x + dx,
      y: lastOffsetRef.current.y + dy,
    });
    setOffset(newOffset);
  };

  const endPan = () => {
    if (!isPanning) return;
    lastOffsetRef.current = { ...offset };
    setIsPanning(false);
    panStartRef.current = null;
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    onFiles(e.dataTransfer.files);
  };

  const processImage = async () => {
    if (!imageUrl || !imgRef.current) return null;

    // Força o formato para PNG para preservar transparência
    const mimeType = 'image/png';
    const extension = 'png';

    const canvas = document.createElement('canvas');
    canvas.width = currentConfig.targetWidth; // 500
    canvas.height = currentConfig.targetHeight; // 500
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Limpa o canvas com fundo transparente
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = imgRef.current;

    // Get viewport dimensions
    const container = containerRef.current as HTMLDivElement;
    const viewportRect = container.getBoundingClientRect();
    const viewportWidth = viewportRect.width;
    const viewportHeight = viewportRect.height;

    // Calculate how the image is displayed in the viewport
    const viewportAspect = viewportWidth / viewportHeight;
    const imageAspect = img.naturalWidth / img.naturalHeight;

    // Calcula a escala base para caber no viewport
    let baseScale: number;
    if (imageAspect > viewportAspect) {
      baseScale = viewportWidth / img.naturalWidth;
    } else {
      baseScale = viewportHeight / img.naturalHeight;
    }

    // Aplica o zoom do usuário
    const appliedScale = baseScale * scale;
    const scaledImageWidth = img.naturalWidth * appliedScale;
    const scaledImageHeight = img.naturalHeight * appliedScale;

    // Posição central da imagem no viewport
    const imageCenterX = viewportWidth / 2 + offset.x;
    const imageCenterY = viewportHeight / 2 + offset.y;

    const imageViewportLeft = imageCenterX - scaledImageWidth / 2;
    const imageViewportTop = imageCenterY - scaledImageHeight / 2;

    // Calcula a área visível da imagem no viewport
    const viewportLeftInImage = Math.max(0, -imageViewportLeft / appliedScale);
    const viewportTopInImage = Math.max(0, -imageViewportTop / appliedScale);
    const viewportRightInImage = Math.min(
      img.naturalWidth,
      (viewportWidth - imageViewportLeft) / appliedScale,
    );
    const viewportBottomInImage = Math.min(
      img.naturalHeight,
      (viewportHeight - imageViewportTop) / appliedScale,
    );

    const sx = viewportLeftInImage;
    const sy = viewportTopInImage;
    const sWidth = viewportRightInImage - viewportLeftInImage;
    const sHeight = viewportBottomInImage - viewportTopInImage;

    // Calcula as dimensões da imagem no canvas (sempre 500x500)
    // A imagem vai preencher o canvas mantendo a proporção
    let canvasImageWidth: number;
    let canvasImageHeight: number;
    let canvasImageX: number;
    let canvasImageY: number;

    // Mantém a proporção da imagem dentro do canvas 500x500
    if (imageAspect > 1) {
      // Imagem mais larga que alta
      canvasImageWidth = currentConfig.targetWidth;
      canvasImageHeight = currentConfig.targetWidth / imageAspect;
      canvasImageX = 0;
      canvasImageY = (currentConfig.targetHeight - canvasImageHeight) / 2;
    } else {
      // Imagem mais alta que larga ou quadrada
      canvasImageWidth = currentConfig.targetHeight * imageAspect;
      canvasImageHeight = currentConfig.targetHeight;
      canvasImageX = (currentConfig.targetWidth - canvasImageWidth) / 2;
      canvasImageY = 0;
    }

    // Aplica o zoom
    const zoomedCanvasWidth = canvasImageWidth * scale;
    const zoomedCanvasHeight = canvasImageHeight * scale;

    // Calcula o offset no canvas baseado no offset do viewport
    const canvasOffsetX =
      (offset.x / viewportWidth) * currentConfig.targetWidth;
    const canvasOffsetY =
      (offset.y / viewportHeight) * currentConfig.targetHeight;

    // Posição final da imagem no canvas
    const finalCanvasX =
      canvasImageX + (canvasImageWidth - zoomedCanvasWidth) / 2 - canvasOffsetX;
    const finalCanvasY =
      canvasImageY +
      (canvasImageHeight - zoomedCanvasHeight) / 2 -
      canvasOffsetY;

    ctx.imageSmoothingQuality = 'high';

    // Desenha a imagem no canvas 500x500
    ctx.drawImage(
      img,
      sx,
      sy,
      sWidth,
      sHeight,
      finalCanvasX,
      finalCanvasY,
      zoomedCanvasWidth,
      zoomedCanvasHeight,
    );

    // Salva como PNG para preservar transparência
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png'),
    );
    if (!blob) return null;

    const outputFile = new File([blob], `event-${imageType}.png`, {
      type: 'image/png',
    });

    return { blob, file: outputFile };
  };

  const handleConfirm = async () => {
    try {
      setIsUploading(true);

      const result = await processImage();
      if (!result) {
        toast.error('Erro ao processar a imagem');
        return;
      }

      // Chama a ação recebida como prop
      await action({
        eventId,
        file: result.file,
      });

      toast.success(currentConfig.successMessage);

      onOpenChange(false);

      // Callback opcional para atualizar a página
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error(currentConfig.errorMessage);
      console.error('Error uploading image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[70vw] overflow-hidden sm:max-w-[65vw]">
        <DialogHeader>
          <DialogTitle>{currentConfig.title}</DialogTitle>
          <DialogDescription>{currentConfig.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-hidden">
          {/* Dropzone / Input */}
          {!imageUrl && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              className={cn(
                'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center',
                isDraggingOver ? 'border-primary bg-primary/5' : 'border-muted',
              )}
              onClick={() => {
                const input = document.getElementById(
                  'image-input-hidden',
                ) as HTMLInputElement;
                input?.click();
              }}
            >
              <p className="mb-2 text-sm">Arraste e solte uma imagem aqui</p>
              <p className="text-muted-foreground text-xs">
                ou clique para selecionar
              </p>
              <Input
                id="image-input-hidden"
                className="hidden"
                type="file"
                accept="image/*"
                onChange={(e) => onFiles(e.target.files)}
              />
            </div>
          )}

          {/* Crop viewport */}
          {imageUrl && (
            <div className="min-w-0 space-y-3">
              <div
                ref={containerRef}
                className="relative mx-auto max-h-[70vh] w-full max-w-[min(90vw,800px)] overflow-hidden rounded-md bg-black/70 select-none"
                style={{ aspectRatio: `${currentConfig.aspect}` }}
                onWheel={handleWheel}
                onMouseDown={startPan}
                onMouseMove={onPan}
                onMouseUp={endPan}
                onMouseLeave={endPan}
              >
                {/* Centered viewport using absolute children */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Imagem para recorte"
                    className="pointer-events-none will-change-transform select-none"
                    draggable={false}
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>

                {/* Overlay guides */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="grid h-full w-full grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/10" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="w-16 text-sm">Zoom</span>
                <Slider
                  value={[scale]}
                  min={0.2}
                  max={5}
                  step={0.01}
                  onValueChange={(v) => {
                    const newScale = v[0] ?? 1;
                    const clamped = clampOffset(offset, newScale);
                    setScale(newScale);
                    setOffset(clamped);
                    lastOffsetRef.current = clamped;
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="ml-auto"
                  onClick={() => {
                    setScale(1);
                    setOffset({ x: 0, y: 0 });
                    lastOffsetRef.current = { x: 0, y: 0 };
                  }}
                >
                  Resetar
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setImageUrl(null);
                    setFile(null);
                  }}
                >
                  Trocar imagem
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!imageUrl || isUploading}
            className="dark:text-white"
          >
            {isUploading ? 'Enviando...' : currentConfig.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
