'use client';

import type { UploadFile, UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { ImageIcon, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
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
  description?: string;
  onInvalidFile?: (message: string) => void;
  onDataUrlChange?: (dataUrl: string | null) => void;
  onDataUrlsChange?: (dataUrls: string[]) => void;
  className?: string;
};

export default function ImageUpload({
  value,
  onChange,
  maxCount = 1,
  disabled = false,
  accept = 'image/*',
  title = 'Clique para selecionar',
  description = 'ou arraste e solte a imagem aqui',
  onInvalidFile,
  onDataUrlChange,
  onDataUrlsChange,
  className,
}: ImageUploadProps) {
  const resolvedMaxCount = Math.max(1, maxCount);
  const multiple = resolvedMaxCount > 1;

  const [previewByUid, setPreviewByUid] = React.useState<
    Record<string, string>
  >({});

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
  }, [fileList]);

  React.useEffect(() => {
    void updatePreviews();
  }, [updatePreviews]);

  React.useEffect(() => {
    if (resolvedMaxCount === 1) {
      const first = fileList[0];
      const url = first
        ? (previewByUid[String(first.uid)] ?? first.thumbUrl ?? first.url)
        : undefined;
      onDataUrlChange?.(url ? String(url) : null);
      return;
    }

    if (resolvedMaxCount > 1) {
      const urls = fileList
        .map((f) => previewByUid[String(f.uid)] ?? f.thumbUrl ?? f.url)
        .filter((u): u is string => Boolean(u))
        .map(String);
      onDataUrlsChange?.(urls);
    }
  }, [
    fileList,
    onDataUrlChange,
    onDataUrlsChange,
    previewByUid,
    resolvedMaxCount,
  ]);

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

  const handleRemove = (uid: string) => {
    onChange(fileList.filter((f) => String(f.uid) !== uid));
  };

  const renderSinglePreview = () => {
    const first = fileList[0];
    const url = first
      ? (previewByUid[String(first.uid)] ?? first.thumbUrl ?? first.url)
      : null;

    if (!first || !url) return null;

    return (
      <div className="bg-muted/20 relative overflow-hidden rounded-lg border">
        <div className="relative aspect-video w-full">
          <Image
            src={String(url)}
            alt="Pré-visualização"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <button
          type="button"
          className="bg-background/80 absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md border shadow-sm"
          onClick={() => handleRemove(String(first.uid))}
          aria-label="Remover imagem"
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderMultiPreview = () => {
    if (fileList.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fileList.map((file) => {
          const url =
            previewByUid[String(file.uid)] ?? file.thumbUrl ?? file.url ?? '';
          return (
            <div
              key={String(file.uid)}
              className="group relative overflow-hidden rounded-lg border bg-white dark:bg-zinc-950"
            >
              <div className="relative aspect-square">
                {url ? (
                  <Image
                    src={String(url)}
                    alt={file.name ?? 'Imagem'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
              </div>

              <div className="border-t p-2">
                <div className="truncate text-xs font-medium">
                  {file.name || 'imagem'}
                </div>
              </div>

              <button
                type="button"
                className="bg-background/80 absolute top-2 right-2 hidden h-8 w-8 items-center justify-center rounded-md border shadow-sm group-hover:inline-flex"
                onClick={() => handleRemove(String(file.uid))}
                aria-label="Remover imagem"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Upload.Dragger
        multiple={multiple}
        maxCount={resolvedMaxCount}
        beforeUpload={beforeUpload}
        accept={accept}
        fileList={fileList}
        onChange={handleChange}
        disabled={disabled}
        showUploadList={false}
        className={
          className ??
          'hover:border-primary hover:bg-primary/5 dark:hover:border-primary rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors dark:border-zinc-700 dark:bg-zinc-900'
        }
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <UploadCloud className="text-muted-foreground h-12 w-12" />
          <div>
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              {title}
            </p>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          <div className="text-muted-foreground text-xs">
            {multiple ? `Até ${resolvedMaxCount} imagens` : '1 imagem'}
          </div>
        </div>
      </Upload.Dragger>

      {resolvedMaxCount === 1 ? renderSinglePreview() : renderMultiPreview()}
    </div>
  );
}
