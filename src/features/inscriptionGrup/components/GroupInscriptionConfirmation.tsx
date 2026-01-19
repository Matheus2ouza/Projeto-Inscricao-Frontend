"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Users,
} from "lucide-react";
import { GroupInscriptionConfirmationData } from "../types/inscriptionGrupTypes";

interface GroupInscriptionConfirmationProps {
  data: GroupInscriptionConfirmationData;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming: boolean;
  isCancelling?: boolean;
  timeRemaining?: number; // em minutos
}

// Sistema de cores para tipos de inscrição
const getTypeInscriptionColor = (typeDescription: string) => {
  const type = typeDescription.toLowerCase();
  const normalized = type.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (normalized.includes("normal")) {
    return {
      badge:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-300",
    };
  }

  if (normalized.includes("servico")) {
    return {
      badge:
        "bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-900/30 dark:text-purple-200 dark:border-purple-800",
      text: "text-purple-700 dark:text-purple-300",
    };
  }

  if (normalized.includes("isento")) {
    return {
      badge:
        "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-300",
    };
  }

  // Fallback para tipos desconhecidos
  return {
    badge:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
    text: "text-gray-700 dark:text-gray-300",
  };
};

// Função para agrupar participantes por tipo de inscrição
const groupParticipantsByType = (items: any[]) => {
  const grouped: { [key: string]: any[] } = {};

  items.forEach((item) => {
    if (!grouped[item.typeDescription]) {
      grouped[item.typeDescription] = [];
    }
    grouped[item.typeDescription].push(item);
  });

  return grouped;
};

export function GroupInscriptionConfirmation({
  data,
  onConfirm,
  onCancel,
  isConfirming,
  isCancelling = false,
  timeRemaining = 30,
}: GroupInscriptionConfirmationProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatGender = (gender: string) => {
    return gender === "MASCULINO" ? "Masculino" : "Feminino";
  };

  // Agrupar participantes por tipo de inscrição
  const groupedParticipants = groupParticipantsByType(data.items);

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header com informações importantes */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg text-orange-800 dark:text-orange-200">
                Confirmação Pendente
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-orange-700 dark:text-orange-300 mt-1">
                Você tem <strong>{timeRemaining} minutos</strong> para confirmar
                esta inscrição. Após esse período, ela será cancelada
                automaticamente.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Resumo da inscrição */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            Resumo da Inscrição
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Verifique os dados abaixo antes de confirmar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {data.items.length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Total Participantes
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 break-all">
                  {formatCurrency(data.total)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Valor Total
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 sm:col-span-2 lg:col-span-1">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {Object.keys(groupedParticipants).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Tipos de Inscrição
                </p>
              </div>
            </div>
          </div>

          {/* Resumo por tipo de inscrição */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Resumo por Tipo de Inscrição
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(groupedParticipants).map(
                ([type, participants]) => {
                  const typeColor = getTypeInscriptionColor(type);
                  const totalValue = participants.reduce(
                    (sum, participant) => sum + participant.value,
                    0
                  );

                  return (
                    <div
                      key={type}
                      className={cn(
                        "rounded-lg p-3 sm:p-4 border transition-colors",
                        typeColor.badge
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs font-medium", typeColor.badge)}
                        >
                          <span className="truncate max-w-[120px] sm:max-w-none">
                            {type}
                          </span>
                        </Badge>
                        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap ml-2">
                          {participants.length}{" "}
                          {participants.length === 1 ? "pessoa" : "pessoas"}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-base sm:text-lg font-bold",
                          typeColor.text
                        )}
                      >
                        {formatCurrency(totalValue)}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Lista de participantes agrupados por tipo */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Lista de Participantes
            </h3>

            {Object.entries(groupedParticipants).map(([type, participants]) => {
              const typeColor = getTypeInscriptionColor(type);

              return (
                <div key={type} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full flex-shrink-0",
                        typeColor.badge.split(" ")[0]
                      )}
                    />
                    <h4
                      className={cn(
                        "font-semibold text-base sm:text-lg",
                        typeColor.text
                      )}
                    >
                      <span className="truncate">{type}</span> (
                      {participants.length})
                    </h4>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    {participants.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors gap-3 sm:gap-4"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                              {item.name}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">
                                  {item.birthDate}
                                </span>
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3 flex-shrink-0" />
                                {formatGender(item.gender)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-2 sm:gap-0">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-medium text-xs w-fit",
                              typeColor.badge
                            )}
                          >
                            <span className="truncate max-w-[100px] sm:max-w-none">
                              {item.typeDescription}
                            </span>
                          </Badge>
                          <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(item.value)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Informações importantes */}
          <Card className="border-gray-200 bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-sm sm:text-base">
                    Informações Importantes
                  </h4>
                  <ul className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 space-y-1 sm:space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0">
                        •
                      </span>
                      <span>
                        Você pode confirmar esta inscrição posteriormente em
                        "Inscrições"
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 dark:text-gray-500 mt-1 flex-shrink-0">
                        •
                      </span>
                      <span>Verifique todos os dados antes de confirmar</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 h-12 sm:h-14 text-sm sm:text-base order-2 sm:order-1"
          disabled={isConfirming || isCancelling}
        >
          {isCancelling ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
              <span className="hidden sm:inline">Cancelando...</span>
              <span className="sm:hidden">Cancelando</span>
            </>
          ) : (
            "Cancelar"
          )}
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1 h-12 sm:h-14 text-sm sm:text-base bg-gray-900 hover:bg-gray-800 text-white order-1 sm:order-2"
          disabled={isConfirming || isCancelling}
        >
          {isConfirming ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span className="hidden sm:inline">Confirmando...</span>
              <span className="sm:hidden">Confirmando</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Confirmar Inscrições</span>
              <span className="sm:hidden">Confirmar</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
