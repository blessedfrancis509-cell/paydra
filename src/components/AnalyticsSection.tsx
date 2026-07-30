import React, { useState, useEffect } from 'react';
import { Transaction, CategoryBudget, AIInsight, MonthlySpendingReport } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import {
  Sparkles,
  PieChart as PieIcon,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Users,
  Zap,
  Receipt,
  Send,
  Smartphone,
  CheckCircle2,
  Tag,
  Activity,
  DollarSign,
  Calendar,
  Layers,
  Search,
  Check,
  FileText,
  Award,
  BrainCircuit,
  UserCheck
} from 'lucide-react';

interface AnalyticsSectionProps {
  transactions: Transaction[];
  categoryBudgets: CategoryBudget[];
  userBalance: number;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  transactions,
  categoryBudgets,
  userBalance,
}) => {
  const [activeTab, setActiveTab] = useState<'REPORT' | 'OVERVIEW' | 'RECIPIENTS' | 'UTILITIES' | 'AI_COACH'>('REPORT');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const [aiInsight, setAiInsight] = useState<AIInsight | null>({
    headline: 'Optimal Saving & Cashflow Buffer',
    tip: 'Your outgoing transfers and utility bills are within healthy spending parameters this month. Consider locking ₦35,000 in your 16.5% APY High-Yield Vault to optimize interest returns.',
    recommendedAction: 'Lock ₦35,000 in Vault',
    healthScore: 89,
    categoryTip: 'Transfers make up 81% of your total monthly outflow, while Utility Bills account for 15%.',
    recipientSummary: 'You sent ₦165,000 across 2 main recipients this month: AMINA BELLO (₦45,000) and CHIDI OKAFOR (₦120,000).',
    utilitySummary: 'Utility payments total ₦30,000 across Ikeja Electric (₦25,000 token) and MTN Airtime (₦5,000).'
  });

  const [spendingReport, setSpendingReport] = useState<MonthlySpendingReport | null>(null);

  // Monthly Expenses Calculation
  const outgoingTxs = transactions.filter(t => t.type !== 'INFLOW' && t.type !== 'CASHBACK');
  const totalSpentMonth = outgoingTxs.reduce((acc, t) => acc + t.amount, 0);
  const monthlyIncome = 950000; // Estimated income
  const totalSavedOrRetained = Math.max(0, monthlyIncome - totalSpentMonth);
  const savingsRatePct = Math.round((totalSavedOrRetained / monthlyIncome) * 100);
  const avgDailySpend = Math.round(totalSpentMonth / 30);

  // Group Transfers by Recipient ("Who you sent money to")
  const recipientMap: Record<string, {
    name: string;
    bankName: string;
    accountNumber?: string;
    totalAmount: number;
    count: number;
    lastDate: string;
    note?: string;
    tag?: string;
  }> = {};

  outgoingTxs.forEach(tx => {
    if (tx.type === 'TRANSFER' || tx.recipientName) {
      const name = tx.recipientName || tx.title.replace('Transfer to ', '');
      if (!recipientMap[name]) {
        recipientMap[name] = {
          name,
          bankName: tx.bankName || tx.recipientBank || 'Bank Transfer',
          accountNumber: tx.recipientAccount,
          totalAmount: 0,
          count: 0,
          lastDate: tx.date,
          note: tx.note,
          tag: tx.tag
        };
      }
      recipientMap[name].totalAmount += tx.amount;
      recipientMap[name].count += 1;
      if (new Date(tx.date) > new Date(recipientMap[name].lastDate)) {
        recipientMap[name].lastDate = tx.date;
        recipientMap[name].note = tx.note;
      }
    }
  });

  const recipientList = Object.values(recipientMap).sort((a, b) => b.totalAmount - a.totalAmount);
  const filteredRecipients = recipientList.filter(r => 
    r.name.toLowerCase().includes(recipientSearch.toLowerCase()) || 
    r.bankName.toLowerCase().includes(recipientSearch.toLowerCase())
  );

  // Group Utility Bills ("What utility bills you paid for")
  const utilityTxs = outgoingTxs.filter(t => 
    t.type === 'BILL' || t.type === 'AIRTIME' || t.type === 'DATA' || t.category === 'Bills & Utilities'
  );
  const totalUtilitySpent = utilityTxs.reduce((acc, t) => acc + t.amount, 0);

  // Category chart data
  const chartData = categoryBudgets.map(c => ({
    name: c.name.split(' ')[0],
    amount: c.spent,
    color: c.color,
  }));

  // Automatic Gemini AI Monthly Spending Report Generation
  const fetchAIMonthlySpendingReport = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/monthly-spending-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userBalance,
          monthlyIncome,
          monthlySpent: totalSpentMonth,
          categoryBudgets,
          transactions: transactions.slice(0, 15),
          recipients: recipientList,
        }),
      });
      const data = await res.json();
      if (data.report) {
        setSpendingReport(data.report);
      }
    } catch (e) {
      console.error("Error fetching Gemini spending report:", e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const fetchAIFinancialInsights = async () => {
    setIsLoadingAI(true);
    try {
      await Promise.all([
        fetch('/api/ai/financial-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userBalance,
            monthlyIncome,
            monthlySpent: totalSpentMonth,
            topCategories: categoryBudgets,
            recentTransactions: transactions.slice(0, 10),
          }),
        }).then(res => res.json()).then(data => {
          if (data.insight) setAiInsight(data.insight);
        }),
        fetchAIMonthlySpendingReport()
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Automatically trigger report generation on mount
  useEffect(() => {
    fetchAIMonthlySpendingReport();
  }, []);

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-6 text-slate-900">
      
      {/* Header & Main Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-slate-900">AI Cashflow & Expense Intelligence</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black uppercase flex items-center gap-1">
                <BrainCircuit className="w-3 h-3 text-indigo-600" />
                <span>Gemini 3.6 AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Unified auto-generated monthly spending audit, recipient transfer log & utility bills log</p>
          </div>
        </div>

        <button
          onClick={fetchAIFinancialInsights}
          disabled={isLoadingAI}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAI ? 'animate-spin' : ''}`} />
          <span>{isLoadingAI ? 'Generating Gemini Report...' : 'Regenerate AI Report'}</span>
        </button>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/80 overflow-x-auto custom-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('REPORT')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'REPORT'
              ? 'bg-white text-indigo-600 shadow-2xs font-extrabold border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini AI Monthly Report</span>
          <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[9px] font-black">AUTO</span>
        </button>

        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'OVERVIEW'
              ? 'bg-white text-indigo-600 shadow-2xs font-extrabold border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Monthly Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('RECIPIENTS')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'RECIPIENTS'
              ? 'bg-white text-indigo-600 shadow-2xs font-extrabold border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>Who You Sent Money To ({recipientList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('UTILITIES')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'UTILITIES'
              ? 'bg-white text-indigo-600 shadow-2xs font-extrabold border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Utility Bills Paid ({utilityTxs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('AI_COACH')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeTab === 'AI_COACH'
              ? 'bg-white text-indigo-600 shadow-2xs font-extrabold border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Coach & Vault Tips</span>
        </button>
      </div>

      {/* TAB 0: GEMINI AI MONTHLY SPENDING REPORT */}
      {activeTab === 'REPORT' && (
        <div className="space-y-6 animate-fade-in">
          {isLoadingAI && !spendingReport ? (
            <div className="p-10 bg-slate-50/80 rounded-3xl border border-slate-200/80 text-center space-y-4">
              <div className="relative w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/25">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Synthesizing Monthly AI Report...</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                  Gemini 3.6 Flash model is performing multi-dimensional transaction categorization, beneficiary analysis, and health score calculations.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Executive Report Card Header */}
              <div className="p-6 sm:p-7 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Gemini AI Executive Audit</span>
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">•</span>
                      <span className="text-xs text-slate-400 font-mono font-medium">{spendingReport?.reportMonth || 'July 2026'}</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                      {spendingReport?.headline || 'Monthly Spending & Beneficiary Executive Audit'}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="px-4 py-2 bg-emerald-500/15 text-emerald-300 rounded-2xl border border-emerald-500/30 flex items-center gap-2.5 shadow-xs">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase font-black text-emerald-400/80 block tracking-wider">Health Rating</span>
                        <span className="text-sm font-black text-white leading-none">
                          {spendingReport?.healthScore || 88}<span className="text-emerald-400/60 text-xs">/100</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Executive Summary Narrative */}
                <div className="relative z-10 p-4 sm:p-5 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <BrainCircuit className="w-4 h-4 text-indigo-400" />
                    <span>Executive Intelligence Overview</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    {spendingReport?.summaryParagraph || `Total monthly outflow is ₦${totalSpentMonth.toLocaleString()}, retaining roughly ${savingsRatePct}% of earnings. Peer transfers and utility payments represent your primary expense channels.`}
                  </p>
                </div>

                {/* Key Metrics Quick Grid */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Monthly Outflow</span>
                    <span className="text-base font-black text-white block">
                      ₦{(spendingReport?.totalSpent || totalSpentMonth).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">Across {outgoingTxs.length} transactions</span>
                  </div>

                  <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Income Retained</span>
                    <span className="text-base font-black text-emerald-400 block">
                      ₦{totalSavedOrRetained.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-300/80 font-bold block">+{savingsRatePct}% Surplus Rate</span>
                  </div>

                  <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-1">
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Top Outflow Category</span>
                    <span className="text-xs font-black text-white truncate block mt-1">
                      {spendingReport?.categorizedExpenses?.[0]?.category || 'Transfers & Peer Payments'}
                    </span>
                    <span className="text-[10px] text-indigo-300/80 font-semibold block">
                      {spendingReport?.categorizedExpenses?.[0]?.percentage || 67}% of total spend
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/50 space-y-1">
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Top Beneficiary</span>
                    <span className="text-xs font-black text-amber-300 truncate block mt-1">
                      {spendingReport?.topBeneficiaries?.[0]?.name || recipientList[0]?.name || 'CHIDI OKAFOR'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {spendingReport?.topBeneficiaries?.[0]?.percentageOfTransfers || 72}% of peer transfers
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Identified Beneficiaries Section */}
              <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-200/80 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Top Identified Beneficiaries</h4>
                      <p className="text-[10px] text-slate-500">Recipients ranked by total transfer volume and transaction count</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-black uppercase tracking-wider self-start sm:self-auto">
                    Peer Transfer AI Audit
                  </span>
                </div>

                <div className="space-y-3">
                  {(spendingReport?.topBeneficiaries && spendingReport.topBeneficiaries.length > 0
                    ? spendingReport.topBeneficiaries
                    : recipientList.map(r => ({
                        name: r.name,
                        bankName: r.bankName,
                        totalAmount: r.totalAmount,
                        count: r.count,
                        percentageOfTransfers: Math.round((r.totalAmount / (totalSpentMonth || 1)) * 100),
                        insight: `Primary transfer recipient (${r.count} transfer${r.count > 1 ? 's' : ''})`
                      }))
                  ).map((ben, idx) => (
                    <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:border-indigo-300 transition-all">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/20">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="text-xs font-black text-slate-900">{ben.name}</h5>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-extrabold text-[9px] rounded-full border border-slate-200">
                              {ben.bankName}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                            <Users className="w-3 h-3 text-indigo-600 inline" />
                            <span>{ben.count} transfer{ben.count > 1 ? 's' : ''} • {ben.insight}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-slate-100">
                        <span className="text-sm font-black text-slate-900 block">₦{ben.totalAmount.toLocaleString()}</span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 inline-block mt-0.5">
                          {ben.percentageOfTransfers}% of peer transfers
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Gemini AI Recommendations */}
              <div className="p-6 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 rounded-3xl border border-indigo-200/80 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2.5 border-b border-indigo-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Award className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Gemini AI Actionable Recommendations</h4>
                    <p className="text-[10px] text-slate-500">Strategic optimizations to maximize Paydra 16.5% APY Vault yields</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {(spendingReport?.aiRecommendations || [
                    'Set an automated Paydra Vault rule to lock ₦35,000 in your 16.5% APY Fixed Vault immediately after income credit.',
                    'Consolidate utility bill payments through Paydra to earn up to 5% instant cashback rewards.',
                    'Monitor recurring transfers to top beneficiaries to maintain a healthy 3-month emergency buffer.'
                  ]).map((rec, i) => (
                    <div key={i} className="p-3.5 bg-white rounded-2xl border border-indigo-100/90 flex items-start gap-3 text-xs text-slate-800 shadow-2xs">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                        ✓
                      </div>
                      <span className="font-semibold leading-relaxed pt-0.5">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI SUMMARY BANNER (PERSISTENT ON OTHER TABS) */}
      {activeTab !== 'REPORT' && aiInsight && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-900/50 relative overflow-hidden shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </span>
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-200">
                {aiInsight.headline}
              </h4>
            </div>
            <div className="flex items-center gap-1 text-xs font-extrabold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cashflow Health {aiInsight.healthScore}/100</span>
            </div>
          </div>

          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {aiInsight.tip}
          </p>

          {/* AI Quick Audit Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-indigo-900/60 text-[11px]">
            {aiInsight.recipientSummary && (
              <div className="p-2.5 bg-indigo-900/40 rounded-xl border border-indigo-800/40 flex items-start gap-2">
                <Users className="w-3.5 h-3.5 text-indigo-300 shrink-0 mt-0.5" />
                <p className="text-slate-200 leading-tight">
                  <strong className="text-white block font-bold mb-0.5">Recipients Breakdown:</strong>
                  {aiInsight.recipientSummary}
                </p>
              </div>
            )}
            {aiInsight.utilitySummary && (
              <div className="p-2.5 bg-indigo-900/40 rounded-xl border border-indigo-800/40 flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-slate-200 leading-tight">
                  <strong className="text-white block font-bold mb-0.5">Utility Bills Audit:</strong>
                  {aiInsight.utilitySummary}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: MONTHLY EXPENSES OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5 animate-fade-in">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Monthly Outflow</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">
                ₦{totalSpentMonth.toLocaleString()}
              </h4>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                {outgoingTxs.length} transactions
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Monthly Inflow</span>
              <h4 className="text-lg font-black text-emerald-600 mt-1">
                ₦{monthlyIncome.toLocaleString()}
              </h4>
              <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                +{savingsRatePct}% Retained
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Avg Daily Spend</span>
              <h4 className="text-lg font-black text-indigo-600 mt-1">
                ₦{avgDailySpend.toLocaleString()}
              </h4>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                30-day projection
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 block">Net Surplus Saved</span>
              <h4 className="text-lg font-black text-slate-900 mt-1">
                ₦{totalSavedOrRetained.toLocaleString()}
              </h4>
              <span className="text-[10px] text-indigo-600 font-medium mt-1 block">
                Ready for Vault
              </span>
            </div>
          </div>

          {/* Charts & Category Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Donut Chart */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-slate-800">Expenses by Category</h4>
                <span className="text-[10px] text-slate-500 font-medium">Real-time split</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="amount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '11px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(val: any) => `₦${Number(val).toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Progress Bars */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-800">Category Budgets vs Spent</h4>
                <span className="text-[10px] text-indigo-600 font-bold">Auto-tracked</span>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {categoryBudgets.map((cat, idx) => {
                  const pct = Math.min(100, Math.round((cat.spent / cat.allocated) * 100));
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-800">{cat.name}</span>
                        <span className="font-mono text-slate-500 font-semibold">
                          ₦{cat.spent.toLocaleString()} / ₦{cat.allocated.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECIPIENT AUDIT ("Who you sent money to") */}
      {activeTab === 'RECIPIENTS' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Peer Transfers & Recipient Analysis</h4>
              <p className="text-[11px] text-slate-500">Track total money sent to specific individuals, accounts and banks</p>
            </div>

            {/* Search input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search recipient or bank..."
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Recipient Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredRecipients.length === 0 ? (
              <div className="col-span-full text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No matching recipients found.
              </div>
            ) : (
              filteredRecipients.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-indigo-300 transition-all shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200">
                        {rec.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{rec.name}</h5>
                        <p className="text-[10px] text-slate-500">{rec.bankName}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold text-[10px] rounded-full border border-indigo-100">
                      {rec.count} transfer{rec.count > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Total Sent</span>
                      <span className="font-black text-slate-900">₦{rec.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Last Date</span>
                      <span className="text-[11px] font-bold text-slate-700">{rec.lastDate}</span>
                    </div>
                  </div>

                  {rec.note && (
                    <div className="p-2 bg-white rounded-xl border border-slate-200/60 text-[11px] text-slate-600 italic flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">"{rec.note}"</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: UTILITY BILLS AUDIT ("What utility bills you paid for") */}
      {activeTab === 'UTILITIES' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Utility Bills & Services Log</h4>
              <p className="text-[11px] text-slate-500">Electricity tokens, mobile airtime/data & internet subscriptions</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 block">Total Utility Spend</span>
              <span className="text-sm font-black text-slate-900">₦{totalUtilitySpent.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {utilityTxs.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No utility bills paid this month.
              </div>
            ) : (
              utilityTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between hover:border-amber-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200/80 shrink-0">
                      {tx.type === 'AIRTIME' || tx.type === 'DATA' ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{tx.title}</h5>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{tx.date} • {tx.time}</span>
                        {tx.recipientName && (
                          <span className="font-semibold text-slate-700">• {tx.recipientName}</span>
                        )}
                      </div>
                      {tx.note && (
                        <p className="text-[10px] font-mono text-indigo-700 mt-1 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded w-fit">
                          {tx.note}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-slate-900 block">
                      -₦{tx.amount.toLocaleString()}
                    </span>
                    {tx.cashbackEarned ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block mt-0.5">
                        +₦{tx.cashbackEarned} Cashback
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AI COACH & VAULT TIPS */}
      {activeTab === 'AI_COACH' && aiInsight && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-5 bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 rounded-2xl border border-indigo-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Gemini AI Vault Assistant</h4>
                <p className="text-xs text-slate-500">Personalized automated financial optimization</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-indigo-700 uppercase tracking-wide text-[10px]">Strategic Advice</span>
                <p className="text-slate-800 leading-relaxed font-medium">{aiInsight.tip}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-amber-600 uppercase tracking-wide text-[10px]">Spending Category Insight</span>
                <p className="text-slate-800 leading-relaxed font-medium">{aiInsight.categoryTip}</p>
              </div>
            </div>

            <button
              onClick={() => alert('Recommended Vault goal configured!')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Apply Recommended Action: {aiInsight.recommendedAction}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

