import { Navigate, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
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
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 p-6">
      <AppNavbar title={t("login.title")} userName={t("navbar.guest")} />
      <section className="flex flex-1 flex-col items-center justify-center gap-6">
        <LoginForm />
        <p className="text-sm text-muted-foreground">
          {t("login.browseHintPrefix")}{" "}
          <Link className="underline underline-offset-2" to="/browse">
            /browse
          </Link>{" "}
          {t("login.browseHintSuffix")}
        </p>
      </section>
    </main>
  );
}
