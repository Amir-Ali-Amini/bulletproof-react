// // @ts-nocheck
// import { useEffect, useRef, useState } from 'react';
// import {
//   Alert,
//   Box,
//   Button,
//   CircularProgress,
//   Paper,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { Cancel, CheckCircle, Lock } from '@mui/icons-material';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// import { api, DEFAULT_BASE_URL } from '@/lib/api-client';

// const SCAN_ENDPOINT = '/checkout/pending/confirm';
// const BARCODE_POLYFILL_URL =
//   'https://cdn.jsdelivr.net/npm/@undecaf/barcode-detector-polyfill/dist/barcode-detector-polyfill.min.js';
// const JSQR_URL = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';

// let barcodePolyfillPromise: Promise<boolean> | null = null;
// let jsQrLoaderPromise: Promise<boolean> | null = null;
// const sendNFC = (value: string) =>
//   axios.post(
//     `${DEFAULT_BASE_URL}${SCAN_ENDPOINT}`,
//     { card_id: value }, // data (body)
//     {
//       // config
//       headers: {
//         'Cache-Control': 'no-cache, no-store, must-revalidate',
//         'ngrok-skip-browser-warning': 'true',
//         Pragma: 'no-cache',
//       },
//     },
//   );
// const ensureBarcodeDetector = async () => {
//   if (typeof window === 'undefined' || typeof document === 'undefined') {
//     return false;
//   }

//   if ('BarcodeDetector' in window) {
//     return true;
//   }

//   if (!barcodePolyfillPromise) {
//     barcodePolyfillPromise = new Promise<boolean>((resolve) => {
//       const script = document.createElement('script');
//       script.src = BARCODE_POLYFILL_URL;
//       script.async = true;
//       script.onload = () => {
//         resolve('BarcodeDetector' in window);
//       };
//       script.onerror = () => resolve(false);
//       document.head.appendChild(script);
//     });
//   }

//   return barcodePolyfillPromise;
// };

// const ensureJsQr = async () => {
//   if (typeof window === 'undefined' || typeof document === 'undefined') {
//     return false;
//   }

//   if ((window as any).jsQR) {
//     return true;
//   }

//   if (!jsQrLoaderPromise) {
//     jsQrLoaderPromise = new Promise<boolean>((resolve) => {
//       const script = document.createElement('script');
//       script.src = JSQR_URL;
//       script.async = true;
//       script.onload = () => resolve(Boolean((window as any).jsQR));
//       script.onerror = () => resolve(false);
//       document.head.appendChild(script);
//     });
//   }

//   return jsQrLoaderPromise;
// };

// type ScanStatus = 'idle' | 'sending' | 'success' | 'error';

// const ScanPage = () => {
//   const { cardId } = useParams<{ cardId?: string }>();
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const detectorRef = useRef<any>(null);
//   const [isScanning, setIsScanning] = useState(false);
//   const [error, setError] = useState('');
//   const [status, setStatus] = useState<ScanStatus>('idle');
//   const [statusMessage, setStatusMessage] = useState('');
//   const nfcReaderRef = useRef<any>(null);
//   const nfcAbortControllerRef = useRef<AbortController | null>(null);
//   const [isNfcSupported, setIsNfcSupported] = useState(false);
//   const [isNfcScanning, setIsNfcScanning] = useState(false);
//   const [nfcMessage, setNfcMessage] = useState('');
//   const [nfcError, setNfcError] = useState('');
//   const [cameraSupported, setCameraSupported] = useState(true);
//   const [secureOrigin, setSecureOrigin] = useState(true);
//   const detectionModeRef = useRef<'barcode' | 'jsqr' | 'none'>('none');
//   const [detectionMode, setDetectionMode] = useState<
//     'barcode' | 'jsqr' | 'none'
//   >('none');
//   const jsqrCanvasRef = useRef<HTMLCanvasElement | null>(null);
//   const jsqrCtxRef = useRef<CanvasRenderingContext2D | null>(null);
//   type NfcOverlayState = 'hidden' | 'pending' | 'success' | 'error';
//   const [nfcOverlayState, setNfcOverlayState] =
//     useState<NfcOverlayState>('hidden');
//   const [nfcOverlayMessage, setNfcOverlayMessage] = useState('');
//   const nfcOverlayTimeoutRef = useRef<number | null>(null);
//   const [isLocked, setIsLocked] = useState(true);
//   const [passwordInput, setPasswordInput] = useState('');
//   const [lockError, setLockError] = useState('');

//   useEffect(() => {
//     if (typeof window !== 'undefined' && 'NDEFReader' in window) {
//       setIsNfcSupported(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (isLocked) {
//       stopStream();
//       stopNfcScan();
//       hideNfcOverlay();
//       return;
//     }
//     startScanner();
//     return () => {
//       stopStream();
//       stopNfcScan();
//       hideNfcOverlay();
//     };
//   }, [isLocked]);

//   const setupDetection = async () => {
//     const detector = await getDetector();
//     if (detector) {
//       detectionModeRef.current = 'barcode';
//       setDetectionMode('barcode');
//       return true;
//     }

//     const jsQrReady = await ensureJsQr();
//     if (jsQrReady) {
//       detectionModeRef.current = 'jsqr';
//       setDetectionMode('jsqr');
//       if (!jsqrCanvasRef.current) {
//         jsqrCanvasRef.current = document.createElement('canvas');
//       }
//       if (!jsqrCtxRef.current && jsqrCanvasRef.current) {
//         jsqrCtxRef.current = jsqrCanvasRef.current.getContext('2d', {
//           willReadFrequently: true,
//         });
//       }
//       return Boolean(jsqrCtxRef.current);
//     }

//     detectionModeRef.current = 'none';
//     setDetectionMode('none');
//     return false;
//   };

//   const startScanner = async () => {
//     setError('');
//     setStatus('idle');
//     setStatusMessage('');

//     const detectionReady = await setupDetection();
//     if (!detectionReady) {
//       setError('مرورگر شما از اسکن QR پشتیبانی نمی‌کند.');
//       return;
//     }

//     const isSecure =
//       typeof window === 'undefined'
//         ? true
//         : window.isSecureContext || window.location.hostname === 'localhost';
//     setSecureOrigin(isSecure);
//     if (!isSecure) {
//       setError('برای استفاده از دوربین، لطفا برنامه را روی HTTPS اجرا کنید.');
//       setCameraSupported(false);
//       return;
//     }

//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       setCameraSupported(false);
//       setError('مرورگر شما به دوربین دسترسی ندارد.');
//       return;
//     }

//     try {
//       streamRef.current = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'environment' },
//       });
//       setCameraSupported(true);
//       if (videoRef.current) {
//         videoRef.current.srcObject = streamRef.current;
//         await videoRef.current.play();
//         setIsScanning(true);
//         requestAnimationFrame(scanFrame);
//       }
//     } catch (err) {
//       // setError('امکان دسترسی به دوربین وجود ندارد.');
//     }
//   };

//   const getDetector = async () => {
//     if (detectorRef.current) {
//       return detectorRef.current;
//     }
//     const ready = await ensureBarcodeDetector();
//     if (!ready) {
//       return null;
//     }
//     detectorRef.current = new (window as any).BarcodeDetector({
//       formats: ['qr_code'],
//     });
//     return detectorRef.current;
//   };

//   const stopStream = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     setIsScanning(false);
//   };

//   const stopNfcScan = () => {
//     if (nfcAbortControllerRef.current) {
//       try {
//         nfcAbortControllerRef.current.abort();
//       } catch {
//         // ignore abort failures
//       }
//       nfcAbortControllerRef.current = null;
//     }
//     nfcReaderRef.current = null;
//     setIsNfcScanning(false);
//     setNfcMessage('');
//   };

//   const hideNfcOverlay = () => {
//     if (nfcOverlayTimeoutRef.current) {
//       window.clearTimeout(nfcOverlayTimeoutRef.current);
//       nfcOverlayTimeoutRef.current = null;
//     }
//     setNfcOverlayState('hidden');
//     setNfcOverlayMessage('');
//   };

//   const showNfcOverlay = (
//     state: NfcOverlayState,
//     message: string,
//     autoHideMs?: number,
//   ) => {
//     if (nfcOverlayTimeoutRef.current) {
//       window.clearTimeout(nfcOverlayTimeoutRef.current);
//       nfcOverlayTimeoutRef.current = null;
//     }
//     setNfcOverlayState(state);
//     setNfcOverlayMessage(message);
//     if (autoHideMs) {
//       nfcOverlayTimeoutRef.current = window.setTimeout(() => {
//         hideNfcOverlay();
//       }, autoHideMs);
//     }
//   };

//   const triggerNfcEffect = () => {
//     setShowNfcEffect(true);
//     if (nfcEffectTimeoutRef.current) {
//       window.clearTimeout(nfcEffectTimeoutRef.current);
//     }
//     nfcEffectTimeoutRef.current = window.setTimeout(() => {
//       setShowNfcEffect(false);
//       nfcEffectTimeoutRef.current = null;
//     }, 1800);
//   };

//   const scanFrame = async () => {
//     const video = videoRef.current;
//     if (
//       !video ||
//       video.readyState !== video.HAVE_ENOUGH_DATA ||
//       detectionModeRef.current === 'none'
//     ) {
//       requestAnimationFrame(scanFrame);
//       return;
//     }

//     try {
//       if (detectionModeRef.current === 'barcode' && detectorRef.current) {
//         const barcodes = await detectorRef.current.detect(video);
//         if (barcodes.length > 0) {
//           const detectedValue = barcodes[0].rawValue || '';
//           stopStream();
//           if (detectedValue) {
//             await sendValueToApi(detectedValue);
//           } else {
//             setError('کد معتبر شناسایی نشد.');
//           }
//           return;
//         }
//       } else if (detectionModeRef.current === 'jsqr') {
//         const jsqr = (window as any).jsQR;
//         const canvas = jsqrCanvasRef.current;
//         const ctx =
//           jsqrCtxRef.current ||
//           canvas?.getContext('2d', { willReadFrequently: true });
//         if (!jsqr || !canvas || !ctx) {
//           requestAnimationFrame(scanFrame);
//           return;
//         }
//         jsqrCtxRef.current = ctx;
//         const width = video.videoWidth;
//         const height = video.videoHeight;
//         if (!width || !height) {
//           requestAnimationFrame(scanFrame);
//           return;
//         }
//         canvas.width = width;
//         canvas.height = height;
//         ctx.drawImage(video, 0, 0, width, height);
//         const imageData = ctx.getImageData(0, 0, width, height);
//         const result = jsqr(imageData.data, width, height);
//         if (result?.data) {
//           stopStream();
//           await sendValueToApi(result.data);
//           return;
//         }
//       }
//     } catch (err) {
//       setError('در پردازش تصویر مشکلی پیش آمد.');
//     }
//     requestAnimationFrame(scanFrame);
//   };

//   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
//   // sendNFC(cardId);
//   // api.post(SCAN_ENDPOINT, 'test_endpoint', { headers: {} });
//   const sendValueToApi = async (value: string) => {
//     setStatus('sending');
//     setStatusMessage('در حال ارسال به سرور...');
//     try {
//       await sendNFC(value);
//       // await api.post(SCAN_ENDPOINT, { value });

//       setStatus('success');
//       setStatusMessage('کد با موفقیت ارسال شد.');
//     } catch (err) {
//       setStatus('error');
//       setStatusMessage('تراکنشی وجود ندارد. لطفا از فروشنده بخواهید تراکنش را ثبت کند.');
//     }
//   };

//   const confirmNfcSubmission = async (value: string) => {
//     showNfcOverlay('pending', 'در حال ارسال درخواست به سرور...');
//     try {
//       // await new Promise((resolve) => setTimeout(resolve, 2500));
//       await sendNFC(value);
//       // await api.post(SCAN_ENDPOINT, { value });
//       showNfcOverlay(
//         'success',
//         'کارت شما شناسایی شد، می‌توانید کارت را بردارید.',
//         2500,
//       );
//     } catch (err) {
//       showNfcOverlay(
//         'error',
//         'تایید پرداخت ناموفق بود. لطفا دوباره تلاش کنید.',
//         3000,
//       );
//     }
//   };

//   const handleUnlock = () => {
//     if (passwordInput.trim() === '1111') {
//       setIsLocked(false);
//       setPasswordInput('');
//       setLockError('');
//     } else {
//       setLockError('رمز عبور نادرست است.');
//     }
//   };

//   const handleRescan = () => {
//     stopStream();
//     stopNfcScan();
//     hideNfcOverlay();
//     startScanner();
//   };

//   const handleNfcScanTest = async () => {
//     await confirmNfcSubmission(cardId);
//   };
//   const handleNfcScan = async () => {
//     setNfcError('');
//     setNfcMessage('');
//     hideNfcOverlay();

//     if (
//       !(
//         typeof window !== 'undefined' &&
//         window.isSecureContext &&
//         'NDEFReader' in window
//       )
//     ) {
//       setNfcError(
//         'برای استفاده از NFC باید از مرورگر سازگار در HTTPS استفاده کنید.',
//       );
//       return;
//     }

//     try {
//       stopNfcScan();
//       const reader = new (window as any).NDEFReader();
//       const abortController = new AbortController();
//       nfcAbortControllerRef.current = abortController;
//       nfcReaderRef.current = reader;
//       setIsNfcScanning(true);
//       setNfcMessage('کارت یا برچسب NFC را نزدیک کنید...');

//       reader.onreading = async (event: any) => {
//         const decoder = new TextDecoder();
//         let value = '';

//         if (event.message?.records?.length) {
//           for (const record of event.message.records) {
//             if (record.recordType === 'text' && record.data) {
//               const dataView = record.data as DataView;
//               const buffer = dataView.buffer.slice(
//                 dataView.byteOffset,
//                 dataView.byteOffset + dataView.byteLength,
//               );
//               value = decoder.decode(new Uint8Array(buffer));
//               break;
//             }
//             if (record.data && !value) {
//               const dataView = record.data as DataView;
//               const buffer = dataView.buffer.slice(
//                 dataView.byteOffset,
//                 dataView.byteOffset + dataView.byteLength,
//               );
//               value = Array.from(new Uint8Array(buffer))
//                 .map((b) => b.toString(16).padStart(2, '0'))
//                 .join('');
//             }
//           }
//         } else if (event.serialNumber) {
//           value = String(event.serialNumber);
//         }

//         stopNfcScan();

//         const payload = cardId || value || 'NFC_TAG_DETECTED';
//         if (cardId) {
//           setNfcMessage('شناسه کارت از آدرس خوانده شد. در حال تایید تراکنش...');
//         } else if (value) {
//           setNfcMessage('داده کارت دریافت شد. در حال تایید تراکنش...');
//         } else {
//           setNfcError('');
//           setNfcMessage('کارت شناسایی شد. در حال تایید تراکنش...');
//         }

//         await confirmNfcSubmission(payload);
//       };

//       reader.onerror = () => {
//         stopNfcScan();
//         setNfcError('پرداخت NFC با خطا مواجه شد.');
//         hideNfcOverlay();
//       };

//       await reader.scan({ signal: abortController.signal });
//     } catch (err) {
//       stopNfcScan();
//       setNfcError('دسترسی به NFC امکان‌پذیر نیست یا توسط کاربر لغو شد.');
//       hideNfcOverlay();
//     }
//   };

//   return (
//     <>
//       {isLocked && (
//         <Box
//           sx={{
//             position: 'fixed',
//             inset: 0,
//             zIndex: 1500,
//             backgroundImage:
//               'linear-gradient(135deg, rgba(8,47,73,0.95), rgba(15,23,42,0.95))',
//             color: 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             px: 2,
//           }}
//         >
//           <Paper
//             elevation={8}
//             sx={{
//               width: '100%',
//               maxWidth: 380,
//               borderRadius: 4,
//               p: 4,
//               bgcolor: 'rgba(15, 23, 42, 0.85)',
//               color: 'white',
//               border: '1px solid rgba(148, 163, 184, 0.3)',
//               backdropFilter: 'blur(14px)',
//               textAlign: 'center',
//             }}
//           >
//             <Box
//               sx={{
//                 width: 72,
//                 height: 72,
//                 borderRadius: '50%',
//                 bgcolor: 'rgba(59, 130, 246, 0.15)',
//                 mx: 'auto',
//                 mb: 2,
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <Lock sx={{ fontSize: 38, color: '#60A5FA' }} />
//             </Box>
//             <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
//               دسترسی محافظت‌شده
//             </Typography>
//             <Typography variant="body2" sx={{ mb: 3, color: '#CBD5F5' }}>
//               برای ورود به صفحه اسکن، رمز عبور چهار رقمی را وارد کنید.
//             </Typography>
//             <TextField
//               value={passwordInput}
//               onChange={(e) => {
//                 setPasswordInput(e.target.value);
//                 setLockError('');
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   handleUnlock();
//                 }
//               }}
//               label="رمز ۴ رقمی"
//               variant="filled"
//               type="password"
//               inputProps={{ inputMode: 'numeric', maxLength: 4 }}
//               sx={{
//                 mb: 2,
//                 '& .MuiInputBase-input': {
//                   textAlign: 'center',
//                   letterSpacing: 6,
//                   fontSize: 26,
//                   color: 'white',
//                 },
//                 '& .MuiFilledInput-root': {
//                   borderRadius: 2,
//                   bgcolor: 'rgba(148, 163, 184, 0.1)',
//                 },
//                 '& .MuiFilledInput-root:before': { borderBottom: 'none' },
//                 '& .MuiFilledInput-root:after': {
//                   borderBottom: '2px solid #60A5FA',
//                 },
//               }}
//             />
//             {lockError && (
//               <Typography color="#F87171" fontWeight="600" sx={{ mb: 2 }}>
//                 {lockError}
//               </Typography>
//             )}
//             <Button
//               variant="contained"
//               onClick={handleUnlock}
//               fullWidth
//               sx={{
//                 py: 1.2,
//                 borderRadius: 3,
//                 bgcolor: '#2563EB',
//                 '&:hover': { bgcolor: '#1D4ED8' },
//               }}
//             >
//               تایید و ورود
//             </Button>
//             <Typography variant="caption" sx={{ mt: 2, color: '#94A3B8' }}>
//               برای امنیت بیشتر رمز عبور پس از هر بار خروج دوباره درخواست می‌شود.
//             </Typography>
//           </Paper>
//         </Box>
//       )}
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
//         {/* <Typography variant="h6" fontWeight="600">
//           اسکن و ارسال QR کد
//         </Typography>
//         <Typography sx={{ color: 'text.secondary' }}>
//           دوربین را روی QR نگه دارید تا به صورت خودکار به سرور ارسال شود. محتوای
//           کد نمایش داده نمی‌شود.
//         </Typography>

//         {detectionMode === 'jsqr' && (
//           <Alert severity="info">
//             حالت سازگار با همه مرورگرها فعال شده است؛ فرایند اسکن ممکن است کمی
//             طولانی‌تر شود.
//           </Alert>
//         )}

//         {error && <Alert severity="warning">{error}</Alert>}
//         {status !== 'idle' && (
//           <Alert
//             severity={
//               status === 'success'
//                 ? 'success'
//                 : status === 'error'
//                   ? 'error'
//                   : 'info'
//             }
//           >
//             {statusMessage}
//           </Alert>
//         )} */}

//         {/* <Paper
//           elevation={0}
//           sx={{
//             borderRadius: 3,
//             border: '1px dashed #CBD5E1',
//             overflow: 'hidden',
//           }}
//         >
//           <Box sx={{ position: 'relative', background: '#000' }}>
//             <video ref={videoRef} playsInline muted style={{ width: '100%' }} />
//             {(!isScanning || !cameraSupported) && (
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   inset: 0,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: 'white',
//                   bgcolor: 'rgba(0,0,0,0.4)',
//                   gap: 1,
//                   flexDirection: 'column',
//                 }}
//               >
//                 {cameraSupported ? (
//                   status === 'sending' ? (
//                     <>
//                       <CircularProgress color="inherit" size={32} />
//                       <Typography component="span">در حال ارسال...</Typography>
//                     </>
//                   ) : (
//                     <Typography component="span">
//                       {status === 'success'
//                         ? 'کد ارسال شد'
//                         : 'برای شروع اسکن، روی دکمه زیر بزنید'}
//                     </Typography>
//                   )
//                 ) : (
//                   <>
//                     <Typography component="span">
//                       استفاده از دوربین در این شرایط ممکن نیست.
//                     </Typography>
//                     {!secureOrigin && (
//                       <Typography component="span" sx={{ fontSize: 12 }}>
//                         برنامه را روی دامنه‌ی HTTPS یا localhost اجرا کنید.
//                       </Typography>
//                     )}
//                   </>
//                 )}
//               </Box>
//             )}
//           </Box>
//         </Paper> */}

//         <Paper
//           elevation={0}
//           sx={{
//             borderRadius: 3,
//             border: '1px solid #E2E8F0',
//             p: 3,
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 2,
//           }}
//         >
//           <Typography variant="h6" fontWeight="600">
//             پرداخت از طریق NFC
//           </Typography>
//           {!isNfcSupported && (
//             <Alert severity="info">
//               دستگاه یا مرورگر شما از NFC پشتیبانی نمی‌کند.
//             </Alert>
//           )}
//           {nfcError && <Alert severity="error">{nfcError}</Alert>}
//           {nfcMessage && <Alert severity="info">{nfcMessage}</Alert>}
//           <Button
//             variant="outlined"
//             onClick={handleNfcScan}
//             disabled={!isNfcSupported || isNfcScanning}
//           >
//             {isNfcScanning ? 'در انتظار کارت...' : 'شروع فرایند NFC'}
//           </Button>
//           {/* <Button variant="outlined" onClick={handleNfcScanTest}>
//             {'تست NFC'}
//           </Button> */}
//         </Paper>

//         {/* <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="contained"
//             onClick={handleRescan}
//             disabled={isScanning || !cameraSupported}
//           >
//             {isScanning ? 'در حال اسکن...' : 'اسکن مجدد'}
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={() => {
//               setStatus('idle');
//               setStatusMessage('');
//             }}
//           >
//             پاک کردن پیام
//           </Button>
//         </Box> */}
//       </Box>
//       {nfcOverlayState !== 'hidden' && (
//         <Box
//           sx={{
//             position: 'fixed',
//             inset: 0,
//             bgcolor:
//               nfcOverlayState === 'error'
//                 ? 'rgba(220, 38, 38, 0.92)'
//                 : nfcOverlayState === 'pending'
//                   ? 'rgba(234, 179, 8, 0.92)'
//                   : 'rgba(22, 163, 74, 0.92)',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             color: 'white',
//             textAlign: 'center',
//             zIndex: 1300,
//             gap: 2,
//             px: 2,
//           }}
//         >
//           {nfcOverlayState === 'pending' ? (
//             <CircularProgress color="inherit" size={72} thickness={4} />
//           ) : nfcOverlayState === 'success' ? (
//             <CheckCircle sx={{ fontSize: 96 }} />
//           ) : (
//             <Cancel sx={{ fontSize: 96 }} />
//           )}
//           <Typography variant="h4" fontWeight="700">
//             {nfcOverlayState === 'pending'
//               ? 'در حال تایید پرداخت...'
//               : nfcOverlayState === 'success'
//                 ? 'پرداخت تایید شد'
//                 : 'پرداخت تایید نشد'}
//           </Typography>
//           {nfcOverlayMessage && (
//             <Typography variant="h6">{nfcOverlayMessage}</Typography>
//           )}
//         </Box>
//       )}
//     </>
//   );
// };

// export default ScanPage;

// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  keyframes,
} from '@mui/material';
import { Cancel, CheckCircle, Lock } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { api, DEFAULT_BASE_URL } from '@/lib/api-client';

const SCAN_ENDPOINT = '/checkout/pending/confirm';
const BARCODE_POLYFILL_URL =
  'https://cdn.jsdelivr.net/npm/@undecaf/barcode-detector-polyfill/dist/barcode-detector-polyfill.min.js';
const JSQR_URL = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';

// Animations
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ripple = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`;

let barcodePolyfillPromise: Promise<boolean> | null = null;
let jsQrLoaderPromise: Promise<boolean> | null = null;

const sendNFC = (value: string) =>
  axios.post(
    `${DEFAULT_BASE_URL}${SCAN_ENDPOINT}`,
    { card_id: value },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'ngrok-skip-browser-warning': 'true',
        Pragma: 'no-cache',
      },
    },
  );

const ensureBarcodeDetector = async () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if ('BarcodeDetector' in window) {
    return true;
  }
  if (!barcodePolyfillPromise) {
    barcodePolyfillPromise = new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = BARCODE_POLYFILL_URL;
      script.async = true;
      script.onload = () => resolve('BarcodeDetector' in window);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }
  return barcodePolyfillPromise;
};

const ensureJsQr = async () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if ((window as any).jsQR) {
    return true;
  }
  if (!jsQrLoaderPromise) {
    jsQrLoaderPromise = new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = JSQR_URL;
      script.async = true;
      script.onload = () => resolve(Boolean((window as any).jsQR));
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }
  return jsQrLoaderPromise;
};

type ScanStatus = 'idle' | 'sending' | 'success' | 'error';
type NfcOverlayState = 'hidden' | 'pending' | 'success' | 'error';

const ScanPage = () => {
  const { cardId } = useParams<{ cardId?: string }>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const nfcReaderRef = useRef<any>(null);
  const nfcAbortControllerRef = useRef<AbortController | null>(null);
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isNfcScanning, setIsNfcScanning] = useState(false);
  const [nfcMessage, setNfcMessage] = useState('');
  const [nfcError, setNfcError] = useState('');
  const [cameraSupported, setCameraSupported] = useState(true);
  const [secureOrigin, setSecureOrigin] = useState(true);
  const detectionModeRef = useRef<'barcode' | 'jsqr' | 'none'>('none');
  const [detectionMode, setDetectionMode] = useState<
    'barcode' | 'jsqr' | 'none'
  >('none');
  const jsqrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const jsqrCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [nfcOverlayState, setNfcOverlayState] =
    useState<NfcOverlayState>('hidden');
  const [nfcOverlayMessage, setNfcOverlayMessage] = useState('');
  const nfcOverlayTimeoutRef = useRef<number | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');
  const [lockError, setLockError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      setIsNfcSupported(true);
    }
  }, []);

  useEffect(() => {
    if (isLocked) {
      stopStream();
      stopNfcScan();
      hideNfcOverlay();
      return;
    }
    startScanner();
    return () => {
      stopStream();
      stopNfcScan();
      hideNfcOverlay();
    };
  }, [isLocked]);

  const setupDetection = async () => {
    const detector = await getDetector();
    if (detector) {
      detectionModeRef.current = 'barcode';
      setDetectionMode('barcode');
      return true;
    }
    const jsQrReady = await ensureJsQr();
    if (jsQrReady) {
      detectionModeRef.current = 'jsqr';
      setDetectionMode('jsqr');
      if (!jsqrCanvasRef.current) {
        jsqrCanvasRef.current = document.createElement('canvas');
      }
      if (!jsqrCtxRef.current && jsqrCanvasRef.current) {
        jsqrCtxRef.current = jsqrCanvasRef.current.getContext('2d', {
          willReadFrequently: true,
        });
      }
      return Boolean(jsqrCtxRef.current);
    }
    detectionModeRef.current = 'none';
    setDetectionMode('none');
    return false;
  };

  const startScanner = async () => {
    setError('');
    setStatus('idle');
    setStatusMessage('');
    const detectionReady = await setupDetection();
    if (!detectionReady) {
      setError('مرورگر شما از اسکن QR پشتیبانی نمی‌کند.');
      return;
    }
    const isSecure =
      typeof window === 'undefined'
        ? true
        : window.isSecureContext || window.location.hostname === 'localhost';
    setSecureOrigin(isSecure);
    if (!isSecure) {
      setError('برای استفاده از دوربین، لطفا برنامه را روی HTTPS اجرا کنید.');
      setCameraSupported(false);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraSupported(false);
      setError('مرورگر شما به دوربین دسترسی ندارد.');
      return;
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setCameraSupported(true);
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        await videoRef.current.play();
        setIsScanning(true);
        requestAnimationFrame(scanFrame);
      }
    } catch (err) {}
  };

  const getDetector = async () => {
    if (detectorRef.current) return detectorRef.current;
    const ready = await ensureBarcodeDetector();
    if (!ready) return null;
    detectorRef.current = new (window as any).BarcodeDetector({
      formats: ['qr_code'],
    });
    return detectorRef.current;
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const stopNfcScan = () => {
    if (nfcAbortControllerRef.current) {
      try {
        nfcAbortControllerRef.current.abort();
      } catch {}
      nfcAbortControllerRef.current = null;
    }
    nfcReaderRef.current = null;
    setIsNfcScanning(false);
    setNfcMessage('');
  };

  const hideNfcOverlay = () => {
    if (nfcOverlayTimeoutRef.current) {
      window.clearTimeout(nfcOverlayTimeoutRef.current);
      nfcOverlayTimeoutRef.current = null;
    }
    setNfcOverlayState('hidden');
    setNfcOverlayMessage('');
  };

  const showNfcOverlay = (
    state: NfcOverlayState,
    message: string,
    autoHideMs?: number,
  ) => {
    if (nfcOverlayTimeoutRef.current) {
      window.clearTimeout(nfcOverlayTimeoutRef.current);
      nfcOverlayTimeoutRef.current = null;
    }
    setNfcOverlayState(state);
    setNfcOverlayMessage(message);
    if (autoHideMs) {
      nfcOverlayTimeoutRef.current = window.setTimeout(() => {
        hideNfcOverlay();
      }, autoHideMs);
    }
  };

  const scanFrame = async () => {
    const video = videoRef.current;
    if (
      !video ||
      video.readyState !== video.HAVE_ENOUGH_DATA ||
      detectionModeRef.current === 'none'
    ) {
      requestAnimationFrame(scanFrame);
      return;
    }
    try {
      if (detectionModeRef.current === 'barcode' && detectorRef.current) {
        const barcodes = await detectorRef.current.detect(video);
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
      } else if (detectionModeRef.current === 'jsqr') {
        const jsqr = (window as any).jsQR;
        const canvas = jsqrCanvasRef.current;
        const ctx =
          jsqrCtxRef.current ||
          canvas?.getContext('2d', { willReadFrequently: true });
        if (!jsqr || !canvas || !ctx) {
          requestAnimationFrame(scanFrame);
          return;
        }
        jsqrCtxRef.current = ctx;
        const width = video.videoWidth;
        const height = video.videoHeight;
        if (!width || !height) {
          requestAnimationFrame(scanFrame);
          return;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const result = jsqr(imageData.data, width, height);
        if (result?.data) {
          stopStream();
          await sendValueToApi(result.data);
          return;
        }
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
      await sendNFC(value);
      setStatus('success');
      setStatusMessage('کد با موفقیت ارسال شد.');
    } catch (err) {
      setStatus('error');
      setStatusMessage(
        'تراکنشی وجود ندارد. لطفا از فروشنده بخواهید تراکنش را ثبت کند.',
      );
    }
  };

  const confirmNfcSubmission = async (value: string) => {
    showNfcOverlay('pending', 'در حال ارسال درخواست به سرور...');
    try {
      await sendNFC(value);
      showNfcOverlay(
        'success',
        'کارت شما شناسایی شد، می‌توانید کارت را بردارید.',
        2500,
      );
    } catch (err) {
      showNfcOverlay(
        'error',
        'تایید پرداخت ناموفق بود. لطفا دوباره تلاش کنید.',
        3000,
      );
    }
  };

  const handleUnlock = () => {
    if (passwordInput.trim() === '1111') {
      setIsLocked(false);
      setPasswordInput('');
      setLockError('');
    } else {
      setLockError('رمز عبور نادرست است.');
    }
  };

  const handleRescan = () => {
    stopStream();
    stopNfcScan();
    hideNfcOverlay();
    startScanner();
  };

  const handleNfcScan = async () => {
    setNfcError('');
    setNfcMessage('');
    hideNfcOverlay();
    if (
      !(
        typeof window !== 'undefined' &&
        window.isSecureContext &&
        'NDEFReader' in window
      )
    ) {
      setNfcError(
        'برای استفاده از NFC باید از مرورگر سازگار در HTTPS استفاده کنید.',
      );
      return;
    }
    try {
      stopNfcScan();
      const reader = new (window as any).NDEFReader();
      const abortController = new AbortController();
      nfcAbortControllerRef.current = abortController;
      nfcReaderRef.current = reader;
      setIsNfcScanning(true);
      setNfcMessage('کارت یا برچسب NFC را نزدیک کنید...');

      reader.onreading = async (event: any) => {
        const decoder = new TextDecoder();
        let value = '';
        if (event.message?.records?.length) {
          for (const record of event.message.records) {
            if (record.recordType === 'text' && record.data) {
              const dataView = record.data as DataView;
              const buffer = dataView.buffer.slice(
                dataView.byteOffset,
                dataView.byteOffset + dataView.byteLength,
              );
              value = decoder.decode(new Uint8Array(buffer));
              break;
            }
            if (record.data && !value) {
              const dataView = record.data as DataView;
              const buffer = dataView.buffer.slice(
                dataView.byteOffset,
                dataView.byteOffset + dataView.byteLength,
              );
              value = Array.from(new Uint8Array(buffer))
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
            }
          }
        } else if (event.serialNumber) {
          value = String(event.serialNumber);
        }
        stopNfcScan();
        const payload = cardId || value || 'NFC_TAG_DETECTED';
        if (cardId) {
          setNfcMessage('شناسه کارت از آدرس خوانده شد. در حال تایید تراکنش...');
        } else if (value) {
          setNfcMessage('داده کارت دریافت شد. در حال تایید تراکنش...');
        } else {
          setNfcError('');
          setNfcMessage('کارت شناسایی شد. در حال تایید تراکنش...');
        }
        await confirmNfcSubmission(payload);
      };

      reader.onerror = () => {
        stopNfcScan();
        setNfcError('پرداخت NFC با خطا مواجه شد.');
        hideNfcOverlay();
      };

      await reader.scan({ signal: abortController.signal });
    } catch (err) {
      stopNfcScan();
      setNfcError('دسترسی به NFC امکان‌پذیر نیست یا توسط کاربر لغو شد.');
      hideNfcOverlay();
    }
  };

  return (
    <>
      {/* Lock Screen */}
      {isLocked && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1500,
            backgroundImage:
              'linear-gradient(135deg, rgba(8,47,73,0.95), rgba(15,23,42,0.95))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              maxWidth: 380,
              borderRadius: 4,
              p: 4,
              bgcolor: 'rgba(15, 23, 42, 0.85)',
              color: 'white',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              backdropFilter: 'blur(14px)',
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'rgba(59, 130, 246, 0.15)',
                mx: 'auto',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock sx={{ fontSize: 38, color: '#60A5FA' }} />
            </Box>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
              دسترسی محافظت‌شده
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: '#CBD5F5' }}>
              برای ورود به صفحه اسکن، رمز عبور چهار رقمی را وارد کنید.
            </Typography>
            <TextField
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setLockError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUnlock();
              }}
              label="رمز ۴ رقمی"
              variant="filled"
              type="password"
              inputProps={{ inputMode: 'numeric', maxLength: 4 }}
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  textAlign: 'center',
                  letterSpacing: 6,
                  fontSize: 26,
                  color: 'white',
                },
                '& .MuiFilledInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(148, 163, 184, 0.1)',
                },
                '& .MuiFilledInput-root:before': { borderBottom: 'none' },
                '& .MuiFilledInput-root:after': {
                  borderBottom: '2px solid #60A5FA',
                },
              }}
            />
            {lockError && (
              <Typography color="#F87171" fontWeight="600" sx={{ mb: 2 }}>
                {lockError}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleUnlock}
              fullWidth
              sx={{
                py: 1.2,
                borderRadius: 3,
                bgcolor: '#2563EB',
                '&:hover': { bgcolor: '#1D4ED8' },
              }}
            >
              تایید و ورود
            </Button>
            <Typography variant="caption" sx={{ mt: 2, color: '#94A3B8' }}>
              برای امنیت بیشتر رمز عبور پس از هر بار خروج دوباره درخواست می‌شود.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
            پرداخت از طریق NFC
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
            {isNfcScanning ? 'در انتظار کارت...' : 'شروع فرایند NFC'}
          </Button>
        </Paper>
      </Box>

      {/* NFC Overlay with Beautiful Progress */}
      {nfcOverlayState !== 'hidden' && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            background:
              nfcOverlayState === 'error'
                ? 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)'
                : nfcOverlayState === 'pending'
                  ? 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)'
                  : 'linear-gradient(135deg, #065f46 0%, #064e3b 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            zIndex: 1300,
            gap: 3,
            px: 2,
            animation: `${fadeIn} 0.3s ease-out`,
          }}
        >
          {/* Icon Container */}
          <Box
            sx={{
              position: 'relative',
              width: 160,
              height: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {nfcOverlayState === 'pending' ? (
              <>
                {/* Ripple effects */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.3)',
                    animation: `${ripple} 1.5s ease-out infinite`,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.3)',
                    animation: `${ripple} 1.5s ease-out infinite 0.5s`,
                  }}
                />
                {/* Rotating ring */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    border: '4px solid transparent',
                    borderTopColor: 'rgba(255,255,255,0.8)',
                    borderRightColor: 'rgba(255,255,255,0.4)',
                    animation: `${rotate} 1.2s linear infinite`,
                  }}
                />
                {/* Progress spinner */}
                <CircularProgress
                  size={110}
                  thickness={3}
                  sx={{ color: 'rgba(255,255,255,0.9)', position: 'absolute' }}
                />
                {/* Inner pulsing circle */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: `${pulse} 1.5s ease-in-out infinite`,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.2)',
                    }}
                  />
                </Box>
              </>
            ) : nfcOverlayState === 'success' ? (
              <Box sx={{ animation: `${fadeIn} 0.4s ease-out` }}>
                <Box
                  sx={{
                    position: 'absolute',
                    width: 130,
                    height: 130,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    animation: `${pulse} 2s ease-in-out infinite`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                <CheckCircle sx={{ fontSize: 100, color: '#4ade80' }} />
              </Box>
            ) : (
              <Box sx={{ animation: `${fadeIn} 0.4s ease-out` }}>
                <Box
                  sx={{
                    position: 'absolute',
                    width: 130,
                    height: 130,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    animation: `${pulse} 2s ease-in-out infinite`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                />
                <Cancel sx={{ fontSize: 100, color: '#f87171' }} />
              </Box>
            )}
          </Box>

          {/* Title */}
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
          >
            {nfcOverlayState === 'pending'
              ? 'در حال تایید پرداخت...'
              : nfcOverlayState === 'success'
                ? 'پرداخت تایید شد'
                : 'پرداخت تایید نشد'}
          </Typography>

          {/* Message */}
          {nfcOverlayMessage && (
            <Typography
              variant="h6"
              sx={{ opacity: 0.9, maxWidth: 400, lineHeight: 1.6 }}
            >
              {nfcOverlayMessage}
            </Typography>
          )}

          {/* Progress dots for pending */}
          {nfcOverlayState === 'pending' && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    animation: `${pulse} 1s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default ScanPage;
