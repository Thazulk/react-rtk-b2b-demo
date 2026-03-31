export const huHU = {
  common: {
    language: {
      english: "Angol",
      hungarian: "Magyar",
      switchLabel: "Nyelv",
    },
    navbar: {
      profile: "Profil",
      language: "Nyelvválasztás",
      logout: "Kijelentkezés",
      guest: "Vendég",
      cart: "Kosár",
    },
    login: {
      title: "B2B storefront belépés",
      description: "Jelentkezz be az előre definiált DummyJSON demó felhasználóval.",
      email: "Email",
      password: "Jelszó",
      demoCredentials: "Demó belépési adatok: {{email}} / {{password}}",
      invalidCredentials: "Hibás email vagy jelszó.",
      submit: "Belépés",
    },
    storefront: {
      notAvailable: "n/a",
    },
    profile: {
      title: "Profil",
      subtitle: "Bejelentkezett B2B fiók adatai",
      name: "Név",
      email: "Email",
      username: "Felhasználónév",
    },
    catalog: {
      routeTitle: "Katalógus",
      title: "Termékkatalógus",
      description: "A katalógus publikus, de kosár műveletekhez bejelentkezés szükséges.",
      stockAndPrice: "{{stock}} készlet | {{price}} EUR",
      addToCart: "Kosárba",
      loginRequired: "Belépés szükséges",
    },
    cart: {
      routeTitle: "Kosár",
      title: "Aktív kosár",
      cartId: "Kosár ID: {{id}}",
      empty: "A kosarad jelenleg üres.",
      quantityAndPrice: "{{quantity}} db x {{price}} EUR",
      total: "Összesen: {{total}} EUR",
    },
  },
} as const;
