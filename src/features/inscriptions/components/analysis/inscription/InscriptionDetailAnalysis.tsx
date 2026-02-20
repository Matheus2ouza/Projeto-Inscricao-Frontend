"use client";

import { downloadParticipantsPdf } from "@/features/inscriptions/api/analysis/inscription/downloadParticipantsPdf";
import { inscriptionsForAnalysisKeys } from "@/features/inscriptions/hooks/analysis/useInscriptionsForAnalysisQuery";
import { useUpdateInscription } from "@/features/inscriptions/hooks/useEditInscription";
import {
  AnalysisInscriptionResponse,
  Participants,
} from "@/features/inscriptions/types/analysis/analysisTypes";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { getCalculateAge } from "@/shared/utils/getCalculateAge";
import { getConvertStatusInscription } from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CheckCircle,
  Download,
  Loader2,
  Mail,
  Menu,
  OctagonX,
  Phone,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmationModal } from "./ConfirmationModal";

interface InscriptionDetailAnalysisProps {
  inscriptionId: string;
  inscriptionDetails: AnalysisInscriptionResponse | null;
  participants: Participants | null;
  page: number;
  pageCount: number;
  total: number;
  setPage: (page: number) => void;
  approveInscription: (inscriptionId: string) => Promise<void>;
  cancelInscription: (
    inscriptionId: string,
    currentStatus: string,
  ) => Promise<void>;
  deleteInscription: (inscriptionId: string) => Promise<void>;
  isApproving: boolean;
  isCancelling: boolean;
  isDeleting: boolean;
}

export default function InscriptionDetailAnalysis({
  inscriptionId,
  inscriptionDetails,
  participants,
  page,
  pageCount,
  total,
  setPage,
  approveInscription,
  cancelInscription,
  deleteInscription,
  isApproving,
  isCancelling,
  isDeleting,
}: InscriptionDetailAnalysisProps) {
  const [sortBy, setSortBy] = useState<{
    field: string;
    direction: "asc" | "desc" | "default";
  }>({ field: "", direction: "default" });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    title: string;
    description: string;
    confirmText: string;
    variant: "default" | "destructive" | "success";
    action: () => void;
  }>({
    title: "",
    description: "",
    confirmText: "",
    variant: "default",
    action: () => {},
  });

  const [participantsDownloadLoading, setParticipantsDownloadLoading] =
    useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    form,
    handleSubmit: handleUpdateSubmit,
    isUpdating,
  } = useUpdateInscription({
    inscriptionId: inscriptionDetails?.id ?? inscriptionId,
    initialValues: {
      responsible: inscriptionDetails?.responsible,
      phone: inscriptionDetails?.phone,
      email: inscriptionDetails?.email,
    },
    onSuccess: async () => {
      setIsEditDialogOpen(false);
      // Invalidar queries de análise também
      await queryClient.invalidateQueries({
        queryKey:
          inscriptionsForAnalysisKeys.inscriptionDetailsBase(inscriptionId),
      });
      await queryClient.invalidateQueries({
        queryKey: inscriptionsForAnalysisKeys.all,
      });
    },
  });

  const handleDownloadParticipants = async () => {
    const targetInscriptionId = inscriptionDetails?.id ?? inscriptionId;
    if (!targetInscriptionId) {
      toast.error("Inscrição não encontrada para gerar a lista.");
      return;
    }

    try {
      setParticipantsDownloadLoading(true);
      const { pdfBase64, filename } =
        await downloadParticipantsPdf(targetInscriptionId);
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Download da lista iniciado.");
    } catch (error) {
      console.error("Erro ao baixar lista de participantes:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Erro ao gerar PDF da lista de participantes.";
      toast.error(message);
    } finally {
      setParticipantsDownloadLoading(false);
    }
  };

  const handleApproveInscription = () => {
    setModalConfig({
      title: "Aprovar Inscrição",
      description:
        "Tem certeza que deseja aprovar esta inscrição? Esta ação irá marcar a inscrição como aprovada.",
      confirmText: "Aprovar",
      variant: "success",
      action: async () => {
        await approveInscription(inscriptionId);
        setShowConfirmModal(false);
      },
    });
    setShowConfirmModal(true);
  };

  const handleCancelInscription = () => {
    const isCurrentlyCancelled =
      inscriptionDetails?.status.toLowerCase() === "cancelled";

    setModalConfig({
      title: isCurrentlyCancelled ? "Reativar Inscrição" : "Cancelar Inscrição",
      description: isCurrentlyCancelled
        ? "Tem certeza que deseja reativar esta inscrição? Ela voltará ao status de pendente."
        : "Tem certeza que deseja cancelar esta inscrição? Esta ação pode ser revertida posteriormente.",
      confirmText: isCurrentlyCancelled ? "Reativar" : "Cancelar",
      variant: isCurrentlyCancelled ? "success" : "default",
      action: async () => {
        await cancelInscription(
          inscriptionId,
          inscriptionDetails?.status || "",
        );
        setShowConfirmModal(false);
      },
    });
    setShowConfirmModal(true);
  };

  const handleDeleteInscription = () => {
    setModalConfig({
      title: "Deletar Inscrição",
      description:
        "ATENÇÃO: Esta ação irá deletar permanentemente esta inscrição e todos os dados associados. Esta ação NÃO pode ser desfeita. Tem certeza que deseja continuar?",
      confirmText: "Deletar Permanentemente",
      variant: "destructive",
      action: async () => {
        await deleteInscription(inscriptionId);
        setShowConfirmModal(false);
      },
    });
    setShowConfirmModal(true);
  };

  const getGenderText = (gender: string) => {
    switch (gender.toLowerCase()) {
      case "male":
        return "Masculino";
      case "female":
        return "Feminino";
      case "other":
        return "Outro";
      default:
        return gender;
    }
  };

  const formatDate = (date: string | Date) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(parsedDate.getTime())) return "";
    return parsedDate.toLocaleDateString("pt-BR");
  };

  // Função para ordenar os participantes
  const sortParticipants = (participants: any[]) => {
    if (sortBy.direction === "default") return participants;

    return [...participants].sort((a, b) => {
      if (sortBy.field === "name") {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();

        if (sortBy.direction === "asc") {
          return aName.localeCompare(bName);
        } else {
          return bName.localeCompare(aName);
        }
      }

      if (sortBy.field === "birthDate") {
        const aDate = new Date(a.birthDate);
        const bDate = new Date(b.birthDate);

        if (sortBy.direction === "asc") {
          return aDate.getTime() - bDate.getTime();
        } else {
          return bDate.getTime() - aDate.getTime();
        }
      }

      if (sortBy.field === "gender") {
        const aGender = getGenderText(a.gender).toLowerCase();
        const bGender = getGenderText(b.gender).toLowerCase();

        if (sortBy.direction === "asc") {
          return aGender.localeCompare(bGender);
        } else {
          return bGender.localeCompare(aGender);
        }
      }

      return 0;
    });
  };

  return (
    <div className="space-y-6">
      {/* Botões de Ação */}
      {inscriptionDetails && (
        <div className="flex items-center justify-end gap-3">
          {inscriptionDetails.status.toLowerCase() === "under_review" && (
            <Button
              variant="default"
              onClick={handleApproveInscription}
              disabled={isApproving}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <User className="h-4 w-4" />
              {isApproving ? "Aprovando..." : "Aprovar Inscrição"}
            </Button>
          )}

          {inscriptionDetails.status.toLowerCase() !== "paid" && (
            <div className="flex items-center gap-2">
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Editar Inscrição</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Editar dados da inscrição</DialogTitle>
                    <DialogDescription>
                      Atualize as informações de contato do responsável.
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={handleUpdateSubmit} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="responsible"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Responsável</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(false)}
                          disabled={isUpdating}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="text-white"
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Salvando...
                            </span>
                          ) : (
                            "Salvar alterações"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                onClick={handleCancelInscription}
                disabled={isCancelling}
                className={`flex items-center gap-2 ${
                  inscriptionDetails.status.toLowerCase() === "cancelled"
                    ? "border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 hover:text-green-700"
                    : "border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-700"
                }`}
              >
                {inscriptionDetails.status.toLowerCase() === "cancelled" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                {isCancelling
                  ? inscriptionDetails.status.toLowerCase() === "cancelled"
                    ? "Reativando..."
                    : "Cancelando..."
                  : inscriptionDetails.status.toLowerCase() === "cancelled"
                    ? "Reativar Inscrição"
                    : "Cancelar Inscrição"}
              </Button>
            </div>
          )}

          <Button
            variant="destructive"
            onClick={handleDeleteInscription}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
          >
            <OctagonX className="h-4 w-4" />
            {isDeleting ? "Deletando..." : "Deletar Inscrição"}
          </Button>
        </div>
      )}

      {/* Informações da Inscrição */}
      {inscriptionDetails && (
        <Card className="border-0 shadow-md mb-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {inscriptionDetails.responsible}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Responsável pela inscrição
                  </p>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  inscriptionDetails.status,
                )}`}
              >
                {getConvertStatusInscription(inscriptionDetails.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="p-3 bg-green-500 rounded-lg shadow-md">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                    Telefone
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {inscriptionDetails.phone}
                  </p>
                </div>
              </div>

              {inscriptionDetails.email && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="p-3 bg-orange-500 rounded-lg shadow-md">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                      Email
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white break-all">
                      {inscriptionDetails.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botão Baixar Lista */}
      {inscriptionDetails && (
        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            onClick={handleDownloadParticipants}
            className="flex items-center gap-2"
            disabled={participantsDownloadLoading}
          >
            <Download className="h-4 w-4" />
            {participantsDownloadLoading ? "Baixando lista..." : "Baixar Lista"}
          </Button>
        </div>
      )}

      {/* Informações da Lista de Participantes - Fora da Tabela */}
      {inscriptionDetails && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Lista de Participantes
          </h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{total} participante(s)</span>
          </div>
        </div>
      )}

      {/* Tabela de Participantes */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {participants && participants.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-base">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (sortBy.field === "name") {
                              if (sortBy.direction === "default") {
                                setSortBy({
                                  field: "name",
                                  direction: "asc",
                                });
                              } else if (sortBy.direction === "asc") {
                                setSortBy({
                                  field: "name",
                                  direction: "desc",
                                });
                              } else {
                                setSortBy({
                                  field: "",
                                  direction: "default",
                                });
                              }
                            } else {
                              setSortBy({
                                field: "name",
                                direction: "asc",
                              });
                            }
                          }}
                          className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1"
                        >
                          Nome
                          {sortBy.field === "name" ? (
                            sortBy.direction === "asc" ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : sortBy.direction === "desc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <Menu className="h-3 w-3" />
                            )
                          ) : (
                            <Menu className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-base">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (sortBy.field === "birthDate") {
                              if (sortBy.direction === "default") {
                                setSortBy({
                                  field: "birthDate",
                                  direction: "asc",
                                });
                              } else if (sortBy.direction === "asc") {
                                setSortBy({
                                  field: "birthDate",
                                  direction: "desc",
                                });
                              } else {
                                setSortBy({
                                  field: "",
                                  direction: "default",
                                });
                              }
                            } else {
                              setSortBy({
                                field: "birthDate",
                                direction: "asc",
                              });
                            }
                          }}
                          className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1"
                        >
                          Data de Nascimento
                          {sortBy.field === "birthDate" ? (
                            sortBy.direction === "asc" ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : sortBy.direction === "desc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <Menu className="h-3 w-3" />
                            )
                          ) : (
                            <Menu className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-base">
                        Inscrição
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-base">
                        Idade
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-base">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (sortBy.field === "gender") {
                              if (sortBy.direction === "default") {
                                setSortBy({
                                  field: "gender",
                                  direction: "asc",
                                });
                              } else if (sortBy.direction === "asc") {
                                setSortBy({
                                  field: "gender",
                                  direction: "desc",
                                });
                              } else {
                                setSortBy({
                                  field: "",
                                  direction: "default",
                                });
                              }
                            } else {
                              setSortBy({
                                field: "gender",
                                direction: "asc",
                              });
                            }
                          }}
                          className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1 mx-auto"
                        >
                          Gênero
                          {sortBy.field === "gender" ? (
                            sortBy.direction === "asc" ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : sortBy.direction === "desc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <Menu className="h-3 w-3" />
                            )
                          ) : (
                            <Menu className="h-3 w-3 text-gray-400" />
                          )}
                        </Button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortParticipants(participants).map((participant) => (
                      <tr
                        key={participant.id}
                        className="border-t hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white dark:text-white" />
                            </div>
                            <span className="font-medium">
                              {participant.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {formatDate(participant.birthDate)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(participant.typeInscription)}`}
                          >
                            {participant.typeInscription}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-muted-foreground font-medium">
                            {getCalculateAge(participant.birthDate)} anos
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-muted-foreground">
                            {getGenderText(participant.gender)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {pageCount > 1 && (
                <div className="p-6 border-t">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {(page - 1) * 10 + 1} a{" "}
                      {Math.min(page * 10, total)} de {total} participantes
                    </p>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setPage(Math.max(1, page - 1))}
                            href="#"
                            className={
                              page === 1 ? "pointer-events-none opacity-50" : ""
                            }
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
                            onClick={() =>
                              setPage(Math.min(pageCount, page + 1))
                            }
                            href="#"
                            className={
                              page === pageCount
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Nenhum participante encontrado
              </h3>
              <p className="text-muted-foreground">
                Esta inscrição não possui participantes cadastrados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={modalConfig.action}
        title={modalConfig.title}
        description={modalConfig.description}
        confirmText={modalConfig.confirmText}
        variant={modalConfig.variant}
        isLoading={isApproving || isCancelling || isDeleting}
      />
    </div>
  );
}
