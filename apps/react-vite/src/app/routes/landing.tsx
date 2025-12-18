import { useNavigate } from 'react-router';

import { Head } from '@/components/seo';
import { Button, Box } from '@mui/material';

const LandingRoute = () => {
  return (
    <>
      <Head description="Welcome to Azkivam react" title="test title" />
      <Box>hello</Box>
    </>
  );
};

export default LandingRoute;
