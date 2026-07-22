'use client';

import AccountsTable from '@/features/accounts/components/AccountsTable';
import { useListAccounts } from '@/features/accounts/hooks/listAccounts/useListAccounts';
import { AuthUser } from '@/features/auth/types/userTypes';
import { useListRegions } from '@/features/regions/hooks/listRegions/useListRegions';
import PageContainer from '@/shared/components/layout/PageContainer';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AccountsPage() {
  const { data: session, status } = useSession();
  const user = session?.user as AuthUser | null;
  const userRegionId = user?.regionId;
  const userRole = user?.role;
  const router = useRouter();
  const {
    accounts,
    total,
    page,
    pageCount,
    loading,
    error,
    setPage,
    refetch: refetchUsers,
  } = useListAccounts({ pageSize: 20, initialPage: 1 });

  const {
    regions,
    loading: regionsLoading,
    error: regionsError,
    refetch: refetchRegions,
  } = useListRegions();

  const handleRetry = async () => {
    await Promise.all([refetchUsers(), refetchRegions()]);
  };

  // Verifica se o usuário está autenticado mas não tem os dados necessários
  if (!userRegionId || !userRole) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">
          Dados do usuário não encontrados. Por favor, faça login novamente.
        </p>
        <Button onClick={() => router.push('/login')}>Fazer login</Button>
      </div>
    );
  }

  if (loading || status === 'loading') {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-muted-foreground">
          Erro ao carregar contas: {error.message}
        </p>
        <Button onClick={handleRetry}>Tentar novamente</Button>
      </div>
    );
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <PageContainer
      title="Contas"
      description="Gerencie e visualize todos as contas cadastradas"
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <AccountsTable
        userRegionId={userRegionId}
        userRole={userRole}
        accounts={accounts}
        total={total}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        regions={regions}
      />
    </PageContainer>
  );
}
