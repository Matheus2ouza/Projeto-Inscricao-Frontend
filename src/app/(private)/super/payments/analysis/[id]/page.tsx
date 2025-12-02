"use client";

import { ComboboxAccount } from "@/features/accounts/components/ComboboxAccount";
import PaymentsAnalysisTable from "@/features/analysis/payment/components/PaymentsAnalysisTable";
import { useAnalysisPaymentsQuery } from "@/features/analysis/payment/hooks/useAnalysisInscriptionsQuery";
import { useEvent } from "@/features/events/hooks/useEvent";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { CreditCard, Filter } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function EventInscriptionsAnalysisSuperPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [appliedStatuses, setAppliedStatuses] = useState<string[] | undefined>(
    undefined
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [appliedAccountId, setAppliedAccountId] = useState<string | undefined>(
    undefined
  );

  const statusOptions = useMemo(
    () => [
      { value: "APPROVED", label: "Aprovados" },
      { value: "UNDER_REVIEW", label: "Em análise" },
      { value: "REFUSED", label: "Recusados" },
    ],
    []
  );

  const { event, loading: eventLoading, error: eventError } = useEvent(eventId);
  const {
    data: analysisData,
    isLoading: analysisLoading,
    error: analysisError,
  } = useAnalysisPaymentsQuery(
    eventId,
    page,
    pageSize,
    appliedStatuses,
    appliedAccountId
  );

  const loading = eventLoading || analysisLoading;
  const error = eventError
    ? new Error(eventError)
    : analysisError instanceof Error
      ? analysisError
      : null;

  if (loading) {
    return (
      <PageContainer
        title="Análise de Pagamentos"
        description="Visualize as inscrições por Conta"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Análise de Pagamentos"
        description="Visualize as inscrições por Conta"
      >
        <div className="flex items-center justify-center min-h-96">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Erro ao carregar pagamentos
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error instanceof Error ? error.message : "Erro desconhecido"}
              </p>
              <Button asChild className="w-full">
                <Link href="/super/payments/analysis">Voltar para Análise</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  const handleViewPayment = (inscriptionId: string, eventStatus: string) => {
    const queryParams = new URLSearchParams({
      eventId,
      eventStatus,
    });
    router.push(
      `/super/payments/payment/${inscriptionId}?${queryParams.toString()}`
    );
  };

  const handleApplyFilters = () => {
    setAppliedStatuses(
      selectedStatuses.length > 0 ? selectedStatuses : undefined
    );
    setAppliedAccountId(selectedAccountId || undefined);
    setPage(1);
  };

  const hasFilters = selectedStatuses.length > 0;

  return (
    <PageContainer
      title="Análise de Pagamentos"
      description="Visualize as inscrições por Conta"
    >
      <div className="mb-4 grid items-center gap-4 md:grid-cols-[1fr_1fr_auto_auto]">
        <div>
          <ComboboxAccount
            value={selectedAccountId ? [selectedAccountId] : []}
            onChange={(items) =>
              setSelectedAccountId(items[items.length - 1] ?? "")
            }
            showRole={false}
            roles={["USER"]}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full max-w-[260px] justify-between"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status
              </span>
              <span className="text-xs text-muted-foreground">
                {hasFilters
                  ? `${selectedStatuses.length} selecionado(s)`
                  : "Todos"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[var(--radix-popover-trigger-width)] min-w-[260px]"
          >
            <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
              Filtrar por status
            </div>
            <DropdownMenuSeparator />
            {statusOptions.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={selectedStatuses.includes(status.value)}
                onCheckedChange={(checked) => {
                  setSelectedStatuses((prev) => {
                    if (checked) {
                      return [...prev, status.value];
                    }
                    return prev.filter((value) => value !== status.value);
                  });
                }}
              >
                {status.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            setPageSize(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Itens por página" />
          </SelectTrigger>
          <SelectContent>
            {[10, 15, 25].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} por página
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleApplyFilters}>Aplicar filtros</Button>
      </div>
      <PaymentsAnalysisTable
        eventId={eventId}
        event={event}
        analysisData={analysisData || null}
        loading={loading}
        error={error}
        page={page}
        pageCount={analysisData?.pageCount ?? 1}
        onPageChange={setPage}
        onViewPayment={handleViewPayment}
      />
    </PageContainer>
  );
}
