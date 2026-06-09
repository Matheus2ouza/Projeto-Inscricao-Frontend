'use client';

import type { UploadFile, UploadProps } from 'antd';
import { Image as AntImage, message, Upload } from 'antd';
import { Eye, ImageIcon, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Falha ao processar imagem.'));
  });

export type ImageUploadProps = {
  value: UploadFile[];
  onChange: (next: UploadFile[]) => void;
  maxCount?: number;
  disabled?: boolean;
  accept?: string;
  title?: string;
  onInvalidFile?: (message: string) => void;
  onDataUrlsChange?: (dataUrls: string[] | string | null) => void; // Alterado para aceitar string | null também
  className?: string;
  singleMode?: boolean; // Nova prop para indicar modo single
};

export default function ImageUpload({
  value,
  onChange,
  maxCount = 10,
  disabled = false,
  accept = 'image/*',
  title = 'Adicionar imagem',
  onInvalidFile,
  onDataUrlsChange,
  className,
  singleMode = false, // Default false para manter compatibilidade
}: ImageUploadProps) {
  const resolvedMaxCount = Math.max(1, maxCount);
  const multiple = resolvedMaxCount > 1;

  const [previewByUid, setPreviewByUid] = React.useState<
    Record<string, string>
  >({});
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [prevUrlsRef, setPrevUrlsRef] = React.useState<string[]>([]);

  const fileList = React.useMemo(() => {
    const list = Array.isArray(value) ? value : [];
    if (list.length <= resolvedMaxCount) return list;
    return list.slice(-resolvedMaxCount);
  }, [resolvedMaxCount, value]);

  const updatePreviews = React.useCallback(async () => {
    const nextEntries: Array<[string, string]> = [];

    await Promise.all(
      fileList.map(async (file) => {
        const uid = String(file.uid);
        const existing = file.thumbUrl || file.url || previewByUid[uid];
        if (existing) {
          nextEntries.push([uid, String(existing)]);
          return;
        }

        const origin = file.originFileObj as File | undefined;
        if (!origin) return;

        try {
          const dataUrl = await fileToDataUrl(origin);
          nextEntries.push([uid, dataUrl]);
        } catch {
          // ignore
        }
      }),
    );

    if (nextEntries.length === 0) return;

    setPreviewByUid((prev) => {
      const hasChanges = nextEntries.some(([uid, url]) => prev[uid] !== url);
      if (!hasChanges) return prev;
      const next = { ...prev };
      for (const [uid, url] of nextEntries) {
        next[uid] = url;
      }
      return next;
    });
  }, [fileList, previewByUid]);

  React.useEffect(() => {
    void updatePreviews();
  }, [updatePreviews]);

  // Só chama onDataUrlsChange quando as URLs realmente mudarem
  React.useEffect(() => {
    const urls = fileList
      .map((f) => previewByUid[String(f.uid)] ?? f.thumbUrl ?? f.url)
      .filter((u): u is string => Boolean(u))
      .map(String);

    // Compara com as URLs anteriores para evitar loop infinito
    if (JSON.stringify(urls) !== JSON.stringify(prevUrlsRef)) {
      setPrevUrlsRef(urls);

      // Se estiver em modo single, retorna string ou null
      if (singleMode) {
        const result = urls.length > 0 ? urls[0] : null;
        onDataUrlsChange?.(result);
      } else {
        // Modo multiple, retorna array
        onDataUrlsChange?.(urls);
      }
    }
  }, [fileList, onDataUrlsChange, previewByUid, prevUrlsRef, singleMode]);

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (!file.type.startsWith('image/')) {
      const msg = 'Apenas imagem é permitida.';
      message.error(msg);
      onInvalidFile?.(msg);
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: next }) => {
    const trimmed = next.slice(-resolvedMaxCount);
    onChange(trimmed);
  };

  const handleRemoveImage = (uid: string) => {
    onChange(fileList.filter((f) => String(f.uid) !== uid));
  };

  const handlePreview = (index: number) => {
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const getImageUrl = (file: UploadFile): string => {
    return previewByUid[String(file.uid)] ?? file.thumbUrl ?? file.url ?? '';
  };

  const renderUploadThumbnail = () => (
    <Upload.Dragger
      multiple={multiple}
      maxCount={resolvedMaxCount}
      beforeUpload={beforeUpload}
      accept={accept}
      fileList={fileList}
      onChange={handleChange}
      disabled={disabled}
      showUploadList={false}
      className="!m-0 h-32 w-32 rounded-lg border-2 border-dashed p-0 transition-colors hover:border-blue-500 hover:bg-blue-50/5 dark:hover:border-blue-500"
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-1">
        <Plus className="h-6 w-6 text-slate-400 dark:text-slate-500" />
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {title}
        </span>
      </div>
    </Upload.Dragger>
  );

  return (
    <div className={`flex flex-wrap gap-3 ${className || ''}`}>
      {fileList.map((file, index) => {
        const imageUrl = getImageUrl(file);
        return (
          <div
            key={file.uid}
            className="group relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={file.name ?? `Imagem ${index + 1}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImageIcon className="h-8 w-8 text-slate-400" />
              </div>
            )}

            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => handlePreview(index)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-800 shadow-sm transition hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-zinc-950/85 dark:text-white"
                aria-label="Visualizar imagem"
                disabled={disabled}
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveImage(String(file.uid))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-800 shadow-sm transition hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-zinc-950/85 dark:text-white"
                aria-label="Remover imagem"
                disabled={disabled}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}

      {!disabled &&
        fileList.length < resolvedMaxCount &&
        renderUploadThumbnail()}

      {fileList.length > 0 &&
        fileList[previewIndex] &&
        getImageUrl(fileList[previewIndex]) && (
          <AntImage
            src={getImageUrl(fileList[previewIndex])}
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
