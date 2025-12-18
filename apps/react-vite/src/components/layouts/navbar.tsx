import type { ReactElement } from 'react';
import { CameraAlt, CreditCard, Home, Person, Store } from '@mui/icons-material';

import { paths } from '@/config/paths';

export type DashboardNavItem = {
  id: string;
  label: string;
  path: string;
  icon: ReactElement;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    id: 'home',
    label: 'خانه',
    path: paths.app.payment.getHref(),
    icon: <Home />,
  },
  {
    id: 'profile',
    label: 'پروفایل',
    path: paths.app.profile.getHref(),
    icon: <Person />,
  },
  {
    id: 'in-person',
    label: 'خرید حضوری',
    path: paths.app.inPerson.getHref(),
    icon: <Store />,
  },
  {
    id: 'credits',
    label: 'اعتبارهای من',
    path: paths.app.credits.getHref(),
    icon: <CreditCard />,
  },
  {
    id: 'add-card',
    label: 'افزودن کارت',
    path: paths.app.addCard.getHref(),
    icon: <CreditCard />,
  },
  {
    id: 'scan',
    label: 'اسکن QR',
    path: paths.app.scan.getHref(),
    icon: <CameraAlt />,
  },
];

export const NAV_LINKS = [
  'دسته‌بندی‌ها',
  'فروشگاه‌ها',
  'خرید حضوری',
  'ثبت‌نام فروشگاه',
  'تماس با ما',
  'درباره ما',
];
