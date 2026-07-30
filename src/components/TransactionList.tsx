import React, { useState } from 'react';
import { Transaction } from '../types';
import { Search, Filter, Send, ArrowDownLeft, Zap, CreditCard, Sparkles, Receipt, ArrowUpRight, Download } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onOpenSendMoney: () => void;
  limit?: number;
  onViewAll?: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onSelectTransaction,
  onOpenSendMoney,
  limit,
  onViewAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'TRANSFER' | 'INFLOW' | 'BILL' | 'CASHBACK'>('ALL');

  // Filter logic
  const filtered = transactions.filter((tx) => {
    const matchesQuery =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.recipientName && tx.recipientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    if (filterType === 'ALL') return true;
    if (filterType === 'TRANSFER') return tx.type === 'TRANSFER' || tx.type === 'CARD_PAYMENT';
    if (filterType === 'INFLOW') return tx.type === 'INFLOW';
    if (filterType === 'BILL') return tx.type === 'BILL' || tx.type === 'AIRTIME';
    if (filterType === 'CASHBACK') return tx.type === 'CASHBACK';
    return true;
  });

  const getTxIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'INFLOW':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600" />;
      case 'TRANSFER':
        return <Send className="w-4 h-4 text-indigo-600" />;
      case 'BILL':
      case 'AIRTIME':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'CARD_PAYMENT':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      case 'CASHBACK':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      default:
        return <ArrowUpRight className="w-4 h-4 text-slate-500" />;
    }
  };

  // Apply limit if specified
  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs space-y-3 sm:space-y-4">
      {/* Top Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight">Recent Transactions</h3>
          <p className="text-[11px] text-slate-500 hidden sm:block">Tap any transaction to view official receipt</p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-0.5"
          >
            <span>See All</span>
            <span className="text-sm">&rsaquo;</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-0.5">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-0.5">
          {(['ALL', 'TRANSFER', 'INFLOW', 'BILL', 'CASHBACK'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                filterType === tab
                  ? 'bg-slate-900 text-white font-bold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All' : tab.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Compact Search Input */}
        <div className="relative w-full sm:w-52">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-100/80 border border-transparent focus:border-slate-300 focus:bg-white rounded-xl text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Clean Divided Transactions List */}
      <div className="divide-y divide-slate-100 pt-1">
        {displayed.length === 0 ? (
          <div className="py-10 text-center text-slate-400 space-y-1.5">
            <Receipt className="w-7 h-7 mx-auto opacity-40 text-slate-400" />
            <p className="text-xs font-medium">No transactions found matching your filter.</p>
          </div>
        ) : (
          displayed.map((tx) => {
            const isCredit = tx.type === 'INFLOW' || tx.type === 'CASHBACK';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="py-3 px-1 -mx-1 flex items-center justify-between group cursor-pointer hover:bg-slate-50/80 active:bg-slate-100 rounded-2xl transition-colors"
              >
                {/* Left: Minimal Icon & Details */}
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 transition-transform group-hover:scale-105 ${
                    isCredit
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/80'
                      : 'bg-slate-100 text-slate-700 border border-slate-200/60'
                  }`}>
                    {getTxIcon(tx.type)}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {tx.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {tx.date} • {tx.time}
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Status */}
                <div className="text-right shrink-0">
                  <p className={`text-xs sm:text-sm font-black tracking-tight ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5 capitalize">
                    {tx.status.toLowerCase()}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
