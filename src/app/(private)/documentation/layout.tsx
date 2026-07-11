import { verifySession } from '@/lib/auth';
import { PrivateNavbar } from '@/shared/components/layout/private-navbar';
import SidebarDocumentation from '@/shared/components/layout/sidebar-documentation/SidebarDocumentation';
import SessionUserProvider from '@/shared/providers/session-user-provider';
import { redirect } from 'next/navigation';

export default async function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <SessionUserProvider>
      <SidebarDocumentation>
        <PrivateNavbar />
        {children}
      </SidebarDocumentation>
    </SessionUserProvider>
  );
}
