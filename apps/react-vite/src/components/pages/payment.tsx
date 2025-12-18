import { useState, useEffect } from 'react';
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

// ============ TYPES ============
interface BankCardType {
  id: number;
  bankName: string;
  cardNumber: string;
  balance: number;
  color: string;
  expiry: string;
}

interface TransactionType {
  id: number;
  title: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
  category: string;
}

interface PaymentsPageProps {
  onNavigate: (path: string) => void;
}

interface AddCardPageProps {
  onNavigate: (path: string) => void;
}

// ============ API CALLS ============
const API_BASE_URL = '/api'; // Change to your API base URL

const api = {
  getCards: () => axios.get<BankCardType[]>(`${API_BASE_URL}/cards`),
  getTransactions: () =>
    axios.get<TransactionType[]>(`${API_BASE_URL}/transactions`),
  addCard: (data: Partial<BankCardType>) =>
    axios.post<BankCardType>(`${API_BASE_URL}/cards`, data),
};

// ============ HELPERS ============
const formatNumber = (num: number) => num.toLocaleString('fa-IR');
const maskCardNumber = (num: string) =>
  num.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1-$2-$3-$4');

// ============ COMPONENTS ============
const BankCard = ({ card }: { card: BankCardType }) => (
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
          {card.expiry}
        </Typography>
        <Typography fontWeight="600" fontSize={14}>
          {card.bankName}
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
        {maskCardNumber(card.cardNumber)}
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
          <Typography sx={{ fontSize: 11, opacity: 0.8 }}>موجودی</Typography>
          <Typography fontWeight="bold" fontSize={15}>
            {formatNumber(card.balance)} ریال
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

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
  const isPositive = transaction.amount > 0;
  const statusConfig = {
    success: {
      icon: <CheckCircle sx={{ fontSize: 18 }} />,
      color: '#22C55E',
      label: 'موفق',
    },
    pending: {
      icon: <AccessTime sx={{ fontSize: 18 }} />,
      color: '#F59E0B',
      label: 'در انتظار',
    },
    failed: {
      icon: <Cancel sx={{ fontSize: 18 }} />,
      color: '#EF4444',
      label: 'ناموفق',
    },
  };
  const status = statusConfig[transaction.status];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        py: 2,
        borderBottom: '1px solid #F1F5F9',
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
          <Typography fontSize={11}>{status.label}</Typography>
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
export const PaymentsPage = ({ onNavigate }: PaymentsPageProps) => {
  const [cards, setCards] = useState<BankCardType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardsRes = await api.getCards();
        setCards(cardsRes.data);
      } catch (e) {
        console.error('Error fetching cards:', e);
      }
      setLoadingCards(false);

      try {
        const txRes = await api.getTransactions();
        setTransactions(txRes.data);
      } catch (e) {
        console.error('Error fetching transactions:', e);
      }
      setLoadingTx(false);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Cards Section */}
      <Paper
        elevation={0}
        sx={{ borderRadius: 3, p: 3, border: '1px solid #E5E7EB' }}
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
            overflowX: 'auto',
            pb: 1,
            direction: 'ltr',
          }}
        >
          <AddCardButton onClick={() => onNavigate('/add-card')} />
          {loadingCards
            ? [...Array(2)].map((_, i) => <CardSkeleton key={i} />)
            : cards.map((card) => <BankCard key={card.id} card={card} />)}
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
          <Button size="small" sx={{ color: '#1E88E5' }}>
            مشاهده همه
          </Button>
          <Typography variant="h6" fontWeight="600" sx={{ color: '#1a1a1a' }}>
            تراکنش‌های اخیر
          </Typography>
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
export const AddCardPage = ({ onNavigate }: AddCardPageProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    cardNumber: '',
    expiry: '',
    bankName: '',
  });

  const handleSubmit = async () => {
    if (!form.cardNumber || !form.expiry) return;

    setLoading(true);
    try {
      await api.addCard({
        ...form,
        balance: 0,
        color: '#6366F1',
      });
      onNavigate('/payments');
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
        <TextField
          fullWidth
          label="نام بانک"
          placeholder="مثال: بانک ملت"
          value={form.bankName}
          onChange={(e) => setForm({ ...form, bankName: e.target.value })}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          label="شماره کارت"
          placeholder="xxxx-xxxx-xxxx-xxxx"
          value={form.cardNumber}
          onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
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
            onClick={() => onNavigate('/payments')}
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
