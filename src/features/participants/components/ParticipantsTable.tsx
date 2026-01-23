"use client";

import { useDownloadEtiqueta } from "@/features/participants/hooks/useDownloadEtiqueta";
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
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/lib/utils";
import { Download, User, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Account } from "../../events/types/checkout/checkoutTypes";

interface ParticipantsTableProps {
  eventId: string;
  accounts: Account[];
  countAccounts: number;
  countParticipants: number;
  countParticipantsMale: number;
  countParticipantsFemale: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

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

export default function ParticipantsTable({
  eventId,
  accounts,
  countAccounts,
  countParticipants,
  countParticipantsMale,
  countParticipantsFemale,
  page,
  pageCount,
  onPageChange,
}: ParticipantsTableProps) {
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  const { generateSelectedPdf, generateAllPdf, isGenerating, isGeneratingAll } =
    useDownloadParticipantsPdf(eventId, {
      onSuccess: () => setSelectedAccountIds([]),
    });
  const { downloadEtiqueta, downloadEtiquetas, isDownloadingEtiqueta } =
    useDownloadEtiqueta(eventId);

  const availableAccountIds = useMemo(
    () => accounts.map((account) => account.id),
    [accounts],
  );

  useEffect(() => {
    setSelectedAccountIds((prev) =>
      prev.filter((id) => availableAccountIds.includes(id)),
    );
  }, [availableAccountIds]);

  const totalSelected = selectedAccountIds.length;
  const hasSelection = totalSelected > 0;

  const toggleAccount = (accountId: string) => {
    setSelectedAccountIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId],
    );
  };

  const handleGenderToggle = (gender: string, enabled: boolean) => {
    setSelectedGenders((prev) =>
      enabled ? [...prev, gender] : prev.filter((item) => item !== gender),
    );
  };

  const handleGeneratePdf = () => {
    generateSelectedPdf(selectedAccountIds, selectedGenders);
  };

  const handleGenerateAll = () => {
    generateAllPdf(selectedGenders);
  };

  const handleDownloadAccount = (accountId: string) => {
    generateSelectedPdf([accountId], selectedGenders);
  };

  const handleDownloadEtiqueta = (accountId: string) => {
    downloadEtiqueta(accountId);
  };

  const handleDownloadEtiquetasSelecionadas = async () => {
    const success = await downloadEtiquetas(selectedAccountIds);
    if (success) {
      setSelectedAccountIds([]);
    }
  };

  if (!accounts.length) {
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
      {/* Seção de Dados Principais - 4 cards no topo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total de Contas */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">
                  Contas
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {countAccounts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Contas de usuários com inscrições
            </p>
          </CardContent>
        </Card>

        {/* Total de Participantes */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/20 dark:to-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
                  Participantes
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {countParticipants}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Total de pessoas inscritas
            </p>
          </CardContent>
        </Card>

        {/* Participantes Masculinos */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400">
                  Masculino
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {countParticipantsMale}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {countParticipants > 0 ? (
                <span>
                  {((countParticipantsMale / countParticipants) * 100).toFixed(
                    1,
                  )}
                  % do total
                </span>
              ) : (
                <span>0% do total</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Participantes Femininos */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-pink-50 to-white dark:from-pink-900/20 dark:to-gray-800">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-pink-600 dark:text-pink-400">
                  Feminino
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {countParticipantsFemale}
                </p>
              </div>
              <div className="w-12 h-12 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {countParticipants > 0 ? (
                <span>
                  {(
                    (countParticipantsFemale / countParticipants) *
                    100
                  ).toFixed(1)}
                  % do total
                </span>
              ) : (
                <span>0% do total</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de Gênero para PDFs */}
      <div className="rounded-2xl border border-border bg-white/80 p-6 mb-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Filtros para PDFs
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <Switch
                  checked={selectedGenders.includes("MASCULINO")}
                  onCheckedChange={(checked) =>
                    handleGenderToggle("MASCULINO", Boolean(checked))
                  }
                />
                <span className="text-sm font-medium text-gray-700">
                  Masculino
                </span>
              </label>
              <label className="flex items-center gap-2">
                <Switch
                  checked={selectedGenders.includes("FEMININO")}
                  onCheckedChange={(checked) =>
                    handleGenderToggle("FEMININO", Boolean(checked))
                  }
                />
                <span className="text-sm font-medium text-gray-700">
                  Feminino
                </span>
              </label>
            </div>
            <div className="text-sm text-muted-foreground">
              {selectedGenders.length === 0 && "Nenhum filtro (inclui todos)"}
              {selectedGenders.length === 1 &&
                `Filtrando: ${selectedGenders[0] === "MASCULINO" ? "Masculino" : "Feminino"}`}
              {selectedGenders.length === 2 &&
                "Filtrando: Masculino e Feminino"}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Os filtros acima se aplicam tanto ao "Baixar seleção" quanto ao
            "Baixar todas"
          </p>
        </div>

        {/* Botões de Download */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Baixar seleção
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Gera o PDF apenas das contas marcadas na lista atual.
            </p>
            <div className="space-y-3">
              <Button
                type="button"
                size="sm"
                onClick={handleGeneratePdf}
                disabled={!hasSelection || isGenerating || isGeneratingAll}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:bg-primary/40"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? "Baixando..." : "Baixar PDF dos selecionados"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadEtiquetasSelecionadas}
                disabled={
                  !hasSelection ||
                  isGenerating ||
                  isGeneratingAll ||
                  isDownloadingEtiqueta
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/60 text-xs uppercase tracking-wide"
              >
                <Download className="h-4 w-4" />
                Gerar etiquetas selecionadas
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-muted-foreground/40 bg-white/90 p-4">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Baixar todas
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Gera o relatório completo com todos os participantes do evento.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateAll}
              disabled={isGenerating || isGeneratingAll}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border"
            >
              <Download className="h-4 w-4" />
              {isGeneratingAll ? "Baixando..." : "Baixar Lista completa"}
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Contas */}
      <div className="space-y-6">
        {accounts.map((account) => {
          const isAccountSelected = selectedAccountIds.includes(account.id);

          return (
            <Card
              key={account.id}
              className={cn(
                "border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 transition-all",
                isAccountSelected && "ring-2 ring-primary/50",
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
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={
                        isGenerating || isGeneratingAll || isDownloadingEtiqueta
                      }
                      onClick={() => handleDownloadAccount(account.id)}
                      className="flex items-center gap-2 text-xs uppercase"
                    >
                      <Download className="h-3 w-3" />
                      Baixar Lista
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={
                        isGenerating || isGeneratingAll || isDownloadingEtiqueta
                      }
                      onClick={() => handleDownloadEtiqueta(account.id)}
                      className="flex items-center gap-2 text-xs uppercase"
                    >
                      <Download className="h-3 w-3" />
                      Download etiqueta
                    </Button>
                  </div>
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
                                  {participant.gender}
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

                {Array.from({ length: pageCount }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={page === index + 1}
                      href="#"
                      onClick={() => onPageChange(index + 1)}
                    >
                      {index + 1}
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
