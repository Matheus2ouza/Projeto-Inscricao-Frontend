import { useGlobalLoading } from "@/components/GlobalLoading";
import { downloadParticipantsPdf } from "@/features/inscriptions/api/downloadParticipantsPdf";
import { useUpdateInscription } from "@/features/inscriptions/hooks/useEditInscription";
import { useParticipantActions } from "@/features/participants/hooks/useParticipantActions";
import RegisterPaymentDialog from "@/features/payment/components/RegisterPaymentDialog";
import {
  ComboboxTypeInscription,
  TypeInscriptionOption,
} from "@/features/typeInscription/components/ComboboxTypeInscription";
import { useTypeInscriptionsQuery } from "@/features/typeInscription/hook/useTypeInscriptionsQuery";
import { ConfirmationDialog } from "@/shared/components/ConfirmationDialog";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { getcalculateAge } from "@/shared/utils/getCalculateAge";
import {
  getConvertStatusInscription,
  getConvertStatusPayment,
} from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  CreditCard,
  Download,
  Edit,
  Eye,
  Loader2,
  MoreVertical,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  InscriptionDetails,
  Participant,
} from "../types/inscriptionsDetails.types";

interface InscriptionDetailsProps {
  eventId?: string;
  data?: InscriptionDetails;
  isLoading?: boolean;
  error?: string | null;
}

export default function DetailsInscriptionsTable({
  eventId,
  data,
  isLoading = false,
  error = null,
}: InscriptionDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [registerPaymentOpen, setRegisterPaymentOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [downloadLoading, setDownloadLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPaymentPage, setCurrentPaymentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("participants");
  const [participantsDownloadLoading, setParticipantsDownloadLoading] =
    useState(false);
  const { setLoading } = useGlobalLoading();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditParticipantDialogOpen, setIsEditParticipantDialogOpen] =
    useState(false);
  const [isDeleteParticipantDialogOpen, setIsDeleteParticipantDialogOpen] =
    useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);
  const resolvedEventId = eventId ?? data?.eventId ?? "";
  const { data: typeInscriptionList, isLoading: isLoadingTypeInscriptions } =
    useTypeInscriptionsQuery(resolvedEventId, {
      enabled: Boolean(resolvedEventId),
    });
  const typeInscriptionOptions = useMemo<TypeInscriptionOption[]>(() => {
    if (!typeInscriptionList) return [];
    return typeInscriptionList.map((type) => ({
      label: `${type.description} - ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(type.value)}`,
      value: type.id,
      description: type.description,
      price: type.value,
    }));
  }, [typeInscriptionList]);
  const matchedTypeInscriptionId = useMemo(() => {
    if (!selectedParticipant) return undefined;
    const fallbackId = selectedParticipant.typeInscriptionId ?? "";
    const participantDescription = selectedParticipant.typeInscription
      ?.trim()
      .toLowerCase();
    if (!participantDescription || !typeInscriptionList?.length) {
      return fallbackId;
    }
    const match = typeInscriptionList.find(
      (type) => type.description.trim().toLowerCase() === participantDescription
    );
    return match?.id ?? fallbackId;
  }, [selectedParticipant, typeInscriptionList]);
  const {
    form,
    handleSubmit: handleUpdateSubmit,
    isUpdating,
    handleDelete,
    isDeleting,
  } = useUpdateInscription({
    inscriptionId: data?.id,
    initialValues: {
      responsible: data?.responsible,
      phone: data?.phone,
      email: data?.email,
    },
    onSuccess: () => setIsEditDialogOpen(false),
    onDeleteSuccess: () => {
      setIsDeleteDialogOpen(false);
      window.history.back();
    },
  });

  // Formatar data para o formato esperado pela API (YYYY-MM-DD)
  const formatBirthDateForAPI = (date: Date | string): string => {
    if (typeof date === "string") {
      // Se já é string, verificar se está no formato correto
      if (date.includes("T")) {
        return date.split("T")[0];
      }
      // Se está no formato DD/MM/YYYY, converter
      if (date.includes("/")) {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
      }
      return date;
    }
    // Se é Date, converter para YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const {
    form: participantForm,
    handleSubmit: handleParticipantUpdateSubmit,
    isUpdating: isUpdatingParticipant,
    handleDelete: handleParticipantDelete,
    isDeleting: isDeletingParticipant,
  } = useParticipantActions({
    participantId: selectedParticipant?.id,
    inscriptionId: data?.id,
    initialValues: selectedParticipant
      ? {
          name: selectedParticipant.name,
          birthDate: formatBirthDateForAPI(selectedParticipant.birthDate),
          gender: selectedParticipant.gender,
          typeInscriptionId: matchedTypeInscriptionId ?? "",
        }
      : undefined,
    onSuccess: () => {
      setIsEditParticipantDialogOpen(false);
      setSelectedParticipant(null);
    },
    onDeleteSuccess: () => {
      setIsDeleteParticipantDialogOpen(false);
      setSelectedParticipant(null);
    },
  });

  const itemsPerPage = 15;
  const paymentItemsPerPage = 10;

  // Usar o GlobalLoading quando estiver carregando
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Resetar página quando os dados mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [data?.participants]);

  // Resetar página de pagamentos quando os dados mudarem
  useEffect(() => {
    setCurrentPaymentPage(1);
  }, [data?.payments]);

  // Calcular participantes paginados
  const paginatedParticipants = data?.participants
    ? data.participants.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const totalPages = data?.participants
    ? Math.ceil(data.participants.length / itemsPerPage)
    : 0;

  // Calcular pagamentos paginados
  const paginatedPayments = data?.payments
    ? data.payments.slice(
        (currentPaymentPage - 1) * paymentItemsPerPage,
        currentPaymentPage * paymentItemsPerPage
      )
    : [];

  const totalPaymentPages = data?.payments
    ? Math.ceil(data.payments.length / paymentItemsPerPage)
    : 0;

  // Se estiver carregando, não renderizar nada (o GlobalLoading será mostrado)
  if (isLoading) {
    return null;
  }

  const showUnderReviewToast = () => {
    toast.info("Inscrição em revisão", {
      description:
        "Aguardando análise da organização. Assim que houver uma atualização você será avisado.",
    });
  };

  const handleRegisterPayment = () => {
    if (data?.status === "UNDER_REVIEW") {
      showUnderReviewToast();
      return;
    }
    setRegisterPaymentOpen(true);
  };
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Função para fazer download da imagem
  const handleDownloadImage = async (imageUrl: string, paymentId: string) => {
    try {
      setDownloadLoading((prev) => ({ ...prev, [paymentId]: true }));

      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Criar um URL temporário para o blob
      const blobUrl = URL.createObjectURL(blob);

      // Criar um elemento link temporário
      const link = document.createElement("a");
      link.href = blobUrl;

      // Extrair o nome do arquivo da URL ou usar um padrão
      const fileName = `comprovante-${paymentId}.${getFileExtension(imageUrl)}`;
      link.download = fileName;

      // Simular clique no link para iniciar o download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar o URL do blob
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao fazer download da imagem:", error);
      // Fallback: abrir em nova aba se o download falhar
      window.open(imageUrl, "_blank");
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [paymentId]: false }));
    }
  };

  // Função para obter a extensão do arquivo baseado na URL
  const getFileExtension = (url: string) => {
    const extension = url.split(".").pop()?.split("?")[0];
    return extension || "jpg"; // Fallback para jpg
  };

  // Se houver erro, mostrar mensagem de erro
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  // Se não há dados, mostrar mensagem
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Nenhum dado encontrado</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const formatDateForInput = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsEditParticipantDialogOpen(true);
  };

  const handleDeleteParticipant = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsDeleteParticipantDialogOpen(true);
  };

  const formatDateTime = (date: Date | string) => {
    return new Date(date).toLocaleString("pt-BR");
  };

  const handleImageLoad = (paymentId: string) => {
    setImageLoading((prev) => ({ ...prev, [paymentId]: false }));
  };

  const handleImageError = (paymentId: string) => {
    setImageLoading((prev) => ({ ...prev, [paymentId]: false }));
  };

  const handleImageStart = (paymentId: string) => {
    setImageLoading((prev) => ({ ...prev, [paymentId]: true }));
  };

  const renderRejectionReason = (reason?: string | null) => {
    if (!reason) {
      return <span className="text-muted-foreground">-</span>;
    }

    return (
      <div
        className="w-full text-xs font-medium text-destructive break-words whitespace-pre-wrap leading-snug text-left"
        title={reason}
      >
        {reason}
      </div>
    );
  };

  const handleDownloadParticipants = async () => {
    if (!data?.id) {
      toast.error("Inscrição não encontrada para gerar a lista.");
      return;
    }

    try {
      setParticipantsDownloadLoading(true);
      const { pdfBase64, filename } = await downloadParticipantsPdf(data.id);
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

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPaymentPage = (page: number) => {
    setCurrentPaymentPage(page);
  };

  const goToNextPaymentPage = () => {
    if (currentPaymentPage < totalPaymentPages) {
      setCurrentPaymentPage(currentPaymentPage + 1);
    }
  };

  const goToPreviousPaymentPage = () => {
    if (currentPaymentPage > 1) {
      setCurrentPaymentPage(currentPaymentPage - 1);
    }
  };

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {data && (
          <div className="flex justify-end gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Excluir Inscrição
            </Button>
          </div>
        )}
        {/* Header com informações principais */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    ID da Inscrição
                  </p>
                  <CardTitle className="text-base sm:text-lg font-mono">
                    #{data.id.slice(0, 8)}...
                  </CardTitle>
                </div>
                <div className="border-t pt-3">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    Responsável
                  </p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-lg sm:text-xl font-semibold text-foreground">
                      {data.responsible}
                    </p>
                  </div>
                </div>
              </div>
              <Badge
                className={`self-start text-sm px-3 py-1.5 ${getStatusColor(data.status)}`}
              >
                {getConvertStatusInscription(data.status.toUpperCase())}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t text-center">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  E-mail
                </p>
                <p className="text-sm font-medium break-all">
                  {data.email || "-"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Telefone
                </p>
                <p className="text-sm font-medium break-all">{data.phone}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Saldo devedor
                </p>
                <p className="text-lg font-bold text-red-500">
                  {formatCurrency(data.totalValue)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Data de Criação
                </p>
                <p className="text-sm font-medium">
                  {formatDateTime(data.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Abas para Participantes e Pagamentos */}
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2 h-auto">
            <TabsTrigger
              value="participants"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3"
            >
              <User className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Participantes</span>
              <span className="sm:hidden">Part.</span>({data.countParticipants})
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm py-2 sm:py-3"
            >
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
              <span className="sm:hidden">Pag.</span>(
              {data.payments?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Tab de Participantes */}
          <TabsContent value="participants">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">
                    Lista de Participantes
                  </CardTitle>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                    onClick={handleDownloadParticipants}
                    disabled={participantsDownloadLoading}
                  >
                    {participantsDownloadLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Baixar Lista
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm w-auto">
                          Nome
                        </TableHead>
                        <TableHead className="hidden sm:table-cell text-xs sm:text-sm w-auto">
                          Tipo de Inscrição
                        </TableHead>
                        <TableHead className="hidden md:table-cell text-xs sm:text-sm w-auto">
                          Data de Nascimento
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm w-auto">
                          Idade
                        </TableHead>
                        <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                          Gênero
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedParticipants.map((participant) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium text-xs sm:text-sm">
                            <div className="flex flex-col">
                              <span>{participant.name}</span>
                              {/* Mostrar informações extras em telas pequenas */}
                              <div className="sm:hidden text-muted-foreground text-xs mt-1">
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {participant.typeInscription ||
                                      "Não informado"}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {participant.gender === "MASCULINO"
                                      ? "Masculino"
                                      : participant.gender === "FEMININO"
                                        ? "Feminino"
                                        : participant.gender}
                                  </Badge>
                                </div>
                                <div className="mt-1">
                                  {formatDate(participant.birthDate)}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {participant.typeInscription || "Não informado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs sm:text-sm">
                            {formatDate(participant.birthDate)}
                          </TableCell>
                          <TableCell className="text-xs sm:text-sm font-medium">
                            {getcalculateAge(participant.birthDate)} anos
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="outline" className="text-xs">
                                {participant.gender === "MASCULINO"
                                  ? "Masculino"
                                  : participant.gender === "FEMININO"
                                    ? "Feminino"
                                    : participant.gender}
                              </Badge>
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 flex-shrink-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  onCloseAutoFocus={(e) => e.preventDefault()}
                                >
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      handleEditParticipant(participant);
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      handleDeleteParticipant(participant);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Deletar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                          <TableCell className="lg:hidden">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="outline" className="text-xs">
                                {participant.gender === "MASCULINO"
                                  ? "Masculino"
                                  : participant.gender === "FEMININO"
                                    ? "Feminino"
                                    : participant.gender}
                              </Badge>
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 flex-shrink-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  onCloseAutoFocus={(e) => e.preventDefault()}
                                >
                                  <DropdownMenuItem
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      handleEditParticipant(participant);
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      handleDeleteParticipant(participant);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Deletar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                      Mostrando {paginatedParticipants.length} de{" "}
                      {data.participants.length} participantes
                    </div>

                    <div className="flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => goToPreviousPage()}
                              href="#"
                              className={
                                currentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                href="#"
                                onClick={() => goToPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => goToNextPage()}
                              href="#"
                              className={
                                currentPage === totalPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <div className="text-sm text-muted-foreground text-center sm:text-right">
                      Página {currentPage} de {totalPages}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Pagamentos */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg sm:text-xl">
                    Histórico de Pagamentos
                  </CardTitle>
                  <Button
                    onClick={handleRegisterPayment}
                    className="dark:text-white"
                    disabled={data.status === "UNDER_REVIEW"}
                  >
                    <Plus className="h-4 w-4 mr-2 dark:text-white" />
                    Registrar Pagamento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {data.payments && data.payments.length > 0 ? (
                  <>
                    {/* Lista mobile (sem tabela) */}
                    <div className="sm:hidden space-y-3">
                      {paginatedPayments.map((payment) => (
                        <div key={payment.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(payment.status)}>
                              {getConvertStatusPayment(payment.status)}
                            </Badge>
                            <span className="text-sm font-medium">
                              {formatCurrency(payment.value)}
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <div>{formatDateTime(payment.createdAt)}</div>
                            {payment.rejectionReason && (
                              <div className="mt-1">
                                {renderRejectionReason(payment.rejectionReason)}
                              </div>
                            )}
                          </div>
                          <div className="mt-3">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedImage(payment.image);
                                    handleImageStart(payment.id);
                                  }}
                                >
                                  <Eye className="h-4 w-4 mr-1" /> Ver
                                  comprovante
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Comprovante de Pagamento
                                  </DialogTitle>
                                  <DialogDescription>
                                    Comprovante do pagamento{" "}
                                    {payment.id.slice(0, 8)}...
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center">
                                  {imageLoading[payment.id] && (
                                    <div className="flex items-center justify-center h-96 w-full">
                                      <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                  )}
                                  <img
                                    src={payment.image}
                                    alt={`Comprovante do pagamento ${payment.id}`}
                                    className={`max-h-96 rounded-lg ${imageLoading[payment.id] ? "hidden" : "block"}`}
                                    onLoad={() => handleImageLoad(payment.id)}
                                    onError={() => handleImageError(payment.id)}
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button
                                    className="text-white"
                                    onClick={() =>
                                      handleDownloadImage(
                                        payment.image,
                                        payment.id
                                      )
                                    }
                                    disabled={downloadLoading[payment.id]}
                                  >
                                    {downloadLoading[payment.id] ? (
                                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    ) : (
                                      <Download className="h-4 w-4 mr-1" />
                                    )}
                                    Download
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tabela desktop */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs sm:text-sm">
                              Status
                            </TableHead>
                            <TableHead className="text-xs sm:text-sm">
                              Valor
                            </TableHead>
                            <TableHead className="hidden sm:table-cell text-xs sm:text-sm">
                              Comprovante
                            </TableHead>
                            <TableHead className="hidden md:table-cell text-xs sm:text-sm">
                              Data do Pagamento
                            </TableHead>
                            <TableHead className="hidden lg:table-cell text-xs sm:text-sm">
                              Motivo da Rejeição
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedPayments.map((payment) => (
                            <TableRow key={payment.id}>
                              <TableCell>
                                <Badge
                                  className={getStatusColor(payment.status)}
                                >
                                  {getConvertStatusPayment(payment.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {formatCurrency(payment.value)}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setSelectedImage(payment.image);
                                          handleImageStart(payment.id);
                                        }}
                                      >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Visualizar
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-2xl">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Comprovante de Pagamento
                                        </DialogTitle>
                                        <DialogDescription>
                                          Comprovante do pagamento{" "}
                                          {payment.id.slice(0, 8)}...
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="flex justify-center">
                                        {imageLoading[payment.id] && (
                                          <div className="flex items-center justify-center h-96 w-full">
                                            <Loader2 className="h-8 w-8 animate-spin" />
                                          </div>
                                        )}
                                        <img
                                          src={payment.image}
                                          alt={`Comprovante do pagamento ${payment.id}`}
                                          className={`max-h-96 rounded-lg ${imageLoading[payment.id] ? "hidden" : "block"}`}
                                          onLoad={() =>
                                            handleImageLoad(payment.id)
                                          }
                                          onError={() =>
                                            handleImageError(payment.id)
                                          }
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2">
                                        <Button
                                          onClick={() =>
                                            handleDownloadImage(
                                              payment.image,
                                              payment.id
                                            )
                                          }
                                          disabled={downloadLoading[payment.id]}
                                          className="text-white"
                                        >
                                          {downloadLoading[payment.id] ? (
                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                          ) : (
                                            <Download className="h-4 w-4 mr-1" />
                                          )}
                                          Download
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDateTime(payment.createdAt)}
                              </TableCell>
                              <TableCell>
                                <div className="max-w-sm">
                                  {renderRejectionReason(
                                    payment.rejectionReason
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 dark:text-white">
                    <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4 dark:text-white" />
                    <p className="text-muted-foreground mb-4 dark:text-white">
                      Nenhum pagamento encontrado
                    </p>
                    <Button
                      onClick={handleRegisterPayment}
                      className="dark:text-white"
                      disabled={data.status === "UNDER_REVIEW"}
                    >
                      <Plus className="h-4 w-4 mr-2 dark:text-white" />
                      Registrar Primeiro Pagamento
                    </Button>
                  </div>
                )}

                {/* Paginação para pagamentos */}
                {totalPaymentPages > 1 && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                    <div className="text-sm text-muted-foreground text-center sm:text-left">
                      Mostrando {paginatedPayments.length} de{" "}
                      {data.payments?.length || 0} pagamentos
                    </div>

                    <div className="flex justify-center">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => goToPreviousPaymentPage()}
                              href="#"
                              className={
                                currentPaymentPage === 1
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                          {Array.from(
                            { length: totalPaymentPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPaymentPage === page}
                                href="#"
                                onClick={() => goToPaymentPage(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => goToNextPaymentPage()}
                              href="#"
                              className={
                                currentPaymentPage === totalPaymentPages
                                  ? "pointer-events-none opacity-50"
                                  : ""
                              }
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>

                    <div className="text-sm text-muted-foreground text-center sm:text-right">
                      Página {currentPaymentPage} de {totalPaymentPages}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <RegisterPaymentDialog
        open={registerPaymentOpen}
        onOpenChange={setRegisterPaymentOpen}
        inscriptionId={data.id}
        totalValue={data.totalValue}
      />

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Excluir Inscrição"
        message="Tem certeza que deseja excluir esta inscrição? Esta ação não pode ser desfeita e todos os dados associados serão permanentemente removidos."
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={isDeleting}
      />

      {/* Dialog de Edição de Participante */}
      <Dialog
        open={isEditParticipantDialogOpen}
        onOpenChange={setIsEditParticipantDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Participante</DialogTitle>
            <DialogDescription>
              Atualize as informações do participante.
            </DialogDescription>
          </DialogHeader>

          <Form {...participantForm}>
            <form
              onSubmit={handleParticipantUpdateSubmit}
              className="space-y-4"
            >
              <FormField
                control={participantForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={participantForm.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={
                          field.value ? formatDateForInput(field.value) : ""
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={participantForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gênero</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o gênero" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MASCULINO">Masculino</SelectItem>
                        <SelectItem value="FEMININO">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={participantForm.control}
                name="typeInscriptionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Inscrição</FormLabel>
                    <FormControl>
                      {resolvedEventId ? (
                        <ComboboxTypeInscription
                          eventId={resolvedEventId}
                          value={field.value}
                          onChange={field.onChange}
                          options={typeInscriptionOptions}
                          loading={isLoadingTypeInscriptions}
                        />
                      ) : (
                        <Input
                          placeholder="Carregando tipos de inscrição..."
                          disabled
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditParticipantDialogOpen(false);
                    setSelectedParticipant(null);
                  }}
                  disabled={isUpdatingParticipant}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="text-white"
                  disabled={isUpdatingParticipant}
                >
                  {isUpdatingParticipant ? (
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

      {/* Dialog de Confirmação de Exclusão de Participante */}
      <ConfirmationDialog
        open={isDeleteParticipantDialogOpen}
        onOpenChange={setIsDeleteParticipantDialogOpen}
        onConfirm={handleParticipantDelete}
        title="Excluir Participante"
        message={`Tem certeza que deseja excluir o participante "${selectedParticipant?.name}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={isDeletingParticipant}
      />
    </>
  );
}
