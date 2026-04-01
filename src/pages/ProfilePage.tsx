import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store";
import { selectUser } from "@/store/authSlice";

export function ProfilePage() {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);

  return (
    <Card className="w-full min-h-0 flex-1 overflow-y-auto">
      <CardHeader>
        <CardTitle>{t("profile.title")}</CardTitle>
        <CardDescription>{t("profile.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        {user?.image ? (
          <img
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="size-20 rounded-full border object-cover"
            loading="lazy"
          />
        ) : null}
        <p>
          <span className="font-medium">{t("profile.name")}:</span>{" "}
          {user ? `${user.firstName} ${user.lastName}` : t("storefront.notAvailable")}
        </p>
        <p>
          <span className="font-medium">{t("profile.email")}:</span>{" "}
          {user?.email ?? t("storefront.notAvailable")}
        </p>
        <p>
          <span className="font-medium">{t("profile.username")}:</span>{" "}
          {user?.username ?? t("storefront.notAvailable")}
        </p>
      </CardContent>
    </Card>
  );
}
