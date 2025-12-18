import { Box, Button, Typography } from '@mui/material';

export const MainErrorFallback = () => {
  return (
    <Box
      role="alert"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        color: '#B91C1C',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" fontWeight="600">
        خطایی رخ داده است
      </Typography>
      <Button
        variant="contained"
        sx={{ mt: 1 }}
        onClick={() => window.location.assign(window.location.origin)}
      >
        تلاش دوباره
      </Button>
    </Box>
  );
};
