"use client";

import {
  Calendar,
  CreditCard,
  FileText,
  Home,
  Settings,
  Users,
} from "lucide-react";

interface DocumentationContentProps {
  activeSection?: string;
}

export default function DocumentationContent({
  activeSection,
}: DocumentationContentProps) {
  const sections = {
    welcome: {
      title: "Bem-vindo ao Sistema",
      icon: <Home className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-lg leading-relaxed">
            Esta documentação foi criada para ajudá-lo a utilizar todas as
            funcionalidades do nosso Sistema de Gestão de Inscrições.
          </p>
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-3">
              🚧 Documentação em Construção
            </h3>
            <p className="text-blue-700 dark:text-blue-400">
              Estamos organizando e atualizando esta documentação. Ao longo dos
              próximos dias, adicionaremos guias detalhados, tutoriais em vídeo
              e exemplos práticos para cada funcionalidade do sistema.
            </p>
          </div>
        </div>
      ),
    },
    "system-overview": {
      title: "Visão Geral do Sistema",
      icon: <FileText className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <p>
            O Sistema de Gestão de Inscrições é uma plataforma completa para
            gerenciamento de eventos, inscrições e pagamentos.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary dark:text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Gestão de Membros
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Cadastro e organização de participantes, com dados completos e
                histórico.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Eventos e Inscrições
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Criação de eventos, tipos de inscrição e gerenciamento de
                participações.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sistema de Pagamentos
                </h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Processamento seguro de pagamentos via PIX com comprovantes
                digitais.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    requirements: {
      title: "Requisitos do Sistema",
      icon: <Settings className="h-6 w-6" />,
      content: (
        <div className="space-y-4">
          <p>Para utilizar o sistema, você precisa de:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            <li>Conexão com internet estável</li>
            <li>Navegador atualizado (Chrome, Firefox, Edge ou Safari)</li>
            <li>Conta de usuário ativa no sistema</li>
            <li>Permissões de acesso conforme seu perfil</li>
          </ul>
        </div>
      ),
    },
  };

  const defaultSection = sections["welcome"];
  const section =
    activeSection && sections[activeSection as keyof typeof sections]
      ? sections[activeSection as keyof typeof sections]
      : defaultSection;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            {section.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {section.title}
          </h1>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            {section.content}
          </div>

          {/* What to Expect */}
          <section className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              O Que Você Encontrará Aqui
            </h3>

            <div className="space-y-4">
              {[
                {
                  number: "1",
                  title: "Guias Passo a Passo",
                  description:
                    "Instruções detalhadas para usar cada funcionalidade do sistema.",
                },
                {
                  number: "2",
                  title: "Vídeos Tutoriais",
                  description:
                    "Demonstrações visuais para facilitar o aprendizado.",
                },
                {
                  number: "3",
                  title: "FAQ e Solução de Problemas",
                  description:
                    "Respostas para perguntas frequentes e soluções para problemas comuns.",
                },
                {
                  number: "4",
                  title: "Melhores Práticas",
                  description:
                    "Dicas e recomendações para aproveitar ao máximo o sistema.",
                },
              ].map((item) => (
                <div key={item.number} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-primary text-sm font-semibold">
                      {item.number}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Coming Soon */}
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-medium mb-4">
                <span className="animate-pulse">⚡</span>
                Em breve: Documentação completa
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Estamos trabalhando para fornecer a melhor experiência de
                aprendizado. Volte em breve para conferir as atualizações!
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
