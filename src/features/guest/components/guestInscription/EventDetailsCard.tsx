// features/guest/components/guestInscription/EventDetailsCard.tsx
'use client';

import {
  Event,
  TypeInscription,
} from '@/features/guest/types/guestInscription/eventDetailsToGuestInscriptionTypes';
import { cn } from '@/lib/utils';
import { AspectRatio } from '@/shared/components/ui/aspect-ratio';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { formatDate } from '@/shared/utils/formatDate';
import { generateGradientClass } from '@/shared/utils/generateGradient';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getInitial } from '@/shared/utils/getInitials';
import { AlertCircle, Calendar, Info } from 'lucide-react';
import Image from 'next/image';

interface EventDetailsCardProps {
  event: Event;
  typeInscriptions: TypeInscription[];
  filteredTypeInscriptions: TypeInscription[];
  primaryColor: string;
  secondaryColor: string;
  glassSurfaceClass: string;
  calculateMaxAge: (ruleDate?: Date) => string | number;
}

export function EventDetailsCard({
  event,
  typeInscriptions,
  filteredTypeInscriptions,
  primaryColor,
  secondaryColor,
  glassSurfaceClass,
  calculateMaxAge,
}: EventDetailsCardProps) {
  return (
    <div
      className={`relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-4 shadow-sm backdrop-blur-md sm:flex-row sm:p-6 ${glassSurfaceClass}`}
    >
      {/* Gradiente radial com a cor primária */}
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(750px circle at 18% 15%, ${primaryColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex w-full flex-col lg:flex-row">
        {/* Imagem do Evento */}
        <div className="w-full lg:w-1/3">
          <AspectRatio
            ratio={16 / 9}
            className="relative overflow-hidden rounded-2xl"
          >
            {event.image ? (
              <Image
                src={event.image}
                alt={event.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                priority
                loading="eager"
              />
            ) : (
              <div
                className={`flex h-full w-full bg-gradient-to-br ${generateGradientClass()} items-center justify-center`}
              >
                <div className="text-center">
                  <div className="mb-2 text-5xl font-semibold">
                    {getInitial(event.name)}
                  </div>
                  <p className="text-sm">Sem imagem</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
            <div className="absolute bottom-0 left-0 p-6 lg:hidden">
              <h1 className="text-xl font-bold text-white uppercase shadow-sm">
                {event.name}
              </h1>
            </div>
          </AspectRatio>
        </div>

        {/* Informações do Evento */}
        <div className="flex-1 space-y-6 p-6 lg:p-8">
          <div className="hidden lg:block">
            <h1 className="text-foreground text-4xl font-bold tracking-tight uppercase">
              {event.name}
            </h1>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className="rounded-full p-2"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                }}
              >
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium tracking-wider uppercase">
                  Início
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {formatDate(event.startDate)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="rounded-full p-2"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                }}
              >
                <Calendar className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium tracking-wider uppercase">
                  Fim
                </span>
                <span className="text-foreground text-sm font-semibold">
                  {formatDate(event.endDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Tipos de inscrição disponíveis
              </div>
            </div>

            {filteredTypeInscriptions.length > 0 ? (
              <>
                {/* Desktop - Grid */}
                <div className="hidden grid-cols-1 gap-4 sm:grid-cols-2 lg:grid lg:grid-cols-3">
                  {typeInscriptions.map((type) => (
                    <div
                      key={type.id || type.description}
                      className={cn(
                        'rounded-lg border p-4 transition-all hover:shadow-md',
                        glassSurfaceClass,
                        type.specialType
                          ? 'border-amber-200/30'
                          : 'border-glass',
                      )}
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <div className="text-foreground truncate text-sm font-medium">
                              {type.description}
                            </div>
                            {type.specialType && (
                              <Badge
                                variant="outline"
                                className="shrink-0 border-amber-300 bg-amber-100 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                              >
                                Especial
                              </Badge>
                            )}
                            {type.specialType && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground h-5 w-5 p-0 hover:text-amber-600"
                                  >
                                    <Info className="h-3.5 w-3.5" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4 text-amber-500" />
                                      <h4 className="text-sm font-semibold">
                                        Inscrição Especial
                                      </h4>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                      Esta é uma inscrição marcada como{' '}
                                      <strong>&quot;Especial&quot;</strong> e
                                      necessita de aprovação. Após a inscrição,
                                      os organizadores analisarão sua
                                      solicitação.
                                    </p>
                                    <p className="text-muted-foreground mt-2 text-xs">
                                      Você receberá uma notificação quando sua
                                      inscrição for aprovada.
                                    </p>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {type.rule &&
                              `Até ${calculateMaxAge(new Date(type.rule))} anos`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t pt-3">
                        <div className="text-muted-foreground text-xs whitespace-nowrap">
                          {type.specialType ? 'Necessita aprovação' : ''}
                        </div>
                        <div className="text-foreground text-sm font-semibold whitespace-nowrap">
                          {getFormatCurrency(type.value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile - Lista */}
                <div className="border-glass bg-muted/20 overflow-hidden rounded-lg border lg:hidden">
                  {typeInscriptions.map((type) => (
                    <div
                      key={type.id || type.description}
                      className={cn(
                        'border-glass flex items-center justify-between gap-4 border-b px-4 py-3 last:border-b-0',
                        type.specialType
                          ? 'bg-amber-50/60 dark:bg-amber-950/30'
                          : '',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <div className="text-foreground truncate text-sm font-medium">
                            {type.description}
                          </div>
                          {type.specialType && (
                            <Badge
                              variant="secondary"
                              className="shrink-0 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                            >
                              Especial
                            </Badge>
                          )}
                          {type.specialType && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  className="h-5 w-5"
                                  variant="ghost"
                                  style={{ color: primaryColor }}
                                >
                                  <Info className="h-3.5 w-3.5" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-amber-500" />
                                    <h4 className="text-sm font-semibold">
                                      Inscrição Especial
                                    </h4>
                                  </div>
                                  <p className="text-muted-foreground text-sm">
                                    Esta é uma inscrição marcada como{' '}
                                    <strong>&quot;Especial&quot;</strong> e
                                    necessita de aprovação. Após a inscrição, os
                                    organizadores analisarão sua solicitação.
                                  </p>
                                  <p className="text-muted-foreground mt-2 text-xs">
                                    Você receberá uma notificação quando sua
                                    inscrição for aprovada.
                                  </p>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {type.rule &&
                            `Até ${calculateMaxAge(new Date(type.rule))} anos`}
                        </div>
                      </div>

                      <div className="text-foreground ml-4 flex-shrink-0 text-sm font-semibold whitespace-nowrap">
                        {getFormatCurrency(type.value)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground text-sm">
                Nenhum tipo de inscrição disponível.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
