'use client';

import {
  Event,
  Inscription,
} from '@/features/inscriptions/types/myInscriptions/myInscriptionsTypes';
import { ConfirmationDialog } from '@/shared/components/ConfirmationDialog';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { formatDate, formatDateTime } from '@/shared/utils/formatDate';
import { getConvertStatusInscription } from '@/shared/utils/getConvertStatus';
import { getFormatCurrency } from '@/shared/utils/getFormatCurrency';
import { getStatusColor } from '@/shared/utils/getStatusColor';
import {
  Calendar,
  Eye,
  Image as ImageIcon,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useMyInscriptionActions } from '../../hooks/myInscriptions/useMyInscriptionActions';

type MyInscriptionsProps = {
  event: Event | null;
  inscriptions: Inscription[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onSelectInscription: (id: string) => void;
  pageSize?: number;
  onInscriptionDeleted?: () => void;
};

export default function MyInscriptionsTable({
  event,
  inscriptions,
  total,
  page,
  pageCount,
  onPageChange,
  onSelectInscription,
  pageSize = 10,
  onInscriptionDeleted,
}: MyInscriptionsProps) {
  const [imageError, setImageError] = useState(false);
  const [inscriptionToDelete, setInscriptionToDelete] =
    useState<Inscription | null>(null);
  const [selectedInscription, setSelectedInscription] =
    useState<Inscription | null>(null);

  const { handleDeleteInscription, isDeleting } = useMyInscriptionActions();

  // Função para calcular o índice global
  const calculateGlobalIndex = (localIndex: number): number => {
    return (page - 1) * pageSize + localIndex + 1;
  };

  // Função para deletar a inscrição
  const handleDelete = async () => {
    if (!inscriptionToDelete) return;

    try {
      await handleDeleteInscription(inscriptionToDelete.id);
      setInscriptionToDelete(null);

      // Chama o callback para atualizar a lista
      if (onInscriptionDeleted) {
        onInscriptionDeleted();
      }
    } catch (error) {
      console.error('Erro ao deletar inscrição:', error);
      // O erro já é tratado no hook useMyInscriptionActions
    }
  };

  // Função para visualizar detalhes da inscrição (mobile)
  const handleViewDetails = (inscription: Inscription) => {
    setSelectedInscription(inscription);
  };

  // Função para redirecionar para a página de detalhes da inscrição (desktop)
  const handleViewInscription = (inscriptionId: string) => {
    onSelectInscription(inscriptionId);
  };

  // Função para abrir dialog de exclusão
  const handleOpenDeleteDialog = (inscription: Inscription) => {
    setInscriptionToDelete(inscription);
  };

  if (!event) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="bg-riodavida/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Users className="text-riodavida h-8 w-8" />
        </div>
        <h3 className="text-riodavida-gray-dark dark:text-riodavida-gray mb-2 text-lg font-semibold">
          Nenhum evento encontrado
        </h3>
        <p className="text-muted-foreground">
          Não há inscrições disponíveis para visualização.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card do Evento */}
      <div className="liquid-card overflow-hidden rounded-xl">
        <div className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Imagem do Evento à esquerda */}
            <div className="bg-riodavida/5 relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:w-70">
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
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="text-muted-foreground h-12 w-12" />
                </div>
              )}
            </div>

            {/* Informações do Evento à direita */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
                  {event.name}
                </h1>

                {/* Detalhes do Evento */}
                <div className="mt-3 flex flex-wrap gap-4">
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Calendar className="text-riodavida h-4 w-4" />
                    <span>
                      {formatDate(event.startDate)} -{' '}
                      {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>

                {/* Data de criação (se disponível) */}
                {(event as any).createdAt && (
                  <div className="text-muted-foreground mt-2 text-xs">
                    Criado em: {formatDateTime((event as any).createdAt)}
                  </div>
                )}
              </div>

              {/* Estatísticas do Evento */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-riodavida/5 rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Minhas Inscrições
                    </span>
                    <span className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
                      {event.totalInscription}
                    </span>
                  </div>
                </div>

                <div className="bg-riodavida/5 rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Total de Participantes
                    </span>
                    <span className="text-riodavida-gray-dark dark:text-riodavida-gray text-2xl font-bold">
                      {event.totalParticipants}
                    </span>
                  </div>
                </div>

                <div className="bg-riodavida-secondary/5 rounded-lg p-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Total Pago
                    </span>
                    <span className="text-riodavida-secondary dark:text-riodavida-muted-light text-2xl font-bold">
                      {getFormatCurrency(event.totalPaid)}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-red-50/50 p-4 dark:bg-red-950/20">
                  <div className="flex flex-col space-y-1">
                    <span className="text-muted-foreground text-sm">
                      Total Pendente
                    </span>
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {getFormatCurrency(event.totalDue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Título das Inscrições */}
      <div className="pt-4">
        <h2 className="text-riodavida-gray-dark dark:text-riodavida-gray text-xl font-semibold">
          Minhas Inscrições
        </h2>
      </div>

      {/* Tabela - Versão Mobile com Cards */}
      <div className="block sm:hidden">
        {inscriptions.length === 0 ? (
          <div className="text-muted-foreground border-riodavida/20 rounded-lg border px-4 py-8 text-center">
            Nenhuma inscrição encontrada
          </div>
        ) : (
          <div className="space-y-3">
            {inscriptions.map((inscription, idx) => (
              <div
                key={inscription.id}
                className="border-riodavida/20 liquid-card rounded-lg border p-4 transition-colors"
              >
                {/* Primeira linha: Número, Status e Ações */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm font-medium">
                      #
                    </span>
                    <span className="font-semibold">
                      {calculateGlobalIndex(idx)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-10 w-10 p-0"
                      onClick={() => handleViewDetails(inscription)}
                      title="Visualizar Detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                      onClick={() => handleOpenDeleteDialog(inscription)}
                      title="Excluir Inscrição"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                      inscription.status,
                    )}`}
                  >
                    {getConvertStatusInscription(inscription.status)}
                  </span>
                </div>

                {/* Segunda linha: Responsável e ID */}
                <div className="mb-3 grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">Responsável</p>
                    <div className="flex items-center gap-2">
                      <User className="text-riodavida h-4 w-4" />
                      <p className="font-medium">{inscription.responsible}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-xs">ID</p>
                    <code className="bg-riodavida/5 rounded px-2 py-1 font-mono text-xs">
                      {inscription.id.substring(0, 12)}...
                    </code>
                  </div>
                </div>

                {/* Terceira linha: Participantes */}
                <div className="border-riodavida/20 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="text-riodavida h-4 w-4" />
                      <span className="text-sm font-medium">Participantes</span>
                    </div>
                    <span className="text-riodavida-gray-dark dark:text-riodavida-gray text-lg font-bold">
                      {inscription.totalParticipant}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabela - Versão Desktop */}
      <div className="liquid-card-solid hidden rounded-md border sm:block">
        {inscriptions.length === 0 ? (
          <div className="text-muted-foreground px-6 py-12 text-center">
            Nenhuma inscrição encontrada
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-riodavida/5">
              <TableRow className="border-gray-600/20">
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-16">
                  #
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[200px]">
                  ID
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray">
                  Responsável
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[140px]">
                  Status
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[140px] text-right">
                  Participantes
                </TableHead>
                <TableHead className="text-riodavida-gray-dark dark:text-riodavida-gray w-[100px] text-center">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscriptions.map((inscription, idx) => (
                <TableRow
                  key={inscription.id}
                  className="hover:bg-riodavida/5 border-gray-600/20"
                >
                  <TableCell className="font-medium">
                    {calculateGlobalIndex(idx)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {inscription.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="text-riodavida h-4 w-4" />
                      {inscription.responsible}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                        inscription.status,
                      )}`}
                    >
                      {getConvertStatusInscription(inscription.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Users className="text-riodavida h-4 w-4" />
                      <span className="font-semibold">
                        {inscription.totalParticipant}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-riodavida hover:bg-riodavida/10 hover:text-riodavida-dark dark:text-riodavida dark:hover:bg-riodavida/20 h-8 w-8 p-0"
                        onClick={() => handleViewInscription(inscription.id)}
                        title="Visualizar Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        onClick={() => handleOpenDeleteDialog(inscription)}
                        title="Excluir Inscrição"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Paginação */}
      {pageCount > 1 && (
        <div className="py-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-muted-foreground text-sm">
              Página {page} de {pageCount} • Total: {total} inscrições
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    href={page > 1 ? '#' : undefined}
                    className={
                      page === 1 ? 'pointer-events-none opacity-50' : ''
                    }
                  />
                </PaginationItem>

                {/* Versão mobile - apenas página atual */}
                <div className="sm:hidden">
                  <PaginationItem>
                    <PaginationLink
                      isActive={true}
                      href="#"
                      className="bg-riodavida hover:bg-riodavida-dark pointer-events-none text-white"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </div>

                {/* Versão desktop - todas as páginas */}
                <div className="hidden sm:flex">
                  {Array.from({ length: pageCount }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        href="#"
                        onClick={() => onPageChange(i + 1)}
                        className={
                          page === i + 1
                            ? 'bg-riodavida hover:bg-riodavida-dark text-white'
                            : ''
                        }
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </div>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < pageCount && onPageChange(page + 1)}
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
      )}

      {/* Dialog de Confirmação para Excluir */}
      <ConfirmationDialog
        open={!!inscriptionToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setInscriptionToDelete(null);
          }
        }}
        onConfirm={handleDelete}
        title="Excluir inscrição"
        message="Tem certeza que deseja excluir esta inscrição? Esta ação não pode ser desfeita e todos os participantes serão removidos."
        confirmText="Excluir"
        cancelText="Cancelar"
        isLoading={isDeleting}
        variant="destructive"
      />

      {/* Dialog de Detalhes da Inscrição (apenas para mobile) */}
      <Dialog
        open={!!selectedInscription}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedInscription(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-[95vw] overflow-y-auto sm:max-w-2xl">
          {selectedInscription && (
            <>
              <DialogHeader>
                <DialogTitle className="text-riodavida-gray-dark dark:text-riodavida-gray">
                  Detalhes da Inscrição
                </DialogTitle>
                <DialogDescription className="break-all">
                  ID: {selectedInscription.id.substring(0, 16)}...
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {/* Informações principais */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">
                      Responsável
                    </span>
                    <div className="flex items-center gap-2">
                      <User className="text-riodavida h-4 w-4" />
                      <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-base font-semibold">
                        {selectedInscription.responsible}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">
                      Status
                    </span>
                    <div className="mt-1">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                          selectedInscription.status,
                        )}`}
                      >
                        {getConvertStatusInscription(
                          selectedInscription.status,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">
                      Total de Participantes
                    </span>
                    <div className="flex items-center gap-2">
                      <Users className="text-riodavida h-4 w-4" />
                      <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-base font-semibold">
                        {selectedInscription.totalParticipant}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs">
                      ID da Inscrição
                    </span>
                    <code className="bg-riodavida/5 block rounded px-2 py-1 font-mono text-sm">
                      {selectedInscription.id}
                    </code>
                  </div>
                </div>

                {/* Informações do Evento */}
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs font-medium">
                    Evento
                  </span>
                  <div className="border-riodavida/20 bg-riodavida/5 overflow-hidden rounded-md border p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      {event.image && (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                          <Image
                            src={event.image}
                            alt={event.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="text-riodavida-gray-dark dark:text-riodavida-gray font-semibold">
                          {event.name}
                        </h4>
                        <p className="text-muted-foreground text-xs">
                          {formatDate(event.startDate)} -{' '}
                          {formatDate(event.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações Adicionais (se disponíveis) */}
                {(selectedInscription as any).createdAt && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-xs font-medium">
                      Data de Criação
                    </span>
                    <div className="border-riodavida/20 bg-riodavida/5 rounded-md border px-4 py-3">
                      <p className="text-riodavida-gray-dark dark:text-riodavida-gray text-sm">
                        {formatDateTime((selectedInscription as any).createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão para ver mais detalhes */}
                <div className="border-riodavida/20 border-t pt-4">
                  <Button
                    onClick={() => {
                      setSelectedInscription(null);
                      handleViewInscription(selectedInscription.id);
                    }}
                    className="bg-riodavida hover:bg-riodavida-dark w-full text-white"
                  >
                    Ver mais detalhes
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
