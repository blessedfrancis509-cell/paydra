import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Key, CheckCircle, Smartphone, AlertCircle } from 'lucide-react';

interface SecurityQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityQuestionsModal: React.FC<SecurityQuestionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [question1, setQuestion1] = useState("What was the name of your primary school?");
  const [answer1, setAnswer1] = useState('St. Gregory College');
  const [question2, setQuestion2] = useState("What is your mother's maiden name?");
  const [answer2, setAnswer2] = useState('Okonkwo');
  const [pin, setPin] = useState('4921');
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Security & Account Protection</h2>
              <p className="text-xs text-slate-500">Manage security questions & 2FA transaction PIN</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Security Settings Updated</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your security questions, PIN, and biometric preferences have been saved securely.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            {/* Status Banner */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Protection Level: High (Tier 3 Verified)</p>
                <p className="text-emerald-700 text-[11px]">2-Factor Authentication & Biometrics active</p>
              </div>
            </div>

            {/* Question 1 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>Security Question 1</span>
              </label>
              <select
                value={question1}
                onChange={(e) => setQuestion1(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>What was the name of your primary school?</option>
                <option>In what city were your parents born?</option>
                <option>What was your childhood nickname?</option>
              </select>
              <input
                type="text"
                value={answer1}
                onChange={(e) => setAnswer1(e.target.value)}
                placeholder="Your Answer"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Question 2 */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-indigo-600" />
                <span>Security Question 2</span>
              </label>
              <select
                value={question2}
                onChange={(e) => setQuestion2(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>What is your mother's maiden name?</option>
                <option>What was the make of your first car?</option>
                <option>What is the name of your favorite pet?</option>
              </select>
              <input
                type="text"
                value={answer2}
                onChange={(e) => setAnswer2(e.target.value)}
                placeholder="Your Answer"
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* 4-Digit Transaction PIN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>4-Digit Transaction PIN</span>
                </span>
                <span className="text-[10px] text-slate-400">Required for transfers</span>
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono tracking-widest font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Toggle Biometrics */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Biometric / FaceID Login</p>
                  <p className="text-[10px] text-slate-500">Use fingerprint or FaceID for fast access</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  biometricsEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                    biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all active:scale-98"
            >
              Save Security Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
