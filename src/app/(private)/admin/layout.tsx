import PrivateNavbar from "@/shared/components/layout/private-navbar";
import AppSidebarAdminManager from "@/shared/components/layout/sidebar-admin-manager/Sidebar";
import SessionUserProvider from "@/shared/providers/session-user-provider";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionUserProvider>
      <AppSidebarAdminManager>
        <PrivateNavbar />
        {children}
      </AppSidebarAdminManager>
    </SessionUserProvider>
  );
}
