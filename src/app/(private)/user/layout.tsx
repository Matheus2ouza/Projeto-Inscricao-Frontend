import PrivateNavbar from "@/shared/components/layout/private-navbar";
import AppSidebarNormal from "@/shared/components/layout/sidebar/Sidebar";
import SessionUserProvider from "@/shared/providers/session-user-provider";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionUserProvider>
      <AppSidebarNormal>
        <PrivateNavbar />
        {children}
      </AppSidebarNormal>
    </SessionUserProvider>
  );
}
