"use client";

import MembersTable from "@/features/members/components/MembersTable";
import { UseMembers } from "@/features/members/hook/useMembers";
import PageContainer from "@/shared/components/layout/PageContainer";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useRouter } from "next/navigation";

const PAGE_SIZE = 20;
export default function MembersPage() {
  const router = useRouter();
  const { members, total, page, pageCount, loading, error, setPage, refresh } =
    UseMembers({ initialPage: 1, pageSize: PAGE_SIZE });

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
            <p className="mb-4">Erro ao carregar membros: {error.message}</p>
            <Button onClick={refresh}>Tentar Novamente</Button>
          </div>
        </div>
      );
    }

    return (
      <MembersTable
        members={members}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        pageSize={PAGE_SIZE}
      />
    );
  };

  const handleBack = () => {
    router.replace(`/user/home`);
  };

  return (
    <PageContainer
      title="Membros"
      description="Gerencie seus membros e registre novos membros."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      {renderContent()}
    </PageContainer>
  );
}
