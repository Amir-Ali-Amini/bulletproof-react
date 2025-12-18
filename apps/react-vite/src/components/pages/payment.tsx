// @ts-nocheck

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
  Skeleton,
  Button,
  TextField,
  CircularProgress,
  alpha,
} from '@mui/material';
import {
  Add,
  CreditCard,
  AccountBalanceWallet,
  Receipt,
  CheckCircle,
  Cancel,
  AccessTime,
} from '@mui/icons-material';

import { paths } from '@/config/paths';

// ============ TYPES ============
interface BankCardType {
  id: number;
  brand: string;
  masked_pan: string;
  balance: number;
  color: string;
  exp_year: string;
}

interface TransactionType {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
  category: string;
  merchant_name: string;
}

// ============ API CALLS ============
const API_BASE_URL = 'http://10.72.103.60:8000/api/v1';
const api = {
  // getCards: () => axios.get<BankCardType[]>(`${API_BASE_URL}/api/v1/cards`),
  getCards: () => axios.get<BankCardType[]>(`${API_BASE_URL}/cards`),
  getTransactions: () =>
    axios.get<TransactionType[]>(`${API_BASE_URL}/payments`),
  addCard: (data: Partial<BankCardType>) => {
    const [year, month] = data.expiry.split('/');
    axios.post<BankCardType>(`${API_BASE_URL}/cards`, {
      ...data,
      exp_year: year,
      exp_month: month,
    });
  },
};

// ============ HELPERS ============
const formatNumber = (num: number) => num.toLocaleString('fa-IR');
const maskmasked_pan = (num: string) =>
  num.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');

// ============ COMPONENTS ============
const BankCard = ({ card }: { card: BankCardType }) => {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(paths.app.scan.getHref(card.id))}>
      <Card
        sx={{
          minWidth: 280,
          width: 280,
          height: 160,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}99 100%)`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -20,
            left: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
          }}
        />
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 2.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
              {card.exp_year}
            </Typography>
            <Typography fontWeight="600" fontSize={14}>
              {card.brand}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: 'monospace',
              fontSize: 16,
              letterSpacing: 2,
              textAlign: 'center',
              direction: 'ltr',
            }}
          >
            {maskmasked_pan(card.masked_pan)}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <CreditCard sx={{ opacity: 0.7 }} />
            <Box sx={{ textAlign: 'left' }}>
              <Typography sx={{ fontSize: 11, opacity: 0.8 }}>
                موجودی
              </Typography>
              <Typography fontWeight="bold" fontSize={15}>
                {formatNumber(card.balance)} ریال
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Button>
  );
};

const AddCardButton = ({ onClick }: { onClick: () => void }) => (
  <Card
    onClick={onClick}
    sx={{
      minWidth: 280,
      width: 280,
      height: 160,
      borderRadius: 3,
      border: '2px dashed #CBD5E1',
      bgcolor: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      flexShrink: 0,
      '&:hover': { borderColor: '#1E88E5', bgcolor: '#EFF6FF' },
    }}
  >
    <Box sx={{ textAlign: 'center' }}>
      <Avatar
        sx={{ width: 48, height: 48, bgcolor: '#E2E8F0', mx: 'auto', mb: 1 }}
      >
        <Add sx={{ color: '#64748B' }} />
      </Avatar>
      <Typography sx={{ color: '#64748B', fontSize: 14 }}>
        افزودن کارت جدید
      </Typography>
    </Box>
  </Card>
);

const CardSkeleton = () => (
  <Card
    sx={{
      minWidth: 280,
      width: 280,
      height: 160,
      borderRadius: 3,
      flexShrink: 0,
    }}
  >
    <CardContent sx={{ height: '100%', p: 2.5 }}>
      <Skeleton variant="text" width={80} />
      <Skeleton variant="text" width="100%" height={40} sx={{ my: 3 }} />
      <Skeleton variant="text" width={120} />
    </CardContent>
  </Card>
);

const TransactionItem = ({ transaction }: { transaction: TransactionType }) => {
  const isPositive = transaction.status.toLowerCase() == 'confirmed';
  const statusConfig = {
    confirmed: {
      icon: <CheckCircle sx={{ fontSize: 18 }} />,
      color: '#22C55E',
      label: 'موفق',
    },
    pending: {
      icon: <AccessTime sx={{ fontSize: 18 }} />,
      color: '#F59E0B',
      label: 'در انتظار',
    },
    initiated: {
      icon: <AccessTime sx={{ fontSize: 18 }} />,
      color: '#F59E0B',
      label: 'در انتظار',
    },
    declined: {
      icon: <Cancel sx={{ fontSize: 18 }} />,
      color: '#EF4444',
      label: 'ناموفق',
    },
    cancelled: {
      icon: <Cancel sx={{ fontSize: 18 }} />,
      color: '#EF4444',
      label: 'لغو شده',
    },
    expired: {
      icon: <Cancel sx={{ fontSize: 18 }} />,
      color: '#EF4444',
      label: 'منقضی شده',
    },
  };
  console.log(
    'transaction.status:',
    transaction.status,
    transaction.status.toLowerCase(),
  );
  const status = statusConfig[transaction.status.toLowerCase() || 'expired'];
  console.log('status:', status);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 2,
        borderBottom: '1px solid #F1F5F9',
        border: '2px solid ',
        borderColor: alpha(status.color, 0.5), // 10% opacity,
        borderRadius: '16px',
        padding: '8px',
        marginY: 1,
        backgroundColor: alpha(status.color, 0.2), // 10% opacity
      }}
    >
      <Avatar
        sx={{
          bgcolor: isPositive ? '#DCFCE7' : '#FEE2E2',
          width: 44,
          height: 44,
        }}
      >
        {isPositive ? (
          <AccountBalanceWallet sx={{ color: '#22C55E' }} />
        ) : (
          <Receipt sx={{ color: '#EF4444' }} />
        )}
      </Avatar>
      <Box sx={{ flex: 1, mx: 2 }}>
        <Typography fontWeight="500" fontSize={14} sx={{ color: '#1E293B' }}>
          {transaction.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography fontSize={12} sx={{ color: '#94A3B8' }}>
            {transaction.date}
          </Typography>
          <Chip
            label={transaction.category}
            size="small"
            sx={{
              fontSize: 10,
              height: 20,
              bgcolor: '#F1F5F9',
              color: '#64748B',
            }}
          />
        </Box>
      </Box>
      <Box sx={{ textAlign: 'left' }}>
        <Typography
          fontWeight="600"
          fontSize={14}
          sx={{ color: isPositive ? '#22C55E' : '#EF4444', direction: 'ltr' }}
        >
          {isPositive ? '+' : ''}
          {formatNumber(transaction.amount)} ریال
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            justifyContent: 'flex-end',
            mt: 0.5,
            color: status.color,
          }}
        >
          {status.icon}
          <Typography
            sx={{ color: isPositive ? '#22C55E' : '#EF4444' }}
            fontSize={11}
          >
            {status.label}{' '}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const TransactionSkeleton = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      py: 2,
      borderBottom: '1px solid #F1F5F9',
    }}
  >
    <Skeleton variant="circular" width={44} height={44} />
    <Box sx={{ flex: 1, mx: 2 }}>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </Box>
    <Skeleton variant="text" width={80} />
  </Box>
);

// ============ PAYMENTS PAGE ============
export const PaymentsPage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<BankCardType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);

  const cardColors = [
    '#4F46E5',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
  ];
  const bankNames = ['بلو', 'ملت', 'ملی', 'پاسارگاد', 'پارسیان', 'سپه'];
  const card_static = {
    id: 'idddd',
    brand: 'stfsfsafawring',
    masked_pan: 'item.mfdsafasfdsasked_pan' as string,
    balance: '23040',
    exp_year: 2009 as number,
  };
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const cardsRes = await api.getCards();
        console.log('xards:', cardsRes);
        setCards(
          Array.isArray(cardsRes.data)
            ? cardsRes.data.map((item, index) => ({
                ...item,
                balance: '*****',
                brand:
                  item.brand != 'UNKNOWN'
                    ? item.brand
                    : bankNames[index % bankNames.length],
                color: cardColors[index % cardColors.length] as string,
              }))
            : [],
        );
      } catch (e) {
        console.error('Error fetching cards:', e);
        // setCards([]);
      } finally {
        setLoadingCards(false);
      }
    };
    console.log('cards:', cards);

    const fetchTransactions = async () => {
      try {
        const txRes = await api.getTransactions();
        console.log('txRes', txRes);
        setTransactions(
          Array.isArray(txRes.data.results) ? txRes.data.results : [],
        );
      } catch (e) {
        console.error('Error fetching transactions:', e);
        setTransactions([]);
      } finally {
        setLoadingTx(false);
      }
    };

    // Fetch both in parallel
    fetchCards();
    fetchTransactions();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          maxWidth: '100%',
        }}
      >
        {/* <Button
          variant="outlined"
          onClick={() => navigate(paths.app.scan.getHref())}
          sx={{ borderRadius: 2 }}
        >
          اسکن QR برای پرداخت
        </Button> */}
      </Box>
      {/* Cards Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 3,
          minWidth: 0, // add this
          border: '1px solid #E5E7EB',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="600"
          sx={{ mb: 2, color: '#1a1a1a' }}
        >
          کارت‌های بانکی
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'scroll',
            pb: 2,
            direction: 'ltr',
            flexWrap: 'nowrap',
            minWidth: 0,
            width: '100%',
            flexWrap: 'nowrap',
            scrollSnapType: 'x mandatory',
            '& > *': {
              flexShrink: 0,
              scrollSnapAlign: 'start',
            },
          }}
        >
          {loadingCards
            ? [...Array(2)].map((_, i) => <CardSkeleton key={i} />)
            : cards.map((card) => <BankCard key={card.id} card={card} />)}
          <AddCardButton
            onClick={() => navigate(paths.app.addCard.getHref())}
          />
        </Box>
      </Paper>

      {/* Transactions Section */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, p: 3, border: '1px solid #E5E7EB' }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="600" sx={{ color: '#1a1a1a' }}>
            تراکنش‌های اخیر
          </Typography>
          <Button size="small" sx={{ color: '#1E88E5' }}>
            مشاهده همه
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {loadingTx ? (
          [...Array(4)].map((_, i) => <TransactionSkeleton key={i} />)
        ) : transactions.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" py={4}>
            تراکنشی یافت نشد
          </Typography>
        ) : (
          transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))
        )}
      </Paper>
    </Box>
  );
};

// ============ ADD CARD PAGE ============
export const AddCardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    card_number: '',
    expiry: '',
    brand: '',
    cvv: '',
    set_efault: '',
  });

  const handleSubmit = async () => {
    if (!form.card_number || !form.expiry) return;

    setLoading(true);
    console.log('addCard:', form);
    try {
      await api.addCard({
        ...form,
        balance: 0,
        // color: '#6366F1',
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
      });
      navigate(paths.app.payment.getHref());
    } catch (e) {
      console.error('Error adding card:', e);
    }
    setLoading(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{ borderRadius: 3, p: 4, border: '1px solid #E5E7EB' }}
    >
      <Typography
        variant="h6"
        fontWeight="600"
        sx={{ mb: 3, color: '#1a1a1a' }}
      >
        افزودن کارت جدید
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ maxWidth: 400 }}>
        {/* <TextField
          fullWidth
          label="نام بانک"
          placeholder="مثال: بانک ملت"
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
          sx={{ mb: 3 }}
        /> */}
        <TextField
          fullWidth
          label="شماره کارت"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          value={form.card_number}
          onChange={(e) => setForm({ ...form, card_number: e.target.value })}
          sx={{ mb: 3 }}
          inputProps={{ style: { direction: 'ltr', textAlign: 'left' } }}
        />
        <TextField
          fullWidth
          label="cvv2"
          placeholder="1234"
          value={form.cvv}
          onChange={(e) => setForm({ ...form, cvv: e.target.value })}
          sx={{ mb: 3 }}
          inputProps={{ style: { direction: 'ltr', textAlign: 'left' } }}
        />
        <TextField
          fullWidth
          label="تاریخ انقضا"
          placeholder="1404/06"
          value={form.expiry}
          onChange={(e) => setForm({ ...form, expiry: e.target.value })}
          sx={{ mb: 3 }}
          inputProps={{ style: { direction: 'ltr', textAlign: 'left' } }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ borderRadius: 2, px: 4 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'ثبت کارت'
            )}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate(paths.app.payment.getHref())}
            sx={{ borderRadius: 2, px: 4 }}
          >
            انصراف
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PaymentsPage;
