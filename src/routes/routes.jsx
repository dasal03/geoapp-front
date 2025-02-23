const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  services: {
    maintenance: "/services/maintenance",
    management: "/services/management",
  },
  profile: {
    base: "/profile",
    personalInfo: "personal-info",
    accountInfo: "account-info",
    security: {
      base: "security",
      changePassword: "change-password",
    },
    paymentCards: "payment-cards",
    paymentCardsForm: "payment-cards-form",
    addresses: "addresses",
    addressesForm: "addresses-form",
  },
  about: "/about",
  privacyPolicy: "/privacy-policy",
  contactUs: "/contact-us",
  unauthorized: "/unauthorized",
  notFound: "*",
};

export default routes;
