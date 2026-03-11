import PrivateNavbar from "@/shared/components/layout/private-navbar";
import AppSidebarNormal from "@/shared/components/layout/sidebar/Sidebar";
import SessionUserProvider from "@/shared/providers/session-user-provider";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider locale={ptBR}>
      <SessionUserProvider>
        <AppSidebarNormal>
          <PrivateNavbar />
          {children}
        </AppSidebarNormal>
      </SessionUserProvider>
    </ConfigProvider>
  );
}
