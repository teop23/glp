export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  totalEarnings: number;
  offersCompleted: number;
  level: number;
  selectedGame?: Game;
  referralCode: string;
  joinDate: Date;
}

export interface Game {
  id: string;
  name: string;
  currency: string;
  icon: string;
  category: string;
  isPopular?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: 'app' | 'survey' | 'game' | 'signup';
  image: string;
  timeEstimate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isPremium?: boolean;
  category: string;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'cashout' | 'referral';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}