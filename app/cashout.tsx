import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { ArrowLeft, Gift } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';

export default function CashoutScreen() {
  const { user, selectedGame } = useApp();
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  if (!user || !selectedGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Game Selected</Text>
          <Text style={styles.emptyText}>
            Please select a game first to cash out rewards
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const maxAmount = Math.floor(user.totalEarnings);
  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxAmount;

  const handleCashout = () => {
    if (!isValidAmount) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address');
      return;
    }

    Alert.alert(
      'Confirm Cashout',
      `Are you sure you want to redeem $${amount} worth of ${selectedGame.currency} for ${selectedGame.name}?\n\nReward will be sent to: ${email}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success!', `Your ${selectedGame.currency} will be delivered to ${email} within 24 hours.`);
            router.back();
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Cash Out</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Game Info */}
        <View style={styles.gameCard}>
          <View style={styles.gameIcon}>
            <Gift size={32} color={Colors.primary} />
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameName}>{selectedGame.name}</Text>
            <Text style={styles.gameCurrency}>{selectedGame.currency}</Text>
          </View>
        </View>

        {/* Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>${user.totalEarnings.toFixed(2)}</Text>
        </View>

        {/* Amount Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Redemption Amount (USD)</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.inputHint}>
            Minimum: $5.00 • Maximum: ${maxAmount.toFixed(2)}
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.emailInput}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Text style={styles.inputHint}>
            Your {selectedGame.currency} will be delivered to this email
          </Text>
        </View>

        {/* Delivery Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Delivery Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Currency:</Text>
            <Text style={styles.infoValue}>{selectedGame.currency}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Game:</Text>
            <Text style={styles.infoValue}>{selectedGame.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivery method:</Text>
            <Text style={styles.infoValue}>Email</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Delivery time:</Text>
            <Text style={styles.infoValue}>Within 24 hours</Text>
          </View>
        </View>

        {/* Cash Out Button */}
        <TouchableOpacity
          style={[styles.cashoutButton, !isValidAmount && styles.cashoutButtonDisabled]}
          onPress={handleCashout}
          disabled={!isValidAmount}
        >
          <Text style={styles.cashoutButtonText}>
            {isValidAmount ? `Redeem $${amount} of ${selectedGame.currency}` : 'Enter valid amount'}
          </Text>
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
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
  },
  gameCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  gameCurrency: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
  },
  balanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  dollarSign: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    paddingVertical: 16,
  },
  emailInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
  },
  inputHint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
  },
  cashoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cashoutButtonDisabled: {
    backgroundColor: Colors.border,
  },
  cashoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.background,
  },
});