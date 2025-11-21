"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@heroui/react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  CreditCard,
  DollarSign,
  Menu,
  Users,
} from "lucide-react";
import { useState } from "react";
import { PaymentAnalysisResponse } from "../types/analysisTypes";

interface PaymentsAnalysisTableProps {
  eventId: string;
  event: { id: string; name: string; status: string } | null;
  analysisData: PaymentAnalysisResponse | null;
  loading: boolean;
  error: string | Error | null;
  onViewPayment: (inscriptionId: string, eventStatus: string) => void;
}

export default function PaymentsAnalysisTable({
  eventId,
  event,
  analysisData,
  loading,
  error,
  onViewPayment,
}: PaymentsAnalysisTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<{
    field: string;
    direction: "asc" | "desc" | "default";
  }>({ field: "", direction: "default" });
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(
    new Set()
  );

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

  // Filtro local por nome do responsável
  const filteredAccounts =
    analysisData?.account?.filter((account) => {
      if (!searchTerm) return true;

      // Verifica se alguma inscrição da conta tem o nome do responsável que corresponde à busca
      return account.inscriptions.some((inscription) =>
        inscription.responsible.toLowerCase().includes(searchTerm.toLowerCase())
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

      if (sortBy.field === "countPayments") {
        const sortedInscriptions = [...account.inscriptions].sort((a, b) => {
          if (sortBy.direction === "asc") {
            return a.countPayments - b.countPayments;
          } else {
            return b.countPayments - a.countPayments;
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

  // Contar total de pagamentos
  const totalPayments = sortedAccounts.reduce(
    (total, account) =>
      total +
      account.inscriptions.reduce(
        (acc, inscription) => acc + inscription.countPayments,
        0
      ),
    0
  );

  return (
    <>
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
                    Total de Pagamentos
                  </p>
                  <p className="text-xl font-bold">{totalPayments}</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <CreditCard className="h-4 w-4 text-white dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Valor Total
                  </p>
                  <p className="text-xl font-bold">
                    R${" "}
                    {analysisData.account
                      .reduce(
                        (total, account) =>
                          total +
                          account.inscriptions.reduce(
                            (acc, inscription) => acc + inscription.totalValue,
                            0
                          ),
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <DollarSign className="h-4 w-4 text-white dark:text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
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
            const totalValue = account.inscriptions.reduce(
              (total, inscription) => total + inscription.totalValue,
              0
            );
            const totalAccountPayments = account.inscriptions.reduce(
              (total, inscription) => total + inscription.countPayments,
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
                        Total de Pagamentos
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {totalAccountPayments}
                      </p>
                    </div>
                  </div>

                  {/* Valor Total */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        Valor Total:
                      </span>
                      <span className="font-bold text-xl text-purple-600">
                        R$ {totalValue.toFixed(2)}
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
                          Ver Pagamentos
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Lista de Pagamentos (Expandida) */}
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
                                        } else if (sortBy.direction === "asc") {
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
                                <th className="px-3 py-2 text-center font-semibold text-base">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (sortBy.field === "countPayments") {
                                        if (sortBy.direction === "default") {
                                          setSortBy({
                                            field: "countPayments",
                                            direction: "asc",
                                          });
                                        } else if (sortBy.direction === "asc") {
                                          setSortBy({
                                            field: "countPayments",
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
                                          field: "countPayments",
                                          direction: "asc",
                                        });
                                      }
                                    }}
                                    className="h-auto p-0 font-semibold text-base hover:bg-transparent flex items-center gap-1 mx-auto"
                                  >
                                    Qtd. Pagamentos
                                    {sortBy.field === "countPayments" ? (
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
                                      if (sortBy.field === "value") {
                                        if (sortBy.direction === "default") {
                                          setSortBy({
                                            field: "value",
                                            direction: "asc",
                                          });
                                        } else if (sortBy.direction === "asc") {
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
                                    Valor Total
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
                              </tr>
                            </thead>
                            <tbody>
                              {account.inscriptions.map(
                                (inscription, index) => (
                                    <tr
                                      key={`${account.id}-${index}`}
                                      className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                                      onClick={() => {
                                        const eventStatus =
                                          event?.status || "OPEN";
                                        onViewPayment(inscription.id, eventStatus);
                                      }}
                                    >
                                    <td className="px-3 py-3">
                                      <span className="font-medium text-sm">
                                        {inscription.responsible}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                      <span className="font-semibold text-sm text-green-600">
                                        {inscription.countPayments}
                                      </span>
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                      <span className="font-semibold text-sm">
                                        R$ {inscription.totalValue.toFixed(2)}
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
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">
            Nenhum pagamento encontrado
          </h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Nenhum pagamento corresponde à busca."
              : "Este evento ainda não possui pagamentos."}
          </p>
        </div>
      )}
    </>
  );
}
