import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  Dimensions,
  Image,
  Linking,
  RefreshControl,
} from 'react-native';
import { Clock, TrendingUp, Wifi, WifiOff, CircleAlert as AlertCircle, ExternalLink, RefreshCcw } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import TopBar from '@/components/TopBar';
import { router } from 'expo-router';

const { height: screenHeight } = Dimensions.get('window');

interface BitLabsOffer {
  id: number;
  anchor: string;
  description: string;
  icon_url: string;
  total_points: string;
  click_url: string;
  requirements: string;
  confirmation_time: string;
  events: Array<{
    name: string;
    payout: string;
    payable: boolean;
  }>;
  app_metadata?: {
    categories?: string[];
  };
}

interface BitLabsResponse {
  data: {
    offers: BitLabsOffer[];
  };
  status: string;
}

export default function EarnScreen() {
  const [activeTab, setActiveTab] = useState<'offers' | 'surveys'>('offers');
  const [offers, setOffers] = useState<BitLabsOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user, selectedGame, completeOffer } = useApp();

  const fetchOffers = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    setError(null);

    try {
      const options = {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-Api-Token': '90a9f690-08b8-49a8-baea-88b19ee0f69a',
          'X-User-Id': user?.id || 'testuser'
        }
      };

      const response = await fetch(
        'https://api.bitlabs.ai/v2/client/offers?devices=&in_app=true&client_user_agent=Android&client_ip=98.97.10.231&is_game=true',
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: BitLabsResponse = await response.json();
      
      if (data.status === 'success' && data.data?.offers) {
        setOffers(data.data.offers);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load offers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOffers();
    }
  }, [user]);

  if (!user || !selectedGame) {
    return (
      <SafeAreaView style={styles.container}>
        <TopBar />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Select a Game First</Text>
          <Text style={styles.emptyText}>
            Go to the Home tab and select a game to start earning rewards!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const nextPayoutAmount = 20;
  const progressPercentage = Math.min((user.totalEarnings / nextPayoutAmount) * 100, 100);

  const handleOfferPress = async (offer: BitLabsOffer) => {
    // Navigate to offer details page instead of opening URL directly
    router.push({
      pathname: '/offer-details',
      params: {
        offer: JSON.stringify(offer)
      }
    });
  };

  const handleRefresh = () => {
    fetchOffers(true);
  };

  const getDifficultyFromEvents = (events: BitLabsOffer['events']) => {
    const payableEvents = events.filter(e => e.payable);
    if (payableEvents.length <= 3) return 'easy';
    if (payableEvents.length <= 6) return 'medium';
    return 'hard';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return Colors.success;
      case 'medium': return Colors.warning;
      case 'hard': return Colors.error;
      default: return Colors.textMuted;
    }
  };

  const getTimeEstimate = (events: BitLabsOffer['events']) => {
    const payableEvents = events.filter(e => e.payable);
    if (payableEvents.length <= 3) return '5-15 min';
    if (payableEvents.length <= 6) return '30-60 min';
    return '1-2 hours';
  };

  const filteredOffers = offers.filter(offer => {
    if (activeTab === 'surveys') {
      return offer.anchor.toLowerCase().includes('survey') || 
             offer.description.toLowerCase().includes('survey');
    }
    return !offer.anchor.toLowerCase().includes('survey') && 
           !offer.description.toLowerCase().includes('survey');
  });

  const OfferCard = ({ offer }: { offer: BitLabsOffer }) => {
    const difficulty = getDifficultyFromEvents(offer.events);
    const timeEstimate = getTimeEstimate(offer.events);
    const isHighValue = parseFloat(offer.total_points) > 10;

    return (
      <TouchableOpacity 
        style={[styles.offerCard, isHighValue && styles.premiumCard]}
        onPress={() => handleOfferPress(offer)}
        activeOpacity={0.8}
      >
        {isHighValue && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>High Value</Text>
          </View>
        )}
        
        <Image source={{ uri: offer.icon_url }} style={styles.offerImage} />
        
        <View style={styles.offerContent}>
          <Text style={styles.offerTitle} numberOfLines={2}>{offer.anchor}</Text>
          <Text style={styles.offerDescription} numberOfLines={3}>
            {offer.description}
          </Text>
          
          <View style={styles.offerMeta}>
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardAmount}>${parseFloat(offer.total_points).toFixed(2)}</Text>
            </View>
            
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Clock size={14} color={Colors.textMuted} />
                <Text style={styles.metaText}>{timeEstimate}</Text>
              </View>
              
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(difficulty) + '20' }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(difficulty) }]}>
                  {difficulty}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsText} numberOfLines={2}>
              {offer.requirements || 'Complete the listed objectives to earn rewards'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.earnButton}>
          <ExternalLink size={16} color={Colors.background} style={styles.earnButtonIcon} />
          <Text style={styles.earnButtonText}>VIEW OFFER</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const LoadingState = () => (
    <View style={styles.loadingContainer}>
      <RefreshCcw size={32} color={Colors.primary} />
      <Text style={styles.loadingText}>Loading offers...</Text>
    </View>
  );

  const ErrorState = () => (
    <View style={styles.errorContainer}>
      <AlertCircle size={48} color={Colors.error} />
      <Text style={styles.errorTitle}>Failed to Load Offers</Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={() => fetchOffers()}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyOffersContainer}>
      <WifiOff size={48} color={Colors.textMuted} />
      <Text style={styles.emptyOffersTitle}>No {activeTab} Available</Text>
      <Text style={styles.emptyOffersText}>
        Check back later for new {activeTab} or try switching tabs
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
        <RefreshCcw size={16} color={Colors.primary} />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.balanceSection}>
            <Text style={styles.balanceAmount}>${user.totalEarnings.toFixed(2)}</Text>
            <Text style={styles.gameText}>Earning {selectedGame.currency} for {selectedGame.name}</Text>
          </View>
          
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>Next payout for ${nextPayoutAmount}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressAmount}>${user.totalEarnings.toFixed(2)}/${nextPayoutAmount}</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'offers' && styles.activeTab]}
            onPress={() => setActiveTab('offers')}
          >
            <Text style={[styles.tabText, activeTab === 'offers' && styles.activeTabText]}>
              Offers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'surveys' && styles.activeTab]}
            onPress={() => setActiveTab('surveys')}
          >
            <Text style={[styles.tabText, activeTab === 'surveys' && styles.activeTabText]}>
              Surveys
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.availableSection}>
            <Text style={styles.availableText}>
              {filteredOffers.length} {activeTab} available
            </Text>
            <View style={styles.statusContainer}>
              <Wifi size={16} color={Colors.success} />
              <Text style={styles.statusText}>BitLabs Connected</Text>
            </View>
          </View>

          <Text style={styles.totalEarnText}>
            ${filteredOffers.reduce((sum, offer) => sum + parseFloat(offer.total_points), 0).toFixed(2)} to earn
          </Text>

          {loading && <LoadingState />}
          
          {error && !loading && <ErrorState />}
          
          {!loading && !error && filteredOffers.length === 0 && <EmptyState />}
          
          {!loading && !error && filteredOffers.length > 0 && (
            <View style={styles.offersContainer}>
              {filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flex: 1,
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
    lineHeight: 24,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  gameText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  progressSection: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.surface,
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 0,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.primary,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  availableSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  availableText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.success,
  },
  totalEarnText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
    marginBottom: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    marginTop: 16,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.error,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  emptyOffersContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyOffersTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyOffersText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  refreshButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  offersContainer: {
    gap: 16,
  },
  offerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  premiumCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceVariant,
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 1,
  },
  premiumText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  offerImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: Colors.cardBackground,
  },
  offerContent: {
    marginBottom: 16,
  },
  offerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  offerDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  offerMeta: {
    gap: 8,
    marginBottom: 12,
  },
  rewardContainer: {
    alignSelf: 'flex-start',
  },
  rewardAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
  },
  requirementsContainer: {
    backgroundColor: Colors.cardBackground,
    padding: 12,
    borderRadius: 8,
  },
  requirementsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    lineHeight: 16,
  },
  earnButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  earnButtonIcon: {
    marginRight: -4,
  },
  earnButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
});