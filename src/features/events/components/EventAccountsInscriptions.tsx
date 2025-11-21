"use client";

import { getEvent } from "@/features/events/api/getEvent";
import { useEventAccountsInscriptions } from "@/features/events/hooks/useEventAccountsInscriptions";
import { useGenerateSelectedInscriptionsPdf } from "@/features/events/hooks/useGenerateSelectedInscriptionsPdf";
import { AccountWithInscriptions } from "@/features/events/types/eventTypes";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ClipboardList, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface EventAccountsInscriptionsProps {
  eventId: string;
}

export default function EventAccountsInscriptions({
  eventId,
}: EventAccountsInscriptionsProps) {
  const { data, isLoading, error } = useEventAccountsInscriptions(eventId);

  const {
    data: event,
    isLoading: loadingEvent,
    error: eventError,
  } = useQuery({
    queryKey: ["event-basic", eventId],
    queryFn: () => getEvent(eventId),
    enabled: Boolean(eventId),
    staleTime: 5 * 60 * 1000,
  });

  const accounts = data?.accounts ?? [];
  const [selectedInscriptionIds, setSelectedInscriptionIds] = useState<
    string[]
  >([]);

  const { generatePdf, isGenerating: isGeneratingPdf } =
    useGenerateSelectedInscriptionsPdf(eventId, {
      onSuccess: () => setSelectedInscriptionIds([]),
    });

  const availableInscriptionIds = useMemo(
    () =>
      accounts.flatMap(
        (account) =>
          account.inscriptions?.map((inscription) => inscription.id) ?? []
      ),
    [accounts]
  );

  useEffect(() => {
    setSelectedInscriptionIds((prev) => {
      const filtered = prev.filter((id) =>
        availableInscriptionIds.includes(id)
      );

      if (filtered.length === prev.length) {
        return prev;
      }

      return filtered;
    });
  }, [availableInscriptionIds]);

  const totalSelected = selectedInscriptionIds.length;
  const hasSelection = totalSelected > 0;
  const isEverythingSelected =
    availableInscriptionIds.length > 0 &&
    totalSelected === availableInscriptionIds.length;

  const totalAccounts = accounts.length;
  const totalInscriptions = accounts.reduce(
    (acc, account) => acc + (account.countInscriptons ?? 0),
    0
  );
  const totalParticipants = accounts.reduce((acc, account) => {
    const participantsInAccount = account.inscriptions?.reduce(
      (sum, inscription) => sum + (inscription.countParticipants ?? 0),
      0
    );
    return acc + (participantsInAccount ?? 0);
  }, 0);

  const toggleInscriptionSelection = (inscriptionId: string) => {
    setSelectedInscriptionIds((prev) =>
      prev.includes(inscriptionId)
        ? prev.filter((id) => id !== inscriptionId)
        : [...prev, inscriptionId]
    );
  };

  const toggleAccountSelection = (accountInscriptionIds: string[]) => {
    if (!accountInscriptionIds.length) return;

    setSelectedInscriptionIds((prev) => {
      const shouldUnselect = accountInscriptionIds.every((id) =>
        prev.includes(id)
      );

      if (shouldUnselect) {
        return prev.filter((id) => !accountInscriptionIds.includes(id));
      }

      const next = [...prev];
      accountInscriptionIds.forEach((id) => {
        if (!next.includes(id)) {
          next.push(id);
        }
      });
      return next;
    });
  };

  const handleToggleAll = () => {
    setSelectedInscriptionIds((prev) =>
      isEverythingSelected ? [] : availableInscriptionIds
    );
  };

  const handleClearSelection = () => {
    setSelectedInscriptionIds([]);
  };

  const handleGeneratePdf = () => {
    generatePdf(selectedInscriptionIds);
  };

  const formatDate = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const renderAccountRow = (account: AccountWithInscriptions) => {
    const inscriptions = account.inscriptions ?? [];
    const participantsTotal = inscriptions.reduce(
      (sum, inscription) => sum + (inscription.countParticipants ?? 0),
      0
    );
    const accountInscriptionIds = inscriptions.map(
      (inscription) => inscription.id
    );
    const accountSelectedCount = accountInscriptionIds.filter((id) =>
      selectedInscriptionIds.includes(id)
    ).length;
    const isAccountFullySelected =
      accountInscriptionIds.length > 0 &&
      accountSelectedCount === accountInscriptionIds.length;

    return (
      <div
        key={account.id}
        className="rounded-2xl border border-border bg-card/50 shadow-sm transition hover:shadow-md"
      >
        <div className="flex flex-col gap-3 border-b border-border/60 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">
                {account.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {account.countInscriptons}{" "}
                {account.countInscriptons === 1 ? "inscrição" : "inscrições"}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:items-end">
              {accountInscriptionIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={isAccountFullySelected ? "default" : "outline"}
                    onClick={() =>
                      toggleAccountSelection(accountInscriptionIds)
                    }
                  >
                    {isAccountFullySelected
                      ? "Desmarcar conta"
                      : accountSelectedCount > 0
                        ? "Marcar restantes"
                        : "Selecionar conta"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          {inscriptions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-center">Participantes</TableHead>
                  <TableHead className="text-right">Criada em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inscriptions.map((inscription) => (
                  <TableRow
                    key={inscription.id}
                    className={cn(
                      "transition-colors",
                      selectedInscriptionIds.includes(inscription.id)
                        ? "bg-primary/5"
                        : undefined
                    )}
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 cursor-pointer accent-primary"
                        checked={selectedInscriptionIds.includes(
                          inscription.id
                        )}
                        onChange={() =>
                          toggleInscriptionSelection(inscription.id)
                        }
                        aria-label={`Selecionar inscrição ${inscription.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {inscription.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {inscription.countParticipants}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDate(inscription.createAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/40 px-4 py-6 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Nenhuma inscrição encontrada para esta conta.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl uppercase">
          {loadingEvent
            ? "Carregando evento..."
            : (event?.name ?? "Evento não encontrado")}
        </h1>
        <p className="text-muted-foreground">
          Selecione as contas e Inscrições para gerar o PDF
        </p>
        {(eventError as Error | undefined)?.message && (
          <p className="text-sm text-destructive">
            Não foi possível carregar os dados do evento.
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              Contas
            </CardTitle>
            <CardDescription>Total de contas com inscrições</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalAccounts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="h-4 w-4 text-primary" />
              Inscrições
            </CardTitle>
            <CardDescription>Total de inscrições registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalInscriptions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-primary" />
              Participantes
            </CardTitle>
            <CardDescription>Total de participantes vinculados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{totalParticipants}</p>
          </CardContent>
        </Card>
      </div>

      {!isLoading && !error && accounts.length > 0 && (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Selecione as inscrições para gerar o PDF
              </p>
              <p className="text-xs text-muted-foreground">
                {hasSelection
                  ? `${totalSelected} inscrição${
                      totalSelected === 1 ? "" : "s"
                    } selecionada${totalSelected === 1 ? "" : "s"}`
                  : "Nenhuma inscrição selecionada."}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleGeneratePdf}
              disabled={!hasSelection || isGeneratingPdf}
            >
              {isGeneratingPdf ? "Gerando PDF..." : "Gerar PDF"}
            </Button>
          </div>
        </div>
      )}

      {!isLoading && !error && accounts.length > 0 && (
        <div className="flex flex-wrap items-center justify-end gap-2 rounded-2xl">
          {hasSelection && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar seleção
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggleAll}
            disabled={!availableInscriptionIds.length || isEverythingSelected}
          >
            Selecionar todas
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card/50 p-4 shadow-sm"
            >
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-destructive/40 bg-destructive/5 p-10 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div>
            <p className="text-lg font-semibold text-destructive">
              Não foi possível carregar as inscrições.
            </p>
            <p className="text-sm text-muted-foreground">
              {(error as Error).message || "Tente novamente mais tarde."}
            </p>
          </div>
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-muted/40 p-10 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold text-foreground">
              Nenhuma inscrição encontrada
            </p>
            <p className="text-sm text-muted-foreground">
              As contas deste evento ainda não possuem inscrições.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => renderAccountRow(account))}
        </div>
      )}
    </div>
  );
}
