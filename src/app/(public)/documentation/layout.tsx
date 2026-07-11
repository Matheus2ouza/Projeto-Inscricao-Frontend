import { AuthUser } from '@/features/auth/types/userTypes';
import { verifySession } from '@/lib/auth';
import { AppSidebarAdmin } from '@/shared/components/layout/sidebar-admin-manager';
import SessionUserProvider from '@/shared/providers/session-user-provider';

export default async function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  const user = session.user as AuthUser;

  return (
    <SessionUserProvider>
      <AppSidebarAdmin user={user}>
        {/* Só PrivateNavbar */}
        <main>{children}</main>
      </AppSidebarAdmin>
    </SessionUserProvider>
  );
}
