"use client";

import { useDownloadParticipantsPdf } from "@/features/participants/hooks/useDownloadParticipantsPdf";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { cn } from "@/shared/lib/utils";
import { Download, User, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Accounts } from "../types/participantsTypes";

interface ParticipantsTableProps {
  eventId: string;
  accounts: Accounts;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
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

export default function ParticipantsTable({
  eventId,
  accounts,
  page,
  pageCount,
  onPageChange,
}: ParticipantsTableProps) {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);

  const {
    generateSelectedPdf,
    generateAllPdf,
    isGenerating: isGeneratingPdf,
    isGeneratingAll,
  } = useDownloadParticipantsPdf(eventId, {
    onSuccess: () => setSelectedAccountIds([]),
  });

  const availableAccountIds = useMemo(
    () => accounts.map((account) => account.id),
    [accounts]
  );

  useEffect(() => {
    setSelectedAccountIds((prev) =>
      prev.filter((id) => availableAccountIds.includes(id))
    );
  }, [availableAccountIds]);

  const totalSelected = selectedAccountIds.length;
  const hasSelection = totalSelected > 0;
  const isEverythingSelected =
    availableAccountIds.length > 0 &&
    totalSelected === availableAccountIds.length;

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleToggleAll = () => {
    setSelectedAccountIds((prev) =>
      isEverythingSelected ? [] : availableAccountIds
    );
  };

  const handleClearSelection = () => {
    setSelectedAccountIds([]);
  };

  const handleGeneratePdf = () => {
    generateSelectedPdf(selectedAccountIds);
  };

  const handleGenerateAll = () => {
    generateAllPdf();
  };

  const handleDownloadAccount = (accountId: string) => {
    generateSelectedPdf([accountId]);
  };

  if (accounts.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="border-0 shadow-lg w-full max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
              Nenhum participante encontrado
            </h3>
            <p className="text-muted-foreground">
              Não há participantes cadastrados para este evento.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Barra de ações de seleção */}
      {accounts.length > 0 && (
        <div className="rounded-2xl border border-border bg-white/80 p-6 mb-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Baixar seleção
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Gera o PDF apenas das contas marcadas na lista atual.
              </p>
              <Button
                type="button"
                size="sm"
                onClick={handleGeneratePdf}
                disabled={!hasSelection || isGeneratingPdf || isGeneratingAll}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:bg-primary/40"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPdf ? "Gerando..." : "Baixar PDF"}
              </Button>
            </div>
            <div className="rounded-2xl border border-muted-foreground/40 bg-white/90 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Baixar todas
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Gera o relatório completo com todos os participantes do evento.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateAll}
                disabled={isGeneratingPdf || isGeneratingAll}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border"
              >
                <Download className="h-4 w-4" />
                {isGeneratingAll ? "Gerando..." : "Baixar todas as contas"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {accounts.map((account) => {
          const isAccountSelected = selectedAccountIds.includes(account.id);

          return (
            <Card
              key={account.id}
              className={cn(
                "border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all",
                isAccountSelected && "ring-2 ring-primary/50"
              )}
            >
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 cursor-pointer accent-primary"
                      checked={isAccountSelected}
                      onChange={() => toggleAccount(account.id)}
                      aria-label={`Selecionar conta ${account.username}`}
                    />
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {account.username}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {account.countParticipants}{" "}
                        {account.countParticipants === 1
                          ? "participante"
                          : "participantes"}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    disabled={isGeneratingPdf || isGeneratingAll}
                    onClick={() => handleDownloadAccount(account.id)}
                    className="flex items-center gap-2 text-xs uppercase"
                  >
                    <Download className="h-3 w-3" />
                    Baixar PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {account.participants.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
                      Nenhum participante
                    </h3>
                    <p className="text-muted-foreground">
                      Este usuário não possui participantes cadastrados.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="max-h-96 overflow-auto">
                      <table className="min-w-full text-sm">
                        <thead className="sticky top-0 bg-white dark:bg-gray-800 z-10 text-muted-foreground border-b border-gray-200 dark:border-gray-700">
                          <tr>
                            <th className="px-6 py-4 text-left font-semibold text-base">
                              Nome
                            </th>
                            <th className="px-6 py-4 text-left font-semibold text-base">
                              Tipo de Inscrição
                            </th>
                            <th className="px-6 py-4 text-center font-semibold text-base">
                              Idade
                            </th>
                            <th className="px-6 py-4 text-center font-semibold text-base">
                              Gênero
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {account.participants.map((participant) => (
                            <tr
                              key={participant.id}
                              className="border-b border-gray-100 dark:border-gray-800 hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                                  </div>
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {participant.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  <span className="text-muted-foreground font-medium uppercase">
                                    {participant.typeInscription}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-muted-foreground font-medium uppercase">
                                  {calculateAge(participant.birthDate)} anos
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className="text-muted-foreground">
                                  {getGenderText(participant.gender)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {pageCount > 1 && (
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Página {page} de {pageCount}
            </p>
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
    </>
  );
}
