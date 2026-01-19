"use client";

import {
  Event,
  Inscription,
} from "@/features/inscriptions/types/MyInscriptions/myInscriptionsTypes";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatDate, formatDateTime } from "@/shared/utils/formatDate";
import { getConvertStatusInscription } from "@/shared/utils/getConvertStatus";
import { getFormatCurrency } from "@/shared/utils/getFormatCurrency";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  Calendar,
  Eye,
  Image as ImageIcon,
  Trash2,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useMyInscriptionActions } from "../../hooks/myInscriptions/useMyInscriptionActions";

type MyInscriptionsProps = {
  event: Event | null;
  inscriptions: Inscription[];
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onSelectInscription: (id: string) => void;
  pageSize?: number;
  onInscriptionDeleted?: () => void; // Nova prop para atualizar a lista após exclusão
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
      console.error("Erro ao deletar inscrição:", error);
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
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
        <p className="text-muted-foreground">
          Não há inscrições disponíveis para visualização.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card do Evento com layout melhorado */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Imagem do Evento à esquerda */}
            <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Informações do Evento à direita */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {event.name}
                </h1>

                {/* Detalhes do Evento */}
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>

                {/* Data de criação (se disponível) */}
                {(event as any).createdAt && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Criado em: {formatDateTime((event as any).createdAt)}
                  </div>
                )}
              </div>

              {/* Estatísticas do Evento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Total de Inscrições
                    </span>
                    <span className="text-2xl font-bold">
                      {event.totalInscription}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Total Pago
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getFormatCurrency(event.totalPaid)}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">
                      Minhas Inscrições
                    </span>
                    <span className="text-2xl font-bold">
                      {inscriptions.length}
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
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Minhas Inscrições
        </h2>
      </div>

      {/* Tabela - Versão Mobile com Cards */}
      <div className="block sm:hidden">
        {inscriptions.length === 0 ? (
          <div className="px-4 py-8 text-center text-muted-foreground border rounded-lg">
            Nenhuma inscrição encontrada
          </div>
        ) : (
          <div className="space-y-3">
            {inscriptions.map((inscription, idx) => (
              <div
                key={inscription.id}
                className="p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                {/* Primeira linha: Número, Status e Ações */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
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
                      className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      onClick={() => handleViewDetails(inscription)}
                      title="Visualizar Detalhes"
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      inscription.status,
                    )}`}
                  >
                    {getConvertStatusInscription(inscription.status)}
                  </span>
                </div>

                {/* Segunda linha: Responsável e ID */}
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Responsável</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{inscription.responsible}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">ID</p>
                    <code className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {inscription.id.substring(0, 12)}...
                    </code>
                  </div>
                </div>

                {/* Terceira linha: Participantes */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Participantes</span>
                    </div>
                    <span className="text-lg font-bold">
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
      <div className="hidden sm:block rounded-md border">
        {inscriptions.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            Nenhuma inscrição encontrada
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead className="w-[200px]">ID</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="w-[140px]">Status</TableHead>
                <TableHead className="w-[140px] text-right">
                  Participantes
                </TableHead>
                <TableHead className="w-[100px] text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inscriptions.map((inscription, idx) => (
                <TableRow key={inscription.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {calculateGlobalIndex(idx)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {inscription.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {inscription.responsible}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        inscription.status,
                      )}`}
                    >
                      {getConvertStatusInscription(inscription.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
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
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        onClick={() => handleViewInscription(inscription.id)}
                        title="Visualizar Detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
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

      {/* Paginação - Exatamente igual ao exemplo */}
      {pageCount > 1 && (
        <div className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Página {page} de {pageCount} • Total: {total} inscrições
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && onPageChange(page - 1)}
                    href={page > 1 ? "#" : undefined}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* Versão mobile - apenas página atual */}
                <div className="sm:hidden">
                  <PaginationItem>
                    <PaginationLink
                      isActive={true}
                      href="#"
                      className="pointer-events-none"
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
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </div>

                <PaginationItem>
                  <PaginationNext
                    onClick={() => page < pageCount && onPageChange(page + 1)}
                    href={page < pageCount ? "#" : undefined}
                    className={
                      page === pageCount ? "pointer-events-none opacity-50" : ""
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
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedInscription && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Inscrição</DialogTitle>
                <DialogDescription className="break-all">
                  ID: {selectedInscription.id.substring(0, 16)}...
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Informações principais */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Responsável
                    </span>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base font-semibold">
                        {selectedInscription.responsible}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Status
                    </span>
                    <div className="mt-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
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
                    <span className="text-xs text-muted-foreground">
                      Total de Participantes
                    </span>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <p className="text-base font-semibold">
                        {selectedInscription.totalParticipant}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      ID da Inscrição
                    </span>
                    <code className="font-mono text-sm bg-muted px-2 py-1 rounded block">
                      {selectedInscription.id}
                    </code>
                  </div>
                </div>

                {/* Informações do Evento */}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Evento
                  </span>
                  <div className="border rounded-md overflow-hidden bg-muted p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                      {event.image && (
                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
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
                        <h4 className="font-semibold">{event.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.startDate)} -{" "}
                          {formatDate(event.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações Adicionais (se disponíveis) */}
                {(selectedInscription as any).createdAt && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Data de Criação
                    </span>
                    <div className="border rounded-md bg-muted/30 px-4 py-3">
                      <p className="text-sm">
                        {formatDateTime((selectedInscription as any).createdAt)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão para ver mais detalhes */}
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => {
                      setSelectedInscription(null);
                      handleViewInscription(selectedInscription.id);
                    }}
                    className="w-full"
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
