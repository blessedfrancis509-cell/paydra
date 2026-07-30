import React from 'react';
import { NotificationItem } from '../types';
import { X, Bell, Check, ShieldCheck, Gift, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full p-5 shadow-2xl flex flex-col justify-between text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Notifications & Activity Feed</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar my-4 space-y-3 pr-1">
          {notifications.length === 0 ? (
            <p className="text-center text-slate-400 text-xs py-10">No new notifications.</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1 ${
                  n.read
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-indigo-50 border-indigo-200 text-slate-900 font-medium'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    {n.type === 'REWARD' && <Gift className="w-3.5 h-3.5 text-amber-500" />}
                    {n.type === 'CREDIT' && <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" />}
                    {n.type === 'DEBIT' && <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />}
                    {n.type === 'SECURITY' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />}
                    {n.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                </div>
                <p className="text-slate-500 text-[11px]">{n.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition-colors shadow-2xs"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
};
