"use client";

import DocumentationContent from "@/features/documentation/components/DocumentationContent";
import SidebarNavigation from "@/features/documentation/components/SidebarNavigation";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("welcome");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Documentação do Sistema
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Guias completos para utilizar todas as funcionalidades do sistema
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <SidebarNavigation />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              <DocumentationContent activeSection={activeSection} />
            </div>

            {/* Support Footer */}
            <div className="mt-8 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl border border-primary/20 dark:border-primary/30 p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Precisa de ajuda agora?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Entre em contato com nosso suporte para assistência
                    imediata.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary dark:text-primary-foreground" />
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    (91) 99258-7483
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
