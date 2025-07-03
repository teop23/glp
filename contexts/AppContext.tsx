import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Game, Offer } from '@/types/app';
import { SAMPLE_USER, SAMPLE_OFFERS } from '@/constants/data';

interface AppContextType {
  user: User | null;
  selectedGame: Game | null;
  offers: Offer[];
  isAuthenticated: boolean;
  showAuthModal: boolean;
  setUser: (user: User | null) => void;
  setSelectedGame: (game: Game | null) => void;
  setShowAuthModal: (show: boolean) => void;
  completeOffer: (offerId: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [offers] = useState<Offer[]>(SAMPLE_OFFERS);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAuthenticated = !!user;

  const completeOffer = (offerId: string) => {
    if (!user) return;
    
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      setUser({
        ...user,
        totalEarnings: user.totalEarnings + (offer.reward / 100),
        offersCompleted: user.offersCompleted + 1,
      });
    }
  };

  const logout = () => {
    setUser(null);
    setSelectedGame(null);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        selectedGame,
        offers,
        isAuthenticated,
        showAuthModal,
        setUser,
        setSelectedGame,
        setShowAuthModal,
        completeOffer,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}