import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Gift, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';

export default function TopBar() {
  const { user } = useApp();

  if (!user) return null;

  const handleRewardsPress = () => {
    router.push('/(tabs)/rewards');
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.centerContent}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceAmount}>${user.totalEarnings.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <TouchableOpacity onPress={handleRewardsPress} style={styles.iconButton}>
          <Gift size={24} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileButton: {
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  centerContent: {
    flex: 2,
    alignItems: 'center',
  },
  balanceContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  balanceAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  rightContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
});