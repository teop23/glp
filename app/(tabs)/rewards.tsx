import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { Gift, CreditCard as Edit, Search, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { POPULAR_GAMES } from '@/constants/data';
import { Game } from '@/types/app';
import GameCard from '@/components/GameCard';
import TopBar from '@/components/TopBar';

export default function RewardsScreen() {
  const { user, selectedGame, setSelectedGame } = useApp();
  const [showGameModal, setShowGameModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyText}>
            Please sign in to view your rewards
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredGames = POPULAR_GAMES.filter(game =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.currency.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
    setShowGameModal(false);
    setSearchQuery('');
  };

  const GameSelectionModal = () => (
    <Modal
      visible={showGameModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowGameModal(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowGameModal(false)}
      >
        <TouchableOpacity 
          style={styles.gameModal}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Game & Currency</Text>
            <TouchableOpacity 
              onPress={() => setShowGameModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={Colors.textMuted} />
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
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              blurOnSubmit={false}
            />
          </View>

          <ScrollView 
            style={styles.gamesList} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            <Text style={styles.sectionTitle}>Popular Games</Text>
            
            <View style={styles.gamesGrid}>
              {filteredGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPress={handleGameSelect}
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
                    onPress={() => handleGameSelect({
                      id: 'custom',
                      name: 'Custom Game',
                      currency: 'Custom Currency',
                      icon: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
                      category: 'Custom',
                    })}
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
                      onPress={() => handleGameSelect({
                        id: 'custom',
                        name: 'Custom Game',
                        currency: 'Custom Currency',
                        icon: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
                        category: 'Custom',
                      })}
                    >
                      <Text style={styles.customEarnButtonText}>EARN CUSTOM</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Your Reward</Text>
        <Text style={styles.subtitle}>
          Currently earning towards your selected game
        </Text>

        {selectedGame ? (
          <View style={styles.selectedGameCard}>
            <Image source={{ uri: selectedGame.icon }} style={styles.gameIcon} />
            <View style={styles.gameInfo}>
              <Text style={styles.gameName}>{selectedGame.name}</Text>
              <Text style={styles.gameCurrency}>Earning {selectedGame.currency}</Text>
            </View>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => setShowGameModal(true)}
            >
              <Edit size={20} color={Colors.primary} />
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noGameCard}>
            <View style={styles.noGameIcon}>
              <Gift size={48} color={Colors.textMuted} />
            </View>
            <Text style={styles.noGameTitle}>No Game Selected</Text>
            <Text style={styles.noGameDescription}>
              Choose a game to start earning rewards
            </Text>
            <TouchableOpacity 
              style={styles.selectGameButton}
              onPress={() => setShowGameModal(true)}
            >
              <Text style={styles.selectGameButtonText}>Select Game</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Earning Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <View style={styles.progressItem}>
                <Text style={styles.progressValue}>${user.totalEarnings.toFixed(2)}</Text>
                <Text style={styles.progressLabel}>Total Earned</Text>
              </View>
              <View style={styles.progressItem}>
                <Text style={styles.progressValue}>{user.offersCompleted}</Text>
                <Text style={styles.progressLabel}>Offers Completed</Text>
              </View>
            </View>
            
            <View style={styles.nextPayoutContainer}>
              <Text style={styles.nextPayoutText}>Next payout at $20.00</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { 
                  width: `${Math.min((user.totalEarnings / 20) * 100, 100)}%` 
                }]} />
              </View>
              <Text style={styles.progressAmount}>
                ${user.totalEarnings.toFixed(2)} / $20.00
              </Text>
            </View>
          </View>
        </View>

        {/* Reward Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>How Rewards Work</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              • Complete offers and surveys to earn money
            </Text>
            <Text style={styles.infoText}>
              • Cash out as {selectedGame?.currency || 'game currency'} when you reach $5.00
            </Text>
            <Text style={styles.infoText}>
              • Rewards are delivered within 24 hours
            </Text>
            <Text style={styles.infoText}>
              • No expiration on your earnings
            </Text>
          </View>
        </View>
      </ScrollView>

      <GameSelectionModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    marginBottom: 24,
  },
  selectedGameCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  gameCurrency: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  changeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  noGameCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 40,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  noGameIcon: {
    marginBottom: 16,
  },
  noGameTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  noGameDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  selectGameButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectGameButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  nextPayoutContainer: {
    alignItems: 'center',
  },
  nextPayoutText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressAmount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameModal: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
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
  gamesList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 16,
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
});