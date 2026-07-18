'use client';

import MembersTable from '@/features/members/components/MembersTable';
import PageContainer from '@/shared/components/layout/PageContainer';
import { useRouter } from 'next/navigation';

export default function MembersPage() {
  const router = useRouter();

  const handleBack = () => {
    router.replace(`/user/home`);
  };

  const handleViewDetailsMember = (memberId: string) => {
    router.push(`/user/members/${memberId}`);
  };

  return (
    <PageContainer
      title="Membros"
      description="Gerencie seus membros e registre novos membros."
      showBackButton={true}
      backButtonAction={handleBack}
    >
      <MembersTable onViewDetailsMember={handleViewDetailsMember} />
    </PageContainer>
  );
}
