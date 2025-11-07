import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
import { useAuthStore } from '../store/useAuthStore';

type SignInScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { colors, spacing, typography } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signIn = useAuthStore((state) => state.signIn);
  const missionStatement = useAuthStore((state) => state.missionStatement);

  const handleSignIn = () => {
    if (!email) {
      return;
    }
    signIn({ email, password });
  };

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.flex}>
      <View style={[styles.container, { padding: spacing.xl }]}> 
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontSize: typography.fontSize.xl }]}>Welcome back</Text>
          <Text style={{ color: colors.muted, marginTop: spacing.sm, lineHeight: 20 }}>
            {missionStatement}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.muted + '33' }]}
            placeholder="you@study.app"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={[styles.label, { color: colors.muted, marginTop: spacing.md }]}>Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.muted + '33' }]}
            placeholder="Secure & free"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary, marginTop: spacing.lg }]} onPress={handleSignIn}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.secondary }]} onPress={() => navigation.navigate('SignUp')}>
            <Text style={{ color: colors.secondary, fontWeight: '600' }}>Create a free account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Mission')}>
          <Text style={{ color: colors.secondary, textAlign: 'center', marginTop: spacing.lg }}>
            Why we are free forever →
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  header: {
    marginBottom: 32
  },
  title: {
    fontWeight: '700'
  },
  form: {
    width: '100%'
  },
  label: {
    fontSize: 14,
    fontWeight: '500'
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 8
  },
  primaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center'
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center'
  }
});

export default SignInScreen;
