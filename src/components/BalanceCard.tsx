import React, { useState } from 'react';
import { Currency } from '../types';
import {
  Eye,
  EyeOff,
  Send,
  PlusCircle,
  ArrowDownLeft,
  Zap,
  ArrowLeftRight,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Smartphone,
  Lock,
} from 'lucide-react';

interface BalanceCardProps {
  balances: Record<Currency, number>;
  selectedCurrency: Currency;
  accountNumber: string;
  bankName: string;
  veloTag: string;
  onOpenSendMoney: () => void;
  onOpenAddMoney: () => void;
  onOpenRequestMoney: () => void;
  onOpenPayBills: () => void;
  onOpenFXSwap: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  balances,
  selectedCurrency,
  accountNumber,
  bankName,
  veloTag,
  onOpenSendMoney,
  onOpenAddMoney,
  onOpenRequestMoney,
  onOpenPayBills,
  onOpenFXSwap,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const formatBalance = (amount: number, curr: Currency) => {
    const symbol = curr === 'NGN' ? '₦' : curr === 'USD' ? '$' : curr === 'EUR' ? '€' : '£';
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* 1. BALANCE HEADER CARD */}
      <div className="relative w-full rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900 p-6 sm:p-8 text-white shadow-xl shadow-indigo-300/30 overflow-hidden group">
        {/* UNIQUE MOVING ANIMATED SHAPES & GEOMETRIC DESIGNS */}
        {/* Moving Floating Gradient Glass Sphere */}
        <div className="absolute -right-8 -top-10 w-56 h-56 rounded-full bg-gradient-to-tr from-white/15 via-indigo-300/10 to-transparent border border-white/20 backdrop-blur-md animate-float-slow pointer-events-none shadow-2xl" />
        
        {/* Counter-Floating Secondary Orb */}
        <div className="absolute -left-12 -bottom-14 w-48 h-48 rounded-3xl bg-gradient-to-br from-indigo-400/20 to-purple-800/30 border border-white/10 backdrop-blur-sm animate-float-reverse pointer-events-none" />
        
        {/* Slowly Rotating Decorative Geometric Compass / Star Ring */}
        <div className="absolute right-12 -bottom-16 w-52 h-52 rounded-full border border-white/10 border-dashed animate-spin-slow pointer-events-none" />

        {/* Pulsating Glowing Ambient Lights */}
        <div className="absolute right-1/4 -top-12 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="absolute left-1/3 -bottom-12 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

        {/* Top Bar: Total Balance label & eye toggle */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-indigo-100 tracking-wide">
              Total Balance
            </span>

            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-1 text-indigo-200 hover:text-white rounded-lg transition-colors ml-1"
              title={showBalance ? "Hide Balance" : "Show Balance"}
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Hero Balance Number with Multi-Currency Badge */}
        <div className="relative z-10">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-sm font-sans">
              {showBalance ? formatBalance(balances[selectedCurrency], selectedCurrency) : '•••••••••'}
            </span>

            {/* Selected Currency Pill */}
            <span className="px-2.5 py-1 rounded-xl bg-white text-indigo-900 text-xs font-black tracking-wider shadow-sm uppercase">
              {selectedCurrency} Account
            </span>
          </div>
        </div>
      </div>

      {/* 2. SEPARATED QUICK ACTIONS CARD */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-md shadow-slate-200/40">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {/* Send Money */}
          <button
            onClick={onOpenSendMoney}
            className="flex flex-col items-center gap-1.5 group/btn"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200 transition-all group-hover/btn:scale-105 group-hover/btn:bg-indigo-700 active:scale-95">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-tight text-center">To Bank</span>
          </button>

          {/* Add Money */}
          <button
            onClick={onOpenAddMoney}
            className="flex flex-col items-center gap-1.5 group/btn"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200 transition-all group-hover/btn:scale-105 group-hover/btn:bg-emerald-600 active:scale-95">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-tight text-center">Add Funds</span>
          </button>

          {/* Request Money */}
          <button
            onClick={onOpenRequestMoney}
            className="flex flex-col items-center gap-1.5 group/btn"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-200 transition-all group-hover/btn:scale-105 group-hover/btn:bg-sky-600 active:scale-95">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-tight text-center">Request</span>
          </button>

          {/* Pay Bills */}
          <button
            onClick={onOpenPayBills}
            className="flex flex-col items-center gap-1.5 group/btn"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-200 transition-all group-hover/btn:scale-105 group-hover/btn:bg-amber-600 active:scale-95">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-tight text-center">Bills & Utilities</span>
          </button>

          {/* Swap FX */}
          <button
            onClick={onOpenFXSwap}
            className="flex flex-col items-center gap-1.5 group/btn relative"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-200 transition-all group-hover/btn:scale-105 group-hover/btn:bg-purple-700 active:scale-95 relative">
              <ArrowLeftRight className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full border border-white shadow-xs" title="FX Swap Locked">
                <Lock className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-800 tracking-tight text-center flex items-center gap-0.5">
              <span>Swap FX</span>
              <span className="text-[9px] text-amber-600 font-extrabold">(Locked)</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

