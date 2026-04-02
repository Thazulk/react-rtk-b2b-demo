import { House, LayoutGrid, ShoppingCart, UserRound } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export interface NavItem {
  to: string;
  key: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const navItems: NavItem[] = [
  { to: "/dashboard", key: "drawer.dashboard", icon: House },
  { to: "/catalog", key: "drawer.catalog", icon: LayoutGrid },
  { to: "/cart", key: "drawer.cart", icon: ShoppingCart },
  { to: "/profile", key: "drawer.profile", icon: UserRound },
];
