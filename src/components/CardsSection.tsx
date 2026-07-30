import React, { useState, useEffect } from 'react';
import { VirtualCard, CardTheme } from '../types';
import {
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Globe,
  X,
  Copy,
  Check,
  Truck,
  Smartphone,
  KeyRound,
  ShieldAlert,
  Wallet,
  Building,
  CheckCircle2,
  ChevronRight,
  Zap,
  Sparkles,
  Palette,
  ShieldCheck,
} from 'lucide-react';

interface CardsSectionProps {
  cards: VirtualCard[];
  onToggleFreeze: (cardId: string) => void;
  onUpdateLimit?: (cardId: string, limit: number) => void;
  onCreateCard: (theme: CardTheme, brand: 'Mastercard' | 'Visa') => void;
}

export const CardsSection: React.FC<CardsSectionProps> = ({
  cards,
  onToggleFreeze,
  onCreateCard,
}) => {
  // Main Tab: VIRTUAL vs PHYSICAL
  const [activeTab, setActiveTab] = useState<'VIRTUAL' | 'PHYSICAL'>('VIRTUAL');
  
  // Filter cards by tab type
  const virtualCards = cards.filter((c) => c.type === 'Virtual' || !c.type);
  const physicalCards = cards.filter((c) => c.type === 'Physical');

  const currentCategoryCards = activeTab === 'VIRTUAL' ? virtualCards : physicalCards;

  const [activeCardId, setActiveCardId] = useState<string>(
    virtualCards[0]?.id || cards[0]?.id || ''
  );

  // Allow custom theme override per card ID dynamically
  const [cardThemes, setCardThemes] = useState<Record<string, CardTheme>>({});

  const [showCardDetails, setShowCardDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [physicalAddress, setPhysicalAddress] = useState('14 Admiralty Way, Lekki Phase 1, Lagos');
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  // New Card Modal State
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('onyx');
  const [selectedBrand, setSelectedBrand] = useState<'Mastercard' | 'Visa'>('Mastercard');

  // Real Bank Card Controls State
  const [atmEnabled, setAtmEnabled] = useState(true);
  const [posEnabled, setPosEnabled] = useState(true);
  const [internationalEnabled, setInternationalEnabled] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [isWalletAdded, setIsWalletAdded] = useState(false);

  // Active card object selection
  const activeCard =
    currentCategoryCards.find((c) => c.id === activeCardId) ||
    currentCategoryCards[0] ||
    cards[0];

  // Auto-rotating card theme cycle
  const ALL_THEMES: CardTheme[] = ['onyx', 'emerald', 'violet', 'frost', 'gold'];
  const [autoThemeIndex, setAutoThemeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoThemeIndex((prev) => (prev + 1) % ALL_THEMES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Theme styling (auto-rotates designs automatically or uses custom chosen theme)
  const currentTheme: CardTheme = (cardThemes[activeCard?.id] as CardTheme) || ALL_THEMES[autoThemeIndex];

  // Helper function to render unique SVG geometric shapes & Naija tribe art patterns per theme with animated moving elements
  const renderCardPattern = (theme: CardTheme) => {
    switch (theme) {
      case 'onyx':
        // Benin Kingdom Royal Bronze (Edo Motif) with animated moving shapes
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="onyxGlow" cx="80%" cy="20%" r="70%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="onyxShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#onyxGlow)" />
            
            {/* Floating Ambient Glowing Orb */}
            <circle cx="20%" cy="80%" r="90" fill="#f59e0b" opacity="0.15" className="animate-pulse" />

            {/* Rotating Benin Sunburst Bronze Concentric Rings & Rays */}
            <g className="animate-[spin_30s_linear_infinite]" style={{ transformOrigin: '85% 25%' }}>
              <circle cx="85%" cy="25%" r="130" stroke="#f59e0b" strokeWidth="1" fill="none" strokeDasharray="6 6" opacity="0.6" />
              <circle cx="85%" cy="25%" r="95" stroke="#fbbf24" strokeWidth="1.5" fill="none" opacity="0.8" strokeDasharray="12 4" />
              <circle cx="85%" cy="25%" r="65" stroke="#d97706" strokeWidth="1" fill="none" opacity="0.9" />
              <circle cx="85%" cy="25%" r="35" stroke="#f59e0b" strokeWidth="2" fill="none" />
              {/* Radial spokes */}
              <line x1="85%" y1="5%" x2="85%" y2="45%" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
              <line x1="65%" y1="25%" x2="105%" y2="25%" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
            </g>

            {/* Edo Royal Bronze Lattice Grid with Slow Pulsing Effect */}
            <g className="animate-pulse" style={{ animationDuration: '4s' }}>
              <path d="M -20 180 L 180 -20 M 20 220 L 220 20 M 60 260 L 260 60" stroke="#f59e0b" strokeWidth="0.9" opacity="0.4" />
              <path d="M 180 220 L -20 20 M 220 260 L 20 -20 M 260 300 L 60 20" stroke="#f59e0b" strokeWidth="0.9" opacity="0.4" />
            </g>

            {/* Moving Floating Diamond Crest */}
            <g className="animate-[bounce_6s_ease-in-out_infinite]" transform="translate(25, 100) scale(0.75)" opacity="0.7">
              <polygon points="25,0 50,25 25,50 0,25" fill="url(#onyxShimmer)" stroke="#fbbf24" strokeWidth="2" />
              <circle cx="25" cy="25" r="8" fill="#f59e0b" className="animate-ping" style={{ animationDuration: '3s' }} />
            </g>

            {/* Moving Orbiting Particle Dots */}
            <g className="animate-[spin_15s_linear_infinite]" style={{ transformOrigin: '85% 25%' }}>
              <circle cx="85%" cy="8%" r="4" fill="#fbbf24" />
              <circle cx="68%" cy="25%" r="3" fill="#f59e0b" />
            </g>
          </svg>
        );

      case 'emerald':
        // Yoruba Adire Textile & Sacred Waves Motif with animated moving shapes
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="emeraldGlow" cx="20%" cy="80%" r="70%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#emeraldGlow)" />
            
            {/* Floating Emerald Light Orbs */}
            <circle cx="85%" cy="20%" r="80" fill="#34d399" opacity="0.15" className="animate-pulse" style={{ animationDuration: '3.5s' }} />
            
            {/* Moving Yoruba Adire Chevron Rows */}
            <g stroke="#34d399" strokeWidth="1.2" fill="none" opacity="0.7">
              <path d="M 0 30 L 25 10 L 50 30 L 75 10 L 100 30 L 125 10 L 150 30 L 175 10 L 200 30 L 225 10 L 250 30 L 275 10 L 300 30 L 325 10 L 350 30" />
              <path d="M 0 50 L 25 30 L 50 50 L 75 30 L 100 50 L 125 30 L 150 50 L 175 30 L 200 50 L 225 30 L 250 50 L 275 30 L 300 50 L 325 30 L 350 50" />
            </g>

            {/* Moving Adire Spiral Waves */}
            <g className="animate-pulse" style={{ animationDuration: '3s' }}>
              <path d="M 220 180 Q 270 120 320 180 T 420 180" stroke="#6ee7b7" strokeWidth="2.5" fill="none" />
              <path d="M 200 200 Q 250 140 300 200 T 400 200" stroke="#10b981" strokeWidth="1.8" fill="none" />
            </g>

            {/* Rotating Interlocking Diamond Array */}
            <g className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: '160px 110px' }}>
              <polygon points="120,100 140,80 160,100 140,120" stroke="#a7f3d0" strokeWidth="1.5" fill="none" />
              <polygon points="160,100 180,80 200,100 180,120" stroke="#a7f3d0" strokeWidth="1.5" fill="none" />
              <polygon points="140,120 160,100 180,120 160,140" stroke="#a7f3d0" strokeWidth="1.5" fill="none" />
              <circle cx="160" cy="100" r="4" fill="#6ee7b7" className="animate-ping" style={{ animationDuration: '2.5s' }} />
            </g>

            {/* Floating Geometric Particles */}
            <circle cx="70%" cy="75%" r="6" stroke="#34d399" strokeWidth="1.5" fill="none" className="animate-[bounce_7s_ease-in-out_infinite]" />
            <polygon points="50,140 60,125 70,140 60,155" stroke="#6ee7b7" strokeWidth="1" fill="none" className="animate-[bounce_5s_ease-in-out_infinite]" />
          </svg>
        );

      case 'violet':
        // Igbo Nsibidi Ideogram & Ukara Cloth Pattern with animated moving shapes
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="violetGlow" cx="80%" cy="80%" r="65%">
                <stop offset="0%" stopColor="#e879f9" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#violetGlow)" />
            
            {/* Rotating Twin Nsibidi Unity Circles */}
            <g className="animate-[spin_22s_linear_infinite]" style={{ transformOrigin: '310px 70px' }}>
              <circle cx="290" cy="70" r="45" stroke="#f472b6" strokeWidth="1.8" strokeDasharray="6 3" fill="none" />
              <circle cx="330" cy="70" r="45" stroke="#c084fc" strokeWidth="1.8" strokeDasharray="6 3" fill="none" />
              <circle cx="310" cy="70" r="10" fill="#f0abfc" opacity="0.6" />
            </g>
            
            {/* Moving Ukara Triangular Waves */}
            <g stroke="#f0abfc" strokeWidth="1.2" fill="none" opacity="0.7">
              <path d="M -10 150 L 30 110 L 70 150 L 110 110 L 150 150 L 190 110 L 230 150" stroke="#e879f9" strokeWidth="1.8" />
              <path d="M -10 170 L 30 130 L 70 170 L 110 130 L 150 170 L 190 130 L 230 170" stroke="#a855f7" strokeWidth="1.2" className="animate-pulse" />
            </g>

            {/* Floating Nsibidi Star Ideogram */}
            <g className="animate-[bounce_6s_ease-in-out_infinite]" opacity="0.8">
              <path d="M 70 45 L 80 70 L 105 70 L 85 85 L 95 110 L 70 95 L 45 110 L 55 85 L 35 70 L 60 70 Z" fill="none" stroke="#f472b6" strokeWidth="1.5" />
              <circle cx="70" cy="78" r="4" fill="#e879f9" className="animate-ping" style={{ animationDuration: '3s' }} />
            </g>

            {/* Floating Ambient Glowing Particles */}
            <circle cx="20%" cy="25%" r="65" fill="#c084fc" opacity="0.15" className="animate-pulse" />
            <polygon points="200,40 210,25 220,40 210,55" stroke="#f0abfc" strokeWidth="1.5" fill="none" className="animate-[spin_10s_linear_infinite]" style={{ transformOrigin: '210px 40px' }} />
          </svg>
        );

      case 'frost':
        // Hausa Northern Arewa Knot & Zaria Archways with animated moving shapes
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="frostGlow" cx="30%" cy="20%" r="75%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#frostGlow)" />

            {/* Rotating Famous Hausa Arewa Northern Star Knot */}
            <g transform="translate(240, 35) scale(0.95)" stroke="#38bdf8" strokeWidth="2" fill="none">
              <g className="animate-[spin_25s_linear_infinite]" style={{ transformOrigin: '50px 50px' }}>
                <rect x="20" y="20" width="60" height="60" rx="14" stroke="#67e8f9" strokeWidth="2" />
                <rect x="20" y="20" width="60" height="60" rx="14" transform="rotate(45 50 50)" stroke="#38bdf8" strokeWidth="2" />
              </g>
              <circle cx="50" cy="50" r="14" fill="#0284c7" opacity="0.5" stroke="#22d3ee" strokeWidth="2" className="animate-ping" style={{ animationDuration: '4s' }} />
            </g>

            {/* Moving Dabo Archway Arches */}
            <g stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.6" className="animate-pulse" style={{ animationDuration: '3.5s' }}>
              <path d="M 10 220 Q 50 140 90 220" />
              <path d="M 70 220 Q 110 140 150 220" />
              <path d="M 130 220 Q 170 140 210 220" />
              <path d="M 190 220 Q 230 140 270 220" />
            </g>

            {/* Floating Floating Frost Diamonds & Orbs */}
            <circle cx="75%" cy="80%" r="75" fill="#38bdf8" opacity="0.12" className="animate-pulse" />
            <polygon points="40,80 55,60 70,80 55,100" stroke="#67e8f9" strokeWidth="1.5" fill="none" className="animate-[bounce_6s_ease-in-out_infinite]" />
            <polygon points="160,50 172,35 184,50 172,65" stroke="#22d3ee" strokeWidth="1.2" fill="none" className="animate-[spin_12s_linear_infinite]" style={{ transformOrigin: '172px 50px' }} />
          </svg>
        );

      case 'gold':
        // Calabar Royal Gold & Efik Ekpe Diamond Mesh with animated moving shapes
        return (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 overflow-hidden" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="goldGlow" cx="50%" cy="50%" r="70%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#goldGlow)" />
            
            {/* Rotating Radial Gold Sun Ray Burst */}
            <g className="animate-[spin_35s_linear_infinite]" style={{ transformOrigin: '200px 100px' }}>
              <line x1="200" y1="100" x2="350" y2="-20" stroke="#fef08a" strokeWidth="1.2" />
              <line x1="200" y1="100" x2="380" y2="20" stroke="#fde047" strokeWidth="1.2" />
              <line x1="200" y1="100" x2="390" y2="80" stroke="#facc15" strokeWidth="1.2" />
              <line x1="200" y1="100" x2="380" y2="140" stroke="#eab308" strokeWidth="1.2" />
              <line x1="200" y1="100" x2="350" y2="180" stroke="#ca8a04" strokeWidth="1.2" />
              <line x1="200" y1="100" x2="50" y2="220" stroke="#fde047" strokeWidth="1" />
              <line x1="200" y1="100" x2="20" y2="100" stroke="#fef08a" strokeWidth="1" />
            </g>

            {/* Moving & Pulsing Ekpe Royal Diamond Grid */}
            <g stroke="#facc15" strokeWidth="1.8" fill="none">
              <polygon points="30,120 60,80 90,120 60,160" stroke="#fef08a" className="animate-[bounce_5s_ease-in-out_infinite]" />
              <polygon points="80,120 110,80 140,120 110,160" stroke="#fde047" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
              <polygon points="55,160 85,120 115,160 85,200" stroke="#facc15" className="animate-[bounce_7s_ease-in-out_infinite]" />
            </g>

            {/* Floating Gold Sparkle Particles */}
            <circle cx="200" cy="100" r="8" fill="#fef08a" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="85%" cy="30%" r="70" fill="#facc15" opacity="0.15" className="animate-pulse" />
          </svg>
        );

      default:
        return null;
    }
  };

  // Theme styling definitions
  const themeStyles: Record<
    CardTheme,
    { bg: string; text: string; accent: string; name: string; dot: string; tribalTag: string; shapeInfo: string }
  > = {
    onyx: {
      bg: 'from-slate-900 via-slate-950 to-indigo-950 border-amber-500/30 shadow-slate-950/60',
      text: 'text-white',
      accent: 'text-amber-400',
      name: 'Onyx Black',
      dot: 'bg-slate-900 border-amber-500',
      tribalTag: '🏛️ Edo Benin Bronze',
      shapeInfo: 'Sunburst & Bronze Grid',
    },
    emerald: {
      bg: 'from-emerald-950 via-teal-950 to-slate-950 border-emerald-500/30 shadow-emerald-950/60',
      text: 'text-emerald-100',
      accent: 'text-emerald-300',
      name: 'Royal Emerald',
      dot: 'bg-emerald-600 border-emerald-400',
      tribalTag: '🎨 Yoruba Adire',
      shapeInfo: 'Sacred Wave Chevrons',
    },
    violet: {
      bg: 'from-purple-950 via-indigo-950 to-slate-950 border-purple-500/30 shadow-purple-950/60',
      text: 'text-purple-100',
      accent: 'text-purple-300',
      name: 'Deep Violet',
      dot: 'bg-purple-600 border-purple-400',
      tribalTag: '🔮 Igbo Nsibidi',
      shapeInfo: 'Ukara Script & Arcs',
    },
    frost: {
      bg: 'from-slate-800 via-indigo-900 to-slate-950 border-cyan-400/30 shadow-indigo-950/60',
      text: 'text-indigo-100',
      accent: 'text-cyan-300',
      name: 'Titanium Frost',
      dot: 'bg-indigo-500 border-cyan-300',
      tribalTag: '⭐ Hausa Arewa',
      shapeInfo: 'Dabo Archway & Knot',
    },
    gold: {
      bg: 'from-amber-900 via-amber-950 to-slate-950 border-amber-500/40 shadow-amber-950/60',
      text: 'text-amber-100',
      accent: 'text-amber-300',
      name: 'Imperial Gold',
      dot: 'bg-amber-500 border-amber-300',
      tribalTag: '👑 Calabar Gold',
      shapeInfo: 'Ekpe Diamond Weave',
    },
  };

  const handleCopyCard = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangeTheme = (themeKey: CardTheme) => {
    if (activeCard) {
      setCardThemes((prev) => ({ ...prev, [activeCard.id]: themeKey }));
    }
  };

  const handleCreateNewCard = () => {
    onCreateCard(selectedTheme, selectedBrand);
    setIsCreatingModal(false);
  };

  const handleOrderPhysicalCard = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      alert('🎉 Physical Paydra Metallic Card ordered! Free express delivery to your address in 48 hours.');
    }, 1500);
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) return alert('PIN must be exactly 4 digits');
    setPinSuccess(true);
    setTimeout(() => {
      setPinSuccess(false);
      setIsPinModalOpen(false);
      setNewPin('');
      alert('🔒 Card PIN successfully updated! Use your new PIN for ATM and POS terminals.');
    }, 1000);
  };

  return (
    <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-5 text-slate-900 animate-fade-in">
      
      {/* 1. BANK CARDS HEADER & TYPE SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100 shadow-2xs">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Cards & Terminals</h3>
            <p className="text-xs text-slate-500">Manage your Virtual & Physical debit cards</p>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Issue New Card</span>
        </button>
      </div>

      {/* 2. ACTIVE CARD DISPLAY & CUSTOMIZER (BANK CARD FIRST) */}
      {activeCard ? (
        <div className="space-y-4">
          
          {/* Real Metallic/Virtual Debit Card Visual */}
          <div className={`relative w-full max-w-md mx-auto aspect-[1.58/1] rounded-2xl sm:rounded-3xl bg-gradient-to-br p-5 sm:p-6 shadow-xl border flex flex-col justify-between overflow-hidden transition-all duration-500 ${themeStyles[currentTheme].bg}`}>
            
            {/* SVG Geometric Shapes & Naija Tribe Pattern Background */}
            {renderCardPattern(currentTheme)}

            {/* Frozen Overlay */}
            {activeCard.isFrozen && (
              <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                <Lock className="w-8 h-8 text-cyan-400 mb-2 animate-bounce" />
                <p className="text-sm font-bold text-white">Card Temporarily Frozen</p>
                <p className="text-xs text-slate-300 mt-0.5">Transactions blocked at all terminals</p>
                <button
                  onClick={() => onToggleFreeze(activeCard.id)}
                  className="mt-3 px-4 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  Unfreeze Card
                </button>
              </div>
            )}

            {/* Top Row: Bank Brand & Card Type */}
            <div className="flex justify-between items-start z-10">
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-widest text-white">PAYDRA</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-white border border-white/20 uppercase tracking-wider">
                    {activeCard.type}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-sm sm:text-base font-black tracking-tight text-white">{activeCard.brand}</span>
                <span className={`text-[8px] font-extrabold uppercase tracking-widest ${themeStyles[currentTheme].accent}`}>
                  Central NUBAN Linked
                </span>
              </div>
            </div>

            {/* Middle Row: Gold EMV Chip & Contactless Indicator */}
            <div className="flex items-center justify-between my-1 z-10">
              <div className="w-10 h-7 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 border border-amber-200/60 rounded-md flex items-center justify-center shadow-inner">
                <div className="w-6 h-4 border border-amber-900/40 rounded-xs" />
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <Globe className="w-3.5 h-3.5 opacity-80" />
                <span className="text-[9px] font-mono text-emerald-300 font-bold uppercase tracking-wider">Tap & Pay</span>
              </div>
            </div>

            {/* Bottom Section: Card Number, Name & Details */}
            <div className="z-10 space-y-1">
              <div className="flex items-center justify-between font-mono text-base sm:text-lg font-black tracking-widest text-white">
                <span>{showCardDetails ? '5399 2840 1928 8812' : activeCard.cardNumber}</span>
                {showCardDetails && (
                  <button onClick={() => handleCopyCard('5399284019288812')} className="text-emerald-300 hover:text-emerald-200 cursor-pointer">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>

              <div className="flex justify-between items-end text-xs pt-1">
                <div>
                  <p className="text-[8px] uppercase font-mono opacity-70 text-white">Card Holder</p>
                  <p className="font-bold tracking-wider uppercase text-white text-xs">{activeCard.cardHolderName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-[8px] uppercase font-mono opacity-70 text-white">Expires</p>
                    <p className="font-bold font-mono text-white text-xs">{activeCard.expiryMonth}/{activeCard.expiryYear}</p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase font-mono opacity-70 text-white">CVV</p>
                    <p className="font-bold font-mono text-white text-xs">{showCardDetails ? activeCard.cvv : '•••'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VIRTUAL vs PHYSICAL CARD TAB SWITCHER (MOVED BELOW CARD & COMPACT) */}
          <div className="max-w-xs sm:max-w-sm mx-auto grid grid-cols-2 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-[11px] shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setActiveTab('VIRTUAL');
                if (virtualCards[0]) setActiveCardId(virtualCards[0].id);
              }}
              className={`py-1 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'VIRTUAL'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Virtual Cards ({virtualCards.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('PHYSICAL');
                if (physicalCards[0]) setActiveCardId(physicalCards[0].id);
              }}
              className={`py-1 px-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'PHYSICAL'
                  ? 'bg-white text-indigo-600 shadow-2xs border border-slate-200/50'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3 h-3 text-amber-500" />
              <span>Physical Card ({physicalCards.length})</span>
            </button>
          </div>

          {/* QUICK CIRCULAR BANK ACTION BUTTONS */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {/* Freeze / Unfreeze */}
            <button
              type="button"
              onClick={() => onToggleFreeze(activeCard.id)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                activeCard.isFrozen ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200/80 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-600'
              }`}>
                {activeCard.isFrozen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                {activeCard.isFrozen ? 'Unfreeze' : 'Freeze'}
              </span>
            </button>

            {/* Show / Hide Details */}
            <button
              type="button"
              onClick={() => setShowCardDetails(!showCardDetails)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-200/80 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                {showCardDetails ? 'Hide' : 'Show Info'}
              </span>
            </button>

            {/* Change PIN */}
            <button
              type="button"
              onClick={() => setIsPinModalOpen(true)}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-200/80 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                <KeyRound className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                Change PIN
              </span>
            </button>

            {/* Apple / Google Wallet */}
            <button
              type="button"
              onClick={() => {
                setIsWalletAdded(!isWalletAdded);
                if (!isWalletAdded) alert(' Card synced to Apple Pay & Google Wallet!');
              }}
              className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                isWalletAdded ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200/80 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-600'
              }`}>
                <Wallet className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 text-center leading-tight">
                {isWalletAdded ? 'In Wallet' : 'Add Wallet'}
              </span>
            </button>
          </div>

          {/* 7. BANK SECURITY & TERMINAL CONTROLS LIST */}
          <div className="space-y-3 pt-3 border-t border-slate-200/80 text-xs">
            <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              Terminal Security & Channels
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* ATM Cash Withdrawals */}
              <button
                type="button"
                onClick={() => setAtmEnabled(!atmEnabled)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  atmEnabled ? 'bg-indigo-50/50 border-indigo-200 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className={`w-4 h-4 ${atmEnabled ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <span className="font-bold block text-xs">ATM Cash Withdrawals</span>
                    <span className="text-[10px] text-slate-500">Physical terminal cash out</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${atmEnabled ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-200 text-slate-500'}`}>
                  {atmEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </button>

              {/* In-Store POS & Contactless */}
              <button
                type="button"
                onClick={() => setPosEnabled(!posEnabled)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  posEnabled ? 'bg-indigo-50/50 border-indigo-200 text-indigo-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className={`w-4 h-4 ${posEnabled ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <span className="font-bold block text-xs">POS / Contactless Tap</span>
                    <span className="text-[10px] text-slate-500">In-store card reader</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${posEnabled ? 'bg-indigo-200 text-indigo-900' : 'bg-slate-200 text-slate-500'}`}>
                  {posEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
              </button>

              {/* International Cross-Border FX */}
              <button
                type="button"
                onClick={() => setInternationalEnabled(!internationalEnabled)}
                className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                  internationalEnabled ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Globe className={`w-4 h-4 ${internationalEnabled ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <span className="font-bold block text-xs">International FX Spending</span>
                    <span className="text-[10px] text-slate-500">Cross-border USD / GBP</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${internationalEnabled ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-500'}`}>
                  {internationalEnabled ? 'ALLOWED' : 'BLOCKED'}
                </span>
              </button>

              {/* Report Lost or Stolen */}
              <button
                type="button"
                onClick={() => alert('🚨 Card block request submitted. Card permanently disabled.')}
                className="p-3 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-2xl flex items-center justify-between transition-all text-red-900 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <div className="text-left">
                    <span className="font-bold block text-xs">Report Lost or Stolen</span>
                    <span className="text-[10px] text-red-600/80">Permanent card block</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-400" />
              </button>
            </div>

            {/* Linked Settlement NUBAN Account */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block leading-none">Primary Settlement NUBAN</span>
                  <span className="text-xs font-bold text-slate-900 block mt-0.5">Paydra Bank • 2084920193</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md">
                Active Autoload
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* If no card exists in the active tab category (e.g. Physical Card) */
        <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-900 text-center space-y-4 shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">No Physical Metallic Card Ordered Yet</h4>
            <p className="text-xs text-indigo-200 mt-1 max-w-sm mx-auto">
              Get an official Paydra Metallic Debit Card delivered express to your doorstep. Works at all Nigerian ATMs & POS terminals.
            </p>
          </div>

          <form onSubmit={handleOrderPhysicalCard} className="max-w-md mx-auto space-y-3 pt-2 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Delivery Address</label>
              <input
                type="text"
                value={physicalAddress}
                onChange={(e) => setPhysicalAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={orderSuccess}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{orderSuccess ? 'Ordering...' : 'Order Physical Metallic Card'}</span>
            </button>
          </form>
        </div>
      )}

      {/* CHANGE PIN MODAL */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-900 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Change Card PIN</h3>
              </div>
              <button onClick={() => setIsPinModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePin} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Enter New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  placeholder="••••"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                  required
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-snug">
                This 4-digit PIN is required for ATM cash withdrawals and physical POS terminal transactions.
              </p>

              <button
                type="submit"
                disabled={pinSuccess || newPin.length !== 4}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {pinSuccess ? <CheckCircle2 className="w-4 h-4 text-white" /> : <Lock className="w-4 h-4" />}
                <span>{pinSuccess ? 'PIN Saved!' : 'Save New Card PIN'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW VIRTUAL CARD MODAL */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Issue Virtual Debit Card</h3>
              <button onClick={() => setIsCreatingModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block">Choose Cultural Theme & Design Skin</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {(['onyx', 'emerald', 'violet', 'frost', 'gold'] as CardTheme[]).map((th) => {
                  const info = themeStyles[th];
                  const isSel = selectedTheme === th;
                  return (
                    <button
                      key={th}
                      type="button"
                      onClick={() => setSelectedTheme(th)}
                      className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                        isSel
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm ring-1 ring-indigo-600'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border shrink-0 ${info.dot}`} />
                      <div className="min-w-0">
                        <span className="text-xs font-bold capitalize block truncate">{info.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold block truncate">
                          {info.tribalTag}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-2 block">Card Network</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Mastercard', 'Visa'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBrand(b)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      selectedBrand === b ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-2xs' : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateNewCard}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Issue Instant Virtual Card (Free)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
