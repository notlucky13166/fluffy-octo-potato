import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
import { useAuthStore } from '../store/useAuthStore';

const donationTiers = [5, 10, 15, 25];

type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { colors, spacing, typography } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [donationOptIn, setDonationOptIn] = useState(false);
  const [donationAmount, setDonationAmount] = useState(donationTiers[0]);
  const signUp = useAuthStore((state) => state.signUp);
  const donationVision = useAuthStore((state) => state.donationVision);

  const handleSignUp = () => {
    if (!name || !email) {
      return;
    }

    signUp({
      name,
      email,
      password,
      donationOptIn,
      donationAmount: donationOptIn ? donationAmount : undefined
    });
  };

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={styles.flex}>
      <View style={[styles.container, { padding: spacing.xl }]}> 
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text, fontSize: typography.fontSize.xl }]}>Create your free space</Text>
          <Text style={{ color: colors.muted, marginTop: spacing.sm, lineHeight: 20 }}>
            {donationVision}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.muted }]}>Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.muted + '33' }]}
            placeholder="Nova Learner"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
          />
          <Text style={[styles.label, { color: colors.muted, marginTop: spacing.md }]}>Email</Text>
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
            placeholder="Make it memorable"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={[styles.supporterCard, { backgroundColor: colors.secondary + '15', borderColor: colors.secondary + '33' }]}> 
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1, paddingRight: spacing.md }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Join future supporter list</Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>
                  Opt-in now and we'll reach out when optional donations open.
                </Text>
              </View>
              <Switch
                value={donationOptIn}
                onValueChange={setDonationOptIn}
                thumbColor={donationOptIn ? colors.accent : '#f4f3f4'}
                trackColor={{ false: colors.muted + '33', true: colors.accent + '55' }}
              />
            </View>
            {donationOptIn && (
              <View style={styles.tierRow}>
                {donationTiers.map((tier) => {
                  const active = donationAmount === tier;
                  return (
                    <TouchableOpacity
                      key={tier}
                      onPress={() => setDonationAmount(tier)}
                      style={[
                        styles.tierButton,
                        {
                          backgroundColor: active ? colors.primary + '55' : colors.surface,
                          borderColor: active ? colors.primary : colors.surface
                        }
                      ]}
                    >
                      <Text style={{ color: active ? colors.primary : colors.text }}>${tier}/mo</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>

          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.primary, marginTop: spacing.lg }]} onPress={handleSignUp}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Sign up free</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.secondaryButton, { borderColor: colors.secondary }]} onPress={() => navigation.navigate('SignIn')}>
            <Text style={{ color: colors.secondary, fontWeight: '600' }}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </View>
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
  supporterCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    marginTop: 24
  },
  tierRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16
  },
  tierButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1
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

export default SignUpScreen;
