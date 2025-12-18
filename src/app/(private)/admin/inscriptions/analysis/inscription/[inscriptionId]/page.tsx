"use client";

import InscriptionDetailAnalysis from "@/features/inscriptions/components/analysis/InscriptionDetailAnalysis";
import { useInscriptionActions } from "@/features/inscriptions/hooks/analysis/useInscriptionActions";
import { useInscriptionDetails } from "@/features/inscriptions/hooks/analysis/useInscriptionDetails";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { FileText, OctagonX } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function InscriptionDetailInsideAnalysisAdminPage() {
  const params = useParams();
  const inscriptionId = params.id as string;

  const {
    approveInscription,
    cancelInscription,
    deleteInscription,
    isApproving,
    isCancelling,
    isDeleting,
  } = useInscriptionActions();

  const { inscriptionData, loading, error, page, pageCount, total, setPage } =
    useInscriptionDetails({
      inscriptionId,
      initialPage: 1,
      pageSize: 10,
      enabled: !isDeleting,
    });

  // Verificar se a inscrição foi deletada
  const isInscriptionDeleted =
    !loading && !inscriptionData && !error && !isDeleting;

  if (loading) {
    return (
      <PageContainer
        title="Análise da Inscrição"
        description="Carregando detalhes da inscrição"
      >
        <div className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer
        title="Análise da Inscrição"
        description="Erro ao carregar inscrição"
      >
        <div className="flex justify-center items-center min-h-96">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Erro ao carregar inscrição
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button asChild className="w-full">
                <Link href="/admin/inscriptions/analysis">
                  Voltar para Análise
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  if (isInscriptionDeleted) {
    return (
      <PageContainer
        title="Análise da Inscrição"
        description="Inscrição não encontrada"
      >
        <div className="flex justify-center items-center min-h-96">
          <Card className="w-full max-w-md border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <OctagonX className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-xl font-semibold text-orange-600 mb-2">
                Inscrição não encontrada
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Esta inscrição pode ter sido deletada ou não existe mais.
              </p>
              <Button asChild className="w-full">
                <Link href="/admin/inscriptions/analysis">
                  Voltar para Análise
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Análise da Inscrição"
      description={inscriptionData?.responsible || "Detalhes da inscrição"}
    >
      <InscriptionDetailAnalysis
        inscriptionId={inscriptionId}
        inscriptionData={inscriptionData}
        loading={loading}
        error={error}
        page={page}
        pageCount={pageCount}
        total={total}
        setPage={setPage}
        approveInscription={approveInscription}
        cancelInscription={cancelInscription}
        deleteInscription={deleteInscription}
        isApproving={isApproving}
        isCancelling={isCancelling}
        isDeleting={isDeleting}
      />
    </PageContainer>
  );
}
