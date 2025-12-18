export const paths = {
  home: {
    path: '/',
    getHref: () => '/',
  },
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    payment: {
      path: 'payment',
      getHref: () => '/app/payment',
    },
    addCard: {
      path: 'add-card',
      getHref: () => '/app/add-card',
    },
    profile: {
      path: 'profile',
      getHref: () => '/app/profile',
    },
    inPerson: {
      path: 'in-person',
      getHref: () => '/app/in-person',
    },
    credits: {
      path: 'credits',
      getHref: () => '/app/credits',
    },
    scan: {
      path: 'scan',
      getHref: () => '/app/scan',
    },
  },
} as const;
