'use client';

import { Image as AntImage } from 'antd';
import { Eye, ImageIcon } from 'lucide-react';
import { useState } from 'react';

type ImageSize = 'small' | 'medium' | 'large';

const SIZE_CONFIG: Record<
  ImageSize,
  { previewHeight: string; thumbSize: string }
> = {
  small: {
    previewHeight: 'h-44',
    thumbSize: 'h-34 w-34',
  },
  medium: {
    previewHeight: 'h-60',
    thumbSize: 'h-50 w-50',
  },
  large: {
    previewHeight: 'h-80',
    thumbSize: 'h-70 w-70',
  },
};

export type ImageViewerProps = {
  images: string[];
  size?: ImageSize;
  title?: string;
  className?: string;
};

export default function ImageViewer({
  images,
  size = 'medium',
  title = 'Comprovantes',
  className,
}: ImageViewerProps) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const sizeStyles = SIZE_CONFIG[size];

  const openViewer = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800 ${className ?? ''}`}
    >
      <div className="space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="text-muted-foreground h-5 w-5" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title} ({images.length})
            </h2>
          </div>
        </div>

        <div
          className={`flex ${sizeStyles.previewHeight} items-center overflow-x-auto rounded-lg border border-dashed bg-gray-50 p-3 dark:bg-gray-900 ${images.length === 0 ? 'justify-center' : ''}`}
        >
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center text-sm text-slate-500 dark:text-slate-400">
              <ImageIcon className="h-10 w-10" />
              <p>Nenhuma imagem disponível</p>
            </div>
          ) : (
            <div className="flex gap-2">
              {images.map((image, index) => (
                <div
                  key={image + index}
                  className={`group relative flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 transition hover:border-gray-300 dark:border-gray-700 ${sizeStyles.thumbSize}`}
                >
                  <img
                    src={image}
                    alt={`Miniatura ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openViewer(index)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-800 shadow-sm transition hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-zinc-950/85 dark:text-white"
                      aria-label="Visualizar imagem"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && images[previewIndex] && (
        <AntImage
          src={images[previewIndex]}
          preview={{
            open: previewVisible,
            onOpenChange: (visible) => setPreviewVisible(visible),
          }}
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}
