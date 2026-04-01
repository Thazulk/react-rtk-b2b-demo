import { House, LayoutGrid, ShoppingCart, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", key: "drawer.dashboard", icon: House },
  { to: "/catalog", key: "drawer.catalog", icon: LayoutGrid },
  { to: "/cart", key: "drawer.cart", icon: ShoppingCart },
  { to: "/profile", key: "drawer.profile", icon: UserRound },
] as const;

export function NavigationDrawer() {
  const { t } = useTranslation();

  return (
    <aside className="fixed top-14 left-0 z-40 hidden h-[calc(100svh-3.5rem)] w-56 border-r bg-background lg:block">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive && "bg-muted text-foreground",
                )
              }
            >
              <Icon aria-hidden="true" />
              <span>{t(item.key)}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
