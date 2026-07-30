import React, { useState } from 'react';
import { Transaction } from '../types';
import { X, Smartphone, Wifi, Zap, Tv, Gamepad2, CheckCircle2, ArrowRight } from 'lucide-react';
import { triggerSuccessConfetti } from '../utils/confetti';

interface BillsAndServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  onCompleteBillPayment: (tx: Transaction) => void;
}

export const BillsAndServicesModal: React.FC<BillsAndServicesModalProps> = ({
  isOpen,
  onClose,
  userBalance,
  onCompleteBillPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'AIRTIME' | 'DATA' | 'ELECTRICITY' | 'TV' | 'BETTING'>('AIRTIME');

  // Network & Utility Inputs
  const [phone, setPhone] = useState('+234 812 345 6789');
  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [amount, setAmount] = useState('2000');
  const [meterNumber, setMeterNumber] = useState('4501928301');
  const [smartcardNumber, setSmartcardNumber] = useState('1029384756');
  const [bettingUser, setBettingUser] = useState('USER_BET9JA_9920');

  if (!isOpen) return null;

  const numericAmount = parseFloat(amount) || 0;

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return alert('Enter valid amount');
    if (numericAmount > userBalance) return alert('Insufficient NGN balance');

    let title = `${selectedNetwork} Airtime Top-up`;
    let recipient = phone;
    let category = 'Bills & Utilities';

    if (activeTab === 'DATA') title = `${selectedNetwork} 5GB Monthly Data Bundle`;
    else if (activeTab === 'ELECTRICITY') {
      title = `Ikeja Electric (IKEDC) Token`;
      recipient = `Meter ${meterNumber}`;
    } else if (activeTab === 'TV') {
      title = `DSTV Premium Subscription`;
      recipient = `Smartcard ${smartcardNumber}`;
    } else if (activeTab === 'BETTING') {
      title = `SportyBet Wallet Funding`;
      recipient = bettingUser;
    }

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: `PAYDRA-BILL-${Date.now().toString().slice(-6)}`,
      type: 'BILL',
      title: title,
      amount: numericAmount,
      currency: 'NGN',
      fee: 0,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SUCCESSFUL',
      recipientName: recipient,
      category: category,
      note: activeTab === 'ELECTRICITY' ? 'Token: 4910-2019-3820-1920-0012' : 'Utility Payment',
      tag: `#${activeTab}`,
      cashbackEarned: Math.floor(numericAmount * 0.02), // 2% Cashback!
      receiptCode: `RCP-BILL-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    onCompleteBillPayment(newTx);
    triggerSuccessConfetti();
    alert(`Success! ${title} completed. You earned ₦${newTx.cashbackEarned} cashback!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Bills & Utility Payments</h2>
              <p className="text-xs text-indigo-600 font-semibold">Instant Token & 2% Cashback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 my-4 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'AIRTIME', label: 'Airtime', icon: Smartphone },
            { id: 'DATA', label: 'Data Bundles', icon: Wifi },
            { id: 'ELECTRICITY', label: 'Electricity', icon: Zap },
            { id: 'TV', label: 'Cable TV', icon: Tv },
            { id: 'BETTING', label: 'Betting', icon: Gamepad2 },
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handlePayBill} className="space-y-4">
          {/* Network / Provider Select for Airtime & Data */}
          {(activeTab === 'AIRTIME' || activeTab === 'DATA') && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Network Provider</label>
              <div className="grid grid-cols-4 gap-2">
                {['MTN', 'Airtel', 'Glo', '9mobile'].map((net) => (
                  <button
                    type="button"
                    key={net}
                    onClick={() => setSelectedNetwork(net)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedNetwork === net
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {net}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Phone Input */}
          {(activeTab === 'AIRTIME' || activeTab === 'DATA') && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          {/* Electricity Meter Input */}
          {activeTab === 'ELECTRICITY' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Select Disco & Meter Number</label>
              <select className="w-full p-3 mb-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900">
                <option>Ikeja Electric (IKEDC) Prepaid</option>
                <option>Eko Electricity (EKEDC) Prepaid</option>
                <option>Abuja Electricity (AEDC)</option>
                <option>Ibadan Electricity (IBEDC)</option>
              </select>
              <input
                type="text"
                placeholder="Meter Number"
                value={meterNumber}
                onChange={(e) => setMeterNumber(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <div className="mt-1.5 text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified: ADEBAYO RESIDENCE • IKEDC 019283</span>
              </div>
            </div>
          )}

          {/* TV Smartcard Input */}
          {activeTab === 'TV' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Select Provider & Smartcard ID</label>
              <select className="w-full p-3 mb-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900">
                <option>DSTV Premium (₦29,500)</option>
                <option>GOtv Supa (₦15,700)</option>
                <option>StarTimes Classic (₦4,500)</option>
              </select>
              <input
                type="text"
                placeholder="Smartcard / IUC Number"
                value={smartcardNumber}
                onChange={(e) => setSmartcardNumber(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="text-xs font-semibold text-slate-700 mb-1 block">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="flex gap-2 mt-2">
              {[500, 1000, 2000, 5000].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setAmount(chip.toString())}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
                >
                  ₦{chip}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <span>Pay & Generate Token (Earn 2% Cashback)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
