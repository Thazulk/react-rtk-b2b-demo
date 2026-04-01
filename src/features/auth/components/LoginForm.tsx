import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/store";
import { setSession } from "@/store/authSlice";
import { useLoginMutation } from "@/store/dummyJsonApi";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();

  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError(t("login.invalidCredentials"));
      return;
    }

    try {
      setError(null);
      const response = await login({
        username: username.trim(),
        password,
        expiresInMins: 30,
      }).unwrap();

      dispatch(
        setSession({
          accessToken: response.accessToken,
          activeCartId: null,
          user: {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            gender: response.gender,
            email: response.email,
            username: response.username,
            image: response.image,
          },
        }),
      );

      navigate("/dashboard", { replace: true });
    } catch {
      setError(t("login.requestFailed"));
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{t("login.title")}</CardTitle>
        <CardDescription>{t("login.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">{t("login.username")}</Label>
            <Input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">{t("login.password")}</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("login.credentialsHint")}</p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("login.loading") : t("login.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
