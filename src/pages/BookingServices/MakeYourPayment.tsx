// PaymentDetails.tsx  (Step 4)
import {
  Box, Typography, TextField, Button, Divider,
  Alert, CircularProgress, Chip, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, InputAdornment,
  Snackbar,
} from '@mui/material';
import {
  FaLock, FaMobileAlt, FaShieldAlt, FaInfoCircle,
  FaExclamationTriangle, FaUserCheck, FaCheckCircle, FaRedo, FaTimesCircle,
  FaEnvelope,
} from 'react-icons/fa';
import { Theme } from '@/assets/constants/colors';
import { useState, useMemo, useRef } from 'react';
import type { TripInput } from '@/types';
import type { PackageOption } from './ChoosePackage';
import type { TravelerInfo, Traveler } from './TravelersDetails';
import PaymentServices, { generatePaymentReference } from '@/ApiCalls/paymentsApi';
import { cancelAndDeleteBooking } from '@/ApiCalls/paymentsApi';
import TravelerServices from '@/ApiCalls/travelerApi';
import type { CreateTravelerPayload, TravelerExistsData, TravelerExistsError } from '@/ApiCalls/travelerApi';
import BookingServices from '@/ApiCalls/BookingApi';
import AlreadyBookedModal from '@/components/AlreadyBookedModal';
import type { AlreadyBookedInfo } from '@/components/AlreadyBookedModal';
import type { AxiosError } from 'axios';
import { getDataFromResponse } from '@/lib/utils';
import { colors } from '@/assets/constants/theme';
import { useNavigate } from 'react-router-dom';
import SmartNavigation from '@/components/SmartNavigation';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PaymentDetailsProps {
  bookingData: {
    destination:      TripInput | null;
    selectedPackage:  PackageOption | null;
    travelerInfo:     TravelerInfo | null;
    totalPrice:       number;
    bookingReference?: string;
  };
  onPaymentComplete?: (paymentDetails: PaymentResult) => void;
}

export interface PaymentResult {
  method:           string;
  mobileNumber:     string;
  amountPaid:       number;
  totalPrice:       number;
  currency:         'ZMW';
  timestamp:        string;
  paymentReference: string;
}

type Phase =
  | 'ready' | 'creating_travelers' | 'creating_booking'
  | 'processing' | 'polling' | 'payment_failed' | 'success' | 'error';

// ── Constants ─────────────────────────────────────────────────────────────────

const TIER_THRESHOLD    = 100;
const FEE_LOW           = 5;
const FEE_HIGH          = 5;
const POLL_INTERVAL     = 5_000;
const MAX_POLL_ATTEMPTS = 12;

function getMinPayment(total: number): number {
  return total < TIER_THRESHOLD ? FEE_LOW : FEE_HIGH;
}

// ── Payment methods ───────────────────────────────────────────────────────────

interface MobilePaymentMethod {
  id: 'airtel' | 'mtn';
  label: string; shortLabel: string; brandColor: string;
  textColor: string; hoverColor: string; placeholder: string;
  prefixes: string[]; logo: React.ReactNode;
}

const MOBILE_PAYMENT_METHODS: MobilePaymentMethod[] = [
  {
    id: 'airtel', label: 'Airtel Money', shortLabel: 'Airtel',
    brandColor: '#E3000F', textColor: '#ffffff', hoverColor: '#C1000D',
    placeholder: '097 XXX XXXX', prefixes: ['097', '077'],
    logo: <Box sx={{ width:56,height:56,borderRadius:'50%',backgroundColor:'#E3000F',display:'flex',alignItems:'center',justifyContent:'center' }}><Typography sx={{ color:'white',fontWeight:900,fontSize:'11px' }}>AIRTEL</Typography></Box>,
  },
  {
    id: 'mtn', label: 'MTN Mobile Money', shortLabel: 'MTN',
    brandColor: '#FFCC00', textColor: '#000000', hoverColor: '#E6B800',
    placeholder: '076 XXX XXXX', prefixes: ['076', '096'],
    logo: <Box sx={{ width:56,height:56,borderRadius:'50%',backgroundColor:'#FFCC00',display:'flex',alignItems:'center',justifyContent:'center' }}><Typography sx={{ color:'#000',fontWeight:900,fontSize:'15px' }}>MTN</Typography></Box>,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatZMW = (n: number) =>
  `K${n.toLocaleString('en-ZM', { minimumFractionDigits:0, maximumFractionDigits:0 })}`;
const sanitizePhone = (v: string) => v.replace(/\D/g,'').slice(0,10);

function ageFromDOB(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset':       { borderColor: Theme['olive-wood'][400] },
    '&.Mui-focused fieldset': { borderColor: Theme['olive-wood'][500] },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: Theme['olive-wood'][500] },
};

// ── ExistingTravelerDialog ────────────────────────────────────────────────────

function ExistingTravelerDialog({ open, travelerData, onUseExisting, onCreateNew, onClose }: {
  open: boolean; travelerData: TravelerExistsData | null;
  onUseExisting: () => void; onCreateNew: () => void; onClose: () => void;
}) {
  if (!travelerData) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display:'flex',alignItems:'center',gap:1,color:Theme.bronze[700] }}>
        <FaExclamationTriangle color={Theme.bronze[500]} /> Existing Profile Found
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb:2 }}>We found an existing traveler profile:</DialogContentText>
        <Box sx={{ p:2,bgcolor:Theme.bronze[50],borderRadius:2,border:`1px solid ${Theme.bronze[200]}`,mb:2 }}>
          <Typography sx={{ fontWeight:600,color:Theme['dark-khakhi'][800] }}>Name: {travelerData.fullName}</Typography>
          <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'14px' }}>ID: {travelerData.idNumber}</Typography>
          <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'14px' }}>Nationality: {travelerData.nationality}</Typography>
          <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'14px' }}>Age: {travelerData.age}</Typography>
        </Box>
        <DialogContentText>Would you like to use this existing profile or create a new one?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCreateNew} color="inherit">Create New Profile</Button>
        <Button onClick={onUseExisting} variant="contained" startIcon={<FaUserCheck />}
          sx={{ bgcolor:Theme['olive-wood'][600],'&:hover':{ bgcolor:Theme['olive-wood'][700] } }}>
          Use Existing Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── DuplicateEmailModal ───────────────────────────────────────────────────────

function DuplicateEmailModal({ open, email, tripTitle, onGoBack, onViewTrips }: {
  open: boolean; email: string; tripTitle: string;
  onGoBack: () => void; onViewTrips: () => void;
}) {
  return (
    <Dialog open={open} onClose={onGoBack} maxWidth="xs" fullWidth
      PaperProps={{ sx:{ borderRadius:3, overflow:'hidden' } }}
    >
      {/* Amber header */}
      <Box sx={{ backgroundColor:Theme.bronze[600],p:3,display:'flex',flexDirection:'column',alignItems:'center',gap:1.5 }}>
        <Box sx={{ width:56,height:56,borderRadius:'50%',backgroundColor:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <FaEnvelope size={26} color="white" />
        </Box>
        <Typography sx={{ color:'white',fontWeight:700,fontSize:'18px',textAlign:'center' }}>
          Already Booked for This Trip
        </Typography>
      </Box>

      <DialogContent sx={{ p:3 }}>
        <DialogContentText sx={{ mb:2,fontSize:'14px' }}>
          The email address <strong>{email}</strong> already has an active booking for{' '}
          <strong>{tripTitle}</strong>.
        </DialogContentText>
        <DialogContentText sx={{ fontSize:'13px',color:'text.secondary' }}>
          If you believe your previous booking is incomplete, please contact our support team
          with your booking reference number.
        </DialogContentText>

        <Box sx={{ mt:2.5,p:2,borderRadius:2,backgroundColor:Theme.wheat[50],border:`1px solid ${Theme.bronze[100]}` }}>
          <Typography sx={{ fontWeight:600,color:Theme['dark-khakhi'][800],fontSize:'13px',mb:1 }}>
            What can I do?
          </Typography>
          {[
            'Check your email for your existing booking confirmation',
            'View your current bookings in the trips section',
            'Use a different email address if you want a separate booking',
            'Contact support if you think this is an error',
          ].map((text) => (
            <Typography key={text} sx={{ color:Theme['dark-khakhi'][600],fontSize:'13px',display:'flex',gap:1,mb:0.5 }}>
              <span style={{ color:Theme['olive-wood'][600] }}>✓</span> {text}
            </Typography>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p:3,pt:0,gap:1.5,flexDirection:'column' }}>
        <Button fullWidth variant="contained" onClick={onViewTrips}
          sx={{ backgroundColor:Theme['olive-wood'][600],color:'white',borderRadius:2,py:1.2,'&:hover':{ backgroundColor:Theme['olive-wood'][700] } }}
          startIcon={<FaCheckCircle />}
        >
          View My Bookings
        </Button>
        <Button fullWidth variant="outlined" onClick={onGoBack}
          sx={{ borderColor:Theme.bronze[400],color:Theme.bronze[700],borderRadius:2,py:1.2,'&:hover':{ borderColor:Theme.bronze[600],backgroundColor:Theme.bronze[50] } }}
        >
          Go Back &amp; Use Different Email
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── MethodCard ────────────────────────────────────────────────────────────────

function MethodCard({ method, isSelected, onSelect, disabled }: {
  method: MobilePaymentMethod; isSelected: boolean;
  onSelect: (id: string) => void; disabled: boolean;
}) {
  return (
    <Box role="radio" aria-checked={isSelected} tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onSelect(method.id)}
      onKeyDown={(e) => { if (!disabled && (e.key==='Enter'||e.key===' ')){ e.preventDefault(); onSelect(method.id); }}}
      sx={{
        display:'flex',flexDirection:'column',alignItems:'center',gap:1.5,p:2.5,borderRadius:2,
        cursor:disabled?'default':'pointer', opacity:disabled?0.5:1,
        border: isSelected ? `2px solid ${method.brandColor}` : `1px solid ${Theme['dark-khakhi'][200]}`,
        backgroundColor: isSelected ? `${method.brandColor}12` : 'white',
        transition:'all 0.2s ease',
        '&:hover': disabled ? {} : { border:`2px solid ${method.brandColor}`,backgroundColor:`${method.brandColor}08`,transform:'translateY(-2px)',boxShadow:`0 4px 14px ${method.brandColor}30` },
      }}
    >
      {method.logo}
      <Typography sx={{ color:Theme['dark-khakhi'][800],fontWeight:isSelected?700:500,fontSize:'14px',textAlign:'center' }}>
        {method.label}
      </Typography>
      {isSelected && <Box sx={{ width:8,height:8,borderRadius:'50%',backgroundColor:method.brandColor }} />}
    </Box>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PaymentDetails({ bookingData, onPaymentComplete }: PaymentDetailsProps) {
  const navigate = useNavigate();

  const [phase,        setPhase]        = useState<Phase>('ready');
  const [errorMessage, setErrorMessage] = useState('');
  const [toast,        setToast]        = useState<{ message:string; severity:'error'|'warning'|'info' } | null>(null);

  const [bookingId,        setBookingId]        = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  const [pollAttempts,     setPollAttempts]     = useState(0);

  const [selectedMethodId, setSelectedMethodId] = useState<MobilePaymentMethod['id']>('airtel');
  const [mobileNumber,     setMobileNumber]     = useState('');
  const [amountInput,      setAmountInput]      = useState('');
  const [amountError,      setAmountError]      = useState('');

  const [showExistingDialog,   setShowExistingDialog]   = useState(false);
  const [existingTravelerData, setExistingTravelerData] = useState<TravelerExistsData | null>(null);
  const [pendingTravelerIndex, setPendingTravelerIndex] = useState<number | null>(null);

  const [alreadyBookedInfo,      setAlreadyBookedInfo]      = useState<AlreadyBookedInfo | null>(null);
  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);   // ← new

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling,     setIsCancelling]     = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successResult,    setSuccessResult]    = useState<PaymentResult | null>(null);

  const pendingIdsRef   = useRef<string[]>([]);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { destination, travelerInfo, totalPrice } = bookingData;
  const minPayment      = getMinPayment(totalPrice);
  const parsedAmount    = parseFloat(amountInput);
  const isAmountValid   = !isNaN(parsedAmount) && parsedAmount >= minPayment && parsedAmount <= totalPrice;
  const effectiveAmount = isAmountValid ? parsedAmount : minPayment;
  const remaining       = totalPrice - effectiveAmount;

  const selectedMethod = useMemo(
    () => MOBILE_PAYMENT_METHODS.find(m => m.id === selectedMethodId) ?? MOBILE_PAYMENT_METHODS[0],
    [selectedMethodId],
  );

  const isBusy = ['creating_travelers','creating_booking','processing','polling'].includes(phase);

  const isPhoneValid  = mobileNumber.length === 10;
  const prefixMatches = mobileNumber.length >= 3
    ? selectedMethod.prefixes.some(p => mobileNumber.startsWith(p)) : true;
  const phoneError = !isPhoneValid && mobileNumber.length > 0
    ? 'Please enter a valid 10-digit Zambian number'
    : isPhoneValid && !prefixMatches
    ? `${selectedMethod.shortLabel} numbers start with ${selectedMethod.prefixes.join(' or ')}.`
    : '';

  const bookingAlreadyCreated = bookingId !== null;

  const quickPicks = [
    { label:`Min  ${formatZMW(minPayment)}`,                value:minPayment },
    { label:`Half ${formatZMW(Math.round(totalPrice/2))}`,  value:Math.round(totalPrice/2) },
    { label:`Full ${formatZMW(totalPrice)}`,                value:totalPrice },
  ].filter((q,i,arr) => arr.findIndex(x=>x.value===q.value)===i);

  const handleAmountChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g,'').replace(/(\..*)\./g,'$1');
    setAmountInput(cleaned);
    const n = parseFloat(cleaned);
    if (!cleaned||isNaN(n))  setAmountError('Please enter an amount');
    else if (n<minPayment)   setAmountError(`Minimum is ${formatZMW(minPayment)}`);
    else if (n>totalPrice)   setAmountError(`Maximum is ${formatZMW(totalPrice)}`);
    else                     setAmountError('');
  };
  const setQuickPick = (v: number) => { setAmountInput(String(v)); setAmountError(''); };

  // ── Polling ───────────────────────────────────────────────────────────────

  const stopPolling = () => {
    if (pollIntervalRef.current) { clearInterval(pollIntervalRef.current); pollIntervalRef.current=null; }
  };

  function resolveZynleCode(code: string): string | null {
    switch (code) {
      case '995':  return 'Transaction failed — incorrect PIN, insufficient funds, or cancelled on your phone.';
      case '9905': return 'The mobile number is not valid for mobile payments. Please check and try a different number.';
      case '9907': return 'This number cannot receive mobile money prompts. Please try a different number.';
      case '9911': return 'Payment service temporarily unavailable. Please try again shortly.';
      case '9912': return 'Payment amount exceeds the allowed limit. Please try a smaller amount.';
      case '9914': return 'Unable to confirm payment status right now. Please try again.';
      default:     return null;
    }
  }

  const friendlyMsg = (gr?: string) =>
    !gr ? 'Payment was not completed. Please try again.'
        : resolveZynleCode(gr) ?? 'Payment was not completed. Please try again.';

  const startPolling = (paymentReference: string, bkId: string) => {
    setPhase('polling');
    setPollAttempts(0);
    let attempts = 0;

    pollIntervalRef.current = setInterval(async () => {
      attempts++;
      setPollAttempts(attempts);
      try {
        const payments    = await PaymentServices.getPaymentsByBooking(bkId);
        const thisPayment = payments.find(p => p.paymentReference === paymentReference);

        if (!thisPayment) {
          if (attempts >= MAX_POLL_ATTEMPTS) { stopPolling(); await failBooking(bkId,'Payment confirmation timed out. Your booking is saved — try again below.'); }
          return;
        }
        if (thisPayment.status === 'completed') {
          stopPolling();
          setPhase('success');
          const result: PaymentResult = { method:selectedMethodId, mobileNumber, amountPaid:effectiveAmount, totalPrice, currency:'ZMW', timestamp:thisPayment.completedAt??thisPayment.updatedAt, paymentReference };
          setSuccessResult(result);
          setShowSuccessModal(true);
          return;
        }
        if (thisPayment.status === 'failed') {
          stopPolling();
          await failBooking(bkId, friendlyMsg(thisPayment.gatewayResponse));
          return;
        }
        if (attempts >= MAX_POLL_ATTEMPTS) { stopPolling(); await failBooking(bkId,'Payment confirmation timed out. Your booking is saved — try again below.'); }
      } catch {
        if (attempts >= MAX_POLL_ATTEMPTS) { stopPolling(); await failBooking(bkId,'Lost connection. Your booking is saved — try again below.'); }
      }
    }, POLL_INTERVAL);
  };

  const failBooking = async (bkId: string, message?: string) => {
    try { await PaymentServices.markBookingPaymentFailed(bkId); } catch { /* best-effort */ }
    setPhase('payment_failed');
    setErrorMessage(message ?? 'Payment not confirmed. Your booking is saved — try again below.');
  };

  // ── Traveler creation ─────────────────────────────────────────────────────

  const buildAndCreateTraveler = async (traveler: Traveler, email: string, forceCreate: boolean): Promise<string> => {
    const payload: CreateTravelerPayload = {
      fullName:traveler.fullName, age:ageFromDOB(traveler.dateOfBirth)?.toString()?? '0',
      gender:traveler.gender as CreateTravelerPayload['gender'],
      idNumber:traveler.idNumber, idType:traveler.idType as CreateTravelerPayload['idType'],
      nationality:traveler.nationality, dateOfBirth:new Date(traveler.dateOfBirth).toISOString(),
      isStudent:traveler.isStudent, schoolName:traveler.schoolName, email,
    };
    const created = await TravelerServices.createTraveler(payload, forceCreate);
    return created._id;
  };

  const processRemainingTravelers = async (startIndex: number, accIds: string[]): Promise<void> => {
    if (!travelerInfo) return;
    const all = [travelerInfo.mainTraveler, ...travelerInfo.additionalTravelers];
    for (let i = startIndex; i < all.length; i++) {
      try {
        const id = await buildAndCreateTraveler(all[i], travelerInfo.email, false);
        accIds[i] = id; pendingIdsRef.current = [...accIds];
      } catch (err: unknown) {
        const te = err as TravelerExistsError;
        if (te.code === 'TRAVELER_EXISTS') { setExistingTravelerData(te.existingData); setPendingTravelerIndex(i); setShowExistingDialog(true); return; }
        setPhase('error'); setErrorMessage(err instanceof Error ? err.message : 'Failed to create traveler'); return;
      }
    }
    await finaliseBooking(accIds);
  };

  // ── Booking creation ──────────────────────────────────────────────────────

  const finaliseBooking = async (travelerIds: string[]): Promise<void> => {
    if (!destination?.title || !travelerInfo) return;
    setPhase('creating_booking');

    try {
      const [mainTravelerId, ...additionalTravelerIds] = travelerIds;
      const grandTotal = ((destination.price??0) + (bookingData.selectedPackage?.additionalPrice??0)) * (travelerInfo.additionalTravelers.length + 1);

      const created = await BookingServices.createBooking({
        contactEmail:travelerInfo.email, contactPhone:travelerInfo.phone,
        mainTravelerId, additionalTravelerIds, tripId:destination.title,
        travelDates:{ start:new Date(destination.startDate).toISOString(), end:new Date(destination.endDate).toISOString() },
        totalPrice:grandTotal, specialRequests:travelerInfo.specialRequest||undefined,
      });

      localStorage.setItem('currentBooking', JSON.stringify({ bookingNumber:created.bookingNumber, bookingId:created._id, totalPrice:grandTotal, amountPaid:effectiveAmount }));
      setBookingId(created._id);
      setBookingReference(created.bookingNumber);
      await initiatePayment(created._id, created.bookingNumber);

    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ code?:string; message?:string; existingBooking?:AlreadyBookedInfo }>;

      if (axiosErr.response?.status === 409) {
        const data = axiosErr.response.data;

        // ── Duplicate email for this trip (your new backend check) ─────────
        if (!data?.code || data?.message?.includes('email already exists')) {
          setShowDuplicateEmailModal(true);
          setPhase('error');
          return;
        }

        // ── Traveler already booked (existing check) ───────────────────────
        if (data?.code === 'TRAVELER_ALREADY_BOOKED') {
          setAlreadyBookedInfo(data.existingBooking as AlreadyBookedInfo);
          setPhase('error');
          return;
        }
      }

      setPhase('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create booking');
    }
  };

  // ── Payment initiation ────────────────────────────────────────────────────

  const initiatePayment = async (bkId: string, bkRef: string): Promise<void> => {
    setPhase('processing');
    const paymentReference = generatePaymentReference(bkRef);
    try {
      await PaymentServices.initiatePayment({ bookingId:bkId, amountPaid:effectiveAmount, paymentMethod:selectedMethodId, mobileNumber, paymentReference });
      startPolling(paymentReference, bkId);
    } catch (err) {
      const data       = getDataFromResponse(err);
      const msg        = typeof data?.message==='string' ? data.message : 'Failed to initiate payment. Please try again.';
      const visibility = data?.visibility ?? 'silent';
      const zynleCode  = data?.zynleCode  ?? '';
      if (visibility==='silent') setToast({ message:msg, severity:'error' });
      if (zynleCode==='9904'||zynleCode==='9906') { setToast({ message:'Duplicate reference — tap Complete Booking again.', severity:'warning' }); setPhase('payment_failed'); setErrorMessage(''); return; }
      setPhase('error'); setErrorMessage(msg);
    }
  };

  // ── Dialog handlers ───────────────────────────────────────────────────────

  const handleUseExistingProfile = async () => {
    if (pendingTravelerIndex===null||!travelerInfo) { setShowExistingDialog(false); return; }
    setShowExistingDialog(false);
    try {
      const all = [travelerInfo.mainTraveler,...travelerInfo.additionalTravelers];
      const existing = await TravelerServices.getTravelerByIdNumber(all[pendingTravelerIndex].idNumber);
      const updated = [...pendingIdsRef.current]; updated[pendingTravelerIndex]=existing._id; pendingIdsRef.current=updated;
      setPendingTravelerIndex(null); setExistingTravelerData(null);
      await processRemainingTravelers(pendingTravelerIndex+1, updated);
    } catch { setPhase('error'); setErrorMessage('Failed to load existing profile. Please try again.'); }
  };

  const handleCreateNewProfile = async () => {
    if (pendingTravelerIndex===null||!travelerInfo) { setShowExistingDialog(false); return; }
    setShowExistingDialog(false);
    try {
      const all = [travelerInfo.mainTraveler,...travelerInfo.additionalTravelers];
      const newId = await buildAndCreateTraveler(all[pendingTravelerIndex], travelerInfo.email, true);
      const updated = [...pendingIdsRef.current]; updated[pendingTravelerIndex]=newId; pendingIdsRef.current=updated;
      setPendingTravelerIndex(null); setExistingTravelerData(null);
      await processRemainingTravelers(pendingTravelerIndex+1, updated);
    } catch { setPhase('error'); setErrorMessage('Failed to create traveler profile. Please try again.'); }
  };

  const handleCancelBooking = async () => {
    if (!bookingId) return;
    setIsCancelling(true);
    try {
      await cancelAndDeleteBooking(bookingId);
      setBookingId(null); setBookingReference(null); setPhase('ready');
      setErrorMessage(''); setMobileNumber(''); setAmountInput('');
      localStorage.removeItem('currentBooking');
      <SmartNavigation section='services'/>
    } catch { setErrorMessage('Could not delete the booking. Please contact support.'); }
    finally { setIsCancelling(false); setShowCancelDialog(false); }
  };

  const handleCompleteBooking = async () => {
    if (!destination?.title||!travelerInfo) { setPhase('error'); setErrorMessage('Booking information is missing. Please go back and try again.'); return; }
    if (!isPhoneValid||!prefixMatches) { setErrorMessage(phoneError||'Please enter a valid mobile number.'); return; }
    if (!isAmountValid) { setAmountError(amountError||`Minimum payment is ${formatZMW(minPayment)}`); return; }
    setErrorMessage(''); setAmountError('');
    if (bookingAlreadyCreated&&bookingId&&bookingReference) { await initiatePayment(bookingId,bookingReference); return; }
    setPhase('creating_travelers'); pendingIdsRef.current=[]; await processRemainingTravelers(0,[]);
  };

  const buttonLabel = () => {
    switch (phase) {
      case 'creating_travelers': return 'Setting up profiles…';
      case 'creating_booking':   return 'Creating booking…';
      case 'processing':         return 'Initiating payment…';
      case 'polling':            return `Waiting for approval… (${pollAttempts}/${MAX_POLL_ATTEMPTS})`;
      case 'payment_failed':     return `Retry Payment — Pay ${formatZMW(isAmountValid?parsedAmount:minPayment)} via ${selectedMethod.shortLabel}`;
      default: return `Complete Booking — Pay ${formatZMW(isAmountValid?parsedAmount:minPayment)} via ${selectedMethod.shortLabel}`;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ height:'100%',display:'flex',flexDirection:'column',gap:3,p:{ xs:2,sm:3,md:4 } }}>

      <Box>
        <Typography variant="h4" sx={{ color:Theme.bronze[700],fontWeight:600,mb:1 }}>Complete Your Booking</Typography>
        <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'16px' }}>
          Choose how much to pay now — the minimum reservation fee secures your slot
        </Typography>
      </Box>

      {isBusy && (
        <Alert severity="info" icon={<CircularProgress size={18} />} sx={{ borderRadius:2 }}>
          {phase==='creating_travelers' && 'Setting up traveler profiles…'}
          {phase==='creating_booking'   && 'Creating your booking…'}
          {phase==='processing'         && 'Sending payment prompt to your phone…'}
          {phase==='polling' && (<>Check your phone ({mobileNumber}) and enter your PIN.&nbsp;<strong>Attempt {pollAttempts} of {MAX_POLL_ATTEMPTS}</strong></>)}
        </Alert>
      )}
      {phase==='success'       && <Alert severity="success" sx={{ borderRadius:2 }}>✓ Payment confirmed! Your slot is reserved. A receipt has been sent to your email.</Alert>}
      {phase==='payment_failed'&& <Alert severity="warning" sx={{ borderRadius:2 }}><Typography fontWeight={600} sx={{ mb:0.5 }}>Payment was not completed</Typography>{errorMessage} You can change method or number below and retry — your booking reference is preserved.</Alert>}
      {phase==='error'&&errorMessage && <Alert severity="error" sx={{ borderRadius:2 }}>{errorMessage}</Alert>}

      <Box sx={{ display:'grid',gridTemplateColumns:{ xs:'1fr',lg:'2fr 1fr' },gap:4,flex:1 }}>

        {/* Left */}
        <Box sx={{ display:'flex',flexDirection:'column',gap:3,backgroundColor:'white',borderRadius:3,p:{ xs:2,sm:3 },boxShadow:2,border:`1px solid ${Theme.bronze[100]}` }}>

          {/* Method */}
          <Box>
            <Typography variant="h6" sx={{ color:Theme['dark-khakhi'][800],mb:2,display:'flex',alignItems:'center',gap:1 }}>
              <FaLock size={15} color={Theme.bronze[500]} /> Payment Method
            </Typography>
            <Box sx={{ display:'grid',gridTemplateColumns:`repeat(${MOBILE_PAYMENT_METHODS.length},minmax(140px,1fr))`,gap:2 }}>
              {MOBILE_PAYMENT_METHODS.map(m => (
                <MethodCard key={m.id} method={m} isSelected={selectedMethodId===m.id}
                  onSelect={id => { setSelectedMethodId(id as 'airtel'|'mtn'); setMobileNumber(''); }}
                  disabled={isBusy||phase==='success'} />
              ))}
            </Box>
          </Box>
          <Divider />

          {/* Phone */}
          <Box>
            <Typography variant="h6" sx={{ color:Theme['dark-khakhi'][800],mb:2,display:'flex',alignItems:'center',gap:1 }}>
              <FaMobileAlt size={15} color={Theme.bronze[500]} /> Mobile Number
            </Typography>
            <TextField fullWidth size="small"
              label={`${selectedMethod.shortLabel} Mobile Number`}
              placeholder={selectedMethod.placeholder}
              value={mobileNumber} onChange={e => setMobileNumber(sanitizePhone(e.target.value))}
              helperText={phoneError||`${selectedMethod.shortLabel} numbers start with ${selectedMethod.prefixes.join(' or ')} — 10 digits`}
              error={Boolean(phoneError)} disabled={isBusy||phase==='success'}
              InputProps={{ startAdornment:<InputAdornment position="start"><FaMobileAlt style={{ color:Theme.bronze[500] }} /></InputAdornment> }}
              sx={inputSx} />
          </Box>
          <Divider />

          {/* Amount */}
          {!bookingAlreadyCreated && (
            <Box>
              <Typography variant="h6" sx={{ color:Theme['dark-khakhi'][800],mb:0.5 }}>Amount to Pay Now</Typography>
              <Typography sx={{ color:Theme['dark-khakhi'][500],fontSize:'13px',mb:2 }}>
                Minimum is the reservation fee ({formatZMW(minPayment)}). Pay up to the full trip cost ({formatZMW(totalPrice)}).
              </Typography>
              <Box sx={{ display:'flex',gap:1.5,flexWrap:'wrap',mb:2 }}>
                {quickPicks.map(q => {
                  const active = amountInput===String(q.value);
                  return (
                    <Chip key={q.value} label={q.label} clickable onClick={() => setQuickPick(q.value)}
                      disabled={isBusy||phase==='success'}
                      sx={{ fontWeight:active?700:500,fontSize:'13px',backgroundColor:active?Theme.bronze[100]:Theme.wheat[50],color:active?Theme.bronze[800]:Theme['dark-khakhi'][700],border:active?`2px solid ${Theme.bronze[500]}`:`1px solid ${Theme['dark-khakhi'][200]}`,'&:hover':{ backgroundColor:Theme.bronze[50],border:`2px solid ${Theme.bronze[400]}` } }} />
                  );
                })}
              </Box>
              <TextField fullWidth size="small" label="Enter Amount (ZMW)" placeholder={`Min ${formatZMW(minPayment)}`}
                value={amountInput} onChange={e => handleAmountChange(e.target.value)}
                error={Boolean(amountError)} helperText={amountError||`Any amount from ${formatZMW(minPayment)} to ${formatZMW(totalPrice)}`}
                disabled={isBusy||phase==='success'}
                InputProps={{ startAdornment:<InputAdornment position="start"><Typography sx={{ color:Theme.bronze[600],fontWeight:700,fontSize:'15px' }}>K</Typography></InputAdornment> }}
                sx={inputSx} />
            </Box>
          )}
          {bookingAlreadyCreated && (
            <Box sx={{ p:2,borderRadius:2,backgroundColor:Theme.wheat[50],border:`1px solid ${Theme.bronze[100]}` }}>
              <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'13px',mb:0.5 }}>Payment amount locked in for this booking</Typography>
              <Typography sx={{ color:Theme.bronze[700],fontWeight:700,fontSize:'20px' }}>{formatZMW(effectiveAmount)}</Typography>
              <Typography sx={{ color:Theme['dark-khakhi'][500],fontSize:'12px',mt:0.5 }}>Booking reference: <strong>{bookingReference}</strong></Typography>
            </Box>
          )}
          <Divider />

          {/* Breakdown */}
          <Box sx={{ backgroundColor:Theme.wheat[50],borderRadius:2,p:2.5,border:`1px solid ${Theme.bronze[100]}`,display:'flex',flexDirection:'column',gap:1.5 }}>
            <Typography sx={{ color:Theme['dark-khakhi'][700],fontSize:'13px',fontWeight:700 }}>Payment Breakdown</Typography>
            <Box sx={{ display:'flex',justifyContent:'space-between' }}>
              <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'13px' }}>Total Trip Cost</Typography>
              <Typography sx={{ color:Theme['dark-khakhi'][800],fontWeight:600,fontSize:'13px' }}>{formatZMW(totalPrice)}</Typography>
            </Box>
            <Box sx={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'13px' }}>Paying Now</Typography>
              <Typography sx={{ color:selectedMethod.brandColor,fontWeight:700,fontSize:'18px' }}>{formatZMW(effectiveAmount)}</Typography>
            </Box>
            <Divider sx={{ borderColor:Theme.bronze[100] }} />
            <Box sx={{ display:'flex',justifyContent:'space-between' }}>
              <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'13px' }}>Remaining Balance <span style={{ fontStyle:'italic',fontSize:'11px',color:Theme['dark-khakhi'][500],marginLeft:4 }}>(due before departure)</span></Typography>
              <Typography sx={{ color:Theme['dark-khakhi'][800],fontWeight:600,fontSize:'13px' }}>{formatZMW(remaining)}</Typography>
            </Box>
          </Box>

          {/* Polling bar */}
          {phase==='polling' && (
            <Box sx={{ display:'flex',alignItems:'center',gap:1.5,p:2,bgcolor:Theme.wheat[100],borderRadius:2 }}>
              <CircularProgress size={18} sx={{ color:selectedMethod.brandColor }} />
              <Box sx={{ flex:1 }}>
                <Typography sx={{ color:Theme['dark-khakhi'][700],fontSize:'13px' }}>Waiting for you to approve on your phone…</Typography>
                <Box sx={{ mt:1,height:4,borderRadius:2,backgroundColor:Theme['dark-khakhi'][100],overflow:'hidden' }}>
                  <Box sx={{ height:'100%',width:`${(pollAttempts/MAX_POLL_ATTEMPTS)*100}%`,backgroundColor:selectedMethod.brandColor,transition:'width 0.5s ease',borderRadius:2 }} />
                </Box>
                <Typography sx={{ color:Theme['dark-khakhi'][500],fontSize:'11px',mt:0.5 }}>{MAX_POLL_ATTEMPTS-pollAttempts} checks remaining before timeout</Typography>
              </Box>
            </Box>
          )}

          {/* Security */}
          <Box sx={{ backgroundColor:Theme['olive-wood'][50],borderRadius:2,p:2,border:`1px solid ${Theme['olive-wood'][200]}`,display:'flex',gap:2,alignItems:'flex-start' }}>
            <FaShieldAlt size={18} color={Theme['olive-wood'][600]} style={{ flexShrink:0,marginTop:2 }} />
            <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'13px',lineHeight:1.5 }}>
              Payments are processed securely. Your phone number is only used to deliver the payment prompt.
            </Typography>
          </Box>

          {/* CTA */}
          {phase!=='success' && (
            <Button variant="contained" fullWidth size="large" onClick={handleCompleteBooking}
              disabled={isBusy||!isPhoneValid||!prefixMatches||(!bookingAlreadyCreated&&!isAmountValid)}
              sx={{ mt:1,py:2,fontSize:'15px',fontWeight:700,borderRadius:2,backgroundColor:phase==='payment_failed'?Theme['olive-wood'][600]:Theme.bronze[600],color:'white','&:hover':{ backgroundColor:phase==='payment_failed'?Theme['olive-wood'][700]:Theme.bronze[700] },'&.Mui-disabled':{ backgroundColor:Theme['dark-khakhi'][200],color:Theme['dark-khakhi'][400] } }}
              startIcon={isBusy?<CircularProgress size={20} color="inherit" />:phase==='payment_failed'?<FaRedo />:<FaCheckCircle />}
            >{buttonLabel()}</Button>
          )}
          {phase==='error' && <Button variant="text" size="small" onClick={() => { setPhase('ready'); setErrorMessage(''); }} sx={{ color:Theme.bronze[600],alignSelf:'center' }}>Try again from the beginning</Button>}
          {phase==='payment_failed'&&bookingId && (
            <Button variant="outlined" fullWidth size="large" onClick={() => setShowCancelDialog(true)} disabled={isCancelling}
              sx={{ py:1.5,borderRadius:2,borderColor:'error.main',color:'error.main',fontWeight:600,'&:hover':{ backgroundColor:'rgba(211,47,47,0.04)',borderColor:'error.dark' } }}
              startIcon={<FaTimesCircle />}>Cancel Booking</Button>
          )}
        </Box>

        {/* Right */}
        <Box sx={{ display:'flex',flexDirection:'column',gap:3,backgroundColor:Theme.bronze[50],borderRadius:3,p:{ xs:2,sm:3 },border:`2px solid ${Theme.bronze[200]}`,position:'sticky',top:20,alignSelf:'start' }}>
          <Typography variant="h6" sx={{ color:Theme.bronze[800],fontWeight:700 }}>Payment Summary</Typography>
          <Box sx={{ display:'flex',flexDirection:'column',gap:2 }}>
            <Box sx={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'14px' }}>Total Trip Cost</Typography>
              <Typography sx={{ fontWeight:600,fontSize:'16px',color:Theme.bronze[700] }}>{formatZMW(totalPrice)}</Typography>
            </Box>
            <Divider sx={{ borderColor:Theme.bronze[200] }} />
            <Box sx={{ backgroundColor:'white',borderRadius:2,p:2 }}>
              <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'12px',mb:0.5 }}>Paying Now</Typography>
              <Typography sx={{ fontWeight:800,fontSize:'32px',color:Theme.bronze[800] }}>{formatZMW(effectiveAmount)}</Typography>
            </Box>
            <Box sx={{ backgroundColor:'white',borderRadius:2,p:2 }}>
              <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'12px',mb:0.5 }}>Remaining After Payment</Typography>
              <Typography sx={{ fontWeight:700,fontSize:'20px',color:Theme.bronze[700] }}>{formatZMW(remaining)}</Typography>
              <Typography sx={{ color:Theme['dark-khakhi'][500],fontSize:'11px',mt:0.5 }}>Due before your departure date</Typography>
            </Box>
          </Box>
          <Divider sx={{ borderColor:Theme.bronze[200] }} />
          <Box sx={{ p:2,borderRadius:2,backgroundColor:Theme['olive-wood'][50],border:`1px solid ${Theme['olive-wood'][200]}`,display:'flex',gap:1.5,alignItems:'flex-start' }}>
            <FaInfoCircle size={16} color={Theme['olive-wood'][600]} style={{ flexShrink:0,marginTop:2 }} />
            <Box>
              <Typography sx={{ color:Theme['dark-khakhi'][800],fontWeight:700,fontSize:'13px',mb:0.5 }}>Minimum reservation fee</Typography>
              <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'12px',lineHeight:1.5 }}>
                {totalPrice<TIER_THRESHOLD?'K250 — trips under K1,000':'K500 — trips K1,000 and above'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display:'flex',flexDirection:'column',gap:1 }}>
            {['Secure payment via ZynlePay','Instant SMS confirmation','24/7 customer support','Slot held until balance is fully paid'].map(t => (
              <Typography key={t} sx={{ color:Theme['dark-khakhi'][600],fontSize:'13px',display:'flex',gap:1 }}><span style={{ color:Theme['olive-wood'][600] }}>✓</span>{t}</Typography>
            ))}
          </Box>
          <Divider sx={{ borderColor:Theme.bronze[200] }} />
          <Typography sx={{ color:Theme['dark-khakhi'][500],fontSize:'11px',textAlign:'center' }}>
            By completing this booking you agree to our Terms &amp; Conditions and Privacy Policy
          </Typography>
        </Box>
      </Box>

      {/* ── Existing traveler dialog ── */}
      <ExistingTravelerDialog open={showExistingDialog} travelerData={existingTravelerData}
        onUseExisting={handleUseExistingProfile} onCreateNew={handleCreateNewProfile}
        onClose={() => { setShowExistingDialog(false); setPendingTravelerIndex(null); setExistingTravelerData(null); setPhase('error'); setErrorMessage('Booking was cancelled. Please go back and try again.'); }} />

      {/* ── Already booked modal ── */}
      <AlreadyBookedModal open={alreadyBookedInfo!==null} info={alreadyBookedInfo} onClose={() => setAlreadyBookedInfo(null)} />

      {/* ── Duplicate email for trip modal ── */}
      <DuplicateEmailModal
        open={showDuplicateEmailModal}
        email={bookingData.travelerInfo?.email ?? ''}
        tripTitle={bookingData.destination?.title ?? 'this trip'}
        onGoBack={() => { setShowDuplicateEmailModal(false); setPhase('ready'); setErrorMessage(''); }}
        onViewTrips={() => { setShowDuplicateEmailModal(false); navigate('/viewtrips', { replace:true }); }}
      />

      {/* ── Toast ── */}
      <Snackbar open={toast!==null} autoHideDuration={8000} onClose={() => setToast(null)} anchorOrigin={{ vertical:'top',horizontal:'center' }}>
        <Alert onClose={() => setToast(null)} severity={toast?.severity??'error'} variant="filled" sx={{ width:'100%',maxWidth:520 }}>{toast?.message}</Alert>
      </Snackbar>

      {/* ── Success modal ── */}
      <Dialog open={showSuccessModal} onClose={() => {}} maxWidth="sm" fullWidth PaperProps={{ sx:{ borderRadius:3,overflow:'hidden' } }}>
        <Box sx={{ backgroundColor:colors.oliveWood[600],p:4,display:'flex',flexDirection:'column',alignItems:'center',gap:1.5 }}>
          <Box sx={{ width:64,height:64,borderRadius:'50%',backgroundColor:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <FaCheckCircle size={34} color="white" />
          </Box>
          <Typography sx={{ color:'white',fontWeight:700,fontSize:'22px',textAlign:'center' }}>Booking Completed!</Typography>
          <Typography sx={{ color:'rgba(255,255,255,0.85)',fontSize:'15px',textAlign:'center' }}>
            Your trip to <strong>{bookingData.destination?.title??'your destination'}</strong> is now being processed
          </Typography>
        </Box>
        <DialogContent sx={{ p:3 }}>
          <Box sx={{ p:2,mb:2,borderRadius:2,backgroundColor:Theme.wheat[50],border:`1px solid ${Theme.bronze[100]}`,textAlign:'center' }}>
            <Typography sx={{ color:Theme['dark-khakhi'][500],fontSize:'12px',mb:0.5 }}>Booking Reference</Typography>
            <Typography sx={{ color:Theme.bronze[800],fontWeight:700,fontSize:'20px',fontFamily:'monospace',letterSpacing:1 }}>{bookingReference??'—'}</Typography>
          </Box>
          <Box sx={{ display:'flex',flexDirection:'column',gap:1,mb:2.5 }}>
            {[
              { label:'Amount Paid',       value:formatZMW(successResult?.amountPaid??0) },
              { label:'Remaining Balance', value:formatZMW((successResult?.totalPrice??0)-(successResult?.amountPaid??0)) },
              { label:'Payment Method',    value:successResult?.method?.toUpperCase()??'—' },
            ].map(({ label,value }) => (
              <Box key={label} sx={{ display:'flex',justifyContent:'space-between' }}>
                <Typography sx={{ color:Theme['dark-khakhi'][600],fontSize:'14px' }}>{label}</Typography>
                <Typography sx={{ color:Theme['dark-khakhi'][800],fontWeight:600,fontSize:'14px' }}>{value}</Typography>
              </Box>
            ))}
          </Box>
          <Alert severity="info" sx={{ borderRadius:2,mb:2,fontSize:'13px' }}>
            A confirmation email with full trip details will be sent to <strong>{bookingData.travelerInfo?.email}</strong> shortly.
          </Alert>
          {bookingData.travelerInfo?.phone && (
            <Box sx={{ p:2,borderRadius:2,mb:2,backgroundColor:'#e8f5e9',border:'1px solid #a5d6a7',display:'flex',alignItems:'center',gap:1.5 }}>
              <Box sx={{ width:36,height:36,borderRadius:'50%',backgroundColor:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                <Typography sx={{ color:'white',fontSize:'16px',fontWeight:900 }}>W</Typography>
              </Box>
              <Box sx={{ flex:1 }}>
                <Typography sx={{ color:'#1b5e20',fontWeight:600,fontSize:'13px' }}>Get updates on WhatsApp</Typography>
                <Typography sx={{ color:'#2e7d32',fontSize:'12px' }}>Click to open a WhatsApp chat — we'll send your booking details there too once you are confirmed</Typography>
              </Box>
              <Button size="small" variant="contained"
                onClick={() => {
                  const phone = bookingData.travelerInfo!.phone.replace(/\D/g,'');
                  const intl  = phone.startsWith('0') ? `260${phone.slice(1)}` : phone;
                  const msg   = encodeURIComponent(`Hi TravaUni! My booking reference is ${bookingReference??''} for a trip to ${bookingData.destination?.title??'my destination'}. Please send me the full trip details.`);
                  window.open(`https://wa.me/${intl}?text=${msg}`,'_blank');
                }}
                sx={{ backgroundColor:'#25D366',color:'white',flexShrink:0,'&:hover':{ backgroundColor:'#1ebe5d' },borderRadius:2,fontSize:'12px' }}
              >Open WhatsApp</Button>
            </Box>
          )}
          <Typography sx={{ color:Theme['dark-khakhi'][500],fontSize:'12px',textAlign:'center' }}>
            To view your booking details and trip updates, you will need your booking reference and registered email address.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p:3,pt:0,gap:1.5 }}>
          <Button fullWidth variant="outlined"
            onClick={() => { setShowSuccessModal(false); if(successResult) onPaymentComplete?.(successResult); navigate('/',{ replace:true }); }}
            sx={{ borderColor:Theme.bronze[400],color:Theme.bronze[700],borderRadius:2,py:1.2,'&:hover':{ borderColor:Theme.bronze[600],backgroundColor:Theme.bronze[50] } }}
          >Close</Button>
        </DialogActions>
      </Dialog>

      {/* ── Cancel dialog ── */}
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display:'flex',alignItems:'center',gap:1,color:'error.main' }}>
          <FaTimesCircle size={18} /> Cancel Booking?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete your booking{bookingReference&&<> (<strong>{bookingReference}</strong>)</>} and all associated payment records. You will need to start from scratch.
          </DialogContentText>
          <DialogContentText sx={{ mt:1.5,color:'text.secondary',fontSize:'13px' }}>
            If you just want to try a different phone number or method, close this dialog and use the Retry button instead.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)} color="inherit" disabled={isCancelling}>Keep Booking</Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained" disabled={isCancelling}
            startIcon={isCancelling?<CircularProgress size={16} color="inherit" />:<FaTimesCircle />}
          >{isCancelling?'Cancelling…':'Yes, Cancel Booking'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}