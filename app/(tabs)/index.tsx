import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { POPULAR_GAMES } from '@/constants/data';
import { Game } from '@/types/app';
import GameCard from '@/components/GameCard';
import AuthModal from '@/components/AuthModal';
import TopBar from '@/components/TopBar';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedGameForModal, setSelectedGameForModal] = useState<Game | null>(null);
  const { user, setSelectedGame, showAuthModal, setShowAuthModal, selectedGame } = useApp();

  // Redirect to earn page if user is logged in and has selected a game
  React.useEffect(() => {
    if (user && selectedGame) {
      router.replace('/(tabs)/earn');
    }
  }, [user, selectedGame]);

  const filteredGames = POPULAR_GAMES.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGamePress = (game: Game) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedGameForModal(game);
    setShowCurrencyModal(true);
  };

  const handleConfirmSelection = () => {
    if (selectedGameForModal) {
      setSelectedGame(selectedGameForModal);
      setShowCurrencyModal(false);
      setSelectedGameForModal(null);
    }
  };

  const CurrencySelectionModal = () => (
    <Modal
      visible={showCurrencyModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCurrencyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.currencyModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Confirm Selection</Text>
            <TouchableOpacity 
              onPress={() => setShowCurrencyModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
          
          {selectedGameForModal && (
            <View style={styles.modalContent}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{selectedGameForModal.name}</Text>
                <Text style={styles.currencyText}>Currency: {selectedGameForModal.currency}</Text>
              </View>
              
              <Text style={styles.confirmText}>
                You'll earn {selectedGameForModal.currency} for {selectedGameForModal.name} by completing offers and surveys.
              </Text>
              
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleConfirmSelection}
              >
                <Text style={styles.confirmButtonText}>Start Earning {selectedGameForModal.currency}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {user && <TopBar />}
      
      <View style={styles.header}>
        <Text style={styles.title}>Easy Gems</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for your game"
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Popular Games</Text>
        <Text style={styles.sectionSubtitle}>Or search for your game above!</Text>

        <View style={styles.gamesGrid}>
          {filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPress={handleGamePress}
            />
          ))}
        </View>

        {filteredGames.length === 0 && (
          <>
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No games found</Text>
              <Text style={styles.noResultsSubtext}>Try searching for a different game</Text>
            </View>
            
            <View style={styles.customGameSection}>
              <Text style={styles.customGameTitle}>Can't find your game?</Text>
              <Text style={styles.customGameSubtext}>
                No problem! We can payout to any game through google play or ios store gift cards!
              </Text>
              <TouchableOpacity 
                style={styles.customGameCard}
                onPress={() => {
                  if (!user) {
                    setShowAuthModal(true);
                    return;
                  }
                  setSelectedGameForModal({
                    id: 'custom',
                    name: 'Custom Game',
                    currency: 'Custom Currency',
                    icon: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
                    category: 'Custom',
                  });
                  setShowCurrencyModal(true);
                }}
              >
                <View style={styles.customGameIcon}>
                  <Text style={styles.customGameIconText}>+</Text>
                </View>
                <View style={styles.customGameContent}>
                  <Text style={styles.customGameName}>Custom Game</Text>
                  <Text style={styles.customGameDescription}>Earn any currency</Text>
                </View>
                <TouchableOpacity 
                  style={styles.customEarnButton}
                  onPress={() => {
                    if (!user) {
                      setShowAuthModal(true);
                      return;
                    }
                    setSelectedGameForModal({
                      id: 'custom',
                      name: 'Custom Game',
                      currency: 'Custom Currency',
                      icon: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
                      category: 'Custom',
                    });
                    setShowCurrencyModal(true);
                  }}
                >
                  <Text style={styles.customEarnButtonText}>EARN CUSTOM</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <CurrencySelectionModal />
      <AuthModal 
        visible={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        selectedCurrency={selectedGameForModal?.currency}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    paddingVertical: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    marginBottom: 24,
  },
  gamesGrid: {
    gap: 16,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  customGameSection: {
    marginTop: 32,
  },
  customGameTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  customGameSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  customGameCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  customGameIcon: {
    width: '25%',
    aspectRatio: 1,
    minWidth: 80,
    maxWidth: 120,
    borderRadius: 16,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  customGameIconText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  customGameContent: {
    alignItems: 'center',
    marginBottom: 16,
  },
  customGameName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  customGameDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  customEarnButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  customEarnButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  currencyModal: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    alignItems: 'center',
  },
  gameInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gameName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  currencyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
  },
  confirmText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
});