import { Navigate, Link } from "react-router";
import { LoginForm } from "@/features/auth/components/login-form";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useAppSelector } from "@/store";

export function LoginPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col items-center justify-center gap-6 p-6">
      <LoginForm />
      <p className="text-sm text-muted-foreground">
        Belepes nelkul is megnezheted a katalogust a{" "}
        <Link className="underline underline-offset-2" to="/browse">
          /browse
        </Link>{" "}
        oldalon.
      </p>
    </main>
  );
}
