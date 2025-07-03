import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { ArrowLeft, ExternalLink, Clock, CircleCheck as CheckCircle, Lock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useLocalSearchParams, router } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

interface OfferEvent {
  name: string;
  payout: string;
  payable: boolean;
  points: string;
}

interface OfferDetails {
  id: number;
  anchor: string;
  description: string;
  icon_url: string;
  total_points: string;
  click_url: string;
  requirements: string;
  confirmation_time: string;
  events: OfferEvent[];
}

export default function OfferDetailsScreen() {
  const { user, selectedGame } = useApp();
  const params = useLocalSearchParams();
  
  // Parse the offer data from URL params
  const offer: OfferDetails = JSON.parse(params.offer as string);

  const handleStartOffer = async () => {
    try {
      const supported = await Linking.canOpenURL(offer.click_url);
      if (supported) {
        await Linking.openURL(offer.click_url);
      } else {
        Alert.alert('Error', 'Cannot open this offer link');
      }
    } catch (error) {
      console.error('Error opening offer:', error);
      Alert.alert('Error', 'Failed to open offer');
    }
  };

  const payableEvents = offer.events.filter(event => event.payable);
  const firstPayableEvent = payableEvents[0];
  const finalEvent = payableEvents[payableEvents.length - 1];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offer Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Offer Header */}
        <View style={styles.offerHeader}>
          <Image source={{ uri: offer.icon_url }} style={styles.offerIcon} />
          <View style={styles.offerInfo}>
            <Text style={styles.offerTitle}>{offer.anchor}</Text>
            <Text style={styles.totalReward}>${parseFloat(offer.total_points).toFixed(2)}</Text>
          </View>
        </View>

        {/* Game Currency Display */}
        {selectedGame && (
          <View style={styles.currencyCard}>
            <Text style={styles.currencyText}>
              Earning {selectedGame.currency} for {selectedGame.name}
            </Text>
          </View>
        )}

        {/* Bonus Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bonus Rewards 💰</Text>
          <Text style={styles.sectionSubtitle}>
            Earn instant bonuses by completing bonuses!
          </Text>

          <View style={styles.milestonesContainer}>
            {payableEvents.map((event, index) => (
              <View key={index} style={styles.milestoneCard}>
                <View style={styles.milestoneIcon}>
                  {index === 0 ? (
                    <CheckCircle size={20} color={Colors.success} />
                  ) : (
                    <Lock size={20} color={Colors.textMuted} />
                  )}
                </View>
                <View style={styles.milestoneContent}>
                  <Text style={styles.milestoneName}>{event.name}</Text>
                  <Text style={styles.milestoneReward}>
                    ${parseFloat(event.payout).toFixed(2)}
                  </Text>
                </View>
                {index === 0 && (
                  <View style={styles.availableBadge}>
                    <Text style={styles.availableText}>Available</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ${firstPayableEvent ? parseFloat(firstPayableEvent.payout).toFixed(2) : '0.00'}
              </Text>
              <Text style={styles.statLabel}>First reward</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                ${finalEvent ? parseFloat(finalEvent.payout).toFixed(2) : '0.00'}
              </Text>
              <Text style={styles.statLabel}>Final reward</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{payableEvents.length}</Text>
              <Text style={styles.statLabel}>Total milestones</Text>
            </View>
          </View>
        </View>

        {/* Rewards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rewards</Text>
          
          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Text style={styles.rewardAmount}>
                ${parseFloat(offer.total_points).toFixed(2)} / session
              </Text>
              <View style={styles.rewardMeta}>
                <Clock size={16} color={Colors.textMuted} />
                <Text style={styles.rewardTime}>{offer.confirmation_time}</Text>
              </View>
            </View>
          </View>

          {/* Individual Rewards */}
          <View style={styles.individualRewards}>
            <Text style={styles.rewardsTitle}>Individual Rewards</Text>
            {payableEvents.slice(0, 4).map((event, index) => (
              <View key={index} style={styles.rewardItem}>
                <View style={styles.rewardItemContent}>
                  <Text style={styles.rewardItemTitle}>{event.name}</Text>
                  <Text style={styles.rewardItemAmount}>
                    ${parseFloat(event.payout).toFixed(2)}
                  </Text>
                </View>
                {index === 0 && (
                  <View style={styles.activeIndicator}>
                    <CheckCircle size={16} color={Colors.success} />
                  </View>
                )}
              </View>
            ))}
            
            {payableEvents.length > 4 && (
              <Text style={styles.moreRewards}>
                +{payableEvents.length - 4} more rewards available
              </Text>
            )}
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsText}>{offer.requirements}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Offer</Text>
          <Text style={styles.description}>{offer.description}</Text>
        </View>
      </ScrollView>

      {/* Start Button */}
      <View style={styles.startButtonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartOffer}>
          <ExternalLink size={20} color={Colors.background} />
          <Text style={styles.startButtonText}>Start Earning</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  offerIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  offerInfo: {
    flex: 1,
  },
  offerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  totalReward: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  currencyCard: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  currencyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    marginBottom: 16,
  },
  milestonesContainer: {
    gap: 12,
    marginBottom: 20,
  },
  milestoneCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  milestoneIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  milestoneReward: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  availableBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availableText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  rewardCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  rewardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  individualRewards: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rewardsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rewardItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardItemTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  rewardItemAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  activeIndicator: {
    marginLeft: 8,
  },
  moreRewards: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  requirementsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  requirementsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  startButtonContainer: {
    padding: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  startButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
});