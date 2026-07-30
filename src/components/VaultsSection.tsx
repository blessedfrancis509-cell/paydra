import React, { useState } from 'react';
import { VaultGoal, Transaction, CategoryBudget } from '../types';
import {
  PiggyBank,
  Plus,
  Lock,
  Unlock,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Trophy,
  PartyPopper,
  Eye,
  EyeOff,
  Coins,
  ArrowDownLeft,
  Flame,
  CheckCircle2,
  Sliders,
  X,
} from 'lucide-react';
import { AnalyticsSection } from './AnalyticsSection';
import { triggerGoalReachedConfetti, triggerSuccessConfetti } from '../utils/confetti';

interface VaultsSectionProps {
  vaults: VaultGoal[];
  onCreateVault: (title: string, targetAmount: number, category: VaultGoal['category'], APY: number) => void;
  onDepositVault: (vaultId: string, amount: number) => void;
  transactions: Transaction[];
  categoryBudgets: CategoryBudget[];
  userBalance: number;
  initialTab?: 'VAULTS' | 'INSIGHTS';
}

export const VaultsSection: React.FC<VaultsSectionProps> = ({
  vaults,
  onCreateVault,
  onDepositVault,
  transactions,
  categoryBudgets,
  userBalance,
  initialTab = 'VAULTS',
}) => {
  const [activeTab, setActiveTab] = useState<'GOALS' | 'AUTOSAVE' | 'INSIGHTS'>(
    initialTab === 'INSIGHTS' ? 'INSIGHTS' : 'GOALS'
  );
  const [showStashBalance, setShowStashBalance] = useState(true);
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [depositVaultId, setDepositVaultId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Auto-save Roundup state
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [roundUpNearest, setRoundUpNearest] = useState<100 | 500 | 1000>(100);
  const [roundUpSavedTotal, setRoundUpSavedTotal] = useState(14850);

  // Goal filter state
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'Fixed' | 'Target' | 'Emergency'>('ALL');

  // Celebration state when 100% target goal hit
  const [celebratingVault, setCelebratingVault] = useState<{ title: string; target: number; current: number } | null>(null);

  // Create Form State
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState<VaultGoal['category']>('Target');
  const [lockDuration, setLockDuration] = useState('90');

  const totalSaved = vaults.reduce((acc, v) => acc + v.currentAmount, 0);
  const totalMonthlyYield = Math.round((totalSaved * 0.155) / 12);
  const totalAnnualYield = Math.round(totalSaved * 0.155);

  const filteredVaults = vaults.filter((v) => {
    if (filterCategory === 'ALL') return true;
    return v.category === filterCategory;
  });

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositVaultId) return;
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return alert('Please enter a valid deposit amount');
    if (amt > userBalance) return alert('Insufficient Paydra wallet NGN balance');

    const targetVault = vaults.find((v) => v.id === depositVaultId);
    if (targetVault) {
      const newTotal = targetVault.currentAmount + amt;
      if (newTotal >= targetVault.targetAmount) {
        triggerGoalReachedConfetti();
        setCelebratingVault({
          title: targetVault.title,
          target: targetVault.targetAmount,
          current: newTotal,
        });
      } else {
        triggerSuccessConfetti();
      }
    }

    onDepositVault(depositVaultId, amt);
    setDepositVaultId(null);
    setDepositAmount('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    if (!title.trim() || !target || target <= 0) return alert('Please fill in a valid plan title and target amount');

    const APY = category === 'Fixed' ? 16.5 : category === 'Emergency' ? 15.0 : 14.5;
    onCreateVault(title, target, category, APY);
    triggerSuccessConfetti();
    setIsCreatingModal(false);
    setTitle('');
    setTargetAmount('');
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-6 text-slate-900 animate-fade-in">
      {/* 1. BRANDED APP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-600/30 border border-white/20">
            <PiggyBank className="w-6 h-6 text-amber-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Paydra SafeVaults & Wealth Builder
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>NDIC Guaranteed</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              High-yield automated savings, daily interest payouts & Gemini AI cashflow intelligence
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-indigo-600/25 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Savings Plan</span>
        </button>
      </div>

      {/* 2. HERO STASH BANNER (OPay / Kuda High-Yield Savings Card) */}
      <div className="relative w-full rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-6 text-white shadow-xl shadow-indigo-950/30 overflow-hidden space-y-4">
        {/* Floating Geometric Decorative Orbs */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gradient-to-tr from-white/10 to-indigo-400/20 backdrop-blur-md animate-float-slow pointer-events-none" />
        <div className="absolute left-1/3 -bottom-10 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-[10px] font-extrabold uppercase tracking-wider">
                Total Stashed Balance
              </span>

              <button
                onClick={() => setShowStashBalance(!showStashBalance)}
                className="text-indigo-300 hover:text-white transition-colors cursor-pointer p-0.5"
                title={showStashBalance ? 'Hide Stash Balance' : 'Show Stash Balance'}
              >
                {showStashBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <span className="text-xs text-indigo-300/80 font-medium">
                • {vaults.length} Active {vaults.length === 1 ? 'Plan' : 'Plans'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                {showStashBalance
                  ? `₦${totalSaved.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : '••••••••••'}
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Up to +16.5% APY</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
              <span>Compounding daily interest credited at</span>
              <strong className="text-emerald-400 font-bold">00:00 GMT</strong>
            </p>
          </div>

          {/* Interest Yield Cards */}
          <div className="flex items-center gap-2.5 self-start md:self-auto relative z-10">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 rounded-2xl text-left shadow-2xs">
              <span className="text-[10px] text-emerald-300/80 font-extrabold uppercase block">Est. Monthly Return</span>
              <span className="text-sm sm:text-base font-black flex items-center gap-1 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                +₦{totalMonthlyYield.toLocaleString()}
              </span>
            </div>

            <div className="px-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 rounded-2xl text-left shadow-2xs">
              <span className="text-[10px] text-indigo-300/80 font-extrabold uppercase block">Est. Annual Return</span>
              <span className="text-sm sm:text-base font-black text-white">
                +₦{totalAnnualYield.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300 font-medium relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>CBN Licensed & NDIC Insured</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              <span>Auto-Compounding Enabled</span>
            </span>
          </div>

          <button
            onClick={() => setIsCreatingModal(true)}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
          >
            <span>+ Add New Savings Vault</span>
          </button>
        </div>
      </div>

      {/* 3. MODERN APP TAB NAVIGATION */}
      <div className="p-1 bg-slate-100 rounded-2xl flex items-center text-xs font-bold">
        <button
          onClick={() => setActiveTab('GOALS')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'GOALS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Vault Goals ({vaults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AUTOSAVE')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'AUTOSAVE'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-400" />
          <span>Paydra Auto-Save & Roundups</span>
        </button>

        <button
          onClick={() => setActiveTab('INSIGHTS')}
          className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'INSIGHTS'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Spending Audit</span>
        </button>
      </div>

      {/* TAB 1: VAULT GOALS */}
      {activeTab === 'GOALS' && (
        <div className="space-y-5">
          {/* INTERACTIVE APY YIELD CALCULATOR WIDGET (OPay Style) */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-100 rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    Paydra Compound Interest Estimator
                  </h3>
                  <p className="text-[11px] text-indigo-700 font-medium">
                    Calculate your guaranteed returns at 16.5% APY
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-600 text-white shadow-2xs">
                16.5% APY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
              <div className="p-3 bg-white rounded-2xl border border-indigo-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">If You Save</span>
                <span className="text-base font-black text-slate-900">₦100,000</span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-indigo-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block uppercase">Lock Duration</span>
                <span className="text-base font-black text-slate-900">12 Months (1 Year)</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-800 block uppercase">You Earn Free Payout</span>
                <span className="text-base font-black text-emerald-600">+₦16,500 Interest 🎉</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              {(['ALL', 'Fixed', 'Target', 'Emergency'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                    filterCategory === cat
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'ALL'
                    ? 'All Plans'
                    : cat === 'Fixed'
                    ? '🔒 Fixed Lock (16.5%)'
                    : cat === 'Target'
                    ? '🎯 Target Savings'
                    : '🛡️ Emergency Vault'}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              Showing {filteredVaults.length} of {vaults.length} plans
            </span>
          </div>

          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVaults.map((v) => {
              const progressPercent = Math.min(100, Math.round((v.currentAmount / v.targetAmount) * 100));
              const dailyYield = Math.round((v.currentAmount * (v.interestRateAPY / 100)) / 365);

              return (
                <div
                  key={v.id}
                  className="p-5 bg-slate-50 rounded-3xl border border-slate-200/90 hover:border-indigo-300 transition-all shadow-2xs space-y-4 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                          v.category === 'Fixed'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : v.category === 'Emergency'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-indigo-50 text-indigo-800 border-indigo-200'
                        }`}
                      >
                        {v.category === 'Fixed'
                          ? 'Fixed Lock Plan'
                          : v.category === 'Emergency'
                          ? 'Emergency Vault'
                          : 'Target Flexi Plan'}{' '}
                        • {v.interestRateAPY}% APY
                      </span>

                      {v.status === 'LOCKED' ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Locked</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
                          <Unlock className="w-3 h-3 text-indigo-600" />
                          <span>Flexible</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {v.title}
                    </h4>
                  </div>

                  {/* Progress & Balances */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Saved Balance</span>
                        <span className="font-black text-slate-900 text-lg">₦{v.currentAmount.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Target Goal</span>
                        <span className="text-xs font-bold text-slate-600">₦{v.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progressPercent >= 100
                            ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600'
                            : v.category === 'Fixed'
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-0.5">
                      {progressPercent >= 100 ? (
                        <span className="text-emerald-700 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" />
                          <span>100% Goal Reached! 🎉</span>
                        </span>
                      ) : (
                        <span>{progressPercent}% Achieved</span>
                      )}

                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +₦{dailyYield}/day interest
                      </span>
                    </div>
                  </div>

                  {/* Deposit CTA Button */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setDepositVaultId(v.id)}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Deposit Funds</span>
                    </button>

                    {progressPercent >= 100 && (
                      <button
                        onClick={() => {
                          triggerGoalReachedConfetti();
                          setCelebratingVault({
                            title: v.title,
                            target: v.targetAmount,
                            current: v.currentAmount,
                          });
                        }}
                        className="px-3 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1 shrink-0"
                        title="Celebrate Goal Reached!"
                      >
                        <PartyPopper className="w-4 h-4 text-amber-200 animate-bounce" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PAYDRA AUTO-SAVE & ROUNDUPS */}
      {activeTab === 'AUTOSAVE' && (
        <div className="p-5 bg-indigo-50/60 rounded-3xl border border-indigo-100 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 shadow-md">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Paydra Spare Change Roundups
                </h3>
                <p className="text-xs text-slate-600">
                  Automatically round up transaction amounts on transfers and save spare change.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Auto-Save Status:</span>
              <button
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  autoSaveEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    autoSaveEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-2xs space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-500">
                Total Spare Change Saved
              </span>
              <h4 className="text-xl font-black text-indigo-900">
                ₦{roundUpSavedTotal.toLocaleString()}
              </h4>
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +14.5% APY compounding
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-indigo-100 shadow-2xs space-y-1 col-span-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                Roundup Rule (Round transactions to nearest)
              </span>
              <div className="flex items-center gap-2">
                {[100, 500, 1000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRoundUpNearest(val as any)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      roundUpNearest === val
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Nearest ₦{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-indigo-100 text-xs text-slate-700 space-y-1.5">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              How Paydra Spare Change Works:
            </span>
            <p className="text-slate-600 leading-relaxed">
              When you send ₦4,650 to a friend, Paydra rounds it up to ₦4,700 and automatically deposits the extra ₦50 spare change into your Paydra Auto-Save Vault!
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: AI SPENDING INSIGHTS */}
      {activeTab === 'INSIGHTS' && (
        <div className="space-y-4 pt-2">
          <AnalyticsSection
            transactions={transactions}
            categoryBudgets={categoryBudgets}
            userBalance={userBalance}
          />
        </div>
      )}

      {/* CREATE NEW SAVINGS PLAN MODAL */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-slate-900 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Create Paydra Savings Plan</h3>
              </div>
              <button
                onClick={() => setIsCreatingModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Plan Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New iPhone 17 Fund or House Rent 2027"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Savings Goal (₦)</label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="e.g. 500000"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 pt-2">
                  {[50000, 100000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTargetAmount(amt.toString())}
                      className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                    >
                      +₦{(amt / 1000).toLocaleString()}k
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Savings Plan Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Target">🎯 Target Flexi (14.5% APY - Withdraw Anytime)</option>
                  <option value="Fixed">🔒 Fixed Lock Savings (16.5% APY - High Return)</option>
                  <option value="Emergency">🛡️ Emergency Vault (15.0% APY - Instant Access)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-md shadow-indigo-600/20 cursor-pointer mt-2"
              >
                Create High-Yield Plan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {depositVaultId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Deposit Funds to Vault</h3>
              <button
                onClick={() => setDepositVaultId(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Deposit Amount (₦)</label>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Available: ₦{userBalance.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Confirm Deposit</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CELEBRATION MODAL */}
      {celebratingVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center text-slate-900 overflow-hidden animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Trophy className="w-8 h-8 text-slate-950 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Savings Goal Reached! 🎉</h3>
              <p className="text-xs text-slate-600">
                Congratulations! You hit 100% of your target for <strong>{celebratingVault.title}</strong>!
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs text-slate-500 block uppercase font-bold">Total Stashed</span>
              <span className="text-2xl font-black text-emerald-600">
                ₦{celebratingVault.current.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => setCelebratingVault(null)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
            >
              Continue Banking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
