import React, { useState } from 'react';
import { Transaction } from '../types';
import {
  X,
  Download,
  Share2,
  CheckCircle2,
  Shield,
  Copy,
  Check,
  RefreshCw,
  Building2,
  User,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Printer,
  Calendar,
  Clock,
} from 'lucide-react';
import { triggerSuccessConfetti, triggerGoalReachedConfetti } from '../utils/confetti';

interface TransactionReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onRepeatTransfer?: (tx: Transaction) => void;
  onNewTransfer?: () => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (dateStr.toLowerCase() === 'today') {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
  return dateStr;
};

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  onClose,
  onRepeatTransfer,
  onNewTransfer,
}) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!transaction) return null;

  const isCredit = transaction.type === 'INFLOW' || transaction.type === 'CASHBACK';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(transaction.reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleDownloadReceipt = () => {
    triggerSuccessConfetti();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleShare = () => {
    const text = `Official Paydra Bank Transfer Receipt\nRef: ${transaction.reference}\nAmount: ₦${transaction.amount.toLocaleString()}\nStatus: ${transaction.status}\nRecipient: ${transaction.recipientName || 'N/A'}\nBank: ${transaction.bankName || 'Paydra Bank'}\nDate: ${transaction.date} ${transaction.time}`;
    if (navigator.share) {
      navigator.share({ title: 'Paydra Bank Transfer Receipt', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Receipt details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md overflow-y-auto custom-scrollbar flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 animate-fade-in text-slate-900">
      
      {/* FULL SCREEN TRANSACTION SUCCESSFUL CONTAINER */}
      <div className="relative w-full max-w-xl min-h-screen sm:min-h-0 bg-white sm:rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col my-auto border-0 sm:border border-slate-200">
        
        <div>
          {/* FULL PAGE SIGNATURE INDIGO SUCCESS HERO HEADER */}
          <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900 text-white p-6 sm:p-8 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Top Close Bar */}
            <div className="w-full flex justify-end relative z-20">
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pulsating Checkmark Circle */}
            <div className="relative -mt-2">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse" />
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-950/50 relative z-10 animate-bounce">
                <CheckCircle2 className="w-11 h-11 sm:w-14 sm:h-14 text-indigo-600" />
              </div>
            </div>

            <div className="space-y-1 relative z-10">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Transaction Successful
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100/90 max-w-md mx-auto font-medium">
                The transaction has been processed and credited instantly.
              </p>
            </div>

            {/* Prominent Amount Display */}
            <div className="pt-2 relative z-10">
              <div className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-sm font-mono">
                {isCredit ? '+' : '-'}₦{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-indigo-100 mt-2">
                <span className="bg-white/15 px-3 py-0.5 rounded-full border border-white/20">
                  Zero Transfer Fee
                </span>
                {transaction.cashbackEarned && transaction.cashbackEarned > 0 && (
                  <>
                    <span>•</span>
                    <span className="bg-white/15 px-3 py-0.5 rounded-full border border-white/20">
                      Cashback: +₦{transaction.cashbackEarned}
                    </span>
                  </>
                )}
              </div>

              {/* Prominent Date & Time Badge on Hero Header */}
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full border border-white/30 text-xs font-bold shadow-md backdrop-blur-md mt-3">
                <Calendar className="w-3.5 h-3.5 text-indigo-200" />
                <span>{formatDate(transaction.date)}</span>
                <span className="text-white/40">•</span>
                <Clock className="w-3.5 h-3.5 text-indigo-200" />
                <span>{transaction.time || 'Just now'}</span>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-5">
            {/* SENDER & BENEFICIARY DETAILS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sender Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-slate-500">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sender Account</span>
                </div>
                <p className="text-xs sm:text-sm font-black text-slate-900">{transaction.senderName || 'Tunde Adebayo'}</p>
                <p className="text-xs font-mono text-slate-600">
                  {transaction.senderBank || 'Paydra Bank'} • {transaction.senderAccount || '2084920193'}
                </p>
              </div>

              {/* Beneficiary Box */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200/80 space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-indigo-700">
                  <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Beneficiary Account</span>
                </div>
                <p className="text-xs sm:text-sm font-black text-slate-950">{transaction.recipientName || transaction.title}</p>
                <p className="text-xs font-mono text-indigo-900 font-medium">
                  {transaction.bankName || 'Paydra Bank'} • {transaction.recipientAccount || 'Verified NUBAN'}
                </p>
              </div>
            </div>

            {/* TRANSACTION METADATA BREAKDOWN */}
            <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-3 text-left">
              {/* Prominent High Contrast Date & Time Row */}
              <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-2 font-extrabold text-slate-700 text-xs sm:text-sm">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span>Date & Time</span>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{formatDate(transaction.date)}</p>
                  <p className="text-[11px] font-mono font-bold text-indigo-700 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-indigo-600" />
                    <span>{transaction.time || 'Just now'}</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Payment Category:</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-800 text-xs font-bold">
                    {transaction.category}
                  </span>
                  {transaction.tag && (
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold">
                      {transaction.tag}
                    </span>
                  )}
                </div>
              </div>

              {transaction.note && (
                <div className="flex justify-between items-start pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-medium">Remark / Note:</span>
                  <span className="font-semibold text-slate-800 italic max-w-[260px] text-right text-xs">
                    "{transaction.note}"
                  </span>
                </div>
              )}

              {/* Reference Number */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-medium">NIP Reference:</span>
                <button
                  type="button"
                  onClick={handleCopyRef}
                  className="font-mono font-bold text-slate-900 hover:text-indigo-700 flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs transition-all cursor-pointer"
                >
                  <span>{transaction.reference}</span>
                  {copiedRef ? <Check className="w-3.5 h-3.5 text-indigo-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>

              {/* Digital Seal Code */}
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Digital Verification Seal:</span>
                <span className="font-mono font-bold text-slate-800">{transaction.receiptCode}</span>
              </div>
            </div>

            {/* GUARANTEE & REGULATION */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-2">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>CBN Licensed • NDIC Insured up to ₦5,000,000</span>
              </div>
              <span className="font-mono text-slate-400 text-[10px] uppercase font-bold">Official Receipt</span>
            </div>

            {/* DOWNLOAD SUCCESS TOAST */}
            {downloadSuccess && (
              <div className="p-3 bg-indigo-50 border border-indigo-300 rounded-2xl text-center text-xs font-bold text-indigo-800 animate-fade-in shadow-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Official PDF Transfer Receipt Saved to Downloads!</span>
              </div>
            )}

            {/* ACTION BUTTONS FOOTER */}
            <div className="space-y-2.5 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-indigo-600/25 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-2xl text-xs sm:text-sm border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-indigo-600" />
                  <span>Share Receipt</span>
                </button>
              </div>

              <div className="flex gap-3">
                {onRepeatTransfer && !isCredit && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRepeatTransfer(transaction);
                    }}
                    className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold rounded-2xl text-xs sm:text-sm border border-slate-200 flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-indigo-600" />
                    <span>Repeat Transfer</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-slate-900/10 cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

