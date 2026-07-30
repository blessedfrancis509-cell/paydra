import React, { useState } from 'react';
import {
  Currency,
  Transaction,
  Beneficiary,
  VirtualCard,
  VaultGoal,
  NotificationItem,
  CardTheme,
} from './types';
import {
  INITIAL_USER,
  INITIAL_BALANCES,
  INITIAL_TRANSACTIONS,
  INITIAL_BENEFICIARIES,
  INITIAL_CARDS,
  INITIAL_VAULTS,
  CATEGORY_BUDGETS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { MobileFrameWrapper } from './components/MobileFrameWrapper';
import { BalanceCard } from './components/BalanceCard';
import { BeneficiariesRow } from './components/BeneficiariesRow';
import { TransactionList } from './components/TransactionList';
import { TransactionReceiptModal } from './components/TransactionReceiptModal';
import { SendMoneyModal } from './components/SendMoneyModal';
import { AddMoneyModal } from './components/AddMoneyModal';
import { CardsSection } from './components/CardsSection';
import { VaultsSection } from './components/VaultsSection';
import { BillsAndServicesModal } from './components/BillsAndServicesModal';
import { BillsPage } from './components/BillsPage';
import { AnalyticsSection } from './components/AnalyticsSection';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { ConvertFXModal } from './components/ConvertFXModal';
import { RequestMoneyModal } from './components/RequestMoneyModal';
import { TransferPage } from './components/TransferPage';
import { InfoCarousel } from './components/InfoCarousel';
import { SecurityQuestionsModal } from './components/SecurityQuestionsModal';
import { ProfilePage } from './components/ProfilePage';
import { AuthScreen } from './components/AuthScreen';

import { LayoutDashboard, Receipt, CreditCard, PiggyBank, PieChart as PieIcon, ShieldCheck, Heart, Send, User } from 'lucide-react';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<typeof INITIAL_USER[]>([INITIAL_USER]);

  // State
  const [user, setUser] = useState(INITIAL_USER);
  const [balances, setBalances] = useState(INITIAL_BALANCES);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('NGN');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [cards, setCards] = useState<VirtualCard[]>(INITIAL_CARDS);
  const [vaults, setVaults] = useState<VaultGoal[]>(INITIAL_VAULTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TRANSFER' | 'TRANSACTIONS' | 'CARDS' | 'SAVINGS' | 'ANALYTICS' | 'PROFILE' | 'BILLS'>('OVERVIEW');

  // Mobile Device Frame Mode
  const [isMobileFrame, setIsMobileFrame] = useState(false);

  // Modals
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<Transaction | null>(null);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isPayBillsOpen, setIsPayBillsOpen] = useState(false);
  const [isFXSwapOpen, setIsFXSwapOpen] = useState(false);
  const [isRequestMoneyOpen, setIsRequestMoneyOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [prefilledBeneficiary, setPrefilledBeneficiary] = useState<Beneficiary | null>(null);

  // Unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // Handlers
  const handleCompleteTransfer = (newTx: Transaction) => {
    // Deduct NGN balance
    setBalances(prev => ({
      ...prev,
      NGN: prev.NGN - newTx.amount,
    }));

    // Append transaction to start
    setTransactions(prev => [newTx, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `n_${Date.now()}`,
      title: 'Transfer Sent',
      message: `₦${newTx.amount.toLocaleString()} sent to ${newTx.recipientName}. Zero fee charged.`,
      date: 'Just now',
      type: 'DEBIT',
      read: false,
      amount: newTx.amount,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Open receipt modal automatically
    setSelectedTxForReceipt(newTx);
  };

  const handleAddFundsSuccess = (amount: number) => {
    setBalances(prev => ({ ...prev, NGN: prev.NGN + amount }));
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      reference: `PAYDRA-TOPUP-${Date.now().toString().slice(-6)}`,
      type: 'INFLOW',
      title: 'Deposit Inflow via Debit Card',
      amount: amount,
      currency: 'NGN',
      fee: 0,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'SUCCESSFUL',
      recipientName: user.name,
      category: 'Income',
      tag: '#Deposit',
      receiptCode: `RCP-TOPUP-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleBillPaymentSuccess = (newTx: Transaction) => {
    setBalances(prev => ({ ...prev, NGN: prev.NGN - newTx.amount }));
    setTransactions(prev => [newTx, ...prev]);

    // Cashback notification
    if (newTx.cashbackEarned) {
      setBalances(prev => ({ ...prev, NGN: prev.NGN + (newTx.cashbackEarned || 0) }));
      const cashbackNotif: NotificationItem = {
        id: `n_cb_${Date.now()}`,
        title: 'Instant Cashback Bonus! 🎁',
        message: `You earned ₦${newTx.cashbackEarned} cashback reward!`,
        date: 'Just now',
        type: 'REWARD',
        read: false,
        amount: newTx.cashbackEarned,
      };
      setNotifications(prev => [cashbackNotif, ...prev]);
    }
    setSelectedTxForReceipt(newTx);
  };

  const handleFXSwapSuccess = (fromCurr: Currency, toCurr: Currency, fromAmt: number, toAmt: number) => {
    setBalances(prev => ({
      ...prev,
      [fromCurr]: prev[fromCurr] - fromAmt,
      [toCurr]: prev[toCurr] + toAmt,
    }));
  };

  const handleToggleFreezeCard = (cardId: string) => {
    setCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  };

  const handleUpdateCardLimit = (cardId: string, limit: number) => {
    setCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, spendingLimitMonthly: limit } : c))
    );
  };

  const handleCreateCard = (theme: CardTheme, brand: 'Mastercard' | 'Visa') => {
    const newCard: VirtualCard = {
      id: `card_${Date.now()}`,
      cardHolderName: user.name.toUpperCase(),
      cardNumber: `${brand === 'Mastercard' ? '5399' : '4112'} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiryMonth: '08',
      expiryYear: '29',
      cvv: `${Math.floor(100 + Math.random() * 900)}`,
      brand: brand,
      type: 'Virtual',
      theme: theme,
      isFrozen: false,
      spendingLimitMonthly: 1000000,
      spentThisMonth: 0,
      onlineTransactionsEnabled: true,
      atmWithdrawalsEnabled: true,
      internationalEnabled: true,
    };
    setCards(prev => [newCard, ...prev]);
  };

  const handleCreateVault = (title: string, targetAmount: number, category: VaultGoal['category'], APY: number) => {
    const newVault: VaultGoal = {
      id: `v_${Date.now()}`,
      title,
      category,
      targetAmount,
      currentAmount: 0,
      interestRateAPY: APY,
      startDate: new Date().toISOString().slice(0, 10),
      status: 'ACTIVE',
      icon: 'PiggyBank',
    };
    setVaults(prev => [...prev, newVault]);
  };

  const handleDepositVault = (vaultId: string, amt: number) => {
    if (balances.NGN < amt) return alert('Insufficient NGN balance');
    setBalances(prev => ({ ...prev, NGN: prev.NGN - amt }));
    setVaults(prev =>
      prev.map(v => (v.id === vaultId ? { ...v, currentAmount: v.currentAmount + amt } : v))
    );
    alert(`Added ₦${amt.toLocaleString()} to vault!`);
  };

  if (!isAuthenticated) {
    return (
      <AuthScreen
        defaultUser={INITIAL_USER}
        registeredUsers={registeredUsers}
        onRegisterUser={(newUser) => setRegisteredUsers(prev => [...prev, newUser])}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <MobileFrameWrapper
      isMobileFrame={isMobileFrame}
      onExitMobileFrame={() => setIsMobileFrame(false)}
    >
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        {/* Top Sticky Navbar */}
        <Navbar
          user={user}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          unreadNotificationCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSearch={() => setActiveTab('TRANSACTIONS')}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenProfile={() => setActiveTab('PROFILE')}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-3 sm:space-y-5 pb-16 sm:pb-20">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-2.5 sm:space-y-5">
              {/* Hero Balance Card */}
              <BalanceCard
                balances={balances}
                selectedCurrency={selectedCurrency}
                accountNumber={user.accountNumber}
                bankName={user.bankName}
                veloTag={user.veloTag}
                onOpenSendMoney={() => setActiveTab('TRANSFER')}
                onOpenAddMoney={() => setIsAddMoneyOpen(true)}
                onOpenRequestMoney={() => setIsRequestMoneyOpen(true)}
                onOpenPayBills={() => setActiveTab('BILLS')}
                onOpenFXSwap={() => setIsFXSwapOpen(true)}
              />

              {/* Beneficiaries Quick Row */}
              <BeneficiariesRow
                beneficiaries={beneficiaries}
                onSelectBeneficiary={(b) => {
                  setPrefilledBeneficiary(b);
                  setActiveTab('TRANSFER');
                }}
                onAddBeneficiary={() => {
                  setPrefilledBeneficiary(null);
                  setActiveTab('TRANSFER');
                }}
              />

              {/* Recent Transactions */}
              <div>
                <TransactionList
                  transactions={transactions}
                  onSelectTransaction={(tx) => setSelectedTxForReceipt(tx)}
                  onOpenSendMoney={() => setActiveTab('TRANSFER')}
                  limit={3}
                  onViewAll={() => setActiveTab('TRANSACTIONS')}
                />
              </div>

              {/* Side-Scrolling Updates & Highlights (Security, Product Updates, Savings Goal) */}
              <InfoCarousel
                onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
                onNavigateVaults={() => setActiveTab('SAVINGS')}
                onNavigateCards={() => setActiveTab('CARDS')}
              />
            </div>
          )}

          {/* TAB 1.5: DEDICATED TRANSFER VIEW */}
          {activeTab === 'TRANSFER' && (
            <TransferPage
              beneficiaries={beneficiaries}
              userBalance={balances.NGN}
              onCompleteTransfer={handleCompleteTransfer}
              onOpenSendModal={() => setIsSendMoneyOpen(true)}
            />
          )}

          {/* TAB 2: FULL TRANSACTIONS VIEW */}
          {activeTab === 'TRANSACTIONS' && (
            <TransactionList
              transactions={transactions}
              onSelectTransaction={(tx) => setSelectedTxForReceipt(tx)}
              onOpenSendMoney={() => setActiveTab('TRANSFER')}
            />
          )}

          {/* TAB 3: CARDS VIEW */}
          {activeTab === 'CARDS' && (
            <CardsSection
              cards={cards}
              onToggleFreeze={handleToggleFreezeCard}
              onUpdateLimit={handleUpdateCardLimit}
              onCreateCard={handleCreateCard}
            />
          )}

          {/* TAB 4: SAVINGS & VAULTS VIEW (INCLUDES EMBEDDED AI INSIGHTS) */}
          {activeTab === 'SAVINGS' && (
            <VaultsSection
              vaults={vaults}
              onCreateVault={handleCreateVault}
              onDepositVault={handleDepositVault}
              transactions={transactions}
              categoryBudgets={CATEGORY_BUDGETS}
              userBalance={balances.NGN}
              initialTab="VAULTS"
            />
          )}

          {/* TAB 5: AI ANALYTICS VIEW INSIDE VAULTS */}
          {activeTab === 'ANALYTICS' && (
            <VaultsSection
              vaults={vaults}
              onCreateVault={handleCreateVault}
              onDepositVault={handleDepositVault}
              transactions={transactions}
              categoryBudgets={CATEGORY_BUDGETS}
              userBalance={balances.NGN}
              initialTab="INSIGHTS"
            />
          )}

          {/* TAB 6: PROFILE PAGE */}
          {activeTab === 'PROFILE' && (
            <ProfilePage
              user={user}
              onUpdateUser={(updated) => setUser(prev => ({ ...prev, ...updated }))}
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
              onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
              onLogout={() => setIsAuthenticated(false)}
            />
          )}

          {/* DEDICATED BILLS & DATA PURCHASE PAGE (Not on bottom nav) */}
          {activeTab === 'BILLS' && (
            <BillsPage
              userBalance={balances.NGN}
              onCompleteBillPayment={handleBillPaymentSuccess}
              onBackToOverview={() => setActiveTab('OVERVIEW')}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation Dock - OPay / Kuda Style */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-1.5 sm:px-3 shadow-lg pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="max-w-lg mx-auto flex items-center justify-between sm:justify-around">
            {[
              { id: 'OVERVIEW', label: 'Home', icon: LayoutDashboard },
              { id: 'TRANSFER', label: 'Transfer', icon: Send },
              { id: 'CARDS', label: 'Cards', icon: CreditCard },
              { id: 'SAVINGS', label: 'Vaults', icon: PiggyBank },
              { id: 'TRANSACTIONS', label: 'History', icon: Receipt },
              { id: 'PROFILE', label: 'Profile', icon: User },
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as any)}
                  className={`flex flex-col items-center gap-0.5 sm:gap-1 py-1 px-1.5 sm:px-2.5 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 font-black scale-105'
                      : 'text-slate-500 hover:text-slate-800 font-semibold'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span className="text-[9px] sm:text-[10px] tracking-tight">{nav.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <footer className="hidden sm:block border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-extrabold text-slate-900">PAYDRA DIGITAL BANK</span>
              <span>• Licensed by CBN • Member NDIC</span>
            </div>
            <p className="flex items-center gap-1">
              <span>Crafted with</span> <Heart className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" /> <span>for next-gen digital banking.</span>
            </p>
          </div>
        </footer>

        {/* Modals & Drawers */}
        <TransactionReceiptModal
          transaction={selectedTxForReceipt}
          onClose={() => setSelectedTxForReceipt(null)}
          onRepeatTransfer={(tx) => {
            setSelectedTxForReceipt(null);
            setIsSendMoneyOpen(true);
          }}
        />

        <SendMoneyModal
          isOpen={isSendMoneyOpen}
          onClose={() => {
            setIsSendMoneyOpen(false);
            setPrefilledBeneficiary(null);
          }}
          beneficiaries={beneficiaries}
          userBalance={balances.NGN}
          onCompleteTransfer={handleCompleteTransfer}
          prefilledBeneficiary={prefilledBeneficiary}
        />

        <AddMoneyModal
          isOpen={isAddMoneyOpen}
          onClose={() => setIsAddMoneyOpen(false)}
          user={user}
          onAddFundsSuccess={handleAddFundsSuccess}
        />

        <BillsAndServicesModal
          isOpen={isPayBillsOpen}
          onClose={() => setIsPayBillsOpen(false)}
          userBalance={balances.NGN}
          onCompleteBillPayment={handleBillPaymentSuccess}
        />

        <ConvertFXModal
          isOpen={isFXSwapOpen}
          onClose={() => setIsFXSwapOpen(false)}
          balances={balances}
          onConvertSuccess={handleFXSwapSuccess}
        />

        <RequestMoneyModal
          isOpen={isRequestMoneyOpen}
          onClose={() => setIsRequestMoneyOpen(false)}
          user={user}
        />

        <NotificationsDrawer
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        />

        <SecurityQuestionsModal
          isOpen={isSecurityModalOpen}
          onClose={() => setIsSecurityModalOpen(false)}
        />
      </div>
    </MobileFrameWrapper>
  );
}
