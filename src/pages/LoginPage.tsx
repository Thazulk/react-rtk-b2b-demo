import { useTranslation } from "react-i18next";
import { Navigate, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useAppSelector } from "@/store";
import { selectIsAuthenticated } from "@/store/authSlice";

export function LoginPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { t } = useTranslation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto py-4">
      <LoginForm />
      <Button variant="outline" onClick={() => navigate("/catalog")}>
        {t("login.continueAsGuest")}
      </Button>
    </section>
  );
}
