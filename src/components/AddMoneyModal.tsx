import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Copy, Check, QrCode, CreditCard, Phone, Building, ArrowRight, ShieldCheck } from 'lucide-react';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onAddFundsSuccess: (amount: number) => void;
}

export const AddMoneyModal: React.FC<AddMoneyModalProps> = ({
  isOpen,
  onClose,
  user,
  onAddFundsSuccess,
}) => {
  const [tab, setTab] = useState<'TRANSFER' | 'CARD' | 'USSD'>('TRANSFER');
  const [copied, setCopied] = useState(false);

  // Card topup inputs
  const [cardAmount, setCardAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  if (!isOpen) return null;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(user.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCardTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(cardAmount);
    if (!amt || amt <= 0) return alert('Please enter a valid amount');
    onAddFundsSuccess(amt);
    alert(`Successfully added ₦${amt.toLocaleString()} to your account via Debit Card!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-900">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Money</h2>
              <p className="text-xs text-slate-500">Zero charges on all inward deposits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Tabs */}
        <div className="grid grid-cols-3 gap-1 my-4 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setTab('TRANSFER')}
            className={`py-2 rounded-xl transition-all ${
              tab === 'TRANSFER' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank Transfer
          </button>
          <button
            onClick={() => setTab('CARD')}
            className={`py-2 rounded-xl transition-all ${
              tab === 'CARD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Debit Card
          </button>
          <button
            onClick={() => setTab('USSD')}
            className={`py-2 rounded-xl transition-all ${
              tab === 'USSD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            USSD Code
          </button>
        </div>

        {/* TAB 1: BANK TRANSFER DETAILS */}
        {tab === 'TRANSFER' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 relative">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                Personal Paydra Account
              </span>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Bank Name</span>
                  <span className="font-bold text-slate-900">{user.bankName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Account Name</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Account Number</span>
                  <button
                    onClick={handleCopyAccount}
                    className="font-mono text-base font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <span>{user.accountNumber}</span>
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Scan Simulator */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl p-2 flex items-center justify-center shadow-md">
                  <QrCode className="w-full h-full text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Show QR Code</h4>
                  <p className="text-[11px] text-slate-500">Scan to receive money from any bank app</p>
                </div>
              </div>
              <button
                onClick={() => alert('QR Code displayed. Open any mobile bank camera to scan.')}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-xs font-bold text-indigo-600 rounded-xl border border-slate-200 transition-colors shadow-2xs"
              >
                Display
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DEBIT CARD TOPUP */}
        {tab === 'CARD' && (
          <form onSubmit={handleCardTopup} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Amount to Top-Up (₦)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={cardAmount}
                onChange={(e) => setCardAmount(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Card Number</label>
              <input
                type="text"
                placeholder="5399 •••• •••• 1234"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">CVV</label>
                <input
                  type="password"
                  maxLength={3}
                  placeholder="•••"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Fund Account via Card</span>
            </button>
          </form>
        )}

        {/* TAB 3: USSD CODE GENERATOR */}
        {tab === 'USSD' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Dial these USSD codes on your registered phone number to transfer directly into Paydra Bank:
            </p>

            <div className="space-y-2 text-xs">
              {[
                { bank: 'GTBank', code: `*737*50*Amount*${user.accountNumber}#` },
                { bank: 'Zenith Bank', code: `*966*Amount*${user.accountNumber}#` },
                { bank: 'UBA', code: `*919*3*${user.accountNumber}*Amount#` },
                { bank: 'FirstBank', code: `*894*Amount*${user.accountNumber}#` },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{item.bank}</p>
                    <p className="font-mono text-indigo-600 font-semibold text-[11px]">{item.code}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.code);
                      alert('USSD code copied!');
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-800 bg-white rounded-lg border border-slate-200 shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
