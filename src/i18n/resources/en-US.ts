export const enUS = {
  common: {
    language: {
      english: "English",
      hungarian: "Hungarian",
      switchLabel: "Language",
    },
    navbar: {
      profile: "Profile",
      language: "Language",
      logout: "Logout",
      guest: "Guest",
      cart: "Cart",
    },
    login: {
      title: "B2B storefront login",
      description: "Sign in with the predefined DummyJSON demo user.",
      email: "Email",
      password: "Password",
      demoCredentials: "Demo credentials: {{email}} / {{password}}",
      invalidCredentials: "Invalid email or password.",
      requestFailed: "Login request failed. Please try again.",
      loading: "Signing in...",
      submit: "Sign in",
    },
    storefront: {
      notAvailable: "n/a",
    },
    profile: {
      title: "Profile",
      subtitle: "Signed in B2B account details",
      name: "Name",
      email: "Email",
      username: "Username",
    },
    catalog: {
      routeTitle: "Catalog",
      title: "Product catalog",
      description: "Catalog is public, but cart operations require sign in.",
      loading: "Loading products...",
      stockAndPrice: "{{stock}} in stock | {{price}} EUR",
      addToCart: "Add to cart",
      loginRequired: "Login required",
    },
    cart: {
      routeTitle: "Cart",
      title: "Active cart",
      cartId: "Cart ID: {{id}}",
      empty: "Your cart is currently empty.",
      quantityAndPrice: "{{quantity}} pcs x {{price}} EUR",
      total: "Total: {{total}} EUR",
    },
  },
} as const;
