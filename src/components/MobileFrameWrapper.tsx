import React from 'react';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

interface MobileFrameWrapperProps {
  isMobileFrame: boolean;
  children: React.ReactNode;
  onExitMobileFrame: () => void;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({
  isMobileFrame,
  children,
  onExitMobileFrame,
}) => {
  if (!isMobileFrame) {
    return <div className="w-full min-h-screen bg-slate-950 text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-6 transition-all">
      {/* Top Controller Bar */}
      <div className="mb-4 flex items-center justify-between w-full max-w-[420px] bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Paydra iOS App View</span>
        </div>
        <button
          onClick={onExitMobileFrame}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
        >
          Exit Frame Mode
        </button>
      </div>

      {/* iPhone 16 Pro Frame Shell */}
      <div className="relative w-full max-w-[410px] h-[840px] bg-slate-950 rounded-[50px] p-3 shadow-2xl shadow-emerald-950/40 border-[6px] border-slate-800 ring-1 ring-slate-700/50 overflow-hidden flex flex-col">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-28 h-7 bg-black rounded-full flex items-center justify-between px-2 shadow-inner border border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Status Bar */}
        <div className="pt-2 px-6 pb-2 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-40 bg-slate-950">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Phone Inner Content Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar rounded-[38px] bg-slate-950">
          {children}
        </div>

        {/* Bottom Home Indicator Line */}
        <div className="w-full py-2 flex items-center justify-center bg-slate-950">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
