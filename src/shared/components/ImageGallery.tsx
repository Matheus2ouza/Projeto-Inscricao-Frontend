'use client';

import type { UploadProps } from 'antd';
import { Image as AntImage, message, Upload } from 'antd';
import { Eye, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import { useId, useState, type ChangeEvent } from 'react';

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

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Falha ao processar imagem.'));
  });

export type ImageGalleryProps = {
  images: string[];
  size?: ImageSize;
  editing?: boolean;
  maxCount?: number;
  title?: string;
  onAddImages?: (files: File[], base64Images: string[]) => void;
  onDeleteImage?: (index: number) => void;
  onRemoveImage?: (index: number) => void;
  className?: string;
};

export default function ImageGallery({
  images,
  size = 'medium',
  editing = false,
  maxCount = 10,
  onAddImages,
  onDeleteImage,
  onRemoveImage,
  className,
}: ImageGalleryProps) {
  const uploadId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const sizeStyles = SIZE_CONFIG[size];

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const remainingSlots = Math.max(0, maxCount - images.length);
    const nextFiles = files.slice(0, remainingSlots);

    if (nextFiles.length > 0) {
      const base64Images = await Promise.all(nextFiles.map(fileToDataUrl));
      onAddImages?.(nextFiles, base64Images);
    }

    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    onRemoveImage?.(index);
    if (activeIndex >= images.length - 1 && activeIndex > 0) {
      setActiveIndex(images.length - 2);
    }
  };

  const handleDeleteImage = (index: number) => {
    onDeleteImage?.(index);
    if (activeIndex >= images.length - 1 && activeIndex > 0) {
      setActiveIndex(images.length - 2);
    }
  };

  const handlePasteFile: UploadProps['beforeUpload'] = async (file) => {
    if (!file.type.startsWith('image/')) {
      const msg = 'Apenas imagens são permitidas.';
      message.error(msg);
      return Upload.LIST_IGNORE;
    }

    const remainingSlots = Math.max(0, maxCount - images.length);
    const nextFiles = remainingSlots > 0 ? [file] : [];
    if (nextFiles.length > 0) {
      const base64Images = await Promise.all(nextFiles.map(fileToDataUrl));
      onAddImages?.(nextFiles, base64Images);
    }

    return Upload.LIST_IGNORE;
  };

  const openViewer = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const uploadProps: UploadProps = {
    accept: 'image/*',
    multiple: maxCount > 1,
    pastable: true,
    beforeUpload: handlePasteFile,
    showUploadList: false,
    fileList: [],
  };

  const isBase64Image = (image: string): boolean => {
    return image.startsWith('data:image');
  };

  const shouldShowAddButton =
    editing && onAddImages && images.length < maxCount;

  // Verifica se há imagem para preview
  const hasImageForPreview =
    images.length > 0 && previewIndex >= 0 && previewIndex < images.length;
  const previewSrc = hasImageForPreview ? images[previewIndex] : undefined;

  return (
    <>
      <Upload {...uploadProps} className="hidden">
        <div />
      </Upload>
      <div
        className={`overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-gray-800 ${className ?? ''}`}
      >
        <div className="space-y-4 p-6">
          <div
            className={`flex ${sizeStyles.previewHeight} items-center overflow-x-auto rounded-lg border border-dashed bg-gray-50 p-3 dark:bg-gray-900`}
          >
            {images.length === 0 && !shouldShowAddButton ? (
              <div className="flex w-full items-center justify-center gap-3 text-center text-sm text-slate-500 dark:text-slate-400">
                <ImageIcon className="h-10 w-10" />
                <p>
                  {editing
                    ? 'Adicione imagens para começar'
                    : 'Nenhuma imagem disponível'}
                </p>
              </div>
            ) : (
              <div className="flex gap-2">
                {images.map((image, index) => {
                  const isActive = index === activeIndex;
                  const isBase64 = isBase64Image(image);

                  return (
                    <div
                      key={`${image}-${index}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setActiveIndex(index)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setActiveIndex(index);
                        }
                      }}
                      className={`group relative flex-shrink-0 overflow-hidden rounded-lg border transition ${sizeStyles.thumbSize} ${isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'}`}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openViewer(index);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-800 shadow-sm transition hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-zinc-950/85 dark:text-white"
                          aria-label="Visualizar imagem"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {editing && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (isBase64) {
                                handleRemoveImage(index);
                              } else {
                                handleDeleteImage(index);
                              }
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-red-600 shadow-sm transition hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-zinc-950/85 dark:text-red-400"
                            aria-label="Remover imagem"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {shouldShowAddButton && (
                  <label
                    htmlFor={`image-gallery-upload-${uploadId}`}
                    className={`hover:border-primary hover:bg-primary/10 relative flex flex-shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-white/80 text-center text-slate-500 transition dark:border-zinc-700 dark:bg-zinc-900 dark:text-slate-300 ${sizeStyles.thumbSize}`}
                  >
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-2">
                      <Plus className="h-5 w-5" />
                      <span className="text-[11px] leading-tight">
                        Adicionar
                      </span>
                    </div>
                    <input
                      id={`image-gallery-upload-${uploadId}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}
          </div>
        </div>

        {hasImageForPreview && (
          <AntImage
            src={previewSrc}
            preview={{
              open: previewVisible,
              onOpenChange: (visible) => setPreviewVisible(visible),
            }}
            style={{ display: 'none' }}
          />
        )}
      </div>
    </>
  );
}
