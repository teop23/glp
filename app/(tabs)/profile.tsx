import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { User, Settings, LogOut, CreditCard, MessageSquare, CircleHelp as HelpCircle, Star } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import TopBar from '@/components/TopBar';

export default function ProfileScreen() {
  const { user, selectedGame, logout } = useApp();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyText}>
            Please sign in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleCashOut = () => {
    if (user.totalEarnings < 5) {
      Alert.alert('Minimum Balance', 'You need at least $5.00 to cash out.');
      return;
    }
    router.push('/cashout');
  };

  const levelProgress = (user.offersCompleted % 10) * 10; // 10 offers per level

  const ProfileSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const MenuItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showArrow = true 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    subtitle?: string; 
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.menuIcon}>{icon}</View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <Text style={styles.menuArrow}>›</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.username.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>${user.totalEarnings.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Total Earnings</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.offersCompleted}</Text>
                <Text style={styles.statLabel}>Offers Completed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Level Progress */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Level {user.level}</Text>
            <Text style={styles.levelText}>{1000 - (user.level * 100)} coins to level up</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${levelProgress}%` }]} />
          </View>
        </View>

        {/* Current Game */}
        {selectedGame && (
          <ProfileSection title="Current Game">
            <View style={styles.gameCard}>
              <View style={styles.gameInfo}>
                <Text style={styles.gameName}>{selectedGame.name}</Text>
                <Text style={styles.gameCurrency}>Earning {selectedGame.currency}</Text>
              </View>
            </View>
          </ProfileSection>
        )}

        {/* Actions */}
        <ProfileSection title="Earnings">
          <MenuItem
            icon={<CreditCard size={20} color={Colors.primary} />}
            title="Withdrawals"
            onPress={() => Alert.alert('Withdrawals', 'View withdrawal history')}
          />
        </ProfileSection>

        <ProfileSection title="Started offers">
          <View style={styles.offersGrid}>
            <View style={styles.offerItem}>
              <Text style={styles.offerTitle}>Word Collect</Text>
              <Text style={styles.offerReward}>$387.54</Text>
            </View>
            <View style={styles.offerItem}>
              <Text style={styles.offerTitle}>Royal Match</Text>
              <Text style={styles.offerReward}>$405.64</Text>
            </View>
          </View>
        </ProfileSection>

        <ProfileSection title="Support">
          <MenuItem
            icon={<MessageSquare size={20} color={Colors.primary} />}
            title="Members Chat"
            onPress={() => Alert.alert('Members Chat', 'Opening chat...')}
          />
          <MenuItem
            icon={<HelpCircle size={20} color={Colors.primary} />}
            title="Support"
            onPress={() => Alert.alert('Support', 'Opening support...')}
          />
        </ProfileSection>

        {/* Cash Out Button */}
        <TouchableOpacity 
          style={[styles.cashOutButton, user.totalEarnings < 5 && styles.cashOutButtonDisabled]} 
          onPress={handleCashOut}
          disabled={user.totalEarnings < 5}
        >
          <Text style={styles.cashOutButtonText}>
            {user.totalEarnings >= 5 ? 'Cash Out Now' : `Need $${(5 - user.totalEarnings).toFixed(2)} more to cash out`}
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  settingsButton: {
    padding: 8,
  },
  userCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  levelCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 12,
  },
  gameCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gameInfo: {
    alignItems: 'center',
  },
  gameName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  gameCurrency: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    marginTop: 2,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  offersGrid: {
    gap: 12,
  },
  offerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  offerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  offerReward: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  cashOutButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  cashOutButtonDisabled: {
    backgroundColor: Colors.border,
  },
  cashOutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.error,
    marginBottom: 40,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.error,
  },
});