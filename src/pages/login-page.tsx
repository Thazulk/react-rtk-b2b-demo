import { Navigate, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/features/auth/components/login-form";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useAppSelector } from "@/store";

export function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 px-6 pb-6 pt-14">
      <AppNavbar title={t("login.title")} userName={t("navbar.guest")} cartItemCount={0} />
      <section className="flex flex-1 flex-col items-center justify-center gap-6">
        <LoginForm />
        <Button variant="outline" onClick={() => navigate("/catalog")}>
          {t("login.continueAsGuest")}
        </Button>
      </section>
    </main>
  );
}
