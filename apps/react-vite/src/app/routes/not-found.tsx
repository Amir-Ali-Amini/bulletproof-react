import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

import { paths } from '@/config/paths';

const NotFoundRoute = () => {
  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" fontWeight="600">
        ۴۰۴ - صفحه پیدا نشد
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابجا شده است.
      </Typography>
      <Button
        component={RouterLink}
        to={paths.app.payment.getHref()}
        variant="contained"
        sx={{ mt: 2 }}
      >
        بازگشت به داشبورد
      </Button>
    </Box>
  );
};

export default NotFoundRoute;
