'use client';

import type { UploadFile, UploadProps } from 'antd';
import { Image as AntImage, message, Upload } from 'antd';
import { Eye, ImageIcon, Trash2, UploadCloud } from 'lucide-react';
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
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');

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

  const handlePreview = async (file: UploadFile) => {
    const uid = String(file.uid);
    const existing = previewByUid[uid] ?? file.thumbUrl ?? file.url;
    let nextPreview = existing ? String(existing) : '';

    if (!nextPreview) {
      const origin = file.originFileObj as File | undefined;
      if (origin) {
        try {
          nextPreview = await fileToDataUrl(origin);
        } catch {
          nextPreview = '';
        }
      }
    }

    if (!nextPreview) return;

    setPreviewImage(nextPreview);
    setPreviewOpen(true);
  };

  const renderPreviewGrid = () => {
    if (fileList.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {fileList.map((file) => {
          const url =
            previewByUid[String(file.uid)] ?? file.thumbUrl ?? file.url ?? '';

          return (
            <div
              key={String(file.uid)}
              className="group border-border/70 bg-background/80 relative overflow-hidden rounded-xl border shadow-sm backdrop-blur-sm"
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

                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/20 group-hover:opacity-100">
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-800 shadow-sm transition hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-zinc-950/85 dark:text-white"
                    onClick={() => handlePreview(file)}
                    aria-label="Visualizar imagem"
                    disabled={disabled}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/90 text-zinc-800 shadow-sm transition hover:scale-105 hover:bg-white dark:border-white/10 dark:bg-zinc-950/85 dark:text-white"
                    onClick={() => handleRemove(String(file.uid))}
                    aria-label="Remover imagem"
                    disabled={disabled}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
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

      {renderPreviewGrid()}

      {previewImage ? (
        <AntImage
          styles={{ root: { display: 'none' } }}
          preview={{
            open: previewOpen,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => {
              if (!visible) setPreviewImage('');
            },
          }}
          src={previewImage}
        />
      ) : null}
    </div>
  );
}
