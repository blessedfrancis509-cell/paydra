import React from 'react';
import { UserProfile, Currency } from '../types';
import { Bell, Search, ShieldCheck, Copy, Check, Smartphone, Monitor, User } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  selectedCurrency: Currency;
  onCurrencyChange: (c: Currency) => void;
  unreadNotificationCount: number;
  onOpenNotifications: () => void;
  onOpenSearch: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  selectedCurrency,
  onCurrencyChange,
  unreadNotificationCount,
  onOpenNotifications,
  onOpenSearch,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenProfile,
}) => {
  const [copied, setCopied] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 transition-all text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: User Greetings (Clickable to open profile) */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 text-left hover:opacity-90 transition-opacity cursor-pointer group"
          title="Open Profile Page"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500">Welcome back</span>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-1">
              <span>{user.name}</span>
            </h1>
          </div>
        </button>

        {/* Right Actions: Notifications */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl border border-slate-200 transition-colors shadow-2xs cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
