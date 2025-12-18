import { Box, Typography } from '@mui/material';

const CreditsRoute = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" fontWeight="600">
        اعتبارهای من
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        در این بخش می‌توانید وضعیت اعتبارهای فعال خود را مشاهده کنید.
      </Typography>
    </Box>
  );
};

export default CreditsRoute;
