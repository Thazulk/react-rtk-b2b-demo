import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { useAppSelector } from "@/store";
import { selectUser } from "@/store/authSlice";
import { selectUserDraftItemTypesCount } from "@/store/cartDraftSlice";

export function DashboardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const draftItemTypesCount = useAppSelector((state) => selectUserDraftItemTypesCount(state, user?.id));
  const { cartItemTypesCount } = useActiveCart(user?.id);

  const hasCartContent = (draftItemTypesCount || cartItemTypesCount) > 0;

  return (
    <Card className="w-full min-h-0 flex-1 overflow-y-auto">
      <CardHeader>
        <CardTitle>{t("dashboard.title")}</CardTitle>
        <CardDescription>
          {t("dashboard.welcome", {
            name: user ? `${user.firstName} ${user.lastName}` : t("navbar.guest"),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          {hasCartContent ? t("dashboard.hasCart") : t("dashboard.emptyCart")}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/catalog")}>
            {t("dashboard.continueBrowsing")}
          </Button>
          <Button onClick={() => navigate("/cart")} disabled={!hasCartContent}>
            {t("dashboard.goToCart")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
