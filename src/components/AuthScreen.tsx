import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  ShieldCheck,
  Zap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Send,
  UserCheck,
  AlertCircle,
  Fingerprint,
  Mail,
  User,
} from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  defaultUser: UserProfile;
  registeredUsers: UserProfile[];
  onRegisterUser: (newUser: UserProfile) => void;
}

const FEATURES = [
  {
    icon: Send,
    title: 'Zero-Fee Transfers',
    desc: 'Send money to any bank in Nigeria with zero charges',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: '15.5% APY Vaults',
    desc: 'Earn daily interest on your savings automatically',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: CreditCard,
    title: 'Virtual Cards',
    desc: 'Create instant NGN/USD cards with cashback rewards',
    color: 'from-indigo-400 to-purple-500',
  },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  defaultUser,
  registeredUsers,
  onRegisterUser,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  const [loginIdentifier, setLoginIdentifier] = useState(defaultUser.email);
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPaydraTag, setSignupPaydraTag] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState('');

  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSignupName(val);
    if (val && !signupPaydraTag) {
      setSignupPaydraTag(`@${val.toLowerCase().replace(/\s+/g, '')}`);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const found = registeredUsers.find(
        (u) =>
          u.email.toLowerCase() === loginIdentifier.toLowerCase() ||
          u.phone === loginIdentifier ||
          u.veloTag.toLowerCase() === loginIdentifier.toLowerCase()
      );

      if (found) {
        onLoginSuccess(found);
      } else if (
        loginIdentifier.toLowerCase() === defaultUser.email.toLowerCase() ||
        loginIdentifier === defaultUser.phone ||
        loginIdentifier === 'demo'
      ) {
        onLoginSuccess(defaultUser);
      } else {
        if (loginIdentifier.trim().length > 0) {
          const customUser: UserProfile = {
            ...defaultUser,
            name: loginIdentifier.includes('@')
              ? loginIdentifier.split('@')[0].toUpperCase()
              : loginIdentifier,
            email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@paydra.app`,
          };
          onLoginSuccess(customUser);
        } else {
          setLoginError('Please enter a valid Email Address or Phone Number');
        }
      }
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(defaultUser);
    }, 400);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim()) return setSignupError('Please enter your full legal name');
    if (!signupEmail.trim() || !signupEmail.includes('@'))
      return setSignupError('Please enter a valid email address');
    if (!signupPhone.trim()) return setSignupError('Please enter a valid phone number');
    if (!signupPassword || signupPassword.length < 4)
      return setSignupError('Security PIN must be at least 4 characters');
    if (signupPassword !== signupConfirmPassword)
      return setSignupError('Passwords do not match');
    if (!agreeTerms) return setSignupError('You must agree to the Terms of Service');

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const generatedAcc = `012${Math.floor(1000000 + Math.random() * 9000000)}`;
      const newTag = signupPaydraTag.startsWith('@') ? signupPaydraTag : `@${signupPaydraTag}`;

      const newUser: UserProfile = {
        name: signupName,
        tag: newTag,
        email: signupEmail,
        phone: signupPhone,
        accountNumber: generatedAcc,
        bankName: 'Paydra Bank',
        tierLevel: 2,
        bvnVerified: true,
        kycStatus: 'VERIFIED',
        dailyTransferLimit: 5000000,
        dailySpent: 0,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        veloTag: newTag,
      };

      onRegisterUser(newUser);
      onLoginSuccess(newUser);
    }, 700);
  };

  const currentFeature = FEATURES[activeFeature];
  const FeatIcon = currentFeature.icon;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
      </div>

      <header className="relative z-10 max-w-md w-full mx-auto px-5 pt-8 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="42" height="42" rx="10" fill="url(#p-logo)" />
            <path d="M13 30V12H21.5C24.8 12 27.5 14.7 27.5 18C27.5 21.3 24.8 24 21.5 24H17V30H13ZM17 20H21C22.1 20 23 19.1 23 18C23 16.9 22.1 16 21 16H17V20Z" fill="white" />
            <defs>
              <linearGradient id="p-logo" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                <stop stop-color="#6366F1" />
                <stop offset="1" stop-color="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white">PAYDRA</h1>
            <p className="text-[10px] text-indigo-300/70 font-medium -mt-0.5">Digital Banking</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-indigo-200">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>CBN Licensed</span>
        </div>
      </header>

      <main className="relative z-10 max-w-md w-full mx-auto px-5 py-4 flex-1 flex flex-col gap-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/60 border border-white/10 p-4 min-h-[100px]">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${currentFeature.color} text-slate-900 shrink-0`}>
              <FeatIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-white">{currentFeature.title}</h3>
              <p className="text-xs text-slate-300 mt-0.5">{currentFeature.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            {FEATURES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFeature(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeFeature ? 'w-6 bg-indigo-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-xl">
          <div className="flex p-1 bg-slate-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => { setMode('LOGIN'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                mode === 'LOGIN'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setMode('SIGNUP'); setSignupError(''); }}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                mode === 'SIGNUP'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {mode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email or Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="tunde@paydra.app"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => alert('Reset link sent to your email!')}
                    className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter PIN"
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 accent-indigo-600"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => alert('Fingerprint verified!')}
                  className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  Biometrics
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-xs border border-indigo-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Demo Login (Tunde Adebayo)
                </button>
              </div>
            </form>
          )}

          {mode === 'SIGNUP' && (
            <form onSubmit={handleSignupSubmit} className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={signupName}
                    onChange={handleNameChange}
                    placeholder="Tunde Adebayo"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Phone</label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">@PaydraTag</label>
                <input
                  type="text"
                  value={signupPaydraTag}
                  onChange={(e) => setSignupPaydraTag(e.target.value)}
                  placeholder="@tundex"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Create PIN</label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="****"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Confirm PIN</label>
                  <input
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="****"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {signupError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{signupError}</span>
                </div>
              )}

              <label className="flex items-start gap-2 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 text-indigo-600 rounded border-slate-300 accent-indigo-600"
                />
                <span className="text-[10px] text-slate-500 leading-tight">
                  I agree to the <span className="text-indigo-600 font-semibold">Terms</span> & <span className="text-indigo-600 font-semibold">Privacy Policy</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      <footer className="relative z-10 max-w-md w-full mx-auto px-5 pb-6 pt-1 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="text-[10px] font-medium text-slate-400">NDIC Insured • Licensed by CBN</span>
        </div>
        <p className="text-[9px] text-slate-500">&copy; {new Date().getFullYear()} Paydra Bank. All rights reserved.</p>
      </footer>
    </div>
  );
};
