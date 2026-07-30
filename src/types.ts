export type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP';

export type TransactionType = 'TRANSFER' | 'INFLOW' | 'AIRTIME' | 'DATA' | 'BILL' | 'VAULT_DEPOSIT' | 'CASHBACK' | 'CARD_PAYMENT';

export type TransactionStatus = 'SUCCESSFUL' | 'PENDING' | 'FAILED';

export interface Transaction {
  id: string;
  reference: string;
  type: TransactionType;
  title: string;
  amount: number;
  currency: Currency;
  fee: number;
  date: string;
  time: string;
  status: TransactionStatus;
  recipientName?: string;
  recipientAccount?: string;
  recipientBank?: string;
  bankName?: string;
  senderName?: string;
  senderAccount?: string;
  senderBank?: string;
  category: string;
  note?: string;
  tag?: string;
  cashbackEarned?: number;
  receiptCode: string;
  iconName?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  avatarUrl?: string;
  category: 'Frequent' | 'Family' | 'Business';
  lastTransferDate?: string;
}

export type CardTheme = 'onyx' | 'emerald' | 'violet' | 'frost' | 'gold';

export interface VirtualCard {
  id: string;
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  brand: 'Mastercard' | 'Visa';
  type: 'Virtual' | 'Physical';
  theme: CardTheme;
  isFrozen: boolean;
  spendingLimitMonthly: number;
  spentThisMonth: number;
  onlineTransactionsEnabled: boolean;
  atmWithdrawalsEnabled: boolean;
  internationalEnabled: boolean;
}

export interface VaultGoal {
  id: string;
  title: string;
  category: 'Emergency' | 'Target' | 'Fixed' | 'RoundUp';
  targetAmount: number;
  currentAmount: number;
  interestRateAPY: number; // e.g. 14.5
  lockPeriodDays?: number;
  startDate: string;
  endDate?: string;
  autoSaveRoundUp?: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'LOCKED';
  icon: string;
}

export interface UserProfile {
  name: string;
  tag: string; // e.g. @kunle
  email: string;
  phone: string;
  accountNumber: string;
  bankName: string;
  tierLevel: 1 | 2 | 3;
  bvnVerified: boolean;
  kycStatus: 'VERIFIED' | 'PENDING';
  dailyTransferLimit: number;
  dailySpent: number;
  avatarUrl: string;
  veloTag: string;
}

export interface CategoryBudget {
  name: string;
  icon: string;
  spent: number;
  allocated: number;
  color: string;
}

export interface AIInsight {
  headline: string;
  tip: string;
  recommendedAction: string;
  healthScore: number;
  categoryTip: string;
  recipientSummary?: string;
  utilitySummary?: string;
}

export interface CategorizedExpenseItem {
  category: string;
  amount: number;
  percentage: number;
  aiComment: string;
}

export interface TopBeneficiaryItem {
  name: string;
  bankName: string;
  totalAmount: number;
  count: number;
  percentageOfTransfers: number;
  insight: string;
}

export interface MonthlySpendingReport {
  reportMonth: string;
  headline: string;
  summaryParagraph: string;
  totalSpent: number;
  healthScore: number;
  categorizedExpenses: CategorizedExpenseItem[];
  topBeneficiaries: TopBeneficiaryItem[];
  aiRecommendations: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'CREDIT' | 'DEBIT' | 'SECURITY' | 'REWARD';
  read: boolean;
  amount?: number;
}
