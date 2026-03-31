import { Navigate, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { LoginForm } from "@/features/auth/components/login-form";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useAppSelector } from "@/store";

export function LoginPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col items-center justify-center gap-6 p-6">
      <LanguageSwitcher />
      <LoginForm />
      <p className="text-sm text-muted-foreground">
        {t("login.browseHintPrefix")}{" "}
        <Link className="underline underline-offset-2" to="/browse">
          /browse
        </Link>{" "}
        {t("login.browseHintSuffix")}
      </p>
    </main>
  );
}
