import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/colors';
import { Game } from '@/types/app';

interface GameCardProps {
  game: Game;
  onPress: (game: Game) => void;
}

export default function GameCard({ game, onPress }: GameCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(game)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: game.icon }} style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.name}>{game.name}</Text>
        <Text style={styles.currency}>{game.currency}</Text>
      </View>
      <TouchableOpacity style={styles.earnButton} onPress={() => onPress(game)}>
        <Text style={styles.earnButtonText}>
          EARN {game.currency.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    width: '25%',
    aspectRatio: 1,
    minWidth: 80,
    maxWidth: 120,
    borderRadius: 16,
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  currency: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
  },
  earnButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  earnButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
});