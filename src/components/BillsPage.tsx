import React, { useState } from 'react';
import { Transaction } from '../types';
import {
  ArrowLeft,
  Smartphone,
  Wifi,
  Zap,
  Tv,
  Gamepad2,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  ChevronRight,
  Info,
  Gift,
  RefreshCw,
  Search,
  Check,
  Delete,
  Lock,
  Flame,
  User,
  CreditCard,
} from 'lucide-react';
import { triggerSuccessConfetti } from '../utils/confetti';

interface BillsPageProps {
  userBalance: number;
  onCompleteBillPayment: (tx: Transaction) => void;
  onBackToOverview: () => void;
}

type NetworkProvider = 'MTN' | 'Airtel' | 'Glo' | '9mobile';
type BillCategory = 'DATA' | 'AIRTIME' | 'ELECTRICITY' | 'TV' | 'BETTING';

interface DataBundle {
  id: string;
  size: string;
  price: number;
  validity: string;
  popular?: boolean;
  type: 'SME' | 'DIRECT' | 'WEEKLY' | 'MONTHLY';
  cashback: number;
}

// REAL NIGERIAN TELECOM DATA BUNDLES & EXACT PRICING
const DATA_BUNDLES: Record<NetworkProvider, DataBundle[]> = {
  MTN: [
    { id: 'mtn_1', size: '1.0 GB', price: 350, validity: '30 Days', type: 'SME', cashback: 7 },
    { id: 'mtn_2', size: '1.5 GB', price: 1200, validity: '30 Days', type: 'DIRECT', cashback: 24 },
    { id: 'mtn_3', size: '3.5 GB', price: 2500, validity: '30 Days', popular: true, type: 'DIRECT', cashback: 50 },
    { id: 'mtn_4', size: '10.0 GB', price: 5000, validity: '30 Days', popular: true, type: 'DIRECT', cashback: 100 },
    { id: 'mtn_5', size: '20.0 GB', price: 9000, validity: '30 Days', type: 'DIRECT', cashback: 180 },
    { id: 'mtn_6', size: '40.0 GB', price: 15000, validity: '30 Days', type: 'DIRECT', cashback: 300 },
    { id: 'mtn_7', size: '100.0 GB', price: 28000, validity: '60 Days', type: 'DIRECT', cashback: 560 },
  ],
  Airtel: [
    { id: 'art_1', size: '1.5 GB', price: 1200, validity: '30 Days', type: 'DIRECT', cashback: 24 },
    { id: 'art_2', size: '3.0 GB', price: 2200, validity: '30 Days', type: 'DIRECT', cashback: 44 },
    { id: 'art_3', size: '10.0 GB', price: 5000, validity: '30 Days', popular: true, type: 'DIRECT', cashback: 100 },
    { id: 'art_4', size: '25.0 GB', price: 10000, validity: '30 Days', popular: true, type: 'DIRECT', cashback: 200 },
    { id: 'art_5', size: '50.0 GB', price: 18000, validity: '30 Days', type: 'DIRECT', cashback: 360 },
  ],
  Glo: [
    { id: 'glo_1', size: '1.35 GB', price: 1000, validity: '14 Days', type: 'WEEKLY', cashback: 20 },
    { id: 'glo_2', size: '2.9 GB', price: 2000, validity: '30 Days', type: 'MONTHLY', cashback: 40 },
    { id: 'glo_3', size: '5.8 GB', price: 3000, validity: '30 Days', popular: true, type: 'MONTHLY', cashback: 60 },
    { id: 'glo_4', size: '10.0 GB', price: 4500, validity: '30 Days', type: 'MONTHLY', cashback: 90 },
    { id: 'glo_5', size: '30.0 GB', price: 10000, validity: '30 Days', type: 'MONTHLY', cashback: 200 },
  ],
  '9mobile': [
    { id: '9m_1', size: '1.5 GB', price: 1200, validity: '30 Days', type: 'DIRECT', cashback: 24 },
    { id: '9m_2', size: '4.5 GB', price: 2000, validity: '30 Days', popular: true, type: 'DIRECT', cashback: 40 },
    { id: '9m_3', size: '11.0 GB', price: 4000, validity: '30 Days', type: 'DIRECT', cashback: 80 },
    { id: '9m_4', size: '25.0 GB', price: 8000, validity: '30 Days', type: 'DIRECT', cashback: 160 },
  ],
};

// TELECOM CARRIER BRAND SYSTEM
const NETWORKS: { id: NetworkProvider; name: string; tag: string; bg: string; text: string; border: string; logoBg: string }[] = [
  {
    id: 'MTN',
    name: 'MTN Nigeria',
    tag: '5G / 4G LTE',
    bg: 'bg-amber-400',
    text: 'text-amber-950',
    border: 'border-amber-400',
    logoBg: 'bg-amber-400 text-amber-950 font-black',
  },
  {
    id: 'Airtel',
    name: 'Airtel Nigeria',
    tag: '4G Smart network',
    bg: 'bg-red-600',
    text: 'text-white',
    border: 'border-red-600',
    logoBg: 'bg-red-600 text-white font-black',
  },
  {
    id: 'Glo',
    name: 'Glo Unlimited',
    tag: 'Grandmasters of Data',
    bg: 'bg-emerald-600',
    text: 'text-white',
    border: 'border-emerald-600',
    logoBg: 'bg-emerald-600 text-white font-black',
  },
  {
    id: '9mobile',
    name: '9mobile',
    tag: 'Moreflex Data',
    bg: 'bg-teal-700',
    text: 'text-white',
    border: 'border-teal-700',
    logoBg: 'bg-teal-700 text-white font-black',
  },
];

export const BillsPage: React.FC<BillsPageProps> = ({
  userBalance,
  onCompleteBillPayment,
  onBackToOverview,
}) => {
  const [activeCategory, setActiveCategory] = useState<BillCategory>('DATA');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkProvider>('MTN');
  const [phone, setPhone] = useState('08123456789');

  // Bundle selection
  const [selectedBundle, setSelectedBundle] = useState<DataBundle>(DATA_BUNDLES.MTN[2]);

  // Airtime
  const [airtimeAmount, setAirtimeAmount] = useState('1000');

  // Electricity
  const [meterNumber, setMeterNumber] = useState('4501928301');
  const [disco, setDisco] = useState('Ikeja Electric (IKEDC)');
  const [electricityAmount, setElectricityAmount] = useState('5000');

  // TV
  const [smartcardNumber, setSmartcardNumber] = useState('1029384756');
  const [tvPackage, setTvPackage] = useState('DSTV Compact (₦15,700)');

  // Betting
  const [bettingPlatform, setBettingPlatform] = useState('Bet9ja');
  const [bettingUser, setBettingUser] = useState('USER_99201');
  const [bettingAmount, setBettingAmount] = useState('2000');

  // Security PIN Confirmation Modal
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState(['', '', '', '']);
  const [pendingTxData, setPendingTxData] = useState<{
    title: string;
    amount: number;
    recipient: string;
    category: string;
    note: string;
    cashback: number;
  } | null>(null);

  const QUICK_CONTACTS = [
    { label: 'My Phone', number: '08123456789' },
    { label: 'Mom', number: '08031112222' },
    { label: 'Dad', number: '08023334444' },
    { label: 'Friend', number: '09018887777' },
  ];

  const handleNetworkSelect = (net: NetworkProvider) => {
    setSelectedNetwork(net);
    setSelectedBundle(DATA_BUNDLES[net][0]);
  };

  const handleInitiateDataPurchase = (bundle: DataBundle) => {
    if (!phone || phone.length < 10) return alert('Please enter a valid recipient phone number');
    if (bundle.price > userBalance) return alert('Insufficient Paydra wallet NGN balance');

    setPendingTxData({
      title: `${selectedNetwork} ${bundle.size} Data Bundle`,
      amount: bundle.price,
      recipient: phone,
      category: 'DATA',
      note: `${bundle.size} data bundle valid for ${bundle.validity}`,
      cashback: bundle.cashback,
    });
    setIsPinModalOpen(true);
  };

  const handleInitiateAirtimePurchase = () => {
    const amt = parseFloat(airtimeAmount);
    if (!phone || phone.length < 10) return alert('Please enter a valid recipient phone number');
    if (!amt || amt <= 0) return alert('Please enter a valid airtime amount');
    if (amt > userBalance) return alert('Insufficient Paydra wallet NGN balance');

    const cashback = Math.round(amt * 0.02); // 2% cashback
    setPendingTxData({
      title: `${selectedNetwork} Airtime Top-Up`,
      amount: amt,
      recipient: phone,
      category: 'AIRTIME',
      note: `Airtime dispatch to ${phone}`,
      cashback: cashback,
    });
    setIsPinModalOpen(true);
  };

  const handleInitiateElectricity = () => {
    const amt = parseFloat(electricityAmount);
    if (!meterNumber) return alert('Please enter your meter number');
    if (!amt || amt <= 0) return alert('Please enter amount');
    if (amt > userBalance) return alert('Insufficient balance');

    setPendingTxData({
      title: `${disco} Token Purchase`,
      amount: amt,
      recipient: `Meter ${meterNumber}`,
      category: 'BILL',
      note: `Electricity token for meter ${meterNumber}`,
      cashback: Math.round(amt * 0.01),
    });
    setIsPinModalOpen(true);
  };

  const handleInitiateTV = () => {
    const amt = tvPackage.includes('15,700') ? 15700 : tvPackage.includes('9,000') ? 9000 : 5500;
    if (!smartcardNumber) return alert('Please enter SmartCard number');

    setPendingTxData({
      title: `${tvPackage.split(' ')[0]} Subscription`,
      amount: amt,
      recipient: `SmartCard ${smartcardNumber}`,
      category: 'BILL',
      note: `TV subscription renewal for ${smartcardNumber}`,
      cashback: Math.round(amt * 0.015),
    });
    setIsPinModalOpen(true);
  };

  const handleInitiateBetting = () => {
    const amt = parseFloat(bettingAmount);
    if (!bettingUser) return alert('Please enter your betting User ID');
    if (!amt || amt <= 0) return alert('Please enter valid amount');

    setPendingTxData({
      title: `${bettingPlatform} Wallet Top-Up`,
      amount: amt,
      recipient: bettingUser,
      category: 'BILL',
      note: `Betting wallet topup for ${bettingUser}`,
      cashback: Math.round(amt * 0.01),
    });
    setIsPinModalOpen(true);
  };

  const handleConfirmPin = (enteredPin: string) => {
    if (!pendingTxData) return;

    triggerSuccessConfetti();

    const newTx: Transaction = {
      id: `tx_bill_${Date.now()}`,
      reference: `PAYDRA-BILL-${Date.now().toString().slice(-6)}`,
      type: pendingTxData.category as any,
      title: pendingTxData.title,
      amount: pendingTxData.amount,
      currency: 'NGN',
      fee: 0,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SUCCESSFUL',
      recipientName: pendingTxData.recipient,
      category: pendingTxData.category === 'DATA' || pendingTxData.category === 'AIRTIME' ? 'Utilities' : 'Bills',
      note: pendingTxData.note,
      tag: `#${pendingTxData.category}`,
      cashbackEarned: pendingTxData.cashback,
      receiptCode: `RCP-BILL-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setIsPinModalOpen(false);
    setPin(['', '', '', '']);
    onCompleteBillPayment(newTx);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-6 text-slate-900 animate-fade-in">
      {/* HEADER & BALANCE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToOverview}
            className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Paydra Bills & Data Marketplace
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200">
                Instant Dispatch
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Buy data, airtime, pay electricity & TV bills with instant 2% cashback rewards
            </p>
          </div>
        </div>

        <div className="px-3.5 py-2 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] text-slate-500 font-bold">Paydra Wallet:</span>
          <span className="text-sm font-black text-indigo-900">
            ₦{userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* CASHBACK PROMO BANNER */}
      <div className="p-3.5 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 text-white rounded-2xl border border-indigo-800/50 shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 shadow-md shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
              Instant Cashback Offer 🎁
            </span>
            <p className="text-xs text-slate-200">
              Earn up to <strong className="text-amber-300 font-bold">2% instant cashback bonus</strong> credited to your wallet on every data & airtime purchase!
            </p>
          </div>
        </div>
      </div>

      {/* CATEGORY TABS (OPay & Kuda Style) */}
      <div className="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
        {[
          { id: 'DATA', label: 'Data Bundles', icon: Wifi },
          { id: 'AIRTIME', label: 'Airtime', icon: PhoneCall },
          { id: 'ELECTRICITY', label: 'Electricity', icon: Zap },
          { id: 'TV', label: 'Cable TV', icon: Tv },
          { id: 'BETTING', label: 'Betting', icon: Gamepad2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as BillCategory)}
              className={`py-2.5 px-1 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-center ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="text-[10px] sm:text-xs truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: MOBILE DATA BUNDLES */}
      {activeCategory === 'DATA' && (
        <div className="space-y-5">
          {/* NETWORK PROVIDER CARDS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">1. Select Network Carrier</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {NETWORKS.map((net) => {
                const isSelected = selectedNetwork === net.id;
                return (
                  <button
                    key={net.id}
                    onClick={() => handleNetworkSelect(net.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 text-left ${
                      isSelected
                        ? `${net.bg} ${net.text} ${net.border} shadow-md scale-[1.02]`
                        : 'bg-slate-50 border-slate-200 text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-xs shrink-0 ${net.logoBg}`}>
                      {net.id.slice(0, 3)}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-black block truncate">{net.name}</span>
                      <span className={`text-[10px] font-semibold block truncate ${isSelected ? 'opacity-90' : 'text-slate-500'}`}>
                        {net.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RECIPIENT PHONE NUMBER & CONTACTS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">2. Recipient Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08123456789"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>

            {/* Quick Contacts */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
              <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Recents:</span>
              {QUICK_CONTACTS.map((c) => (
                <button
                  key={c.number}
                  onClick={() => setPhone(c.number)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg text-[10px] font-bold text-slate-700 transition-colors cursor-pointer shrink-0"
                >
                  {c.label} ({c.number.slice(-4)})
                </button>
              ))}
            </div>
          </div>

          {/* DATA BUNDLES GRID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                3. Choose {selectedNetwork} Data Bundle
              </label>
              <span className="text-[11px] text-emerald-600 font-bold">2% Instant Cashback Included</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {DATA_BUNDLES[selectedNetwork].map((bundle) => {
                return (
                  <div
                    key={bundle.id}
                    className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200/90 space-y-3 transition-all shadow-2xs group flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                          {bundle.type} • {bundle.validity}
                        </span>

                        {bundle.popular && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5 fill-slate-950" /> Popular
                          </span>
                        )}
                      </div>

                      <h4 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {bundle.size}
                      </h4>
                    </div>

                    <div className="space-y-2 pt-1 border-t border-slate-200/80">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-black text-indigo-900">
                          ₦{bundle.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          +₦{bundle.cashback} Cashback
                        </span>
                      </div>

                      <button
                        onClick={() => handleInitiateDataPurchase(bundle)}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: AIRTIME TOP-UP */}
      {activeCategory === 'AIRTIME' && (
        <div className="space-y-5 max-w-md mx-auto">
          {/* Network selector */}
          <div className="grid grid-cols-4 gap-2">
            {NETWORKS.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedNetwork === net.id
                    ? `${net.bg} ${net.text} ${net.border} shadow-md font-black`
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <span className="text-xs font-bold block">{net.id}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Airtime Amount (₦)</label>
            <input
              type="number"
              value={airtimeAmount}
              onChange={(e) => setAirtimeAmount(e.target.value)}
              placeholder="e.g. 1000"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-lg font-mono font-bold text-slate-900"
            />

            <div className="grid grid-cols-4 gap-2 pt-2">
              {[200, 500, 1000, 2000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAirtimeAmount(amt.toString())}
                  className="py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 font-bold text-xs rounded-xl border border-slate-200 cursor-pointer"
                >
                  ₦{amt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleInitiateAirtimePurchase}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Recharge Airtime (+2% Cashback)
          </button>
        </div>
      )}

      {/* SECTION 3: ELECTRICITY BILLS */}
      {activeCategory === 'ELECTRICITY' && (
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select DisCo Provider</label>
            <select
              value={disco}
              onChange={(e) => setDisco(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 cursor-pointer"
            >
              <option value="Ikeja Electric (IKEDC)">Ikeja Electric (IKEDC)</option>
              <option value="Eko Electricity (EKEDC)">Eko Electricity (EKEDC)</option>
              <option value="Abuja Electricity (AEDC)">Abuja Electricity (AEDC)</option>
              <option value="Kano Electricity (KEDCO)">Kano Electricity (KEDCO)</option>
              <option value="IBEDC Ibadan">IBEDC Ibadan</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Meter Number</label>
            <input
              type="text"
              value={meterNumber}
              onChange={(e) => setMeterNumber(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Amount (₦)</label>
            <input
              type="number"
              value={electricityAmount}
              onChange={(e) => setElectricityAmount(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900"
            />
          </div>

          <button
            onClick={handleInitiateElectricity}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
          >
            Pay Electricity Bill
          </button>
        </div>
      )}

      {/* SECTION 4: CABLE TV */}
      {activeCategory === 'TV' && (
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Decoder / Smartcard Number</label>
            <input
              type="text"
              value={smartcardNumber}
              onChange={(e) => setSmartcardNumber(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Package</label>
            <select
              value={tvPackage}
              onChange={(e) => setTvPackage(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 cursor-pointer"
            >
              <option value="DSTV Compact (₦15,700)">DSTV Compact (₦15,700/mo)</option>
              <option value="DSTV Premium (₦29,500)">DSTV Premium (₦29,500/mo)</option>
              <option value="GOTV Max (₦4,850)">GOTV Max (₦4,850/mo)</option>
              <option value="GOTV Supa (₦6,400)">GOTV Supa (₦6,400/mo)</option>
              <option value="Startimes Classic (₦3,800)">Startimes Classic (₦3,800/mo)</option>
            </select>
          </div>

          <button
            onClick={handleInitiateTV}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
          >
            Renew TV Subscription
          </button>
        </div>
      )}

      {/* SECTION 5: BETTING */}
      {activeCategory === 'BETTING' && (
        <div className="space-y-4 max-w-md mx-auto">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Bookmaker</label>
            <select
              value={bettingPlatform}
              onChange={(e) => setBettingPlatform(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 cursor-pointer"
            >
              <option value="Bet9ja">Bet9ja</option>
              <option value="SportyBet">SportyBet</option>
              <option value="1xBet">1xBet</option>
              <option value="NairaBet">NairaBet</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">User ID / Account ID</label>
            <input
              type="text"
              value={bettingUser}
              onChange={(e) => setBettingUser(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Top-Up Amount (₦)</label>
            <input
              type="number"
              value={bettingAmount}
              onChange={(e) => setBettingAmount(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono font-bold text-slate-900"
            />
          </div>

          <button
            onClick={handleInitiateBetting}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md cursor-pointer"
          >
            Top-Up Wallet
          </button>
        </div>
      )}

      {/* SECURITY PIN AUTHORIZATION MODAL */}
      {isPinModalOpen && pendingTxData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold text-slate-900">Authorize Bill Payment</h3>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">{pendingTxData.title}</span>
              <h4 className="text-xl font-black text-indigo-900">₦{pendingTxData.amount.toLocaleString()}</h4>
              <p className="text-[11px] text-emerald-600 font-bold">
                🎁 +₦{pendingTxData.cashback} Instant Cashback Reward
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block text-center">
                Enter 4-Digit Security PIN
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin.join('')}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setPin(val.split(''));
                  if (val.length === 4) {
                    setTimeout(() => handleConfirmPin(val), 300);
                  }
                }}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>

            <button
              onClick={() => handleConfirmPin(pin.join(''))}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              Confirm & Pay ₦{pendingTxData.amount.toLocaleString()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
