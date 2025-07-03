import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { SAMPLE_USER } from '@/constants/data';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCurrency?: string;
}

export default function AuthModal({ visible, onClose, selectedCurrency }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useApp();

  const handleAuth = () => {
    if (!email || !password || (isSignUp && !username)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate authentication
    setUser({
      ...SAMPLE_USER,
      email,
      username: username || email.split('@')[0],
    });
    
    setEmail('');
    setUsername('');
    setPassword('');
    onClose();
  };

  const resetForm = () => {
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isSignUp ? 'Sign Up for Free' : 'Welcome Back'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={Colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            {isSignUp && (
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={Colors.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
              <Text style={styles.authButtonText}>
                {isSignUp 
                  ? `Start earning ${selectedCurrency || 'now'}` 
                  : 'Sign In'
                }
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={switchMode} style={styles.switchButton}>
              <Text style={styles.switchText}>
                {isSignUp 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Sign Up"
                }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.modalBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  authButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.background,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  switchText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.primary,
  },
});