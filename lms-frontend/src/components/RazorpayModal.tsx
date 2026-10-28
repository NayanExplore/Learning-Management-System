import React, { useState, useEffect } from 'react';
import { OrderResponse, User } from '../types';
import { api } from '../api/client';
import {
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Check,
} from 'lucide-react';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderResponse;
  courseTitle: string;
  user: User;
  onPaymentSuccess: (orderNumber: string, paymentId: string) => void;
  onPaymentError: (errMsg: string) => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  order,
  courseTitle,
  user,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [activeMethod, setActiveMethod] = useState<PaymentMethod>('upi');
  const [upiOption, setUpiOption] = useState<'qr' | 'id'>('qr');
  const [upiId, setUpiId] = useState('');
  
  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(user.fullName || '');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState('phonepe');

  // Processing & status states
  const [paymentState, setPaymentState] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [processStep, setProcessStep] = useState('');
  const [generatedPaymentId, setGeneratedPaymentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPaymentState('IDLE');
      setErrorMessage('');
      setGeneratedPaymentId('pay_' + Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString().slice(-4));
      setCardHolder(user.fullName || '');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleFillTestCard = () => {
    setCardNumber('4532 8901 2345 6789');
    setCardExpiry('12/28');
    setCardCvv('888');
    setCardHolder(user.fullName || 'Demo Student');
  };

  const handlePayNow = async () => {
    setPaymentState('PROCESSING');
    setProcessStep('Connecting to Razorpay Payment Gateway...');

    try {
      // Step 1: Simulated bank authorization delay for realistic payment experience
      await new Promise((resolve) => setTimeout(resolve, 900));
      setProcessStep('Authorizing payment with bank / UPI network...');

      await new Promise((resolve) => setTimeout(resolve, 1100));
      setProcessStep('Verifying cryptographic signature with server...');

      // Step 2: Call backend payment verification
      const verifyRes = await api.post('/v1/payments/verify', {
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: generatedPaymentId,
        razorpaySignature: 'mock_signature_sandbox',
      });

      if (verifyRes.data?.success) {
        setPaymentState('SUCCESS');
        setProcessStep('Payment Successful & Enrollment Activated!');
        setTimeout(() => {
          onPaymentSuccess(order.orderNumber, generatedPaymentId);
        }, 1800);
      } else {
        throw new Error(verifyRes.data?.message || 'Payment signature verification failed.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Payment failed during gateway processing.';
      setPaymentState('FAILED');
      setErrorMessage(msg);
      onPaymentError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Top Header - Razorpay official branding style */}
        <div className="bg-[#0c2340] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg tracking-wider shadow-md">
              R
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white">Razorpay</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  Test Gateway
                </span>
              </div>
              <p className="text-xs text-slate-300">SkillForge Academy &bull; Instant Course Enrollment</p>
            </div>
          </div>

          <div className="text-right flex items-center space-x-4">
            <div>
              <span className="text-xs text-slate-300 block">Total Payable</span>
              <span className="text-2xl font-extrabold text-white">
                ₹{order.amount?.toLocaleString('en-IN')}
              </span>
            </div>
            {paymentState === 'IDLE' && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
                title="Cancel checkout"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar with Student prefill details */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-slate-800">{user.fullName}</span>
            <span>&bull;</span>
            <span>{user.email}</span>
            {user.phone && (
              <>
                <span>&bull;</span>
                <span>{user.phone}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* State 1: PROCESSING */}
        {paymentState === 'PROCESSING' && (
          <div className="py-16 px-6 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Processing Digital Payment</h3>
              <p className="text-sm text-slate-600 font-medium animate-pulse">{processStep}</p>
            </div>
            <div className="max-w-xs mx-auto bg-slate-100 rounded-lg p-3 text-xs text-slate-500">
              Please do not refresh or press back while Razorpay authenticates this transaction.
            </div>
          </div>
        )}

        {/* State 2: SUCCESS */}
        {paymentState === 'SUCCESS' && (
          <div className="py-16 px-6 text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Payment Successful!</h3>
              <p className="text-sm text-slate-600">Your enrollment in <strong>{courseTitle}</strong> is active.</p>
            </div>
            <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-700">
              <span className="text-slate-400">Transaction ID:</span> <span className="font-mono font-bold text-slate-800">{generatedPaymentId}</span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold flex items-center justify-center space-x-1">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Redirecting to your course player...</span>
            </p>
          </div>
        )}

        {/* State 3: FAILED */}
        {paymentState === 'FAILED' && (
          <div className="py-14 px-6 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Payment Failed</h3>
              <p className="text-sm text-rose-600 font-medium">{errorMessage}</p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setPaymentState('IDLE')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition"
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* State 0: IDLE (Interactive Payment Options) */}
        {paymentState === 'IDLE' && (
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
            
            {/* Left Column: Payment Methods Navigation */}
            <div className="md:col-span-4 bg-slate-50 border-r border-slate-200 p-3 space-y-1.5">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Payment Options
              </div>

              <button
                onClick={() => setActiveMethod('upi')}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left ${
                  activeMethod === 'upi'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <QrCode className="w-4 h-4 shrink-0" />
                <div className="flex-1">
                  <div>UPI & QR Code</div>
                  <div className={`text-[10px] ${activeMethod === 'upi' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Google Pay, PhonePe, Paytm
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveMethod('card')}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left ${
                  activeMethod === 'card'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <div className="flex-1">
                  <div>Cards (Credit/Debit)</div>
                  <div className={`text-[10px] ${activeMethod === 'card' ? 'text-blue-100' : 'text-slate-400'}`}>
                    Visa, Mastercard, RuPay
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveMethod('netbanking')}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left ${
                  activeMethod === 'netbanking'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <div className="flex-1">
                  <div>Net Banking</div>
                  <div className={`text-[10px] ${activeMethod === 'netbanking' ? 'text-blue-100' : 'text-slate-400'}`}>
                    All Major Indian Banks
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveMethod('wallet')}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition text-left ${
                  activeMethod === 'wallet'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/60'
                }`}
              >
                <Wallet className="w-4 h-4 shrink-0" />
                <div className="flex-1">
                  <div>Wallets</div>
                  <div className={`text-[10px] ${activeMethod === 'wallet' ? 'text-blue-100' : 'text-slate-400'}`}>
                    PhonePe, Paytm, Mobikwik
                  </div>
                </div>
              </button>
            </div>

            {/* Right Column: Active Payment Method Form */}
            <div className="md:col-span-8 p-6 flex flex-col justify-between">
              
              {/* Tab 1: UPI / QR */}
              {activeMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <button
                      onClick={() => setUpiOption('qr')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        upiOption === 'qr' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Instant QR Code
                    </button>
                    <button
                      onClick={() => setUpiOption('id')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                        upiOption === 'id' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      UPI ID / VPA
                    </button>
                  </div>

                  {upiOption === 'qr' ? (
                    <div className="text-center space-y-3 py-2">
                      <div className="w-44 h-44 mx-auto p-3 bg-white border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center shadow-inner relative group">
                        <QrCode className="w-28 h-28 text-slate-800" />
                        <div className="absolute inset-0 bg-blue-600/10 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <span className="text-[11px] font-bold bg-blue-600 text-white px-3 py-1 rounded-full shadow">
                            Scan & Pay
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Scan with any UPI App (Google Pay, PhonePe, Paytm, BHIM)
                      </p>
                      <div className="flex items-center justify-center space-x-3 text-[11px] text-slate-500">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold">GPay</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold">PhonePe</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold">Paytm</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold">CRED</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 py-4">
                      <label className="block text-xs font-bold text-slate-700">Enter UPI ID / VPA</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or username@okhdfcbank"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        A payment collect request will be sent to your UPI application.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Cards */}
              {activeMethod === 'card' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Card Information</span>
                    <button
                      onClick={handleFillTestCard}
                      className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Autofill Test Card</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4532 8901 2345 6789"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Name on Card</label>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: Net Banking */}
              {activeMethod === 'netbanking' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 block">Popular Indian Banks</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { code: 'HDFC', name: 'HDFC Bank' },
                      { code: 'ICICI', name: 'ICICI Bank' },
                      { code: 'SBI', name: 'State Bank of India' },
                      { code: 'AXIS', name: 'Axis Bank' },
                      { code: 'KOTAK', name: 'Kotak Bank' },
                      { code: 'PNB', name: 'Punjab National Bank' },
                    ].map((bank) => (
                      <button
                        key={bank.code}
                        type="button"
                        onClick={() => setSelectedBank(bank.code)}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                          selectedBank === bank.code
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{bank.name}</span>
                        {selectedBank === bank.code && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Wallets */}
              {activeMethod === 'wallet' && (
                <div className="space-y-4">
                  <span className="text-xs font-bold text-slate-700 block">Select Digital Wallet</span>
                  <div className="space-y-2">
                    {[
                      { id: 'phonepe', name: 'PhonePe Wallet / UPI' },
                      { id: 'paytm', name: 'Paytm Payments Bank / Wallet' },
                      { id: 'amazon', name: 'Amazon Pay' },
                      { id: 'mobikwik', name: 'MobiKwik' },
                    ].map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition ${
                          selectedWallet === wallet.id
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Smartphone className="w-4 h-4 text-slate-400" />
                          <span>{wallet.name}</span>
                        </div>
                        {selectedWallet === wallet.id && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA Button */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Secured by Razorpay</span>
                </div>

                <button
                  type="button"
                  onClick={handlePayNow}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20 flex items-center space-x-2"
                >
                  <span>Pay ₹{order.amount?.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
