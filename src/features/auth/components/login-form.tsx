import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setSession } from "@/store/authSlice";
import { useAppDispatch } from "@/store";

export function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("buyer.demo");
  const [email, setEmail] = useState("buyer.demo@example.com");
  const [firstName, setFirstName] = useState("Buyer");
  const [lastName, setLastName] = useState("Demo");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    dispatch(
      setSession({
        accessToken: `demo-token-${Date.now()}`,
        activeCartId: 1001,
        user: {
          id: 1,
          firstName,
          lastName,
          age: 30,
          gender: "other",
          email,
          phone: "+36-30-000-0000",
          username,
          birthDate: "1996-01-01",
          image: "https://dummyjson.com/icon/emilys/128",
        },
      }),
    );

    navigate("/", { replace: true });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>B2B storefront login</CardTitle>
        <CardDescription>Demo hitelesites a storefront funkciok tesztelesehez.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </div>
          </div>
          <Button type="submit">Belepes</Button>
        </form>
      </CardContent>
    </Card>
  );
}
