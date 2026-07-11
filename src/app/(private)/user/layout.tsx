'use server';

import { AuthUser } from '@/features/auth/types/userTypes';
import { verifySession } from '@/lib/auth';
import { TooltipProvider } from '@/providers/TooltipProvider';
import { PrivateNavbar } from '@/shared/components/layout/private-navbar';
import { AppSidebarUser } from '@/shared/components/layout/sidebar';
import { SidebarProvider } from '@/shared/components/ui';
import SessionUserProvider from '@/shared/providers/session-user-provider';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  const user = session.user as AuthUser;
  return (
    <TooltipProvider>
      <SidebarProvider className="bg-transparent!">
        <ConfigProvider locale={ptBR}>
          <SessionUserProvider>
            <AppSidebarUser user={user} />
            <div className="w-full">
              <PrivateNavbar />
              {children}
            </div>
          </SessionUserProvider>
        </ConfigProvider>
      </SidebarProvider>
    </TooltipProvider>
  );
}
