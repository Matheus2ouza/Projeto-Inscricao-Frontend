"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getConvertStatusInscription } from "@/shared/utils/getConvertStatus";
import { getStatusColor } from "@/shared/utils/getStatusColor";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  Menu,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { InscriptionAnalysisResponse } from "../../types/analysis/analysisTypes";

interface InscriptionsAnalysisTableProps {
  analysisData: InscriptionAnalysisResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageCount: number;
  total: number;
  onPageChange: (page: number) => void;
  onViewInscription: (inscriptionId: string) => void;
  listPath: string;
}

export default function InscriptionsAnalysisTable({
  analysisData,
  loading,
  error,
  page,
  pageCount,
  total,
  onPageChange,
  onViewInscription,
  listPath,
}: InscriptionsAnalysisTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<{
    field: string;
    direction: "asc" | "desc" | "default";
  }>({ field: "", direction: "default" });
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set()
  );

  const handleInscriptionClick = (inscriptionId: string) => {
    onViewInscription(inscriptionId);
  };

  // Alternar expansão de uma conta
  const toggleAccountExpansion = (accountId: string) => {
    setExpandedAccounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  };

  // Filtro local por nome do responsável ou telefone
  const filteredAccounts =
    analysisData?.account?.filter((account) => {
      if (!searchTerm) return true;

      // Verifica se alguma inscrição da conta tem o nome do responsável ou telefone que corresponde à busca
      return account.inscriptions.some(
        (inscription) =>
          inscription.responsible
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          inscription.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  // Função para ordenar as contas e suas inscrições
  const sortAccounts = (accounts: typeof filteredAccounts) => {
    if (sortBy.direction === "default") return accounts;

    return [...accounts].map((account) => {
      if (sortBy.field === "responsible") {
        const sortedInscriptions = [...account.inscriptions].sort((a, b) => {
          const aName = a.responsible.toLowerCase();
          const bName = b.responsible.toLowerCase();

          if (sortBy.direction === "asc") {
            return aName.localeCompare(bName);
          } else {
            return bName.localeCompare(aName);
          }
        });

        return {
          ...account,
          inscriptions: sortedInscriptions,
        };
      }

      if (sortBy.field === "status") {
        const statusOrder = {
          under_review: 1,
          paid: 2,
          pending: 3,
          cancelled: 4,
        };

        const sortedInscriptions = [...account.inscriptions].sort((a, b) => {
          const aOrder =
            statusOrder[a.status.toLowerCase() as keyof typeof statusOrder] ||
            999;
          const bOrder =
            statusOrder[b.status.toLowerCase() as keyof typeof statusOrder] ||
            999;

          if (sortBy.direction === "asc") {
            return aOrder - bOrder;
          } else {
            return bOrder - aOrder;
          }
        });

        return {
          ...account,
          inscriptions: sortedInscriptions,
        };
      }

      if (sortBy.field === "value") {
        const sortedInscriptions = [...account.inscriptions].sort((a, b) => {
          if (sortBy.direction === "asc") {
            return a.totalValue - b.totalValue;
          } else {
            return b.totalValue - a.totalValue;
          }
        });

        return {
          ...account,
          inscriptions: sortedInscriptions,
        };
      }

      return account;
    });
  };

  const sortedAccounts = sortAccounts(filteredAccounts);

  // Contar total de inscrições filtradas
  const totalFilteredInscriptions = sortedAccounts.reduce(
    (total, account) => total + account.inscriptions.length,
    0
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Erro ao carregar inscrições
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button asChild className="w-full">
              <Link href={listPath}>Voltar para Análise</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Cards de Informações */}
        {analysisData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Contas
                    </p>
                    <p className="text-xl font-bold">
                      {analysisData.account.length}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <FileText className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total de Inscrições
                    </p>
                    <p className="text-xl font-bold">
                      {analysisData.account.reduce(
                        (total, account) => total + account.inscriptions.length,
                        0
                      )}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Users className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Saldo Devedor Total
                    </p>
                    <p className="text-xl font-bold">
                      R${" "}
                      {analysisData.account
                        .reduce(
                          (total, account) =>
                            total +
                            account.inscriptions.reduce(
                              (acc, inscription) =>
                                acc + inscription.totalValue,
                              0
                            ),
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <Calendar className="h-4 w-4 text-white dark:text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Informações da Tabela */}
        {analysisData && sortedAccounts.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <span>
                {totalFilteredInscriptions} inscrição(ões) de{" "}
                {sortedAccounts.length} conta(s)
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                Em análise:{" "}
                {sortedAccounts.reduce(
                  (total, account) =>
                    total +
                    account.inscriptions.filter(
                      (i) => i.status.toLowerCase() === "under_review"
                    ).length,
                  0
                )}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>
                Pendentes:{" "}
                {sortedAccounts.reduce(
                  (total, account) =>
                    total +
                    account.inscriptions.filter(
                      (i) => i.status.toLowerCase() === "pending"
                    ).length,
                  0
                )}
              </span>
            </div>
          </div>
        )}

        {/* Cards de Contas */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="">
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : analysisData && sortedAccounts.length > 0 ? (
          <div className="space-y-4">
            {sortedAccounts.map((account) => {
              const isExpanded = expandedAccounts.has(account.id);
              const totalDebt = account.inscriptions.reduce(
                (total, inscription) => total + inscription.totalValue,
                0
              );

              return (
                <Card
                  key={account.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="">
                    {/* Header do Card */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-white dark:text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-2xl">
                          {account.username.toUpperCase()}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {account.inscriptions.length} inscrição(ões)
                        </p>
                      </div>
                    </div>

                    {/* Informações Gerais */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Total de Inscrições
                        </p>
                        <p className="text-lg font-bold">
                          {account.inscriptions.length}
                        </p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Pagas
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          {
                            account.inscriptions.filter(
                              (i) => i.status.toLowerCase() === "paid"
                            ).length
                          }
                        </p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Pendentes
                        </p>
                        <p className="text-lg font-bold text-yellow-600">
                          {
                            account.inscriptions.filter(
                              (i) => i.status.toLowerCase() === "pending"
                            ).length
                          }
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Em Análise
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {
                            account.inscriptions.filter(
                              (i) => i.status.toLowerCase() === "under_review"
                            ).length
                          }
                        </p>
                      </div>
                    </div>

                    {/* Saldo Devedor Total */}
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          Saldo Devedor Total:
                        </span>
                        <span className="font-bold text-xl text-red-600">
                          R$ {totalDebt.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Botão de Expandir */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => toggleAccountExpansion(account.id)}
                        className="flex items-center gap-2"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronDown className="h-4 w-4" />
                            Ocultar
                          </>
                        ) : (
                          <>
                            <ChevronRight className="h-4 w-4" />
                            Ver Inscrições
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Lista de Inscrições (Expandida) */}
                    {isExpanded && (
                      <div className="mt-4">
                        <div className="pt-4">
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="text-muted-foreground">
                                <tr>
                                  <th className="py-2 text-left font-semibold text-base">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (sortBy.field === "responsible") {
                                          if (sortBy.direction === "default") {
                                            setSortBy({
                                              field: "responsible",
                                              direction: "asc",
                                            });
                                          } else if (
                                            sortBy.direction === "asc"
                                          ) {
                                            setSortBy({
                                              field: "responsible",
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
                                            field: "responsible",
                                            direction: "asc",
                                          });
                                        }
                                      }}
                                      className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1"
                                    >
                                      Responsável
                                      {sortBy.field === "responsible" ? (
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
                                  <th className="px-3 py-2 text-left font-semibold text-base">
                                    Telefone
                                  </th>
                                  <th className="px-3 py-2 text-center font-semibold text-base">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (sortBy.field === "value") {
                                          if (sortBy.direction === "default") {
                                            setSortBy({
                                              field: "value",
                                              direction: "asc",
                                            });
                                          } else if (
                                            sortBy.direction === "asc"
                                          ) {
                                            setSortBy({
                                              field: "value",
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
                                            field: "value",
                                            direction: "asc",
                                          });
                                        }
                                      }}
                                      className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1 mx-auto"
                                    >
                                      Valor
                                      {sortBy.field === "value" ? (
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
                                  <th className="px-3 py-2 text-center font-semibold text-base">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        if (sortBy.field === "status") {
                                          if (sortBy.direction === "default") {
                                            setSortBy({
                                              field: "status",
                                              direction: "asc",
                                            });
                                          } else if (
                                            sortBy.direction === "asc"
                                          ) {
                                            setSortBy({
                                              field: "status",
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
                                            field: "status",
                                            direction: "asc",
                                          });
                                        }
                                      }}
                                      className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1 mx-auto"
                                    >
                                      Status
                                      {sortBy.field === "status" ? (
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
                                {account.inscriptions.map(
                                  (inscription, index) => (
                                    <tr
                                      key={`${account.id}-${index}`}
                                      className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                                      onClick={() =>
                                        handleInscriptionClick(inscription.id)
                                      }
                                    >
                                      <td className="px-3 py-3">
                                        <span className="font-medium text-sm">
                                          {inscription.responsible}
                                        </span>
                                      </td>
                                      <td className="px-3 py-3">
                                        <span className="text-muted-foreground text-sm">
                                          {inscription.phone}
                                        </span>
                                      </td>
                                      <td className="px-3 py-3 text-center">
                                        <span className="font-semibold text-sm">
                                          R$ {inscription.totalValue.toFixed(2)}
                                        </span>
                                      </td>
                                      <td className="px-3 py-3 text-center">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                            inscription.status
                                          )}`}
                                        >
                                          {getConvertStatusInscription(
                                            inscription.status
                                          )}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Nenhuma inscrição encontrada
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Nenhuma inscrição corresponde à busca."
                : "Este evento ainda não possui inscrições."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
