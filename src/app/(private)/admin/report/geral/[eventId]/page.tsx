"use client";

import ReportDetails from "@/features/report/components/reportGeral/ReportDetails";
import { useReportActions } from "@/features/report/hooks/reportGeral/useReportActions";
import { useReportGeneral } from "@/features/report/hooks/reportGeral/useReportGeneral";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function ReportDetalheAdminPage() {
  const params = useParams();
  const router = useRouter();
  const rawEventId = params.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;

  if (!eventId) return null;

  const { data, loading, error, refetch } = useReportGeneral({
    eventId,
  });

  // Hook para ações de relatório (download, etc)
  const { downloadReport, downloadFinancialReport, isDownloading } =
    useReportActions({ eventId });

  if (!eventId) return null;

  const renderSkeletonGrid = () => {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8 space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <Card className="border-destructive/20 border-2 shadow-sm">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-lg font-semibold text-destructive mb-2">
              Erro ao carregar relatório
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {error.message}
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <ReportDetails
        data={data}
        isDownloading={isDownloading}
        onDownload={downloadReport}
      />
    );
  };

  const handleBack = () => {
    router.push("/admin/report/geral");
  };

  return (
    <PageContainer
      title="Relatório Geral"
      description="Dados consolidados do evento selecionado."
      showBackButton
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
