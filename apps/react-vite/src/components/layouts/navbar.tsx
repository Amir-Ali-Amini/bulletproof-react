import {
  Search,
  Person,
  ChevronLeft,
  CardGiftcard,
  CreditCard,
  CalendarMonth,
  Description,
  AccountBalanceWallet,
  Receipt,
  Autorenew,
  HelpOutline,
  Logout,
  FolderOpen,
  Home,
  Store,
  ArrowForward,
} from '@mui/icons-material';
import { useState, createContext, useContext } from 'react';
const menuItemsData = [
  {
    icon: <CardGiftcard />,
    label: 'فرصت‌های ویژه',
    id: 'offers',
    path: '/offers',
  },
  {
    icon: <CreditCard />,
    label: 'اعتبارهای من',
    id: 'credits',
    path: '/credits',
  },
  {
    icon: <CalendarMonth />,
    label: 'قسط‌های من',
    id: 'installments',
    path: '/installments',
  },
  {
    icon: <Description />,
    label: 'درخواست‌های من',
    id: 'requests',
    path: '/requests',
  },
  {
    icon: <AccountBalanceWallet />,
    label: 'کیف پول نقدی',
    id: 'wallet',
    path: '/wallet',
  },
  {
    icon: <Receipt />,
    label: 'تراکنش های من',
    id: 'transactions',
    path: '/transactions',
  },
  {
    icon: <Autorenew />,
    label: 'پرداخت خودکار',
    id: 'autopay',
    path: '/autopay',
  },
];

const navLinksData = [
  'دسته‌بندی‌ها',
  'فروشگاه‌ها',
  'خرید حضوری',
  'ثبت‌نام فروشگاه',
  'تماس با ما',
  'درباره ما',
];

const pageConfig = {
  '/offers': {
    title: 'فرصت‌های ویژه',
    emptyTitle: 'فرصتی موجود نیست',
    emptyDesc: 'فرصت‌های ویژه در این قسمت نمایش داده می‌شود.',
  },
  '/credits': {
    title: 'اعتبارهای من',
    emptyTitle: 'اعتباری ندارید',
    emptyDesc: 'اعتبارهای شما در این قسمت نمایش داده می‌شود.',
  },
  '/installments': {
    title: 'قسط‌های من',
    emptyTitle: 'قسطی ندارید',
    emptyDesc: 'قسط‌های شما در این قسمت نمایش داده می‌شود.',
  },
  '/requests': {
    title: 'درخواست‌های من',
    emptyTitle: 'درخواستی ندارید',
    emptyDesc: 'درخواست‌های شما در این قسمت نمایش داده می‌شود.',
  },
  '/wallet': {
    title: 'کیف پول نقدی',
    emptyTitle: 'کیف پول خالی است',
    emptyDesc: 'موجودی کیف پول شما در این قسمت نمایش داده می‌شود.',
  },
  '/transactions': {
    title: 'تراکنش‌های من',
    emptyTitle: 'هنوز تراکنشی ندارید',
    emptyDesc:
      'تراکنش‌های مربوط به اعتبار و خرید شما در این قسمت نمایش داده می‌شود.',
  },
  '/autopay': {
    title: 'پرداخت خودکار',
    emptyTitle: 'پرداخت خودکاری ندارید',
    emptyDesc: 'پرداخت‌های خودکار شما در این قسمت نمایش داده می‌شود.',
  },
};

const RouterContext = createContext({
  currentPath: '/transactions',
  navigate: () => {},
});
const useRouter = () => useContext(RouterContext);
