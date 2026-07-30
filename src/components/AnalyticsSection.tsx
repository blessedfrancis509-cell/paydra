import React, { useState, useEffect } from 'react';
import { Transaction, CategoryBudget, MonthlySpendingReport } from '../types';
import {
  Sparkles,
  ShieldCheck,
  RefreshCw,
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
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const [spendingReport, setSpendingReport] = useState<MonthlySpendingReport | null>(null);

  // Monthly Expenses Calculation
  const outgoingTxs = transactions.filter(t => t.type !== 'INFLOW' && t.type !== 'CASHBACK');
  const totalSpentMonth = outgoingTxs.reduce((acc, t) => acc + t.amount, 0);
  const monthlyIncome = 950000; // Estimated income
  const totalSavedOrRetained = Math.max(0, monthlyIncome - totalSpentMonth);
  const savingsRatePct = Math.round((totalSavedOrRetained / monthlyIncome) * 100);

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

  // Utility Bills
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
      await fetchAIMonthlySpendingReport();
    } catch (e) {
      console.error(e);
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

      {/* MONTHLY SPENDING REPORT */}
      <div className="space-y-5 animate-fade-in">
        {isLoadingAI && !spendingReport ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-5">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-2xl bg-indigo-600 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl bg-indigo-600 flex items-center justify-center">
                <RefreshCw className="w-7 h-7 text-white animate-spin" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900">Generating Your Monthly Report</h4>
              <p className="text-xs text-slate-400 mt-1">Analyzing transactions, categorizing expenses, and computing financial health metrics...</p>
            </div>
            <div className="max-w-[260px] mx-auto space-y-2">
              {['Scanning transaction history', 'Categorizing expenses', 'Analyzing beneficiary patterns', 'Calculating health score'].map((step, i) => (
                <div key={step} className="flex items-center gap-2.5 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full ${i <= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                  <span className={`font-medium ${i <= 1 ? 'text-slate-700' : 'text-slate-400'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Executive Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-7 text-white relative">
                <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider bg-indigo-500/15 px-2 py-0.5 rounded-full border border-indigo-500/25">
                            Monthly Executive Report
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {spendingReport?.reportMonth || 'July 2026'}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                          {spendingReport?.headline || 'Monthly Spending & Beneficiary Executive Audit'}
                        </h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="px-3 py-1.5 bg-emerald-400/10 rounded-xl border border-emerald-400/20 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-black text-white">
                          {spendingReport?.healthScore || 88}<span className="text-emerald-400/50 text-[10px]">/100</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                      {spendingReport?.summaryParagraph || `Total monthly outflow is ₦${totalSpentMonth.toLocaleString()}, retaining roughly ${savingsRatePct}% of earnings. Peer transfers and utility payments represent your primary expense channels.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Outflow</span>
                      <span className="text-sm font-black text-white block">₦{(spendingReport?.totalSpent || totalSpentMonth).toLocaleString()}</span>
                      <span className="text-[9px] text-slate-500">{outgoingTxs.length} transactions</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Retained</span>
                      <span className="text-sm font-black text-emerald-400 block">₦{totalSavedOrRetained.toLocaleString()}</span>
                      <span className="text-[9px] text-emerald-300/70">{savingsRatePct}% surplus</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                      <span className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider">Top Category</span>
                      <span className="text-xs font-black text-white block truncate">{spendingReport?.categorizedExpenses?.[0]?.category || 'Transfers'}</span>
                      <span className="text-[9px] text-indigo-300/70">{spendingReport?.categorizedExpenses?.[0]?.percentage || 67}% of spend</span>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-0.5">
                      <span className="text-[9px] font-bold text-amber-300 uppercase tracking-wider">Top Recipient</span>
                      <span className="text-xs font-black text-amber-300 block truncate">{spendingReport?.topBeneficiaries?.[0]?.name || recipientList[0]?.name || 'CHIDI OKAFOR'}</span>
                      <span className="text-[9px] text-amber-200/60">{spendingReport?.topBeneficiaries?.[0]?.percentageOfTransfers || 72}% of transfers</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown Mini-Section */}
              <div className="p-5 sm:p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Spending Breakdown by Category</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chartData.map((item) => (
                    <div key={item.name} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ backgroundColor: item.color }}>
                        {item.name.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-slate-800 truncate">{item.name}</span>
                          <span className="text-slate-500 font-mono font-semibold">₦{item.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, Math.round((item.amount / totalSpentMonth) * 100))}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Utility Bills Section */}
              {utilityTxs.length > 0 && (
                <div className="p-5 sm:p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Utility Bills & Services</h4>
                    </div>
                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                      ₦{totalUtilitySpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
                    {utilityTxs.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                            tx.type === 'AIRTIME' || tx.type === 'DATA'
                              ? 'bg-amber-50 text-amber-600 border border-amber-200'
                              : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                          }`}>
                            {tx.type === 'AIRTIME' || tx.type === 'DATA' ? (
                              <span className="text-[10px]">📱</span>
                            ) : (
                              <span className="text-[10px]">⚡</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block truncate">{tx.title}</span>
                            <span className="text-[10px] text-slate-400">{tx.date} &bull; {tx.time}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span className="text-xs font-black text-slate-900 block">-₦{tx.amount.toLocaleString()}</span>
                          {tx.cashbackEarned && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 inline-block mt-0.5">
                              +₦{tx.cashbackEarned} Cashback
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Top Beneficiaries Section */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Top Beneficiaries</h4>
                    <p className="text-[10px] text-slate-400">Ranked by transfer volume</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">AI Ranked</span>
              </div>

              <div className="space-y-2">
                {(spendingReport?.topBeneficiaries && spendingReport.topBeneficiaries.length > 0
                  ? spendingReport.topBeneficiaries
                  : recipientList.map(r => ({
                      name: r.name,
                      bankName: r.bankName,
                      totalAmount: r.totalAmount,
                      count: r.count,
                      percentageOfTransfers: Math.round((r.totalAmount / (totalSpentMonth || 1)) * 100),
                      insight: `${r.count} transfer${r.count > 1 ? 's' : ''}`
                    }))
                ).map((ben, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 block truncate">{ben.name}</span>
                        <span className="text-[10px] text-slate-400">{ben.bankName} &bull; {ben.insight}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="text-sm font-black text-slate-900 block">₦{ben.totalAmount.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-indigo-600">{ben.percentageOfTransfers}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">AI Recommendations</h4>
                  <p className="text-[10px] text-slate-400">Optimization suggestions for your finances</p>
                </div>
              </div>

              <div className="space-y-2">
                {(spendingReport?.aiRecommendations || [
                  'Set an automated Paydra Vault rule to lock ₦35,000 in your 16.5% APY Fixed Vault immediately after income credit.',
                  'Consolidate utility bill payments through Paydra to earn up to 5% instant cashback rewards.',
                  'Monitor recurring transfers to top beneficiaries to maintain a healthy 3-month emergency buffer.'
                ]).map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-black">
                      ✓
                    </div>
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

