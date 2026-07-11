import { PrivateNavbar } from '@/shared/components/layout/private-navbar';
import AppSidebarSuper from '@/shared/components/layout/sidebar-super/Sidebar';
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
        <AppSidebarSuper>
          <PrivateNavbar />
          {children}
        </AppSidebarSuper>
      </SessionUserProvider>
    </ConfigProvider>
  );
}
