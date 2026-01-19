"use client";

import {
  Calendar,
  CreditCard,
  MessageCircle,
  Rocket,
  Utensils,
} from "lucide-react";
import Link from "next/link";

type CardProps = {
  disabled?: boolean;
};

function QuickStartCard({ disabled = false }: CardProps) {
  if (disabled) {
    return (
      <div className="cursor-not-allowed rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 p-6 opacity-60">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-500 dark:text-gray-400">
              Comece agora
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Aprenda os conceitos básicos do sistema e como navegar por eles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link href="/documentation/getting-started" className="block">
      <div className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-6 hover:border-gray-300">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Comece agora
            </h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Aprenda os conceitos básicos do sistema e como navegar por eles.
          </p>
        </div>
      </div>
    </Link>
  );
}

function InscriptionsCard({ disabled = false }: CardProps) {
  if (disabled) {
    return (
      <div className="cursor-not-allowed rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 p-6 opacity-60">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-500 dark:text-gray-400">
              Inscrições
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Aprenda como fazer inscrições para os eventos e como gerencia-los
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link href="/documentation/inscription/introduction" className="block">
      <div className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-6 hover:border-gray-300">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Inscrições
            </h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Aprenda como fazer inscrições para os eventos e como gerencia-los
          </p>
        </div>
      </div>
    </Link>
  );
}

function PaymentsCard({ disabled = false }: CardProps) {
  if (disabled) {
    return (
      <div className="cursor-not-allowed rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 p-6 opacity-60">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-500 dark:text-gray-400">
              Pagamentos
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Aprenda como registrar pagamentos e verificar relatorios financeiros
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link href="/documentation/payments" className="block">
      <div className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-6 hover:border-gray-300">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Pagamentos
            </h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Aprenda como registrar pagamentos e verificar relatorios financeiros
          </p>
        </div>
      </div>
    </Link>
  );
}

function MealCard({ disabled = false }: CardProps) {
  if (disabled) {
    return (
      <div className="cursor-not-allowed rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 p-6 opacity-60">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Utensils className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-500 dark:text-gray-400">
              Refeição
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Aprenda como você pode adiantar suas refeições
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link href="/documentation/meals" className="block">
      <div className="cursor-pointer rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-6 hover:border-gray-300">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Utensils className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Refeição
            </h3>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Aprenda como você pode adiantar suas refeições
          </p>
        </div>
      </div>
    </Link>
  );
}

type IntroductionDocumentationContentProps = {
  quickStartDisabled?: boolean;
  inscriptionsDisabled?: boolean;
  paymentsDisabled?: boolean;
  mealDisabled?: boolean;
  disableAll?: boolean;
};

export default function IntroductionDocumentationContent({
  quickStartDisabled = false,
  inscriptionsDisabled = false,
  paymentsDisabled = false,
  mealDisabled = false,
  disableAll = false,
}: IntroductionDocumentationContentProps) {
  // Se disableAll for true, desabilita todos
  const showQuickStart = !disableAll && !quickStartDisabled;
  const showInscriptions = !disableAll && !inscriptionsDisabled;
  const showPayments = !disableAll && !paymentsDisabled;
  const showMeal = false;

  // Verifica se pelo menos um card está habilitado
  const showCardsSection =
    showQuickStart || showInscriptions || showPayments || showMeal;

  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300 px-4 sm:px-0">
      <div className="space-y-8">
        <div className="space-y-4">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            Esta documentação foi criada para auxiliá-lo na compreensão e
            utilização de todas as funcionalidades do Sistema de Gestão de
            Inscrições. Aqui você encontrará explicações detalhadas e guias
            passo a passo que cobrem cada recurso da plataforma, facilitando o
            uso correto e eficiente do sistema.
          </p>
        </div>

        {showCardsSection && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Comece sua Jornada
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <QuickStartCard disabled={!showQuickStart} />
              <InscriptionsCard disabled={!showInscriptions} />
              <PaymentsCard disabled={!showPayments} />
              <MealCard disabled={!showMeal} />
            </div>
          </div>
        )}

        {/* Footer com contato do suporte */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Precisa de ajuda?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
                Não encontrou o que estava procurando ou tem alguma dúvida
                específica? Nossa equipe de suporte está pronta para ajudá-lo!
              </p>
            </div>
            <a
              href={`https://wa.me/5591992587483?text=Olá! Preciso de ajuda com a documentação do sistema de inscrições.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Conversar no WhatsApp
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Suporte disponível de segunda a sexta, das 8h às 18h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
