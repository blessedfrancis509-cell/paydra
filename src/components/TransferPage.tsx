import React, { useState, useEffect } from 'react';
import { Beneficiary, Transaction } from '../types';
import { NIGERIAN_BANKS } from '../data/mockData';
import {
  Send,
  Search,
  CheckCircle2,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Zap,
  X,
  Check,
  ChevronDown,
  Lock,
  QrCode,
  Camera,
  Share2,
  Copy,
  Sparkles,
} from 'lucide-react';
import { triggerSuccessConfetti } from '../utils/confetti';

interface TransferPageProps {
  beneficiaries: Beneficiary[];
  userBalance: number;
  onCompleteTransfer: (newTx: Transaction) => void;
  onOpenSendModal: () => void;
}

const POPULAR_BANKS = [
  { name: 'OPay Digital Services', code: '999992', shortName: 'OPay' },
  { name: 'Guaranty Trust Bank', code: '058', shortName: 'GTBank' },
  { name: 'Kuda Microfinance Bank', code: '50211', shortName: 'Kuda' },
  { name: 'Zenith Bank PLC', code: '057', shortName: 'Zenith' },
  { name: 'Access Bank PLC', code: '044', shortName: 'Access' },
  { name: 'Moniepoint MFB', code: '50515', shortName: 'Moniepoint' },
];

export const TransferPage: React.FC<TransferPageProps> = ({
  beneficiaries,
  userBalance,
  onCompleteTransfer,
  onOpenSendModal,
}) => {
  // Main mode: BANK vs PAYDRA_TAG
  const [transferMode, setTransferMode] = useState<'BANK' | 'PAYDRA_TAG'>('BANK');

  // PaydraTag Sub-Modes: INPUT_TAG | SCAN_QR | MY_QR
  const [paydraTagSubTab, setPaydraTagSubTab] = useState<'INPUT_TAG' | 'SCAN_QR' | 'MY_QR'>('INPUT_TAG');

  // Bank transfer state
  const [searchBankQuery, setSearchBankQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState(NIGERIAN_BANKS[0]);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [note, setNote] = useState('');

  // PaydraTag transfer state
  const [paydraTagInput, setPaydraTagInput] = useState('@kunle');
  const [paydraTagAmount, setPaydraTagAmount] = useState('');
  const [verifiedTagUser, setVerifiedTagUser] = useState('');
  const [isVerifyingTag, setIsVerifyingTag] = useState(false);

  // Scanner Simulator state
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  // Copy indicator
  const [copiedMyTag, setCopiedMyTag] = useState(false);

  // Security PIN state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [isProcessingPin, setIsProcessingPin] = useState(false);
  const [pinError, setPinError] = useState('');

  // Bank Account Lookup Simulator
  useEffect(() => {
    if (accountNumber.length === 10) {
      setIsVerifying(true);
      setVerifiedName('');
      const timer = setTimeout(() => {
        setIsVerifying(false);
        if (accountNumber.endsWith('120')) setVerifiedName('AMINA BELLO');
        else if (accountNumber.endsWith('102')) setVerifiedName('CHIDI OKAFOR');
        else if (accountNumber.endsWith('810')) setVerifiedName('FOLAKE OGUNLEYE');
        else setVerifiedName('OBAFEMI KUNLE ADENIYI');
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setVerifiedName('');
    }
  }, [accountNumber, selectedBank]);

  // PaydraTag Lookup Simulator
  useEffect(() => {
    if (paydraTagInput.length >= 3) {
      setIsVerifyingTag(true);
      setVerifiedTagUser('');
      const timer = setTimeout(() => {
        setIsVerifyingTag(false);
        if (paydraTagInput.toLowerCase().includes('tundex')) setVerifiedTagUser('TUNDE ADEBAYO • @tundex');
        else if (paydraTagInput.toLowerCase().includes('amina')) setVerifiedTagUser('AMINA BELLO • @amina');
        else setVerifiedTagUser('KUNLE ADENIYI • @kunle');
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setVerifiedTagUser('');
    }
  }, [paydraTagInput]);

  const filteredBanks = NIGERIAN_BANKS.filter((b) =>
    b.name.toLowerCase().includes(searchBankQuery.toLowerCase())
  );

  const numericAmount = parseFloat(transferMode === 'BANK' ? amount : paydraTagAmount) || 0;
  const currentRecipient = transferMode === 'BANK' ? verifiedName : verifiedTagUser;

  const handleInitiateTransfer = () => {
    if (numericAmount <= 0) return alert('Please enter a valid transfer amount');
    if (numericAmount > userBalance) return alert('Insufficient funds in your NGN balance');

    if (transferMode === 'BANK' && !verifiedName)
      return alert('Please enter a valid 10-digit account number first');
    if (transferMode === 'PAYDRA_TAG' && !verifiedTagUser)
      return alert('Please enter a valid PaydraTag username');

    setPin(['', '', '', '']);
    setPinError('');
    setIsPinModalOpen(true);
  };

  const handleKeypadPress = (val: string) => {
    setPinError('');
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
    const emptyIdx = newPin.findIndex((d) => d === '');
    if (emptyIdx !== -1) {
      newPin[emptyIdx] = val;
      setPin(newPin);
    }
  };

  const handleExecuteTransferWithPin = (customPin?: string[]) => {
    const finalPin = customPin || pin;
    if (finalPin.some((d) => d === '')) {
      setPinError('Please enter all 4 digits of your Security PIN');
      return;
    }

    setIsProcessingPin(true);

    setTimeout(() => {
      setIsProcessingPin(false);

      const recipient =
        transferMode === 'BANK'
          ? verifiedName || accountNumber
          : verifiedTagUser || paydraTagInput;

      const bankNameStr = transferMode === 'BANK' ? selectedBank.name : 'Paydra Bank';

      const newTx: Transaction = {
        id: `tx_${Date.now()}`,
        reference: `PAYDRA-${Date.now().toString().slice(-8)}`,
        type: 'TRANSFER',
        title: `Transfer to ${recipient}`,
        amount: numericAmount,
        currency: 'NGN',
        fee: 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'SUCCESSFUL',
        recipientName: recipient,
        recipientAccount: transferMode === 'BANK' ? accountNumber : paydraTagInput,
        bankName: bankNameStr,
        senderName: 'Tunde Adebayo',
        senderAccount: '2084920193',
        senderBank: 'Paydra Bank',
        category: 'Transfer',
        note: note || (transferMode === 'BANK' ? 'Bank Transfer' : 'PaydraTag Transfer'),
        tag: '#ZeroFeeTransfer',
        cashbackEarned: 20,
        receiptCode: `RCP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      };

      triggerSuccessConfetti();
      onCompleteTransfer(newTx);

      setIsPinModalOpen(false);
      setAccountNumber('');
      setAmount('');
      setPaydraTagAmount('');
      setVerifiedName('');
      setVerifiedTagUser('');
      setNote('');
      setPin(['', '', '', '']);
    }, 600);
  };

  useEffect(() => {
    if (pin.every((d) => d !== '') && isPinModalOpen && !isProcessingPin) {
      handleExecuteTransferWithPin(pin);
    }
  }, [pin]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult('@kunle');
      setPaydraTagInput('@kunle');
      setVerifiedTagUser('KUNLE ADENIYI • @kunle');
      setPaydraTagSubTab('INPUT_TAG');
    }, 1200);
  };

  return (
    <div className="w-full space-y-4 text-slate-900 animate-fade-in">
      {/* BRANDED HEADER BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 rounded-3xl p-4 sm:p-5 text-white border border-slate-800 shadow-lg">
        {/* Floating Background Shapes */}
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full border border-indigo-400/20" />
        <div className="absolute right-24 bottom-2 w-14 h-14 rounded-xl border border-emerald-400/20 rotate-45 bg-emerald-400/5" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400" />
                Zero-Fee Paydra Settlement
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
              Send Money Instantly
            </h1>
            <p className="text-xs text-slate-300">
              Transfer to any Nigerian bank or pay instantly via PaydraTag & QR Code
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSendModal}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Full Transfer Form</span>
            </button>
          </div>
        </div>

        {/* 2 MAIN TRANSFER METHODS SELECTOR: TO BANK vs TO PAYDRA TAG */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 relative z-10">
          <button
            onClick={() => setTransferMode('BANK')}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              transferMode === 'BANK'
                ? 'bg-white text-slate-950 border-white shadow-md'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <Building2 className={`w-4 h-4 ${transferMode === 'BANK' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>To Bank Account</span>
          </button>

          <button
            onClick={() => setTransferMode('PAYDRA_TAG')}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              transferMode === 'PAYDRA_TAG'
                ? 'bg-white text-slate-950 border-white shadow-md'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <User className={`w-4 h-4 ${transferMode === 'PAYDRA_TAG' ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span>To PaydraTag / QR</span>
          </button>
        </div>
      </div>

      {/* MAIN FORM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* MODE 1: TO BANK ACCOUNT */}
        {transferMode === 'BANK' && (
          <div className="lg:col-span-2 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* Bank Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-800">Select Recipient Bank</label>
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>All 100+ Banks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsBankModalOpen(true)}
                className="w-full p-3 bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-300 rounded-2xl flex items-center justify-between text-left transition-all shadow-2xs group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                    {selectedBank.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {selectedBank.name}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
              </button>

              {/* Quick Popular Bank Chips */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto py-0.5">
                {POPULAR_BANKS.map((b) => {
                  const isSel =
                    selectedBank.code === b.code ||
                    selectedBank.name.toLowerCase().includes(b.shortName.toLowerCase());
                  return (
                    <button
                      key={b.code}
                      type="button"
                      onClick={() => {
                        const found =
                          NIGERIAN_BANKS.find(
                            (bank) =>
                              bank.code === b.code ||
                              bank.name.toLowerCase().includes(b.shortName.toLowerCase())
                          ) || selectedBank;
                        setSelectedBank(found);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer ${
                        isSel
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      {b.shortName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Number Input */}
            <div>
              <label className="text-xs font-bold text-slate-900 mb-1 block">
                Account Number (10-Digit NUBAN)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Enter 10-digit account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-wider"
                />
                {isVerifying && (
                  <span className="absolute right-3.5 top-3 text-xs font-bold text-indigo-600 animate-pulse flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    Verifying...
                  </span>
                )}
              </div>

              {/* Verified Result Card */}
              {verifiedName && (
                <div className="mt-2.5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between animate-fade-in shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-2xs shrink-0">
                      {verifiedName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-extrabold text-slate-900">{verifiedName}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">Verified Recipient Account</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    NIP Verified
                  </span>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-900">Transfer Amount (₦)</label>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  ₦0.00 Fee
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-lg font-bold text-slate-400">₦</span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex items-center gap-1.5 mt-2 overflow-x-auto py-0.5">
                {[1000, 2000, 5000, 10000, 20000, 50000].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setAmount(chip.toString())}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    +₦{chip.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Remark */}
            <div>
              <label className="text-xs font-bold text-slate-900 mb-1 block">Remark / Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Weekend groceries or rent"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={handleInitiateTransfer}
              disabled={!verifiedName || numericAmount <= 0}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                verifiedName && numericAmount > 0
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white shadow-indigo-600/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>
                Authorize & Send ₦
                {numericAmount > 0
                  ? numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })
                  : '0.00'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MODE 2: TO PAYDRA TAG & QR CODE */}
        {transferMode === 'PAYDRA_TAG' && (
          <div className="lg:col-span-2 bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* SUB-TABS: INPUT TAG | SCAN QR | MY QR CODE */}
            <div className="p-1 bg-slate-100 rounded-2xl flex items-center text-xs font-bold">
              <button
                onClick={() => setPaydraTagSubTab('INPUT_TAG')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paydraTagSubTab === 'INPUT_TAG'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Input @PaydraTag</span>
              </button>

              <button
                onClick={() => setPaydraTagSubTab('SCAN_QR')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paydraTagSubTab === 'SCAN_QR'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Scan QR Code</span>
              </button>

              <button
                onClick={() => setPaydraTagSubTab('MY_QR')}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  paydraTagSubTab === 'MY_QR'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-amber-300" />
                <span>My Paydra QR</span>
              </button>
            </div>

            {/* SUB-OPTION 1: INPUT PAYDRA TAG */}
            {paydraTagSubTab === 'INPUT_TAG' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 mb-1 block">
                    Recipient PaydraTag Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. @kunle or @tundex"
                      value={paydraTagInput}
                      onChange={(e) => setPaydraTagInput(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {isVerifyingTag && (
                      <span className="absolute right-3.5 top-3 text-xs font-bold text-indigo-600 animate-pulse">
                        Resolving @tag...
                      </span>
                    )}
                  </div>

                  {verifiedTagUser && (
                    <div className="mt-2.5 p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                          {verifiedTagUser.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-extrabold text-slate-900 block">
                            {verifiedTagUser}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-bold">
                            ⚡ Instant ₦0 Fee Paydra Transfer
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="text-xs font-bold text-slate-900 mb-1 block">
                    Amount (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={paydraTagAmount}
                    onChange={(e) => setPaydraTagAmount(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  onClick={handleInitiateTransfer}
                  disabled={!verifiedTagUser || parseFloat(paydraTagAmount) <= 0}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 ${
                    verifiedTagUser && parseFloat(paydraTagAmount) > 0
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Send PaydraTag Instant Transfer</span>
                </button>
              </div>
            )}

            {/* SUB-OPTION 2: SCAN QR CODE */}
            {paydraTagSubTab === 'SCAN_QR' && (
              <div className="p-6 bg-slate-950 rounded-3xl text-white text-center space-y-4 border border-slate-800">
                <div className="relative w-52 h-52 mx-auto rounded-3xl border-2 border-dashed border-indigo-400/60 p-4 flex flex-col items-center justify-center overflow-hidden">
                  {/* Pulse Scanner Frame */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-pulse" />
                  <Camera className="w-12 h-12 text-indigo-400 animate-bounce mb-2" />
                  <span className="text-xs font-bold text-slate-300">Align QR Code within frame</span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleSimulateScan}
                    disabled={isScanning}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isScanning ? (
                      <span>Scanning QR Code...</span>
                    ) : (
                      <>
                        <QrCode className="w-4 h-4" />
                        <span>Simulate Camera QR Scan</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400">
                    Supports all Paydra & NIBSS NIP QR codes
                  </p>
                </div>
              </div>
            )}

            {/* SUB-OPTION 3: MY PAYDRA QR CODE */}
            {paydraTagSubTab === 'MY_QR' && (
              <div className="p-6 bg-slate-950 rounded-3xl text-white text-center space-y-4 border border-slate-800">
                <div className="w-44 h-44 bg-white mx-auto rounded-2xl p-3 flex items-center justify-center shadow-xl">
                  <QrCode className="w-36 h-36 text-slate-950" />
                </div>

                <div>
                  <h4 className="font-black text-base text-amber-300">Tunde Adebayo</h4>
                  <p className="font-mono text-xs text-slate-300">@tundex • Paydra MFB</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-bold">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('@tundex');
                      setCopiedMyTag(true);
                      setTimeout(() => setCopiedMyTag(false), 2000);
                    }}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/15 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedMyTag ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedMyTag ? 'Copied!' : 'Copy @Tag'}</span>
                  </button>

                  <button
                    onClick={() => alert('📤 Shared Paydra QR Code details!')}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl border border-indigo-400/30 text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share QR</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Column: Beneficiaries & Security Notice */}
        <div className="space-y-3.5">
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Quick Beneficiaries
            </h3>

            <div className="space-y-2">
              {beneficiaries.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setTransferMode('BANK');
                    setAccountNumber(b.accountNumber);
                    setVerifiedName(b.name);
                  }}
                  className="w-full p-3 bg-slate-50 hover:bg-indigo-50/80 rounded-2xl border border-slate-200/70 flex items-center justify-between text-left group transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs shadow-2xs">
                      {b.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 leading-tight">
                        {b.name}
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 leading-tight">
                        {b.bankName} • {b.accountNumber}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bank Selection Search Modal */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 border border-slate-100 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select Recipient Bank</h3>
                <p className="text-[11px] text-slate-500">Supported 100+ Nigerian Financial Institutions</p>
              </div>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search bank name..."
                value={searchBankQuery}
                onChange={(e) => setSearchBankQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.code}
                  onClick={() => {
                    setSelectedBank(bank);
                    setIsBankModalOpen(false);
                  }}
                  className="w-full p-2.5 hover:bg-indigo-50 rounded-xl text-left flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <span>{bank.name}</span>
                  {selectedBank.code === bank.code && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security PIN Authorization Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 animate-scale-in text-center">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">Authorize Transfer</h3>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Transfer to</span>
              <h4 className="text-base font-black text-slate-900">{currentRecipient}</h4>
              <span className="text-xl font-black text-indigo-900 block">
                ₦{numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Enter 4-Digit Security PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin.join('')}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPin(val.split(''));
                }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <button
              onClick={() => handleExecuteTransferWithPin()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              Confirm & Send Money
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
