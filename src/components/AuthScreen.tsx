import React, { useState, useEffect, useCallback } from 'react';
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
  ChevronRight,
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
    gradient: 'from-amber-400 to-orange-500',
    bg: 'from-amber-900/40 via-orange-900/20 to-transparent',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&auto=format&fit=crop',
  },
  {
    icon: TrendingUp,
    title: '15.5% APY Vaults',
    desc: 'Earn daily interest on your savings automatically',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'from-emerald-900/40 via-teal-900/20 to-transparent',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop',
  },
  {
    icon: CreditCard,
    title: 'Virtual Cards',
    desc: 'Create instant NGN/USD cards with cashback rewards',
    gradient: 'from-indigo-400 to-purple-500',
    bg: 'from-indigo-900/40 via-purple-900/20 to-transparent',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop',
  },
];

const Logo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="12" fill="url(#plogo)" />
    <path d="M15 34V14H24.5C28 14 31 16.7 31 20.5C31 24.3 28 27 24.5 27H19.5V34H15ZM19.5 22.5H24C25.4 22.5 26.5 21.4 26.5 20C26.5 18.6 25.4 17.5 24 17.5H19.5V22.5Z" fill="white" />
    <defs>
      <linearGradient id="plogo" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#8B5CF6" />
      </linearGradient>
    </defs>
  </svg>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  defaultUser,
  registeredUsers,
  onRegisterUser,
}) => {
  const [phase, setPhase] = useState<'SPLASH' | 'AUTH'>('SPLASH');
  const [featureIndex, setFeatureIndex] = useState(0);
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

  useEffect(() => {
    if (phase !== 'SPLASH') return;
    const timer = setInterval(() => {
      setFeatureIndex((prev) => {
        if (prev >= FEATURES.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [phase]);

  const enterAuth = useCallback(() => {
    setPhase('AUTH');
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

  const f = FEATURES[featureIndex];
  const FIcon = f.icon;

  if (phase === 'SPLASH') {
    const bgStyle = {
      backgroundImage: `
        linear-gradient(to top, rgb(2 6 23 / 0.85), rgb(2 6 23 / 0.4) 40%, rgb(2 6 23 / 0.3)),
        linear-gradient(to bottom, ${featureIndex === 0 ? 'rgb(217 119 6 / 0.35)' : featureIndex === 1 ? 'rgb(5 150 105 / 0.35)' : 'rgb(99 102 241 / 0.35)'}),
        url(${f.image})
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };

    return (
      <div className="min-h-screen w-full bg-slate-950 text-white flex flex-col relative overflow-hidden font-sans">
        <div className="absolute inset-0 transition-all duration-700" style={bgStyle} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10" />

        <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-6">
          <div className="pt-10 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-xl font-black tracking-tight text-white">PAYDRA</h1>
                <p className="text-[10px] text-indigo-300/60 font-medium -mt-0.5">Digital Banking</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-indigo-200">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>CBN Licensed</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center -mt-12">
            <div className="relative" key={featureIndex}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${f.gradient} text-slate-900 shadow-lg`}>
                  <FIcon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
                  Feature {featureIndex + 1} of 3
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-3">{f.title}</h2>
              <p className="text-base text-slate-300 leading-relaxed max-w-sm">{f.desc}</p>
            </div>

            <div className="flex items-center gap-2 mt-8">
              {FEATURES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setFeatureIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === featureIndex ? 'w-8 bg-indigo-400' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <div className="mt-10">
              {featureIndex < FEATURES.length - 1 ? (
                <button
                  onClick={() => setFeatureIndex((p) => Math.min(p + 1, FEATURES.length - 1))}
                  className="w-full py-3.5 bg-white text-slate-900 font-bold rounded-xl text-sm hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={enterAuth}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={enterAuth}
                className="w-full mt-2 py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Skip intro
              </button>
            </div>
          </div>

          <footer className="py-6 text-center">
            <p className="text-[9px] text-slate-500">&copy; {new Date().getFullYear()} Paydra Bank</p>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
      </div>

      <header className="relative z-10 max-w-md w-full mx-auto px-5 pt-8 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email or Phone</label>
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
