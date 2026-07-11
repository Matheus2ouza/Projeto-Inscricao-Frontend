'use client';

import {
  Event,
  ExclusiveInscriptionLink,
} from '@/features/inscriptions/types/exclusiveInscriptionLink/exclusiveInscriptionLinkTypes';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { calculateGlobalIndex } from '@/shared/utils/calculateGlobalIndex';
import { formatDate } from '@/shared/utils/formatDate';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { Pagination } from 'antd';
import {
  Calendar,
  Check,
  Copy,
  Image as ImageIcon,
  Plus,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface ListExclusiveInscriptionLinkProps {
  pageSize: number;
  event: Event | null;
  exclusiveInscriptionLinks: ExclusiveInscriptionLink[];
  total: number;
  page: number;
  pageCount: number;
  loadingExclusiveInscriptionLinks?: boolean;
  onPageChange: (page: number) => void;
  onCreateLink?: () => void;
}

export default function ListExclusiveInscriptionLink({
  pageSize,
  event,
  exclusiveInscriptionLinks,
  total,
  page,
  pageCount,
  loadingExclusiveInscriptionLinks = false,
  onPageChange,
  onCreateLink,
}: ListExclusiveInscriptionLinkProps) {
  const [imageError, setImageError] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  const copyToClipboard = async (token: string) => {
    try {
      await navigator.clipboard.writeText(`${baseUrl}/exclusive/${token}`);
      setCopiedToken(token);

      setTimeout(() => setCopiedToken(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!event) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="bg-muted mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Users className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Nenhum evento encontrado</h3>
        <p className="text-muted-foreground">
          Não há links disponíveis para visualização.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass-surface overflow-hidden rounded-xl">
        <div className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="bg-muted relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:w-70">
              {event.image && !imageError ? (
                <Image
                  src={event.image}
                  alt={event.name}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              ) : (
                <div className="bg-muted flex h-full w-full items-center justify-center">
                  <ImageIcon className="text-muted-foreground h-12 w-12" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase dark:text-white">
                  {event.name}
                </h1>
                <p className="text-muted-foreground mt-2">
                  Links de Inscrição Exclusivos
                </p>

                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(event.startDate)} -{' '}
                      {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="glass-surface-strong rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Total de Links
                    </span>
                    <span className="text-2xl font-bold">{total}</span>
                  </div>
                </div>

                <div className="glass-surface-strong rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Inscrições Totais
                    </span>
                    <span className="text-2xl font-bold">
                      {exclusiveInscriptionLinks.reduce(
                        (acc, link) => acc + link.countInscriptions,
                        0,
                      )}
                    </span>
                  </div>
                </div>

                <div className="glass-surface-strong rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Valor Total
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(
                        exclusiveInscriptionLinks.reduce(
                          (acc, link) =>
                            acc +
                            link.typeInscriptionAllowed.reduce(
                              (sum, type) => sum + type.value,
                              0,
                            ),
                          0,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links List Section */}
      <div className="glass-surface overflow-hidden rounded-xl">
        <div className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Links Exclusivos
            </h2>
            <Button
              onClick={onCreateLink}
              className="glass-button flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Criar Link
            </Button>
          </div>
        </div>

        <div className="px-6 pb-6">
          {/* Mobile View */}
          <div className="block sm:hidden">
            {loadingExclusiveInscriptionLinks ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="glass-surface space-y-3 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-6 rounded-lg" />
                    </div>
                    <Skeleton className="h-5 w-28 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-6 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : exclusiveInscriptionLinks.length === 0 ? (
              <div className="glass-surface text-muted-foreground rounded-lg px-4 py-8 text-center">
                Nenhum link encontrado
              </div>
            ) : (
              <div className="space-y-3">
                {exclusiveInscriptionLinks.map((link, idx) => {
                  const isCopied = copiedToken === link.token;

                  return (
                    <div
                      key={link.id}
                      className="glass-surface hover:glass-surface-strong rounded-lg p-4 transition-colors"
                    >
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                            Nome do Link
                          </p>
                          <p className="text-lg leading-tight font-semibold">
                            {link.name}
                          </p>
                        </div>

                        {link.typeInscriptionAllowed.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {link.typeInscriptionAllowed.map((type) => (
                              <Badge
                                key={type.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {type.description}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="border-border rounded-lg border bg-white/10 p-3 text-sm shadow-sm shadow-black/5 dark:bg-white/5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-muted-foreground text-xs">
                              URL de Inscrição:
                            </span>
                            <div className="min-w-0 flex-1">
                              <input
                                readOnly
                                className="w-full truncate rounded border bg-transparent px-2 py-1 text-xs"
                                value={`${baseUrl}/exclusive/${link.token}`}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`glass-button transition-all ${
                                isCopied
                                  ? 'border-green-200 bg-green-50 text-green-600'
                                  : ''
                              }`}
                              onClick={() => copyToClipboard(link.token)}
                              title={isCopied ? 'Copiado!' : 'Copiar URL'}
                            >
                              {isCopied ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="border-border rounded-lg border bg-white/5 p-3 text-center shadow-sm shadow-black/5 dark:bg-white/5">
                            <p className="text-muted-foreground text-xs">
                              Inscrições
                            </p>
                            <p className="mt-1 text-lg font-bold">
                              {link.countInscriptions}
                            </p>
                          </div>
                          <div className="border-border rounded-lg border bg-white/5 p-3 text-center shadow-sm shadow-black/5 dark:bg-white/5">
                            <p className="text-muted-foreground text-xs">
                              Valor Total
                            </p>
                            <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                              {getFormatCurrency(
                                link.typeInscriptionAllowed.reduce(
                                  (acc, type) => acc + type.value,
                                  0,
                                ),
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="border-border rounded-lg border bg-white/5 p-3 text-sm shadow-sm shadow-black/5 dark:bg-white/5">
                          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                            Expira em
                          </p>
                          <p className="text-foreground mt-1 text-sm font-medium">
                            {link.expiresAt
                              ? formatDate(link.expiresAt)
                              : 'Nunca'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            {loadingExclusiveInscriptionLinks ? (
              <div className="space-y-4 p-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <Skeleton className="h-5 w-10" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 flex-1" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-10" />
                  </div>
                ))}
              </div>
            ) : exclusiveInscriptionLinks.length === 0 ? (
              <div className="text-muted-foreground px-6 py-12 text-center">
                Nenhum link encontrado
              </div>
            ) : (
              <div className="space-y-4">
                {exclusiveInscriptionLinks.map((link, idx) => {
                  const isCopied = copiedToken === link.token;

                  return (
                    <div
                      key={link.id}
                      className="glass-surface hover:glass-surface-strong rounded-lg p-6 transition-colors"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm font-medium">
                              #
                            </span>
                            <span className="font-semibold">
                              {calculateGlobalIndex(idx, page, pageSize)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                            Nome do Link
                          </p>
                          <p className="text-lg leading-tight font-semibold">
                            {link.name}
                          </p>
                        </div>

                        {link.typeInscriptionAllowed.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {link.typeInscriptionAllowed.map((type) => (
                              <Badge
                                key={type.id}
                                variant="secondary"
                                className="text-xs"
                              >
                                {type.description}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="border-border rounded-lg border bg-white/5 p-4 shadow-sm shadow-black/5 dark:bg-white/5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-muted-foreground text-xs">
                              URL de Inscrição:
                            </span>
                            <div className="min-w-0 flex-1">
                              <input
                                readOnly
                                className="w-full truncate rounded border bg-transparent px-2 py-1 text-xs"
                                value={`${baseUrl}/exclusive/${link.token}`}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className={`glass-button transition-all ${
                                isCopied
                                  ? 'border-green-200 bg-green-50 text-green-600'
                                  : ''
                              }`}
                              onClick={() => copyToClipboard(link.token)}
                              title={isCopied ? 'Copiado!' : 'Copiar URL'}
                            >
                              {isCopied ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div className="border-border rounded-lg border bg-white/5 p-3 text-center shadow-sm shadow-black/5 dark:bg-white/5">
                            <p className="text-muted-foreground text-xs">
                              Inscrições
                            </p>
                            <p className="mt-1 text-lg font-bold">
                              {link.countInscriptions}
                            </p>
                          </div>
                          <div className="border-border rounded-lg border bg-white/5 p-3 text-center shadow-sm shadow-black/5 dark:bg-white/5">
                            <p className="text-muted-foreground text-xs">
                              Valor Total
                            </p>
                            <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">
                              {getFormatCurrency(
                                link.typeInscriptionAllowed.reduce(
                                  (acc, type) => acc + type.value,
                                  0,
                                ),
                              )}
                            </p>
                          </div>
                          <div className="border-border rounded-lg border bg-white/5 p-3 text-center shadow-sm shadow-black/5 dark:bg-white/5">
                            <p className="text-muted-foreground text-xs">
                              Expira em
                            </p>
                            <p className="text-foreground mt-1 text-sm font-medium">
                              {link.expiresAt
                                ? formatDate(link.expiresAt)
                                : 'Nunca'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {pageCount > 1 && (
            <div className="py-4">
              <div className="flex flex-col items-center gap-3">
                <Pagination
                  current={page}
                  total={total}
                  pageSize={pageSize}
                  showSizeChanger={false}
                  onChange={(next) => onPageChange(next)}
                  responsive
                  size="small"
                />
                <div className="text-foreground text-sm font-semibold">
                  Página {page} de {pageCount}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
