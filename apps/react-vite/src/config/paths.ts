export const paths = {
  app: {
    root: {
      path: '/app',
      getHref: () => '/app',
    },
    payment: {
      path: '/app/payment',
      getHref: () => '/app/payment',
    },
    dashboard: {
      path: '',
      getHref: () => '/app',
    },
    discussions: {
      path: 'discussions',
      getHref: () => '/app/discussions',
    },
    discussion: {
      path: 'discussions/:discussionId',
      getHref: (id: string) => `/app/discussions/${id}`,
    },
    users: {
      path: 'users',
      getHref: () => '/app/users',
    },
    profile: {
      path: 'profile',
      getHref: () => '/app/profile',
    },
  },
} as const;
