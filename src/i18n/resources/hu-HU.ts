export const huHU = {
  common: {
    language: {
      english: "Angol",
      hungarian: "Magyar",
      switchLabel: "Nyelv",
    },
    login: {
      title: "B2B storefront belepes",
      description: "Demo hitelesites a storefront folyamatok tesztelesehez.",
      username: "Felhasznalonev",
      email: "Email",
      firstName: "Keresztnev",
      lastName: "Vezeteknev",
      submit: "Belepes",
      browseHintPrefix: "Belepes nelkul is megnezheted a katalogust a",
      browseHintSuffix: "oldalon.",
    },
    browse: {
      title: "B2B storefront (publikus bongeszes)",
      description: "A katalogus nyilvanos, de a kosar muveletekhez hitelesitett session kell.",
      loginCtaPrefix: "Ha kosarat is kezelnel, menj a",
      loginCtaLink: "login oldalra",
    },
    storefront: {
      title: "B2B storefront",
      signedInUser: "Bejelentkezett user: {{name}}",
      publicBrowse: "Publikus bongeszes",
      logout: "Kijelentkezes",
      notAvailable: "n/a",
    },
    catalog: {
      title: "Termekkatalogus",
      description: "A katalogus publikus, de kosar muveletekhez bejelentkezes szukseges.",
      stockAndPrice: "{{stock}} keszlet | {{price}} EUR",
      addToCart: "Kosarba",
      loginRequired: "Belepes szukseges",
    },
    cart: {
      title: "Aktiv kosar",
      cartId: "Kosar ID: {{id}}",
      empty: "A kosarad jelenleg ures.",
      quantityAndPrice: "{{quantity}} db x {{price}} EUR",
      total: "Osszesen: {{total}} EUR",
    },
  },
} as const;
