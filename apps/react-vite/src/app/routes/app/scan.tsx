import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

const ScanPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const [scannedValue, setScannedValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const startScanner = async () => {
      if (!('BarcodeDetector' in window)) {
        setError('مرورگر شما از شناسایی خودکار QR پشتیبانی نمی‌کند.');
        return;
      }

      try {
        detectorRef.current = new (window as any).BarcodeDetector({
          formats: ['qr_code'],
        });
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          await videoRef.current.play();
          scanFrame();
          setIsScanning(true);
        }
      } catch (err) {
        setError('امکان دسترسی به دوربین وجود ندارد.');
      }
    };

    startScanner();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const scanFrame = async () => {
    if (
      !videoRef.current ||
      videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA ||
      !detectorRef.current
    ) {
      requestAnimationFrame(scanFrame);
      return;
    }

    try {
      const barcodes = await detectorRef.current.detect(videoRef.current);
      if (barcodes.length > 0) {
        setScannedValue(barcodes[0].rawValue || '');
        setIsScanning(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
        return;
      }
    } catch (err) {
      setError('در پردازش تصویر مشکلی پیش آمد.');
    }
    requestAnimationFrame(scanFrame);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight="600">
        اسکن QR کد
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        دوربین خود را روی QR کد بگیرید تا مقدار آن شناسایی شود. در صورت عدم
        پشتیبانی مرورگر، مقدار کد را می‌توانید به صورت دستی وارد کنید.
      </Typography>

      {error && <Alert severity="warning">{error}</Alert>}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px dashed #CBD5E1',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', background: '#000' }}>
          <video ref={videoRef} playsInline muted style={{ width: '100%' }} />
          {!isScanning && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                bgcolor: 'rgba(0,0,0,0.4)',
              }}
            >
              {scannedValue ? 'کد شناسایی شد' : 'در انتظار دوربین'}
            </Box>
          )}
        </Box>
      </Paper>

      <TextField
        label="مقدار QR"
        value={scannedValue}
        onChange={(e) => setScannedValue(e.target.value)}
        fullWidth
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => navigator.clipboard.writeText(scannedValue)}
          disabled={!scannedValue}
        >
          کپی مقدار
        </Button>
        <Button variant="outlined" onClick={() => setScannedValue('')}>
          پاک کردن
        </Button>
      </Box>
    </Box>
  );
};

export default ScanPage;
