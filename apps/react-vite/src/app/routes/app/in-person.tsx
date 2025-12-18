import { Box, Typography } from '@mui/material';

const InPersonRoute = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" fontWeight="600">
        خرید حضوری
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        راهنمای خرید حضوری و اطلاعات فروشگاه‌های طرف قرارداد در این بخش
        قرار می‌گیرد.
      </Typography>
    </Box>
  );
};

export default InPersonRoute;
