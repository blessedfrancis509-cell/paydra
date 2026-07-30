import React, { useState, useRef } from 'react';
import { ShieldCheck, TrendingUp, CreditCard, ChevronRight, Sparkles } from 'lucide-react';

interface InfoCarouselProps {
  onOpenSecurityModal?: () => void;
  onNavigateVaults?: () => void;
  onNavigateCards?: () => void;
}

export const InfoCarousel: React.FC<InfoCarouselProps> = ({
  onOpenSecurityModal,
  onNavigateVaults,
  onNavigateCards,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      id: 'security',
      category: 'ACCOUNT PROTECTION',
      title: 'Security Checkup',
      description: 'Set up secret security questions & enable 2FA biometric login for maximum safety.',
      actionText: 'Review Security',
      badge: 'Action Required',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
      gradient: 'from-slate-900 via-indigo-950 to-slate-900',
      borderColor: 'border-indigo-800/50',
      icon: ShieldCheck,
      iconBg: 'bg-indigo-500/20 text-indigo-300',
      onAction: onOpenSecurityModal,
    },
    {
      id: 'savings',
      category: 'HIGH YIELD VAULTS',
      title: 'Earn Up To 18.5% APY',
      description: 'Create automated target vaults for rent, travel, or emergency funds with daily interest.',
      actionText: 'Explore Vaults',
      badge: '18.5% APY',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      gradient: 'from-slate-900 via-emerald-950 to-slate-900',
      borderColor: 'border-emerald-800/40',
      icon: TrendingUp,
      iconBg: 'bg-emerald-500/20 text-emerald-300',
      onAction: onNavigateVaults,
    },
    {
      id: 'cards',
      category: 'VIRTUAL DEBIT CARDS',
      title: 'Instant Virtual Cards',
      description: 'Create customizable virtual debit cards with instant freeze & spending limits.',
      actionText: 'Manage Cards',
      badge: 'Virtual Cards',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      gradient: 'from-slate-900 via-purple-950 to-slate-900',
      borderColor: 'border-purple-800/40',
      icon: CreditCard,
      iconBg: 'bg-purple-500/20 text-purple-300',
      onAction: onNavigateCards,
    },
  ];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: clientWidth * index, behavior: 'smooth' });
    setActiveIndex(index);
  };

  return (
    <div className="w-full space-y-2">
      {/* Header title & Side Scroll Controls */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Security & Insights</span>
        </h3>

        {/* Carousel Pagination Controls */}
        <div className="flex items-center gap-1">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIndex === idx ? 'w-4 bg-indigo-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Side-Scrollable Container showing ONE card at a time */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden gap-3 py-0.5"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`w-full min-w-full shrink-0 snap-center rounded-2xl sm:rounded-3xl bg-gradient-to-br ${card.gradient} border ${card.borderColor} p-4 sm:p-5 text-white shadow-xs flex flex-col justify-between relative overflow-hidden transition-all hover:border-indigo-500/50`}
            >
              <div>
                {/* Category & Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {card.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Title & Icon Header */}
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className={`p-2 rounded-xl ${card.iconBg} shrink-0`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {card.title}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-slate-300/90 leading-snug font-normal mb-3">
                  {card.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={card.onAction}
                className="w-full py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/15 backdrop-blur-md text-[11px] sm:text-xs font-bold text-white flex items-center justify-between transition-all group/btn cursor-pointer"
              >
                <span>{card.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

