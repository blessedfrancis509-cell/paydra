import React, { useState } from 'react';
import { Currency } from '../types';
import { X, ArrowLeftRight, Lock, ShieldCheck, HelpCircle, Building2, ChevronRight, AlertCircle } from 'lucide-react';

interface ConvertFXModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Record<Currency, number>;
  onConvertSuccess: (fromCurrency: Currency, toCurrency: Currency, fromAmount: number, toAmount: number) => void;
}

export const ConvertFXModal: React.FC<ConvertFXModalProps> = ({
  isOpen,
  onClose,
  balances,
  onConvertSuccess,
}) => {
  const [fromCurr, setFromCurr] = useState<Currency>('NGN');
  const [toCurr, setToCurr] = useState<Currency>('USD');
  const [fromAmount, setFromAmount] = useState('100000');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Instant FX Swap</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold uppercase">
                  🔒 Locked
                </span>
              </h3>
              <p className="text-xs text-slate-400">Foreign Exchange Currency Swapping</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LOCKED FEATURE BANNER (OPay / Kuda Compliance Lock) */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-2xl space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                FX Trading Currently Locked
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In compliance with Central Bank of Nigeria (CBN) Foreign Exchange guidelines, USD/EUR/GBP swaps require Tier 3 Business KYC Verification.
              </p>
            </div>
          </div>
        </div>

        {/* Account Requirements Box */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Your Account Tier:</span>
            <span className="font-bold text-indigo-400">Tier 2 Individual Verified</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Required FX Level:</span>
            <span className="font-bold text-amber-300">Tier 3 Business Verification</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-bit Institutional FX Settlement Protection</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => {
              alert('📝 Tier 3 FX Upgrade Request Submitted! Paydra Compliance Team will review your application within 24 hours.');
              onClose();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-slate-950" />
            <span>Request Tier 3 FX Unlock</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
