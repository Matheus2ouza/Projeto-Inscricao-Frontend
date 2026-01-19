import AppSidebarAdminManager from "@/shared/components/layout/sidebar-admin-manager/Sidebar";
import SessionUserProvider from "@/shared/providers/session-user-provider";

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionUserProvider>
      <AppSidebarAdminManager>
        {/* Só PrivateNavbar */}
        <main>{children}</main>
      </AppSidebarAdminManager>
    </SessionUserProvider>
  );
}
