"use client";

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
  Tag,
  User,
  VenusAndMars,
} from "lucide-react";

// Sistema de cores para tipos de inscrição (mesmo do grupo)
const getTypeInscriptionColor = (typeDescription: string) => {
  const type = typeDescription.toLowerCase();

  if (
    type.includes("normal") ||
    type.includes("padrão") ||
    type.includes("standard")
  ) {
    return {
      badge:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
      text: "text-blue-700 dark:text-blue-300",
    };
  }

  if (type.includes("estudante") || type.includes("student")) {
    return {
      badge:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
      text: "text-green-700 dark:text-green-300",
    };
  }

  if (
    type.includes("idoso") ||
    type.includes("idoso") ||
    type.includes("senior")
  ) {
    return {
      badge:
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
      text: "text-purple-700 dark:text-purple-300",
    };
  }

  if (
    type.includes("criança") ||
    type.includes("kid") ||
    type.includes("child")
  ) {
    return {
      badge:
        "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
      text: "text-pink-700 dark:text-pink-300",
    };
  }

  if (type.includes("premium") || type.includes("vip")) {
    return {
      badge:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
      text: "text-yellow-700 dark:text-yellow-300",
    };
  }

  if (
    type.includes("cortesia") ||
    type.includes("cortesia") ||
    type.includes("free")
  ) {
    return {
      badge:
        "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
      text: "text-gray-700 dark:text-gray-300",
    };
  }

  // Fallback para tipos desconhecidos
  return {
    badge:
      "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800",
    text: "text-gray-700 dark:text-gray-300",
  };
};

// Componente auxiliar para labels com ícone
function LabelWithIcon({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<any>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
      <Icon className="w-4 h-4" />
      <span className="font-medium">{text}</span>
    </div>
  );
}

interface IndividualInscriptionConfirmationProps {
  cacheKey: string;
  confirmationData: any;
  confirming: boolean;
  cancelling: boolean;
  timeRemaining: number;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export default function IndividualInscriptionConfirmation({
  cacheKey,
  confirmationData,
  confirming,
  cancelling,
  timeRemaining,
  handleConfirm,
  handleCancel,
}: IndividualInscriptionConfirmationProps) {
  // Se não há dados de confirmação, não renderizar nada (a página já trata isso)
  if (!confirmationData) {
    return null;
  }

  const { participant } = confirmationData;
  const typeColor = getTypeInscriptionColor(participant.typeDescription);

  return (
    <div className="space-y-6">
      {/* Header com timer (mesmo estilo do grupo) */}
      <Card
        className={cn(
          "border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800",
          timeRemaining <= 5 &&
            "border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800"
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div
                className={cn(
                  "w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center",
                  timeRemaining <= 5 && "bg-red-100 dark:bg-red-900/20"
                )}
              >
                <Clock
                  className={cn(
                    "h-5 w-5 text-orange-600 dark:text-orange-400",
                    timeRemaining <= 5 && "text-red-600 dark:text-red-400"
                  )}
                />
              </div>
            </div>
            <div className="flex-1">
              <CardTitle
                className={cn(
                  "text-lg text-orange-800 dark:text-orange-200",
                  timeRemaining <= 5 && "text-red-800 dark:text-red-200"
                )}
              >
                {timeRemaining <= 5
                  ? "Tempo Esgotando!"
                  : "Confirmação Pendente"}
              </CardTitle>
              <CardDescription
                className={cn(
                  "text-orange-700 dark:text-orange-300 mt-1",
                  timeRemaining <= 5 && "text-red-700 dark:text-red-300"
                )}
              >
                {timeRemaining > 0 ? (
                  <>
                    Você tem{" "}
                    <strong>
                      {timeRemaining}{" "}
                      {timeRemaining === 1 ? "minuto" : "minutos"}
                    </strong>{" "}
                    para confirmar esta inscrição. Após esse período, ela será
                    cancelada automaticamente.
                  </>
                ) : (
                  <>
                    O tempo para confirmação expirou. Esta inscrição será
                    cancelada automaticamente.
                  </>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Card principal de confirmação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Resumo da Inscrição Individual
          </CardTitle>
          <CardDescription>
            Verifique os dados abaixo antes de confirmar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estatísticas (adaptado para individual) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                  <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  1
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Participante
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                  <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  R$ {participant.value.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Valor Total
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-3">
                  <Tag className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  1
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tipo de Inscrição
                </p>
              </div>
            </div>
          </div>

          {/* Detalhes do participante */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Detalhes do Participante
            </h3>

            <div
              className={cn(
                "rounded-lg p-4 border transition-colors",
                typeColor.badge
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <LabelWithIcon icon={User} text="Nome Completo" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {participant.name}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <LabelWithIcon icon={Calendar} text="Data de Nascimento" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {participant.birthDate}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <LabelWithIcon icon={VenusAndMars} text="Gênero" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                      {participant.gender}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <LabelWithIcon icon={Tag} text="Tipo de Inscrição" />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {participant.typeDescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações importantes (mesmo estilo do grupo) */}
          <Card className="border-gray-200 bg-gray-50 dark:bg-gray-800/30 dark:border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base">
                    Informações Importantes
                  </h4>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 dark:text-gray-500 mt-1">
                        •
                      </span>
                      <span>
                        Você tem {timeRemaining}{" "}
                        {timeRemaining === 1 ? "minuto" : "minutos"} para
                        confirmar esta inscrição
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 dark:text-gray-500 mt-1">
                        •
                      </span>
                      <span>Verifique todos os dados antes de confirmar</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400 dark:text-gray-500 mt-1">
                        •
                      </span>
                      <span>
                        Após a confirmação, ainda é possivel alterar os dados em
                        <strong> Minhas Inscrições</strong>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Botões de ação (mesmo estilo do grupo) */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="flex-1 h-14 text-base"
          disabled={confirming || cancelling || timeRemaining <= 0}
        >
          {cancelling ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
              Cancelando...
            </>
          ) : (
            "Cancelar"
          )}
        </Button>
        <Button
          onClick={handleConfirm}
          className={cn(
            "flex-1 h-14 text-base bg-gray-900 hover:bg-gray-800 text-white",
            timeRemaining <= 5 && "bg-orange-600 hover:bg-orange-700",
            timeRemaining <= 0 && "bg-red-600 hover:bg-red-700"
          )}
          disabled={confirming || cancelling || timeRemaining <= 0}
        >
          {timeRemaining <= 0 ? (
            "Tempo Esgotado"
          ) : confirming ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Confirmando...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirmar Inscrição
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
