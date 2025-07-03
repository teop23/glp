import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Users, Link, Copy, MessageSquare, Mail, ExternalLink } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import TopBar from '@/components/TopBar';

export default function InviteScreen() {
  const { user } = useApp();
  const [customMessage, setCustomMessage] = useState('');

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Sign In Required</Text>
          <Text style={styles.emptyText}>
            Please sign in to access the referral program
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const referralLink = `https://lootplay.app/join/${user.referralCode}`;
  const referralEarnings = 0; // This would come from user data
  const pendingEarnings = 0; // This would come from user data

  const copyToClipboard = async () => {
    try {
      // In a real app, you'd use Clipboard API
      Alert.alert('Copied!', 'Referral link copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `Join me on LootPlay and earn free gift cards! Use my code: ${user.referralCode}\n\n${referralLink}`,
        url: referralLink,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const shareViaEmail = () => {
    // In a real app, you'd integrate with email client
    Alert.alert('Email Share', 'Opening email client...');
  };

  const shareViaSMS = () => {
    // In a real app, you'd integrate with SMS
    Alert.alert('SMS Share', 'Opening messages app...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Invite Friends</Text>
        <Text style={styles.subtitle}>
          Earn by helping others
        </Text>

        {/* Earnings Overview */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsRow}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>${referralEarnings}</Text>
              <Text style={styles.earningsLabel}>Referral Earnings</Text>
            </View>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsAmount}>${pendingEarnings}</Text>
              <Text style={styles.earningsLabel}>Pending Earnings</Text>
            </View>
          </View>
        </View>

        {/* How it Works */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.cardTitle}>How it Works</Text>
          
          <View style={styles.stepContainer}>
            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Link size={20} color={Colors.primary} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Earn by helping others</Text>
                <Text style={styles.stepDescription}>
                  Share your unique link - receive $2.50 for every friend that installs a game. They'll get $5 too!
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <ExternalLink size={20} color={Colors.primary} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Get more when they cashout</Text>
                <Text style={styles.stepDescription}>
                  You'll receive an extra $10 when your friend makes their first withdrawal.
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepIcon}>
                <Users size={20} color={Colors.primary} />
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Keep it fair</Text>
                <Text style={styles.stepDescription}>
                  We only reward you for real new users from eligible countries who sign up and play. No duplicate accounts allowed.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Referral Link */}
        <View style={styles.linkCard}>
          <Text style={styles.cardTitle}>Your Referral Link</Text>
          <View style={styles.linkContainer}>
            <TextInput
              style={styles.linkInput}
              value={referralLink}
              editable={false}
              selectTextOnFocus
            />
            <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
              <Copy size={20} color={Colors.background} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.shareButton} onPress={shareLink}>
            <Text style={styles.shareButtonText}>Share link</Text>
          </TouchableOpacity>
        </View>

        {/* Share Options */}
        <View style={styles.shareOptionsCard}>
          <Text style={styles.cardTitle}>Share via</Text>
          <View style={styles.shareOptions}>
            <TouchableOpacity style={styles.shareOption} onPress={shareViaSMS}>
              <MessageSquare size={24} color={Colors.primary} />
              <Text style={styles.shareOptionText}>Messages</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareOption} onPress={shareViaEmail}>
              <Mail size={24} color={Colors.primary} />
              <Text style={styles.shareOptionText}>Email</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.shareOption} onPress={shareLink}>
              <ExternalLink size={24} color={Colors.primary} />
              <Text style={styles.shareOptionText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Friends Status */}
        <View style={styles.friendsCard}>
          <Text style={styles.cardTitle}>Friends joined</Text>
          <View style={styles.emptyFriends}>
            <Users size={48} color={Colors.textMuted} />
            <Text style={styles.emptyFriendsTitle}>No friends invited yet</Text>
            <Text style={styles.emptyFriendsText}>
              Share your link to invite your first friend
            </Text>
          </View>
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
  earningsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  earningsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  howItWorksCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 16,
  },
  stepContainer: {
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  linkCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  linkContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  linkInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  copyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
  shareOptionsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareOption: {
    alignItems: 'center',
    gap: 8,
  },
  shareOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  friendsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyFriends: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyFriendsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyFriendsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    textAlign: 'center',
  },
});