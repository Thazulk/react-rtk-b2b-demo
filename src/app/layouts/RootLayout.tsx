import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import { AppNavbar } from "@/components/shared/AppNavbar";
import { NavigationDrawer, NavigationLinks } from "@/components/shared/NavigationDrawer";
import { navItems } from "@/config/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useRootLayout } from "@/hooks/use-root-layout";

export function RootLayout() {
  const { t } = useTranslation();
  const {
    user,
    isLoginRoute,
    cartBadgeCount,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    closeMobileDrawer,
    toggleMobileDrawer,
    handleLogout,
    navigate,
  } = useRootLayout();

  return (
    <>
      <AppNavbar
        title={t("app.name")}
        userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
        cartItemCount={isLoginRoute ? 0 : cartBadgeCount}
        onTitleClick={() => navigate("/")}
        onCartClick={user ? () => navigate("/cart") : undefined}
        onProfile={user ? () => navigate("/profile") : undefined}
        onLogout={user ? handleLogout : undefined}
        onLogin={!user && !isLoginRoute ? () => navigate("/login") : undefined}
        onMenuToggle={toggleMobileDrawer}
      />
      <NavigationDrawer />

      <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
        <SheetContent side="left" className="w-56 p-0">
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle className="text-base">{t("app.name")}</SheetTitle>
          </SheetHeader>
          <NavigationLinks items={navItems} onNavClick={closeMobileDrawer} />
        </SheetContent>
      </Sheet>

      <main className="flex h-svh min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden lg:pl-56">
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6 overflow-hidden px-6 pb-6 pt-14 [&>*]:min-h-0">
          <div className="flex h-full max-h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
