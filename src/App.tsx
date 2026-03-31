import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  clearSession,
  selectAccessToken,
  selectActiveCartId,
  selectIsAuthenticated,
  selectUser,
  setActiveCartId,
  setSession,
} from "@/store/authSlice";
import type { AppDispatch } from "@/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const activeCartId = useSelector(selectActiveCartId);

  const [username, setUsername] = useState("buyer.demo");
  const [email, setEmail] = useState("buyer.demo@example.com");
  const [firstName, setFirstName] = useState("Buyer");
  const [lastName, setLastName] = useState("Demo");
  const [userId, setUserId] = useState("1");
  const [cartId, setCartId] = useState("101");

  const handleLogin = () => {
    const parsedUserId = Number(userId);
    const resolvedUserId = Number.isNaN(parsedUserId) ? 1 : parsedUserId;

    dispatch(
      setSession({
        accessToken: `demo-token-${Date.now()}`,
        activeCartId: null,
        user: {
          id: resolvedUserId,
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
  };

  const handleSetActiveCart = () => {
    const parsedCartId = Number(cartId);
    if (Number.isNaN(parsedCartId)) {
      return;
    }
    dispatch(setActiveCartId(parsedCartId));
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6 text-left">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Auth sandbox (B2B demo)</h1>
        <p className="text-sm text-muted-foreground">
          Publikus böngészés mehet login nélkül, de kosárkezelés csak hitelesített userrel.
        </p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Login teszt panel</CardTitle>
            <CardDescription>
              Egyszeru, lokalis auth session beallitasa a Redux state-ben.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" value={userId} onChange={(event) => setUserId(event.target.value)} />
            </div>
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
            <div className="flex items-center gap-3">
              <Button onClick={handleLogin}>Login (demo)</Button>
              <Button variant="outline" onClick={() => dispatch(clearSession())}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kosar-hozzaferes policy teszt</CardTitle>
            <CardDescription>
              B2B szabaly: kosarat csak bejelentkezett user kezelhet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border p-3 text-sm">
              <p>
                Auth status:{" "}
                <span className={isAuthenticated ? "font-medium text-emerald-600" : "font-medium text-destructive"}>
                  {isAuthenticated ? "authenticated" : "guest"}
                </span>
              </p>
              <p>User: {user ? `${user.firstName} ${user.lastName} (${user.username})` : "n/a"}</p>
              <p className="truncate">Token: {accessToken ?? "n/a"}</p>
              <p>Active cart ID: {activeCartId ?? "n/a"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cartId">Aktiv kosar ID</Label>
              <Input
                id="cartId"
                value={cartId}
                disabled={!isAuthenticated}
                onChange={(event) => setCartId(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSetActiveCart} disabled={!isAuthenticated}>
                Set active cart
              </Button>
              <Button
                variant="outline"
                disabled={!isAuthenticated}
                onClick={() => dispatch(setActiveCartId(null))}
              >
                Clear active cart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default App;
