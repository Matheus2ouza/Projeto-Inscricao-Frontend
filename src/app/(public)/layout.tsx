import PublicNavbar from "@/shared/components/layout/public-navbar";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider locale={ptBR}>
      <div className="min-h-screen">
        <PublicNavbar />
        <main className="flex-1">{children}</main>
      </div>
    </ConfigProvider>
  );
}
