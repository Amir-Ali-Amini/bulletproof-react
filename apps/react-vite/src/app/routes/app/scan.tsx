import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';

import { api } from '@/lib/api-client';

const SCAN_ENDPOINT = '/scan';

type ScanStatus = 'idle' | 'sending' | 'success' | 'error';

const ScanPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const nfcReaderRef = useRef<any>(null);
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isNfcScanning, setIsNfcScanning] = useState(false);
  const [nfcMessage, setNfcMessage] = useState('');
  const [nfcError, setNfcError] = useState('');

  useEffect(() => {
    startScanner();
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setIsNfcSupported(true);
    }
    return () => {
      stopStream();
      if (nfcReaderRef.current?.abort) {
        try {
          void nfcReaderRef.current.abort();
        } catch {
          // ignore abort errors on unsupported browsers
        }
      }
    };
  }, []);

  const startScanner = async () => {
    setError('');
    setStatus('idle');
    setStatusMessage('');

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
        setIsScanning(true);
        requestAnimationFrame(scanFrame);
      }
    } catch (err) {
      setError('امکان دسترسی به دوربین وجود ندارد.');
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

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
        const detectedValue = barcodes[0].rawValue || '';
        stopStream();
        if (detectedValue) {
          await sendValueToApi(detectedValue);
        } else {
          setError('کد معتبر شناسایی نشد.');
        }
        return;
      }
    } catch (err) {
      setError('در پردازش تصویر مشکلی پیش آمد.');
    }
    requestAnimationFrame(scanFrame);
  };

  const sendValueToApi = async (value: string) => {
    setStatus('sending');
    setStatusMessage('در حال ارسال به سرور...');
    try {
      await api.post(SCAN_ENDPOINT, { value });
      setStatus('success');
      setStatusMessage('کد با موفقیت ارسال شد.');
    } catch (err) {
      setStatus('error');
      setStatusMessage('ارسال کد با خطا مواجه شد. لطفا دوباره تلاش کنید.');
    }
  };

  const handleRescan = () => {
    stopStream();
    startScanner();
  };

  const handleNfcScan = async () => {
    setNfcError('');
    setNfcMessage('');

    if (!(typeof window !== 'undefined' && 'NDEFReader' in window)) {
      setNfcError('دستگاه شما از NFC پشتیبانی نمی‌کند.');
      return;
    }

    try {
      const reader = new (window as any).NDEFReader();
      nfcReaderRef.current = reader;
      setIsNfcScanning(true);
      setNfcMessage('کارت یا برچسب NFC را نزدیک کنید...');

      reader.onreading = async (event: any) => {
        const decoder = new TextDecoder();
        let value = '';

        if (event.message?.records?.length) {
          const record = event.message.records[0];
          value = decoder.decode(record.data);
        } else if (event.serialNumber) {
          value = String(event.serialNumber);
        }

        setIsNfcScanning(false);
        setNfcMessage('');
        reader.onreading = null;
        reader.onerror = null;
        nfcReaderRef.current = null;

        if (value) {
          await sendValueToApi(value);
        } else {
          setNfcError('داده‌ای از کارت خوانده نشد.');
        }
      };

      reader.onerror = () => {
        setIsNfcScanning(false);
        setNfcMessage('');
        setNfcError('خواندن NFC با خطا مواجه شد.');
      };

      await reader.scan();
    } catch (err) {
      setIsNfcScanning(false);
      setNfcMessage('');
      setNfcError('دسترسی به NFC امکان‌پذیر نیست یا توسط کاربر لغو شد.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight="600">
        اسکن و ارسال QR کد
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        دوربین را روی QR نگه دارید تا به صورت خودکار به سرور ارسال شود. محتوای
        کد نمایش داده نمی‌شود.
      </Typography>

      {error && <Alert severity="warning">{error}</Alert>}
      {status !== 'idle' && <Alert severity={status === 'success' ? 'success' : status === 'error' ? 'error' : 'info'}>{statusMessage}</Alert>}

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
                gap: 1,
                flexDirection: 'column',
              }}
            >
              {status === 'sending' ? (
                <>
                  <CircularProgress color="inherit" size={32} />
                  <Typography component="span">در حال ارسال...</Typography>
                </>
              ) : (
                <Typography component="span">
                  {status === 'success'
                    ? 'کد ارسال شد'
                    : 'برای شروع اسکن، روی دکمه زیر بزنید'}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #E2E8F0',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight="600">
          خواندن از طریق NFC
        </Typography>
        {!isNfcSupported && (
          <Alert severity="info">
            دستگاه یا مرورگر شما از NFC پشتیبانی نمی‌کند.
          </Alert>
        )}
        {nfcError && <Alert severity="error">{nfcError}</Alert>}
        {nfcMessage && <Alert severity="info">{nfcMessage}</Alert>}
        <Button
          variant="outlined"
          onClick={handleNfcScan}
          disabled={!isNfcSupported || isNfcScanning}
        >
          {isNfcScanning ? 'در انتظار کارت...' : 'شروع خواندن NFC'}
        </Button>
      </Paper>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleRescan}
          disabled={isScanning}
        >
          {isScanning ? 'در حال اسکن...' : 'اسکن مجدد'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setStatus('idle');
            setStatusMessage('');
          }}
        >
          پاک کردن پیام
        </Button>
      </Box>
    </Box>
  );
};

export default ScanPage;
