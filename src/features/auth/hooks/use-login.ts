import { useAppDispatch } from "@/store";
import { setSession } from "@/store/authSlice";
import { useLoginMutation } from "@/store/dummyJsonApi";
import { type FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useLogin() {
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
          refreshToken: response.refreshToken,
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
      toast.error(t("errors.loginFailed"));
    }
  };

  return {
    username,
    password,
    error,
    isLoading,
    setUsername,
    setPassword,
    handleSubmit,
  };
}
