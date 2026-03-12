"use client";

import DetailsMember from "@/features/members/components/detailsMember/DetailsMember";
import { useDetailsMember } from "@/features/members/hook/detailsMember/useDetailsMember";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";

export default function DetailsMemberPage() {
  const params = useParams();
  const router = useRouter();
  const rawMemberId = params.memberId;
  const memberId = Array.isArray(rawMemberId) ? rawMemberId[0] : rawMemberId;

  if (!memberId) {
    return null;
  }

  const { member, loading, fetching, fetched, error, refresh } =
    useDetailsMember({
      memberId,
    });

  const renderSkeletonGrid = () => {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-end items-center gap-4">
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonGrid();
    }

    if (error) {
      return (
        <div className="p-6 flex items-center justify-center min-h-96">
          <div className="text-center text-destructive">
            <p className="mb-4">
              Erro ao carregar detalhes do membro: {error.message}
            </p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return <DetailsMember member={member} />;
  };

  const handleBack = () => {
    router.replace(`/user/members`);
  };

  return (
    <PageContainer
      title="Detalhes do Membro"
      description="Visualize os detalhes do membro."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
