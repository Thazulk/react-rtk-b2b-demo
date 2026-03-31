import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSession } from "@/store/authSlice";
import { useLoginMutation } from "@/store/dummyJsonApi";
import { useAppDispatch } from "@/store";
import { useTranslation } from "react-i18next";

const DUMMY_CREDENTIALS = {
  email: "emily.johnson@x.dummyjson.com",
  password: "emilyspass",
  username: "emilys",
};

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState(DUMMY_CREDENTIALS.email);
  const [password, setPassword] = useState(DUMMY_CREDENTIALS.password);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidCredentials =
      email.trim().toLowerCase() === DUMMY_CREDENTIALS.email && password === DUMMY_CREDENTIALS.password;

    if (!isValidCredentials) {
      setError(t("login.invalidCredentials"));
      return;
    }

    try {
      setError(null);
      const response = await login({
        username: DUMMY_CREDENTIALS.username,
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

      navigate("/catalog", { replace: true });
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
            <Label htmlFor="email">{t("login.email")}</Label>
            <Input
              id="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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
          <p className="text-xs text-muted-foreground">
            {t("login.demoCredentials", {
              email: DUMMY_CREDENTIALS.email,
              password: DUMMY_CREDENTIALS.password,
            })}
          </p>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("login.loading") : t("login.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
