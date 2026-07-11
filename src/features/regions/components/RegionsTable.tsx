'use client';

import useFormCreateRegion from '@/features/regions/hooks/useFormCreateRegion';
import { cn } from '@/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/shared/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { DialogClose, DialogTitle } from '@radix-ui/react-dialog';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useRegionsAll } from '../hooks/useRegionsAll';

const PAGE_SIZE = 4;

export default function RegionsTable() {
  const [open, setOpen] = useState(false);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const { form, onSubmit } = useFormCreateRegion();
  const { regions, total, page, pageCount, loading, setPage } = useRegionsAll({
    initialPage: 1,
    pageSize: PAGE_SIZE,
  });

  const toggleExpand = (regionId: string) => {
    setExpandedRegion(expandedRegion === regionId ? null : regionId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Retorna o status do evento: "Agendado", "Em andamento" ou "Realizado"
  const getStatus = (startDate: string, endDate?: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : undefined;
    if (end && now > end) return 'Realizado';
    if (now >= start && (!end || now <= end)) return 'Em andamento';
    if (now < start) return 'Agendado';
    return '-';
  };

  // Calcular índice inicial para a paginação
  const startIndex = (page - 1) * 4;

  // Função para lidar com o submit e fechar o dialog se sucesso
  const handleSubmit = async (event: React.FormEvent) => {
    const success = await onSubmit(event);
    if (success) setOpen(false);
  };

  if (loading) {
    return (
      <div className="relative p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Skeleton className="mb-2 h-9 w-32" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <Card
              key={index}
              className="bg-card w-full border-2 border-gray-200 shadow-sm transition-all duration-300 ease-in-out dark:border-gray-700"
            >
              <CardHeader className="border-b pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
                <div className="mb-4 space-y-3">
                  <Skeleton className="h-10 rounded-lg" />
                  <Skeleton className="h-10 rounded-lg" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4">
                <Skeleton className="h-10 w-48" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Regiões
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e visualize todas as regiões cadastradas
          </p>
        </div>
        <Button
          variant="default"
          className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
          onClick={() => setOpen(true)}
        >
          Nova Região
        </Button>
      </div>

      {/* Overlay para quando um card estiver expandido */}
      {expandedRegion && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setExpandedRegion(null)}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary font-bold">
              Criar Nova Região
            </DialogTitle>
          </DialogHeader>
          {/* Formulario de criação da Região */}
          <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="mt-2 space-y-4">
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="name"
                        className="text-transform: flex items-center text-sm font-medium text-gray-700 uppercase dark:text-gray-300"
                      >
                        <i className="bi bi-geo-alt text-indigo-500 dark:text-blue-500"></i>
                        Região
                      </FormLabel>
                      <FormControl className="relative">
                        <Input
                          id="username"
                          type="text"
                          autoComplete="off"
                          placeholder="Digite sua localidade"
                          className="focus:ring-opacity-60 w-full rounded-xl border-gray-300 bg-white/50 py-3 pr-4 pl-4 shadow-sm backdrop-blur-sm transition-all duration-300 focus:border-indigo-400 focus:shadow-md focus:ring-2 focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                >
                  Criar
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      {/* Grid de Cards */}
      <div className="relative mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {regions.map((region) => (
          <div
            key={region.id}
            className={cn(
              'transition-all duration-300 ease-in-out',
              expandedRegion === region.id
                ? 'fixed inset-0 z-50 flex items-center justify-center p-4'
                : 'relative',
            )}
          >
            <Card
              className={cn(
                'bg-card w-full border-2 shadow-sm transition-all duration-300 ease-in-out',
                expandedRegion === region.id
                  ? 'z-50 max-h-[90vh] max-w-6xl overflow-y-auto border-blue-500 shadow-2xl'
                  : 'cursor-pointer border-gray-200 hover:scale-[1.01] hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:hover:border-gray-600',
                expandedRegion &&
                  expandedRegion !== region.id &&
                  'opacity-30 blur-sm',
              )}
              onClick={(e) => {
                if (!expandedRegion) {
                  e.stopPropagation();
                  toggleExpand(region.id);
                }
              }}
            >
              {/* Header do Card */}
              <CardHeader className="border-b pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
                        {region.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {region.name.toUpperCase()}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {region.numberOfAccounts} contas
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {region.numberOfEvents} eventos
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                {/* Estatísticas */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-950/30">
                    <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                      <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {region.numberOfAccounts}
                      </p>
                      <p className="text-muted-foreground text-xs">Contas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/30">
                    <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {region.numberOfEvents}
                      </p>
                      <p className="text-muted-foreground text-xs">Eventos</p>
                    </div>
                  </div>
                </div>

                {/* Eventos */}
                <div className="mb-4 space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Último evento:</span>
                    </div>
                    <span className="text-sm font-medium">
                      {region.lastEvent
                        ? formatDate(region.lastEvent.createdAt)
                        : 'Nenhum'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-blue-50 p-2 dark:bg-blue-950/30">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Próximo evento:</span>
                    </div>
                    <span className="text-black-600 text-sm font-medium dark:text-white">
                      {region.nextEventAt
                        ? formatDate(region.nextEventAt.createdAt)
                        : 'Nenhum agendado'}
                    </span>
                  </div>
                </div>

                {/* Conteúdo Expandido */}
                {expandedRegion === region.id &&
                  (() => {
                    // Badge do próximo evento: status e cor
                    let nextStatus = null;
                    let nextBadgeColor = 'bg-blue-600';
                    if (region.nextEventAt) {
                      nextStatus = getStatus(
                        region.nextEventAt.startDate,
                        region.nextEventAt.endDate,
                      );
                      if (nextStatus === 'Agendado')
                        nextBadgeColor = 'bg-green-600';

                      if (nextStatus === 'Realizado')
                        nextBadgeColor = 'bg-red-600';
                    }
                    return (
                      <div className="mt-6 space-y-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                        {/* Dados dos Eventos */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {/* Último Evento */}
                          <div>
                            <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                              <Clock className="h-5 w-5 text-orange-500" />
                              Último Evento
                            </h4>
                            {region.lastEvent ? (
                              <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-800">
                                <div className="relative h-32">
                                  {region.lastEvent.imageUrl ? (
                                    <Image
                                      src={region.lastEvent.imageUrl}
                                      alt={region.lastEvent.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-500 to-red-500" />
                                  )}
                                  <div className="absolute inset-0 bg-black/20" />
                                  <Badge className="absolute top-2 right-2 bg-green-600">
                                    Realizado
                                  </Badge>
                                </div>
                                <div className="p-4">
                                  <h5 className="mb-2 text-lg font-bold">
                                    {region.lastEvent.name}
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Data:
                                      </span>
                                      <span className="font-medium">
                                        {formatDate(region.lastEvent.createdAt)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Status:
                                      </span>
                                      <span className="font-medium">
                                        {getStatus(
                                          region.lastEvent.startDate,
                                          region.lastEvent.endDate,
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted-foreground rounded-lg border py-8 text-center">
                                <Calendar className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                <p>Nenhum evento realizado</p>
                              </div>
                            )}
                          </div>

                          {/* Próximo Evento */}
                          <div>
                            <h4 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                              <Calendar className="h-5 w-5 text-blue-500" />
                              Próximo Evento
                            </h4>
                            {region.nextEventAt ? (
                              <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-800">
                                <div className="relative h-32">
                                  {region.nextEventAt.imageUrl ? (
                                    <Image
                                      src={region.nextEventAt.imageUrl}
                                      alt={region.nextEventAt.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-purple-500" />
                                  )}
                                  <div className="absolute inset-0 bg-black/20" />
                                  <Badge
                                    className={`absolute top-2 right-2 ${nextBadgeColor} align-center flex min-w-[90px] items-center justify-center text-white`}
                                  >
                                    {nextStatus}
                                  </Badge>
                                </div>
                                <div className="p-4">
                                  <h5 className="mb-2 text-lg font-bold">
                                    {region.nextEventAt.name}
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Data:
                                      </span>
                                      <span className="font-medium">
                                        {formatDate(
                                          region.nextEventAt.createdAt,
                                        )}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        Status:
                                      </span>
                                      <span className="text-black-600 font-medium dark:text-white">
                                        {nextStatus}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-muted-foreground rounded-lg border py-8 text-center">
                                <Calendar className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                <p>Nenhum evento agendado</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
              </CardContent>

              {/* Footer do Card */}
              <CardFooter className="flex justify-end border-t pt-4">
                <Button
                  variant="default"
                  className={cn(
                    'bg-primary dark:bg-secondary dark:text-secondary-foreground flex w-50 items-center justify-center gap-2 text-white transition-none',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(region.id);
                  }}
                >
                  {expandedRegion === region.id ? (
                    <>Fechar Detalhes</>
                  ) : (
                    <>Ver Detalhes Completos</>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {/* Mensagem quando não há regiões */}
      {regions.length === 0 && (
        <div className="py-16 text-center">
          <div className="text-muted-foreground mb-6">
            <MapPin className="mx-auto mb-4 h-20 w-20 opacity-30" />
            <h3 className="mb-2 text-xl font-medium">
              Nenhuma região encontrada
            </h3>
            <p className="mx-auto max-w-md">
              Não há regiões cadastradas no momento. Comece criando a primeira
              região para organizar seus usuários e eventos.
            </p>
          </div>
          <Button size="lg">Criar Primeira Região</Button>
        </div>
      )}

      {/* Paginação */}
      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <div className="text-muted-foreground text-sm">
          Mostrando {startIndex + 1}-{Math.min(startIndex + 4, total)} de{' '}
          {total} regiões
        </div>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                href={page > 1 ? '#' : undefined}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {Array.from({ length: pageCount }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  href="#"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < pageCount && setPage(page + 1)}
                href={page < pageCount ? '#' : undefined}
                className={
                  page === pageCount ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
