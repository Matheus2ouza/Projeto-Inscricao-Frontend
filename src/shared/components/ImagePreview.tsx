'use client';

import { Image as AntImage } from 'antd';
import { Eye, ImageIcon } from 'lucide-react';
import * as React from 'react';

export type ImagePreviewProps = {
  images: string[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  imageClassName?: string;
  containerClassName?: string;
  maxDisplay?: number;
  showPreview?: boolean;
};

export default function ImagePreview({
  images,
  orientation = 'horizontal',
  className = '',
  imageClassName = '',
  containerClassName = '',
  maxDisplay,
  showPreview = true,
}: ImagePreviewProps) {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);

  // Filtra imagens válidas
  const validImages = React.useMemo(() => {
    return images.filter((img) => img && img.trim() !== '');
  }, [images]);

  // Limita a quantidade de imagens exibidas
  const displayImages = React.useMemo(() => {
    if (maxDisplay && validImages.length > maxDisplay) {
      return validImages.slice(0, maxDisplay);
    }
    return validImages;
  }, [validImages, maxDisplay]);

  const remainingCount = validImages.length - displayImages.length;

  if (validImages.length === 0) {
    return (
      <div
        className={`flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 dark:border-gray-600 dark:bg-gray-800 ${className}`}
      >
        <ImageIcon className="h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">Nenhuma imagem disponível</p>
      </div>
    );
  }

  const handlePreview = (index: number) => {
    if (showPreview) {
      setPreviewIndex(index);
      setPreviewVisible(true);
    }
  };

  const getOrientationClasses = () => {
    if (orientation === 'horizontal') {
      return 'flex flex-row flex-wrap gap-3';
    }
    return 'flex flex-col gap-3';
  };

  return (
    <div className={`${className}`}>
      <div
        className={`${getOrientationClasses()} ${containerClassName}`}
        role="list"
        aria-label="Galeria de imagens"
      >
        {displayImages.map((imageUrl, index) => (
          <div
            key={`image-${index}`}
            className="group relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            role="listitem"
          >
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={`Imagem ${index + 1}`}
                  className={`h-full w-full object-cover ${imageClassName}`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />

                {showPreview && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => handlePreview(index)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-800 shadow-sm transition hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-zinc-950/85 dark:text-white"
                      aria-label={`Visualizar imagem ${index + 1}`}
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-8 w-8 text-slate-400" />
              </div>
            )}
          </div>
        ))}

        {remainingCount > 0 && (
          <div className="flex h-32 w-32 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
            <span className="text-sm font-medium text-gray-500">
              +{remainingCount}
            </span>
          </div>
        )}
      </div>

      {/* Ant Design Image Preview */}
      {showPreview && validImages.length > 0 && (
        <AntImage
          src={validImages[previewIndex]}
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
