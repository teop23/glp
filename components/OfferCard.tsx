import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Clock, Star } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Offer } from '@/types/app';

interface OfferCardProps {
  offer: Offer;
  onPress: (offer: Offer) => void;
}

export default function OfferCard({ offer, onPress }: OfferCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return Colors.success;
      case 'medium': return Colors.warning;
      case 'hard': return Colors.error;
      default: return Colors.textMuted;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, offer.isPremium && styles.premiumCard]}
      onPress={() => onPress(offer)}
      activeOpacity={0.8}
    >
      {offer.isPremium && (
        <View style={styles.premiumBadge}>
          <Star size={12} color={Colors.background} />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
      )}
      
      <Image source={{ uri: offer.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{offer.title}</Text>
        <Text style={styles.description}>{offer.description}</Text>
        
        <View style={styles.meta}>
          <View style={styles.reward}>
            <Text style={styles.rewardAmount}>${(offer.reward / 100).toFixed(2)}</Text>
          </View>
          
          <View style={styles.details}>
            <View style={styles.timeContainer}>
              <Clock size={12} color={Colors.textMuted} />
              <Text style={styles.timeText}>{offer.timeEstimate}</Text>
            </View>
            
            <View style={[styles.difficultyBadge, { borderColor: getDifficultyColor(offer.difficulty) }]}>
              <Text style={[styles.difficultyText, { color: getDifficultyColor(offer.difficulty) }]}>
                {offer.difficulty}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
    gap: 4,
  },
  premiumText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  meta: {
    gap: 12,
  },
  reward: {
    alignSelf: 'flex-start',
  },
  rewardAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'capitalize',
  },
});