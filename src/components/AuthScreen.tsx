import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  ShieldCheck,
  Zap,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CreditCard,
  Send,
  UserCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
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

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  defaultUser,
  registeredUsers,
  onRegisterUser,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState(defaultUser.email);
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPaydraTag, setSignupPaydraTag] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [signupError, setSignupError] = useState('');

  // 3-Way Bank Advert Carousel State
  const [activeAdSlide, setActiveAdSlide] = useState(0);

  const advertSlides = [
    {
      id: 'slide-1',
      tag: '⚡ INSTANT TRANSFERS',
      title: 'Zero Transfer Fees to Any Bank',
      description: 'Send money to all Nigerian banks in seconds with ₦0 fee and instant receipt generation.',
      badge: '₦0 Transfer Charge',
      icon: Send,
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'slide-2',
      tag: '📈 HIGH-YIELD VAULTS',
      title: 'Earn Up to 15.5% APY Savings',
      description: 'Automate your daily savings & lock target goals with daily interest payouts guaranteed.',
      badge: '15.5% APY Interest',
      icon: TrendingUp,
      color: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'slide-3',
      tag: '💳 SMART VIRTUAL CARDS',
      title: 'Global Payments & Bill Cashback',
      description: 'Create instant USD & NGN virtual cards with up to 3% cashback rewards on bill purchases.',
      badge: 'Instant Card Creation',
      icon: CreditCard,
      color: 'from-indigo-400 to-purple-500',
    },
  ];

  // Auto-advance advert slider every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAdSlide((prev) => (prev + 1) % advertSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Auto suggest PaydraTag when signup name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSignupName(val);
    if (val && !signupPaydraTag) {
      const suggested = `@${val.toLowerCase().replace(/\s+/g, '')}`;
      setSignupPaydraTag(suggested);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Check against registered users or default demo user
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
        // Fallback for user ease - if non-empty, log in as custom or default user
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
      return setSignupError('Security PIN/Password must be at least 4 characters');
    if (signupPassword !== signupConfirmPassword)
      return setSignupError('Passwords do not match');
    if (!agreeTerms) return setSignupError('You must agree to the Terms of Service to continue');

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Generate a new 10-digit account number
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
        avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
        veloTag: newTag,
      };

      onRegisterUser(newUser);
      onLoginSuccess(newUser);
    }, 700);
  };

  const currentSlide = advertSlides[activeAdSlide];
  const AdIcon = currentSlide.icon;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* BACKGROUND MOVING ANIMATED SHAPES & GEOMETRIC DESIGN SYSTEM */}
      {/* Moving Floating Gradient Glass Sphere */}
      <div className="absolute -right-12 -top-14 w-80 h-80 rounded-full bg-gradient-to-tr from-white/15 via-indigo-400/10 to-transparent border border-white/20 backdrop-blur-md animate-float-slow pointer-events-none shadow-2xl z-0" />

      {/* Counter-Floating Secondary Orb */}
      <div className="absolute -left-16 -bottom-16 w-72 h-72 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-800/30 border border-white/10 backdrop-blur-sm animate-float-reverse pointer-events-none z-0" />

      {/* Slowly Rotating Decorative Geometric Compass / Star Ring */}
      <div className="absolute right-10 top-1/4 w-64 h-64 rounded-full border border-white/10 border-dashed animate-spin-slow pointer-events-none z-0" />

      {/* Pulsating Glowing Ambient Lights */}
      <div className="absolute right-1/4 top-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none z-0" />
      <div className="absolute left-1/3 bottom-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow pointer-events-none z-0" />

      {/* TOP BRAND HEADER */}
      <header className="relative z-10 max-w-md w-full mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/40 border border-white/20">
            <Zap className="w-5 h-5 text-white fill-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>PAYDRA</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                BANK
              </span>
            </h1>
            <p className="text-[10px] text-indigo-200/80 font-medium">Digital Banking Redefined</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[10px] font-semibold text-indigo-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>CBN Licensed</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-3 flex-1 flex flex-col justify-center gap-4">
        {/* 3-WAY FEATURE ADVERT SHOWCASE CAROUSEL */}
        <div className="relative w-full rounded-3xl bg-gradient-to-br from-indigo-900/80 via-purple-950/80 to-slate-900/90 border border-white/15 p-4 sm:p-5 shadow-2xl backdrop-blur-xl overflow-hidden group">
          {/* Subtle inner ambient light */}
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-indigo-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{currentSlide.tag}</span>
            </span>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200">
              {currentSlide.badge}
            </span>
          </div>

          {/* Slide Content */}
          <div className="flex items-start gap-3 my-1 min-h-[64px]">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${currentSlide.color} text-slate-950 shadow-md shrink-0`}>
              <AdIcon className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-0.5 flex-1">
              <h3 className="text-sm font-bold text-white tracking-tight">{currentSlide.title}</h3>
              <p className="text-xs text-slate-300 leading-snug">{currentSlide.description}</p>
            </div>
          </div>

          {/* Carousel Indicators & Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
            <div className="flex items-center gap-1.5">
              {advertSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveAdSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activeAdSlide ? 'w-6 bg-indigo-400' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setActiveAdSlide((prev) => (prev === 0 ? advertSlides.length - 1 : prev - 1))
                }
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Previous Feature"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveAdSlide((prev) => (prev + 1) % advertSlides.length)}
                className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Next Feature"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AUTH FORM CARD (OPay Style Simple & Clean) */}
        <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-900 border border-slate-100">
          {/* SEGMENTED TAB SELECTOR: LOGIN VS SIGN UP */}
          <div className="p-1 bg-slate-100 rounded-2xl flex items-center mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('LOGIN');
                setLoginError('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                mode === 'LOGIN'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              Log In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('SIGNUP');
                setSignupError('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                mode === 'SIGNUP'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* MODE 1: LOG IN FORM */}
          {mode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="tunde@paydra.app or 08012345678"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Password / 4-Digit PIN</label>
                  <button
                    type="button"
                    onClick={() => alert('🔑 Reset link sent to your registered email/phone number!')}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-mono"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 accent-indigo-600"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('👉 Biometric scanner simulated: Fingerprint verified!')}
                  className="flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-800 cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4 text-indigo-600" />
                  <span>Biometrics</span>
                </button>
              </div>

              {/* MAIN LOG IN SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Log In to Paydra Bank</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* QUICK DEMO LOGIN SHORTCUT BUTTON */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-xl text-xs border border-indigo-200/80 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                  <span>⚡ 1-Click Demo Login (Kunle Adebayo)</span>
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: CREATE ACCOUNT (SIGN UP) */}
          {mode === 'SIGNUP' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Full Legal Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signupName}
                    onChange={handleNameChange}
                    placeholder="e.g. Kunle Adebayo"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="08012345678"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Custom @PaydraTag
                </label>
                <input
                  type="text"
                  value={signupPaydraTag}
                  onChange={(e) => setSignupPaydraTag(e.target.value)}
                  placeholder="@kunle"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Create PIN / Password
                  </label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Confirm PIN
                  </label>
                  <input
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {signupError && (
                <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{signupError}</span>
                </div>
              )}

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-indigo-600 rounded-md border-slate-300 focus:ring-indigo-500 accent-indigo-600"
                />
                <span className="text-[11px] text-slate-600 leading-tight font-medium">
                  I agree to Paydra Bank's <span className="text-indigo-600 font-bold">Terms of Service</span> and <span className="text-indigo-600 font-bold">Privacy Policy</span>.
                </span>
              </label>

              {/* SIGN UP SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Create Free Paydra Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* FOOTER SECURITY BADGE */}
      <footer className="relative z-10 max-w-md w-full mx-auto px-4 pb-4 pt-2 text-center text-[10px] text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300">NDIC Insured • Licensed by Central Bank of Nigeria</span>
        </div>
        <p className="opacity-75">© {new Date().getFullYear()} Paydra Bank Plc. 256-bit Bank Grade Security.</p>
      </footer>
    </div>
  );
};
