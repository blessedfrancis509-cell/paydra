import React, { useState } from 'react';
import { UserProfile, Currency } from '../types';
import {
  User,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Phone,
  Mail,
  Copy,
  Check,
  Edit3,
  Lock,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Smartphone,
  Building,
  CheckCircle2,
  X,
  Headphones,
  Globe,
  BadgeCheck,
  Sliders,
  QrCode,
  Gift,
  Zap,
  ArrowRight,
  Share2,
} from 'lucide-react';

interface ProfilePageProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  selectedCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onOpenSecurityModal: () => void;
  onLogout?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
  selectedCurrency,
  onCurrencyChange,
  onOpenSecurityModal,
  onLogout,
}) => {
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editTag, setEditTag] = useState(user.veloTag);

  // Security & Toggles state
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [pushNotifsEnabled, setPushNotifsEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);

  // PIN modal
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  const referralCode = `PAYDRA-${user.name.split(' ')[0].toUpperCase()}`;

  const handleCopy = (text: string, type: 'acc' | 'tag' | 'ref') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else if (type === 'tag') {
      setCopiedTag(true);
      setTimeout(() => setCopiedTag(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: editName,
      email: editEmail,
      phone: editPhone,
      veloTag: editTag,
    });
    setIsEditModalOpen(false);
  };

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length !== 4) return alert('PIN must be 4 digits');
    setPinSaved(true);
    setTimeout(() => {
      setPinSaved(false);
      setIsPinModalOpen(false);
      setPinCode('');
      alert('🔒 4-Digit Transaction PIN updated successfully!');
    }, 1000);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-6 text-slate-900 animate-fade-in">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 shadow-2xs">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Account Profile</h2>
            <p className="text-xs text-slate-500">Manage identity, limits & security settings</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 1. OPAY / KUDA STYLE PROFILE HERO BANNER */}
      <div className="relative p-5 sm:p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white rounded-3xl border border-indigo-900/60 shadow-xl overflow-hidden space-y-4">
        {/* Decorative Floating Orbs */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            {/* Avatar with Tier 3 Badge */}
            <div className="relative shrink-0">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-indigo-400/60 shadow-lg"
              />
              <span
                className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow-md border-2 border-slate-950"
                title="Tier 3 CBN Fully Verified"
              >
                <BadgeCheck className="w-4 h-4 text-white" />
              </span>
            </div>

            {/* User Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white">{user.name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Tier 3 Verified
                </span>
              </div>

              <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span>{user.email}</span>
              </p>

              <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span>{user.phone}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold text-white flex items-center gap-2 transition-all cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Show QR & Share</span>
          </button>
        </div>

        {/* NUBAN Account & PaydraTag Chips */}
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 relative z-10">
          <button
            onClick={() => handleCopy(user.accountNumber, 'acc')}
            className="p-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 rounded-2xl text-xs font-mono text-white flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="text-left">
              <span className="text-[9px] uppercase font-sans text-indigo-200 block font-bold">
                Paydra NUBAN Account
              </span>
              <span className="font-bold text-sm tracking-wider">{user.accountNumber}</span>
            </div>
            {copiedAcc ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Copy className="w-4 h-4 text-slate-300" />
            )}
          </button>

          <button
            onClick={() => handleCopy(user.veloTag, 'tag')}
            className="p-3 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 rounded-2xl text-xs font-mono text-white flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="text-left">
              <span className="text-[9px] uppercase font-sans text-indigo-200 block font-bold">
                PaydraTag Username
              </span>
              <span className="font-bold text-sm text-amber-300">{user.veloTag}</span>
            </div>
            {copiedTag ? (
              <Check className="w-4 h-4 text-emerald-300" />
            ) : (
              <Copy className="w-4 h-4 text-slate-300" />
            )}
          </button>
        </div>
      </div>

      {/* 2. REFER & EARN ₦1,000 BONUS BANNER (OPay Style) */}
      <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-300/40 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 shadow-md shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 block">
              Refer & Earn ₦1,000 Cash Bonus 🎁
            </span>
            <p className="text-xs text-slate-700">
              Invite your friends to Paydra Digital Bank. Get ₦1,000 cash for every friend who signs up!
            </p>
          </div>
        </div>

        <button
          onClick={() => handleCopy(referralCode, 'ref')}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copiedRef ? 'Code Copied!' : referralCode}</span>
        </button>
      </div>

      {/* 3. ACCOUNT TIER & DAILY LIMITS CARD */}
      <div className="p-4 sm:p-5 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Building className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900">CBN Verification & Transfer Limits</span>
          </div>

          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Highest Tier 3 Status
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Daily Transfer Limit</span>
            <span className="font-extrabold text-slate-900">₦185,000 / ₦5,000,000.00</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full w-[4%]" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 text-center">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">BVN Status</span>
            <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          </div>

          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 text-center">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">NIN Identity</span>
            <span className="font-bold text-emerald-600 flex items-center justify-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Linked
            </span>
          </div>

          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 text-center">
            <span className="text-slate-400 block text-[9px] uppercase font-bold">Max Balance</span>
            <span className="font-bold text-indigo-600 mt-0.5 block">Unlimited</span>
          </div>
        </div>
      </div>

      {/* 4. SECURITY & AUTHENTICATION CONTROL CENTER */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
            Security Control Center
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {/* Biometrics */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                <Fingerprint className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Biometric / FaceID Sign-In</span>
                <span className="text-[10px] text-slate-500">Fast fingerprint login without typing password</span>
              </div>
            </div>
            <button
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                biometricsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Change PIN */}
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-2xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                <KeyRound className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">Change Transaction PIN</span>
                <span className="text-[10px] text-slate-500">4-digit security PIN for money transfers</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* 2FA Security Questions */}
          <button
            onClick={onOpenSecurityModal}
            className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-2xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">Security Questions & 2FA</span>
                <span className="text-[10px] text-slate-500">Account recovery & backup security answers</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
              Active
            </span>
          </button>
        </div>
      </div>

      {/* 5. BANK PREFERENCES & NOTIFICATIONS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
            App Preferences & Alerts
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          {/* Default Currency Switcher */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                <Globe className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Primary Display Currency</span>
                <span className="text-[10px] text-slate-500">Default wallet display currency</span>
              </div>
            </div>

            <select
              value={selectedCurrency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="py-1.5 px-3 bg-white border border-slate-200 font-bold rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="NGN">₦ NGN</option>
              <option value="USD">$ USD</option>
              <option value="GBP">£ GBP</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>

          {/* Instant Push Alerts */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                <Bell className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Instant Push Notifications</span>
                <span className="text-[10px] text-slate-500">Real-time credit & debit push alerts</span>
              </div>
            </div>
            <button
              onClick={() => setPushNotifsEnabled(!pushNotifsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                pushNotifsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  pushNotifsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* SMS Alerts */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600">
                <Smartphone className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">SMS Bank Alerts</span>
                <span className="text-[10px] text-slate-500">Carrier SMS notification dispatch</span>
              </div>
            </div>
            <button
              onClick={() => setSmsAlertsEnabled(!smsAlertsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                smsAlertsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  smsAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 6. SUPPORT & HELP CENTER */}
      <div className="p-4 bg-indigo-50/70 rounded-3xl border border-indigo-100 space-y-3">
        <div className="flex items-center gap-2 text-indigo-950">
          <Headphones className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold">24/7 Paydra Priority Customer Support</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => alert('📞 Calling Paydra Concierge Support (+234 700 PAYDRA)...')}
            className="p-3 bg-white hover:bg-slate-50 border border-indigo-200 rounded-2xl text-slate-800 font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Phone className="w-4 h-4 text-indigo-600" />
            <span>Call Support Hotline</span>
          </button>

          <button
            onClick={() => alert('💬 Opening Live Support Chat with Paydra Concierge Agent...')}
            className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-indigo-600/20"
          >
            <HelpCircle className="w-4 h-4 text-white" />
            <span>Live Agent Chat</span>
          </button>
        </div>
      </div>

      {/* 7. LOG OUT OF ACCOUNT */}
      <button
        onClick={() => {
          if (onLogout) {
            onLogout();
          } else {
            alert('🔒 Session secured. You have logged out of Paydra Bank.');
          }
        }}
        className="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-2xl text-xs border border-red-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
      >
        <LogOut className="w-4 h-4 text-red-600" />
        <span>Log Out of Paydra Account</span>
      </button>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Update Profile Info</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Custom PaydraTag</label>
                <input
                  type="text"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer mt-2"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR CODE SHARE MODAL */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-center space-y-4 text-slate-900 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Paydra Account QR</h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-indigo-950 rounded-2xl text-white space-y-2">
              <div className="w-36 h-36 bg-white mx-auto rounded-xl p-2 flex items-center justify-center shadow-md">
                <QrCode className="w-32 h-32 text-slate-950" />
              </div>
              <h4 className="font-black text-sm text-amber-300">{user.name}</h4>
              <p className="font-mono text-xs">{user.accountNumber} • Paydra MFB</p>
            </div>

            <p className="text-xs text-slate-500">Scan QR to send instant zero-fee money transfers</p>

            <button
              onClick={() => {
                navigator.clipboard.writeText(`Paydra Bank: ${user.name} (${user.accountNumber})`);
                alert('Copied account share link!');
                setIsQrModalOpen(false);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy Share Details</span>
            </button>
          </div>
        </div>
      )}

      {/* CHANGE PIN MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Change Transaction PIN</h3>
              </div>
              <button
                onClick={() => setIsPinModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePin} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  New 4-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  required
                />
              </div>

              <p className="text-[11px] text-slate-500">
                This PIN is required to authorize all money transfers and bill payments.
              </p>

              <button
                type="submit"
                disabled={pinSaved || pinCode.length !== 4}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {pinSaved ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Lock className="w-4 h-4" />}
                <span>{pinSaved ? 'PIN Saved!' : 'Save New PIN'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
