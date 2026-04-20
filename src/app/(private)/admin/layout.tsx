import PrivateNavbar from '@/shared/components/layout/private-navbar';
import AppSidebarAdminManager from '@/shared/components/layout/sidebar-admin-manager/Sidebar';
import SessionUserProvider from '@/shared/providers/session-user-provider';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider locale={ptBR}>
      <SessionUserProvider>
        <AppSidebarAdminManager>
          <PrivateNavbar />
          {children}
        </AppSidebarAdminManager>
      </SessionUserProvider>
    </ConfigProvider>
  );
}
