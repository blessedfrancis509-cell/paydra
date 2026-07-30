import React, { useState, useEffect } from 'react';
import { Beneficiary, Transaction } from '../types';
import { NIGERIAN_BANKS } from '../data/mockData';
import { X, Send, Search, CheckCircle2, ShieldCheck, Lock, Sparkles, ArrowRight, Building2, User, ChevronRight, Delete } from 'lucide-react';
import { triggerSuccessConfetti } from '../utils/confetti';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiaries: Beneficiary[];
  userBalance: number;
  onCompleteTransfer: (newTx: Transaction) => void;
  prefilledBeneficiary?: Beneficiary | null;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  beneficiaries,
  userBalance,
  onCompleteTransfer,
  prefilledBeneficiary,
}) => {
  const [step, setStep] = useState<'DESTINATION' | 'DETAILS' | 'PIN' | 'PROCESSING' | 'SUCCESS'>('DESTINATION');
  const [transferType, setTransferType] = useState<'BANK' | 'PAYDRA'>('BANK');

  // Input States
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState(NIGERIAN_BANKS[1]); // Default OPay or GTB
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Transfer');
  const [pin, setPin] = useState(['', '', '', '']);

  // Account Lookup States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  // Completed Tx Ref
  const [createdTx, setCreatedTx] = useState<Transaction | null>(null);
  const [processingStep, setProcessingStep] = useState(0);

  useEffect(() => {
    if (prefilledBeneficiary) {
      setAccountNumber(prefilledBeneficiary.accountNumber);
      const foundBank = NIGERIAN_BANKS.find(b => b.name.includes(prefilledBeneficiary.bankName)) || NIGERIAN_BANKS[0];
      setSelectedBank(foundBank);
      setVerifiedName(prefilledBeneficiary.name);
      setStep('DETAILS');
    }
  }, [prefilledBeneficiary]);

  useEffect(() => {
    if (step !== 'PROCESSING') return;
    setProcessingStep(0);
    const interval = setInterval(() => {
      setProcessingStep(prev => Math.min(prev + 1, 4));
    }, 400);
    return () => clearInterval(interval);
  }, [step]);

  // Account Lookup Simulator
  useEffect(() => {
    if (accountNumber.length === 10) {
      setIsVerifying(true);
      setVerifiedName('');
      const timer = setTimeout(() => {
        setIsVerifying(false);
        // Pre-defined names based on last digits or default
        if (accountNumber.endsWith('120')) setVerifiedName('AMINA BELLO');
        else if (accountNumber.endsWith('102')) setVerifiedName('CHIDI OKAFOR');
        else if (accountNumber.endsWith('810')) setVerifiedName('FOLAKE OGUNLEYE');
        else setVerifiedName('KUNLE ADENIYI OLUWASEUN');
      }, 700);
      return () => clearTimeout(timer);
    } else {
      setVerifiedName('');
    }
  }, [accountNumber, selectedBank]);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setAccountNumber(b.accountNumber);
    const foundBank = NIGERIAN_BANKS.find(bank => bank.name.includes(b.bankName)) || NIGERIAN_BANKS[0];
    setSelectedBank(foundBank);
    setVerifiedName(b.name);
    setStep('DETAILS');
  };

  const handleProceedToPin = async () => {
    if (numericAmount <= 0) return alert('Please enter a valid amount');
    if (numericAmount > userBalance) return alert('Insufficient funds in your NGN balance');

    // Trigger AI analysis
    try {
      const res = await fetch('/api/ai/analyze-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          recipient: verifiedName || accountNumber,
          bankName: selectedBank.name,
          note: note || 'Transfer',
        }),
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (e) {
      setAiAnalysis({ category: 'Transfer', suggestedTag: '#PaydraTransfer', cashbackEarned: 25 });
    }

    setPin(['', '', '', '']);
    setStep('PIN');
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'DEL') {
      const newPin = [...pin];
      for (let i = 3; i >= 0; i--) {
        if (newPin[i] !== '') {
          newPin[i] = '';
          break;
        }
      }
      setPin(newPin);
      return;
    }

    if (val === 'CLEAR') {
      setPin(['', '', '', '']);
      return;
    }

    const newPin = [...pin];
    const emptyIdx = newPin.findIndex(d => d === '');
    if (emptyIdx !== -1) {
      newPin[emptyIdx] = val;
      setPin(newPin);

      if (emptyIdx === 3) {
        // Execute transfer after short delay
        setTimeout(() => {
          executeTransfer(newPin);
        }, 300);
      }
    }
  };

  const executeTransfer = (finalPin: string[]) => {
    setProcessingStep(0);
    setStep('PROCESSING');

    setTimeout(() => {
      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        reference: `PAYDRA-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(10000 + Math.random() * 90000)}`,
        type: 'TRANSFER',
        title: `Transfer to ${verifiedName || accountNumber}`,
        amount: numericAmount,
        currency: 'NGN',
        fee: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESSFUL',
        recipientName: verifiedName || 'Verified Recipient',
        recipientAccount: accountNumber,
        bankName: selectedBank.name,
        senderName: 'Tunde Adebayo',
        senderAccount: '2084920193',
        senderBank: 'Paydra Bank',
        category: category,
        note: note,
        tag: aiAnalysis?.suggestedTag || '#ZeroFeeTransfer',
        cashbackEarned: aiAnalysis?.cashbackEarned || 20,
        receiptCode: `RCP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      setCreatedTx(newTx);
      onCompleteTransfer(newTx);
      triggerSuccessConfetti();
      setStep('SUCCESS');
    }, 1800);
  };

  const handleResetModal = () => {
    setStep('DESTINATION');
    setAccountNumber('');
    setAmount('');
    setNote('');
    setPin(['', '', '', '']);
    setVerifiedName('');
    setProcessingStep(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Send Money</h2>
              <p className="text-xs text-indigo-600 font-semibold">Instant & Always ₦0.00 Fee</p>
            </div>
          </div>
          <button
            onClick={handleResetModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: DESTINATION SELECTION */}
        {step === 'DESTINATION' && (
          <div className="py-4 space-y-4">
            {/* Toggle Paydra vs Other Banks */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setTransferType('BANK')}
                className={`py-2 rounded-xl transition-all ${
                  transferType === 'BANK' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                To Other Banks
              </button>
              <button
                onClick={() => setTransferType('PAYDRA')}
                className={`py-2 rounded-xl transition-all ${
                  transferType === 'PAYDRA' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                To Paydra User / Tag
              </button>
            </div>

            {/* Saved Beneficiaries Quick Picker */}
            <div>
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 block">
                Saved Beneficiaries
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {beneficiaries.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectBeneficiary(b)}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs group-hover:border-indigo-600">
                        {b.avatarUrl ? (
                          <img src={b.avatarUrl} alt={b.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          b.name.charAt(0)
                        )}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">{b.name}</p>
                        <p className="text-[11px] font-mono text-slate-500">{b.bankName} • {b.accountNumber}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* New Recipient Manual Entry Option */}
            <button
              onClick={() => setStep('DETAILS')}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-2xl text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all"
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Enter New Account Number</span>
            </button>
          </div>
        )}

        {/* STEP 2: DETAILS & AMOUNT */}
        {step === 'DETAILS' && (
          <div className="py-4 space-y-4">
            {/* Select Bank */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Select Bank</label>
              <select
                value={selectedBank.code}
                onChange={(e) => {
                  const b = NIGERIAN_BANKS.find(bank => bank.code === e.target.value);
                  if (b) setSelectedBank(b);
                }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {NIGERIAN_BANKS.map((b) => (
                  <option key={b.code} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Account Number Input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Account Number</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Enter 10-digit NUBAN number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-wider"
                />
                {isVerifying && (
                  <span className="absolute right-3 top-3 text-xs text-indigo-600 animate-pulse font-medium">
                    Verifying...
                  </span>
                )}
              </div>

              {/* Verified Account Name Banner */}
              {verifiedName && (
                <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-emerald-700 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{verifiedName}</span>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">Amount (₦)</label>
              </div>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              {/* Quick Chips */}
              <div className="flex items-center gap-2 mt-2">
                {[1000, 5000, 20000, 50000].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setAmount(chip.toString())}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                  >
                    +₦{chip.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Note */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                >
                  <option value="Transfer">Transfer</option>
                  <option value="Family">Family Support</option>
                  <option value="Food">Food & Dining</option>
                  <option value="Business">Business</option>
                  <option value="Bills">Bills</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Lunch refund"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Zero Fee Tag */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">Transfer Fee</span>
              <span className="font-bold text-indigo-600">₦0.00 (Paydra Zero-Fee)</span>
            </div>

            <button
              onClick={handleProceedToPin}
              disabled={!verifiedName || numericAmount <= 0}
              className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                verifiedName && numericAmount > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Continue to Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: 4-DIGIT TRANSACTION PIN */}
        {step === 'PIN' && (
          <div className="py-2 text-center space-y-4 animate-fade-in">
            {/* RECIPIENT & AMOUNT DISPLAY CARD */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 font-black text-base mx-auto flex items-center justify-center border-2 border-indigo-200 shadow-sm">
                {verifiedName.slice(0, 2).toUpperCase()}
              </div>
              
              <div>
                <p className="text-xs text-slate-500 font-semibold">Transfer to</p>
                <h3 className="text-sm font-black text-slate-900">{verifiedName}</h3>
                <p className="text-[11px] font-mono text-slate-500">{selectedBank.name} • {accountNumber}</p>
              </div>

              {/* Display Amount */}
              <div className="pt-1">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">
                  ₦{numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold mt-1">
                  <span>Zero Fee Transfer (₦0.00)</span>
                </div>
              </div>
            </div>

            {/* 4-DIGIT PIN CIRCLE DOTS */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 max-w-[260px] mx-auto flex items-center justify-center gap-4">
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pin[idx] !== '';
                return (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all ${
                      isFilled
                        ? 'bg-indigo-600 scale-125 shadow-md shadow-indigo-600/40 ring-4 ring-indigo-100'
                        : 'bg-slate-300'
                    }`}
                  />
                );
              })}
            </div>

            {/* DEMO PIN HINT */}
            <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-medium flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-700 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Demo PIN: <strong>1234</strong></span>
              </span>
              <button
                type="button"
                onClick={() => {
                  const demo = ['1', '2', '3', '4'];
                  setPin(demo);
                  setTimeout(() => executeTransfer(demo), 300);
                }}
                className="text-indigo-700 font-bold hover:underline text-[10px] cursor-pointer"
              >
                Auto-fill 1234
              </button>
            </div>

            {/* AUTHENTIC 3x4 TOUCH KEYPAD */}
            <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-1 pb-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', 'DEL'].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => handleKeypadPress(btn)}
                  className={`w-14 h-14 mx-auto rounded-full font-mono font-bold text-lg transition-all shadow-2xs cursor-pointer active:scale-90 flex items-center justify-center ${
                    btn === 'DEL' || btn === 'CLEAR'
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-sans border border-slate-200'
                      : 'bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-900 border border-slate-200/90 active:bg-indigo-700'
                  }`}
                >
                  {btn === 'DEL' ? <Delete className="w-5 h-5 text-slate-600 hover:text-white" /> : btn}
                </button>
              ))}
            </div>

            {/* AI Security Tag Preview */}
            {aiAnalysis && (
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-0.5">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AI Fraud Guard Passed • Risk Level: {aiAnalysis.riskLevel || 'LOW'}</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Estimated Cashback: <strong className="text-indigo-600">+{aiAnalysis.cashbackEarned || 20} Paydra Points</strong>
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: PROCESSING */}
        {step === 'PROCESSING' && (
          <div className="py-10 text-center space-y-6 animate-fade-in">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">Processing Transfer</h3>
              <p className="text-xs text-slate-500 mt-1">
                Sending ₦{numericAmount.toLocaleString()} to <strong className="text-indigo-600">{verifiedName || accountNumber}</strong>
              </p>
            </div>

            <div className="max-w-[220px] mx-auto space-y-2.5">
              {[
                { label: 'Verifying PIN' },
                { label: 'Fraud Check' },
                { label: 'Processing Payment' },
                { label: 'Finalizing' },
              ].map((item, idx) => (
                <div key={item.label} className="flex items-center gap-2.5 text-xs">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    processingStep > idx
                      ? 'bg-emerald-500 text-white'
                      : processingStep === idx
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-300'
                  }`}>
                    {processingStep > idx ? (
                      <span className="text-[8px] font-black">{'✓'}</span>
                    ) : processingStep === idx ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span className={`font-medium ${
                    processingStep > idx ? 'text-emerald-600' : processingStep === idx ? 'text-slate-900' : 'text-slate-400'
                  }`}>{item.label}</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Secured by Paydra Encryption
            </p>
          </div>
        )}

        {/* STEP 5: SUCCESS CELEBRATION */}
        {step === 'SUCCESS' && createdTx && (
          <div className="py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-indigo-50 border-4 border-indigo-600 text-indigo-600 mx-auto flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-600/30 animate-bounce">
              ✓
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Transfer Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">
                ₦{createdTx.amount.toLocaleString()} sent to <strong className="text-indigo-600">{createdTx.recipientName}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time:</span>
                <span className="font-bold text-slate-900">{createdTx.date} • {createdTx.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference:</span>
                <span className="font-mono text-slate-800">{createdTx.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank:</span>
                <span className="text-slate-800">{createdTx.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-indigo-600 font-bold">SUCCESSFUL</span>
              </div>
            </div>

            <button
              onClick={handleResetModal}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              View Full Screen Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
