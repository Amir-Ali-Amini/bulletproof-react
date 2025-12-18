import { PropsWithChildren, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
  Paper,
  Avatar,
  Divider,
  CssBaseline,
  ThemeProvider,
  createTheme,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  Person,
  HelpOutline,
  Logout,
  ChevronLeft,
  Home,
  Store,
  CreditCard,
  ArrowBack,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

import { DASHBOARD_NAV_ITEMS, NAV_LINKS } from './navbar';
import { paths } from '@/config/paths';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl',
  typography: { fontFamily: 'Vazir, Vazirmatn, Tahoma, sans-serif' },
  palette: {
    primary: { main: '#1E88E5', light: '#E3F2FD' },
    background: { default: '#F0F4F8' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
  },
});

const MOBILE_SHORTCUTS = [
  {
    id: 'home',
    label: 'خانه',
    path: paths.app.inPerson.getHref(),
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
    path: paths.app.payment.getHref(),
    label: 'خرید حضوری',
    icon: <Store />,
  },
  {
    id: 'credits',
    label: 'اعتبارهای من',
    path: paths.app.credits.getHref(),
    icon: <CreditCard />,
  },
];

type NavigationProps = {
  activePath: string;
  onNavigate: (path: string) => void;
};

const DesktopHeader = () => (
  <AppBar
    position="static"
    elevation={0}
    sx={{
      bgcolor: 'white',
      borderBottom: '1px solid #E5E7EB',
      flexShrink: 0, // prevent header from shrinking
    }}
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
  <Box
    sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}
  >
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
        {NAV_LINKS.map((link) => (
          <Typography
            key={link}
            component="a"
            href="#"
            sx={{
              color: '#4B5563',
              fontSize: 13,
              textDecoration: 'none',
              '&:hover': { color: '#1E88E5' },
            }}
          >
            {link}
          </Typography>
        ))}
      </Box>
      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: 13 }}>
        نیاز به راهنمایی دارید؟
      </Typography>
    </Toolbar>
  </Box>
);

const DesktopSidebar = ({ activePath, onNavigate }: NavigationProps) => (
  <Paper
    elevation={0}
    sx={{
      width: 280,
      borderRadius: 3,
      p: 2,
      flexShrink: 0,
      height: 'fit-content',
      border: '1px solid #E5E7EB',
      alignSelf: 'flex-start', // keeps sidebar at top
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
      <Avatar sx={{ width: 44, height: 44, bgcolor: '#F3F4F6' }}>
        <Person sx={{ color: '#9CA3AF' }} />
      </Avatar>
      <Typography sx={{ flex: 1, color: '#6B7280', fontSize: 14 }}>
        حساب کاربری
      </Typography>
      <IconButton size="small" sx={{ color: '#1E88E5' }}>
        <ChevronLeft />
      </IconButton>
    </Box>

    <List disablePadding>
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const isActive = activePath === item.path;
        return (
          <ListItemButton
            key={item.id}
            onClick={() => onNavigate(item.path)}
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

type MobileHeaderProps = {
  showMenu: boolean;
  onToggleMenu: () => void;
};

const MobileHeader = ({ showMenu, onToggleMenu }: MobileHeaderProps) => (
  <AppBar
    position="static"
    color="inherit"
    elevation={0}
    sx={{ bgcolor: 'white', borderBottom: '1px solid #E5E7EB', flexShrink: 0 }}
  >
    <Toolbar sx={{ minHeight: 56 }}>
      <Typography
        variant="h6"
        sx={{ flexGrow: 1, color: '#1E88E5', fontWeight: 600, fontSize: 16 }}
      >
        {showMenu ? 'منوی اصلی' : 'پنل کاربری'}
      </Typography>
      <IconButton sx={{ color: '#1E88E5' }} onClick={onToggleMenu}>
        {showMenu ? <ArrowBack /> : <MenuIcon />}
      </IconButton>
    </Toolbar>
  </AppBar>
);

const MobileMenu = ({ onNavigate }: { onNavigate: (path: string) => void }) => (
  <Paper elevation={0} sx={{ mt: 2, borderRadius: 3 }}>
    <List disablePadding>
      {DASHBOARD_NAV_ITEMS.map((item) => (
        <ListItemButton
          key={item.id}
          onClick={() => onNavigate(item.path)}
          sx={{ borderBottom: '1px solid #F3F4F6' }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: '#1E88E5' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
          <ChevronLeft sx={{ color: '#CBD5F5' }} />
        </ListItemButton>
      ))}
    </List>
  </Paper>
);

const MobileBottomNav = ({ activePath, onNavigate }: NavigationProps) => (
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
    <BottomNavigation
      value={activePath}
      onChange={(_, value) => onNavigate(value)}
      sx={{ bgcolor: 'white', height: 64 }}
    >
      {MOBILE_SHORTCUTS.map((item) => (
        <BottomNavigationAction
          key={item.id}
          label={item.label}
          icon={item.icon}
          value={item.path}
          sx={{ '&.Mui-selected': { color: '#1E88E5' } }}
        />
      ))}
    </BottomNavigation>
  </Paper>
);

export function DashboardLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');
  const activePath = location.pathname;
  const [showMenu, setShowMenu] = useState(false);

  const handleNavigate = (path: string) => {
    if (path !== activePath) {
      navigate(path);
    }
  };

  const handleMenuToggle = () => setShowMenu((prev) => !prev);

  const handleMenuNavigate = (path: string) => {
    handleNavigate(path);
    setShowMenu(false);
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          dir="rtl"
          sx={{
            height: '100vh',
            bgcolor: '#EFF6FF',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {isMobile ? (
            <>
              <MobileHeader
                showMenu={showMenu}
                onToggleMenu={handleMenuToggle}
              />
              {showMenu ? (
                <Box sx={{ p: 2, pb: 10, flex: 1, overflowY: 'auto' }}>
                  <MobileMenu onNavigate={handleMenuNavigate} />
                </Box>
              ) : (
                <Box sx={{ p: 2, pb: 10, flex: 1, overflowY: 'auto' }}>
                  {children}
                </Box>
              )}
              <MobileBottomNav
                activePath={activePath}
                onNavigate={handleMenuNavigate}
              />
            </>
          ) : (
            <>
              <DesktopHeader />
              <DesktopSecondaryNav />
              <Box
                sx={{
                  maxWidth: '1280px',
                  mx: 'auto',
                  width: '100%',
                  p: 3,
                  display: 'flex',
                  gap: 3,
                  flex: 1,
                  minHeight: 0, // KEY: allows flex child to shrink
                }}
              >
                <DesktopSidebar
                  activePath={activePath}
                  onNavigate={handleNavigate}
                />
                <Paper
                  component="main"
                  elevation={0}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0, // KEY: allows this to shrink
                    borderRadius: 3,
                    p: 4,
                    border: '1px solid #E5E7EB',
                    overflowY: 'auto', // only this scrolls
                    overflowX: 'hidden',
                  }}
                >
                  {children}
                </Paper>
              </Box>
            </>
          )}
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
