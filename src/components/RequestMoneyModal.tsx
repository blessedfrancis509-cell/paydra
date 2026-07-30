import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, QrCode, Copy, Check, Share2, Users } from 'lucide-react';

interface RequestMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const RequestMoneyModal: React.FC<RequestMoneyModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [amount, setAmount] = useState('10000');
  const [note, setNote] = useState('Dinner split bill');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const paymentLink = `https://paydra.app/pay/${user.veloTag}?amt=${amount}&ref=SPLIT`;

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Request Money / Split Bill</h3>
              <p className="text-xs text-slate-400">Generate dynamic QR or payment link</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Requested Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-lg font-bold text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1 block">Reason / Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none"
            />
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
            <div className="w-32 h-32 bg-white rounded-2xl p-2 mx-auto flex items-center justify-center shadow-inner">
              <QrCode className="w-full h-full text-slate-950" />
            </div>
            <p className="text-[11px] font-mono text-emerald-400 font-bold">{paymentLink}</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>Copy Link</span>
            </button>

            <button
              onClick={() => alert('Share dialog opened!')}
              className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
