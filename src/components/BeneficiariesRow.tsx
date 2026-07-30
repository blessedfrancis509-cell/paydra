import React from 'react';
import { Beneficiary } from '../types';
import { Plus, User, ArrowRight } from 'lucide-react';

interface BeneficiariesRowProps {
  beneficiaries: Beneficiary[];
  onSelectBeneficiary: (b: Beneficiary) => void;
  onAddBeneficiary: () => void;
}

export const BeneficiariesRow: React.FC<BeneficiariesRowProps> = ({
  beneficiaries,
  onSelectBeneficiary,
  onAddBeneficiary,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4.5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Beneficiaries
        </h3>
        <button
          onClick={onAddBeneficiary}
          className="text-[11px] sm:text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-0.5 transition-colors"
        >
          <span>Manage All</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5">
        {/* Add New Beneficiary Avatar */}
        <button
          onClick={onAddBeneficiary}
          className="flex-shrink-0 flex flex-col items-center gap-1 group"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 group-hover:border-indigo-600 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 group-hover:text-indigo-600">New</span>
        </button>

        {/* Existing Beneficiaries list */}
        {beneficiaries.map((b) => (
          <button
            key={b.id}
            onClick={() => onSelectBeneficiary(b)}
            className="flex-shrink-0 flex flex-col items-center gap-1 group max-w-[65px] sm:max-w-[70px]"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full p-[2px] bg-gradient-to-tr from-slate-200 via-indigo-500/30 to-indigo-600 group-hover:from-indigo-600 group-hover:to-indigo-700 transition-all shadow-2xs">
              {b.avatarUrl ? (
                <img
                  src={b.avatarUrl}
                  alt={b.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                  {b.name.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full border border-indigo-200 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                ✓
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 group-hover:text-indigo-600 truncate w-full text-center">
              {b.name.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
