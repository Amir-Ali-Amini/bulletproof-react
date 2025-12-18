// export function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
//       {children}
//     </main>
//   );
// }
// export function DashboardLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
//       {children}
//     </main>
//   );
// }
import { useState, createContext, useContext } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Paper,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Link,
  CssBaseline,
  ThemeProvider,
  createTheme,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from '@mui/material';
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
  ReceiptLong,
  Autorenew,
  HelpOutline,
  Logout,
  FolderOpen,
  Home,
  Store,
  ArrowForward,
} from '@mui/icons-material';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl',
  typography: { fontFamily: 'Vazirmatn, Tahoma, sans-serif' },
  palette: {
    primary: { main: '#1E88E5', light: '#E3F2FD' },
    background: { default: '#F0F4F8' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
});

// ============ DATA ============
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
    icon: <ReceiptLong />,
    label: 'خرید های نقدی',
    id: 'cash-payments',
    path: 'cash-payments',
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

// ============ EMPTY STATE ============
const EmptyState = ({ title, description }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 10,
    }}
  >
    <Box
      sx={{
        width: 100,
        height: 100,
        borderRadius: '50%',
        bgcolor: '#E8F4FD',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 3,
      }}
    >
      <FolderOpen sx={{ fontSize: 50, color: '#90CAF9' }} />
    </Box>
    <Typography
      variant="subtitle1"
      fontWeight="600"
      sx={{ mb: 1, color: '#1a1a1a' }}
    >
      {title}
    </Typography>
    <Typography
      variant="body2"
      sx={{ color: '#6B7280', textAlign: 'center', maxWidth: 300 }}
    >
      {description}
    </Typography>
  </Box>
);

// ============ MOBILE COMPONENTS ============
const MobileHeader = ({ title, showBack, onBack }) => (
  <AppBar
    position="static"
    color="inherit"
    elevation={0}
    sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB' }}
  >
    <Toolbar sx={{ minHeight: 56 }}>
      <Typography
        variant="h6"
        sx={{ flexGrow: 1, color: '#1E88E5', fontWeight: 600, fontSize: 16 }}
      >
        {title}
      </Typography>
      {showBack && (
        <IconButton onClick={onBack} sx={{ color: '#374151' }}>
          <ArrowForward />
        </IconButton>
      )}
    </Toolbar>
  </AppBar>
);

const MobileBottomNav = () => {
  const { currentPath, navigate } = useRouter();
  const navValue =
    currentPath === '/profile' ? 0 : currentPath === '/credits' ? 1 : 3;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTop: '1px solid #E5E7EB',
      }}
      elevation={0}
    >
      <BottomNavigation value={navValue} sx={{ bgcolor: 'white', height: 64 }}>
        <BottomNavigationAction
          label="خانه"
          icon={<Home />}
          onClick={() => navigate('/home')}
          sx={{ color: '#6B7280' }}
        />
        <BottomNavigationAction
          label="خرید حضوری"
          icon={<Store />}
          onClick={() => navigate('/in-person')}
          sx={{ color: '#6B7280' }}
        />
        <BottomNavigationAction
          label={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#0D9488',
              }}
            >
              <CreditCard sx={{ fontSize: 18 }} />
              <span style={{ fontSize: 11 }}>۱۰۰ میلیون</span>
            </Box>
          }
          icon={null}
          onClick={() => navigate('/credits')}
          sx={{ '& .MuiBottomNavigationAction-label': { opacity: 1 } }}
        />
        <BottomNavigationAction
          label="پروفایل"
          icon={<Person />}
          onClick={() => navigate('/profile')}
          sx={{ color: '#6B7280', '&.Mui-selected': { color: '#1E88E5' } }}
        />
      </BottomNavigation>
    </Paper>
  );
};

const NotificationBanner = ({ onDismiss }) => (
  <Paper
    elevation={0}
    sx={{
      m: 2,
      p: 2,
      bgcolor: '#EFF6FF',
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      borderRadius: 3,
    }}
  >
    <Avatar
      sx={{
        bgcolor: '#1E88E5',
        width: 44,
        height: 44,
        fontWeight: 'bold',
        fontSize: 18,
      }}
    >
      ā
    </Avatar>
    <Typography
      variant="body2"
      sx={{ flexGrow: 1, color: '#374151', fontSize: 13 }}
    >
      مایلید از رویدادها و پیشنهادات ویژه مطلع شوید؟
    </Typography>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button
        size="small"
        onClick={onDismiss}
        sx={{
          bgcolor: '#E5E7EB',
          color: '#374151',
          fontSize: 12,
          px: 2,
          borderRadius: 2,
          '&:hover': { bgcolor: '#D1D5DB' },
        }}
      >
        قبول می‌کنم
      </Button>
      <Button
        size="small"
        onClick={onDismiss}
        sx={{ color: '#6B7280', fontSize: 12 }}
      >
        بعدا بپرس
      </Button>
    </Box>
  </Paper>
);

const MobileMenuItem = ({ item, onClick }) => (
  <ListItemButton
    onClick={onClick}
    sx={{ py: 2, px: 2, borderBottom: '1px solid #F3F4F6' }}
  >
    <ListItemIcon sx={{ minWidth: 32, color: '#1E88E5' }}>
      {item.icon}
    </ListItemIcon>
    <ListItemText
      primary={item.label}
      sx={{ '& .MuiTypography-root': { color: '#374151', fontSize: 14 } }}
    />
    <ChevronLeft sx={{ color: '#9CA3AF', fontSize: 20 }} />
  </ListItemButton>
);

const MobileProfilePage = () => {
  const { navigate } = useRouter();
  const [showBanner, setShowBanner] = useState(true);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F5F5', pb: 10 }}>
      <MobileHeader title="پروفایل من" showBack={false} />
      {showBanner && (
        <NotificationBanner onDismiss={() => setShowBanner(false)} />
      )}

      <Paper elevation={0} sx={{ mt: 2, borderRadius: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            flexDirection: 'row-reverse',
          }}
        >
          <Avatar sx={{ bgcolor: '#F3F4F6', width: 40, height: 40 }}>
            <Person sx={{ color: '#9CA3AF' }} />
          </Avatar>
          <Typography
            sx={{
              flexGrow: 1,
              textAlign: 'left',
              color: '#6B7280',
              fontSize: 14,
            }}
            dir="ltr"
          >
            0912xxxxxxxx
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ mt: 2, borderRadius: 0 }}>
        <List disablePadding>
          {menuItemsData.map((item) => (
            <MobileMenuItem
              key={item.id}
              item={item}
              onClick={() => navigate(item.path)}
            />
          ))}
        </List>
      </Paper>

      <Paper elevation={0} sx={{ mt: 2, borderRadius: 0 }}>
        <ListItemButton
          sx={{
            py: 2,
            px: 2,
            borderBottom: '1px solid #F3F4F6',
            display: 'flex',
            flexDirection: 'row-reverse',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HelpOutline sx={{ color: '#6B7280' }} />
            <Typography sx={{ color: '#374151', fontSize: 14 }}>
              راهنما و پشتیبانی
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <ChevronLeft sx={{ color: '#9CA3AF', fontSize: 20 }} />
        </ListItemButton>
        <ListItemButton
          sx={{ py: 2, px: 2, display: 'flex', flexDirection: 'row-reverse' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Logout sx={{ color: '#EF4444' }} />
            <Typography sx={{ color: '#EF4444', fontSize: 14 }}>
              خروج
            </Typography>
          </Box>
        </ListItemButton>
      </Paper>
    </Box>
  );
};

const MobileContentPage = ({ config }) => {
  const { navigate } = useRouter();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F5F5', pb: 10 }}>
      <MobileHeader
        title={config.title}
        showBack
        onBack={() => navigate('/profile')}
      />
      <Box sx={{ p: 2 }}>
        <Paper elevation={0} sx={{ borderRadius: 3, p: 3 }}>
          <EmptyState
            title={config.emptyTitle}
            description={config.emptyDesc}
          />
        </Paper>
      </Box>
    </Box>
  );
};

// ============ DESKTOP COMPONENTS ============
const DesktopHeader = () => (
  <AppBar
    position="static"
    elevation={0}
    sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB' }}
  >
    <Toolbar
      sx={{
        justifyContent: 'space-between',
        maxWidth: 1280,
        width: '100%',
        mx: 'auto',
        px: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold">
        <Box component="span" sx={{ color: '#1E88E5' }}>
          azki
        </Box>
        <Box component="span" sx={{ color: '#F59E0B' }}>
          vam
        </Box>
      </Typography>
      <TextField
        placeholder="جستجو"
        size="small"
        sx={{
          width: 280,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: '#F9FAFB',
            '& fieldset': { borderColor: '#E5E7EB' },
            '&:hover fieldset': { borderColor: '#D1D5DB' },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search sx={{ color: '#9CA3AF' }} />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton sx={{ color: '#6B7280' }}>
          <Person />
        </IconButton>
        <Button
          variant="contained"
          disableElevation
          sx={{
            borderRadius: 2,
            bgcolor: '#1E88E5',
            px: 3,
            py: 1,
            '&:hover': { bgcolor: '#1976D2' },
          }}
        >
          درخواست اعتبار
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

const DesktopSecondaryNav = () => (
  <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB' }}>
    <Toolbar
      variant="dense"
      sx={{
        maxWidth: 1280,
        mx: 'auto',
        justifyContent: 'space-between',
        px: 3,
        minHeight: 48,
      }}
    >
      <Box sx={{ display: 'flex', gap: 4 }}>
        {navLinksData.map((link) => (
          <Link
            key={link}
            href="#"
            underline="none"
            sx={{
              color: '#4B5563',
              fontSize: 13,
              '&:hover': { color: '#1E88E5' },
            }}
          >
            {link}
          </Link>
        ))}
      </Box>
      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: 13 }}>
        نیاز به راهنمایی دارید؟
      </Typography>
    </Toolbar>
  </Box>
);

const DesktopSidebar = () => {
  const { currentPath, navigate } = useRouter();

  return (
    <Paper
      elevation={0}
      sx={{
        width: 280,
        borderRadius: 3,
        p: 2,
        flexShrink: 0,
        height: 'fit-content',
        border: '1px solid #E5E7EB',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          pb: 2,
          mb: 2,
          borderBottom: '1px solid #F3F4F6',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar sx={{ width: 44, height: 44, bgcolor: '#F3F4F6' }}>
            <Person sx={{ color: '#9CA3AF' }} />
          </Avatar>
          <Box
            sx={{
              position: 'absolute',
              bottom: 2,
              left: 2,
              width: 10,
              height: 10,
              bgcolor: '#22C55E',
              borderRadius: '50%',
              border: '2px solid white',
            }}
          />
        </Box>
        <Typography sx={{ flex: 1, color: '#6B7280', fontSize: 14 }}>
          ۰۹۱۲۹۳۴۲۸۹۰
        </Typography>
        <IconButton size="small" sx={{ color: '#1E88E5' }}>
          <ChevronLeft />
        </IconButton>
      </Box>

      <List disablePadding>
        {menuItemsData.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <ListItemButton
              key={item.id}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1.5,
                bgcolor: isActive ? '#1E88E5' : 'transparent',
                '&:hover': { bgcolor: isActive ? '#1976D2' : '#F3F4F6' },
              }}
            >
              <ListItemIcon
                sx={{ minWidth: 32, color: isActive ? 'white' : '#1E88E5' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiTypography-root': {
                    fontSize: 14,
                    color: isActive ? 'white' : '#374151',
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      <List disablePadding>
        <ListItemButton sx={{ borderRadius: 2, py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <HelpOutline sx={{ color: '#6B7280' }} />
          </ListItemIcon>
          <ListItemText
            primary="راهنما و پشتیبانی"
            sx={{ '& .MuiTypography-root': { fontSize: 14, color: '#374151' } }}
          />
        </ListItemButton>
        <ListItemButton sx={{ borderRadius: 2, py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Logout sx={{ color: '#EF4444' }} />
          </ListItemIcon>
          <ListItemText
            primary="خروج"
            sx={{ '& .MuiTypography-root': { fontSize: 14, color: '#EF4444' } }}
          />
        </ListItemButton>
      </List>
    </Paper>
  );
};

const DesktopContent = ({ config }) => (
  <Box sx={{ flex: 1 }}>
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        p: 4,
        border: '1px solid #E5E7EB',
        minHeight: 500,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ mb: 2, color: '#1a1a1a', textAlign: 'right' }}
      >
        {config.title}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <EmptyState title={config.emptyTitle} description={config.emptyDesc} />
    </Paper>
  </Box>
);

// ============ MAIN APP ============
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState('/transactions');
  const isMobile = useMediaQuery('(max-width:900px)');
  const navigate = (path) => setCurrentPath(path);
  const config = pageConfig[currentPath] || pageConfig['/transactions'];
  const isProfilePage = currentPath === '/profile';

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterContext.Provider value={{ currentPath, navigate }}>
          <Box dir="rtl" sx={{ minHeight: '100vh', bgcolor: '#EFF6FF' }}>
            {isMobile ? (
              <>
                {isProfilePage ? (
                  <MobileProfilePage />
                ) : (
                  <MobileContentPage config={config} />
                )}
                <MobileBottomNav />
              </>
            ) : (
              <>
                <DesktopHeader />
                <DesktopSecondaryNav />
                <Box
                  sx={{
                    maxWidth: 1280,
                    mx: 'auto',
                    p: 3,
                    display: 'flex',
                    gap: 3,
                  }}
                >
                  <DesktopSidebar />
                  {/* <DesktopContent config={config} />
                   */}
                  <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                  </main>
                </Box>
              </>
            )}
          </Box>
        </RouterContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}
