import React from 'react';
import { ScrollView, View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useUserStore } from '../store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';

const ProfileScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const name = useUserStore((state) => state.name);
  const streak = useUserStore((state) => state.streak);
  const badges = useUserStore((state) => state.badges);
  const themePreference = useUserStore((state) => state.themePreference);
  const setThemePreference = useUserStore((state) => state.setThemePreference);
  const donationOptIn = useUserStore((state) => state.donationOptIn);
  const donationAmount = useUserStore((state) => state.donationAmount);
  const setDonationOptIn = useUserStore((state) => state.setDonationOptIn);
  const setDonationAmount = useUserStore((state) => state.setDonationAmount);
  const missionStatement = useAuthStore((state) => state.missionStatement);
  const donationVision = useAuthStore((state) => state.donationVision);
  const signOut = useAuthStore((state) => state.signOut);

  const toggleDarkMode = () => {
    setThemePreference(themePreference === 'dark' ? 'light' : 'dark');
  };

  const donationTiers = [5, 10, 15, 25];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <LinearGradient colors={[colors.primary, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.header, { padding: spacing.lg }]}>
        <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Astral Alias</Text>
        <Text style={[styles.name, { color: '#fff', fontSize: typography.fontSize.xl }]}>{name}</Text>
        <Text style={{ color: '#fff', marginTop: spacing.sm }}>🔥 {streak} day streak</Text>
        <View style={styles.planBadge}>
          <Ionicons name="infinite" size={16} color={colors.primary} />
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Free AI plan active</Text>
        </View>
      </LinearGradient>

      <LinearGradient
        colors={[colors.surface, colors.secondary + '33']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.section, styles.missionCard, { padding: spacing.lg }]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Our mission</Text>
        <Text style={{ color: colors.muted, lineHeight: 20 }}>{missionStatement}</Text>
        <View style={[styles.missionHighlight, { backgroundColor: colors.secondary + '22' }]}> 
          <Ionicons name="planet" size={18} color={colors.secondary} />
          <Text style={{ color: colors.secondary, flex: 1, marginLeft: spacing.sm }}>
            {donationVision}
          </Text>
        </View>
      </LinearGradient>

      <View style={[styles.section, { backgroundColor: colors.surface, padding: spacing.lg }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Badges</Text>
        {badges.length ? (
          <View style={styles.badgeGrid}>
            {badges.map((badge) => (
              <View key={badge} style={[styles.badgeChip, { backgroundColor: colors.secondary + '33' }]}> 
                <Text style={{ color: colors.secondary }}>{badge}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ color: colors.muted }}>No badges yet. Complete challenges to earn some!</Text>
        )}
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, padding: spacing.lg }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Dark mode</Text>
            <Text style={{ color: colors.muted }}>Override system theme</Text>
          </View>
          <Switch
            value={themePreference === 'dark'}
            onValueChange={toggleDarkMode}
            thumbColor={themePreference === 'dark' ? colors.primary : '#f4f3f4'}
            trackColor={{ false: colors.muted + '33', true: colors.primary + '66' }}
          />
        </View>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={{ color: colors.text, fontWeight: '600' }}>AI coaching intensity</Text>
            <Text style={{ color: colors.muted }}>Balanced</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, padding: spacing.lg }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Optional supporter mode</Text>
        <Text style={{ color: colors.muted, marginBottom: spacing.md }}>
          Keep everything free-first while chipping in when you can. Donations will unlock expanded AI labs and accessibility upgrades.
        </Text>
        <View style={styles.preferenceRow}>
          <View>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Pledge support</Text>
            <Text style={{ color: colors.muted }}>Toggle to join the future supporter list</Text>
          </View>
          <Switch
            value={donationOptIn}
            onValueChange={setDonationOptIn}
            thumbColor={donationOptIn ? colors.accent : '#f4f3f4'}
            trackColor={{ false: colors.muted + '33', true: colors.accent + '55' }}
          />
        </View>
        {donationOptIn && (
          <View style={styles.donationTierRow}>
            {donationTiers.map((tier) => {
              const active = donationAmount === tier;
              return (
                <TouchableOpacity
                  key={tier}
                  onPress={() => setDonationAmount(tier)}
                  style={[
                    styles.donationChip,
                    { backgroundColor: active ? colors.primary + '55' : colors.background }
                  ]}
                >
                  <Text style={{ color: active ? colors.primary : colors.text }}>${tier}/mo</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        {donationOptIn && (
          <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
            You can adjust or cancel anytime. We will email you before we open contributions.
          </Text>
        )}
      </View>

      <TouchableOpacity style={[styles.signOutButton, { borderColor: colors.muted + '55' }]} onPress={signOut}>
        <Ionicons name="exit-outline" size={18} color={colors.muted} />
        <Text style={{ color: colors.muted, marginLeft: spacing.sm, fontWeight: '600' }}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    borderRadius: 24,
    marginBottom: 24
  },
  name: {
    fontWeight: '700',
    marginTop: 4
  },
  section: {
    borderRadius: 20,
    marginBottom: 20
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  badgeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16
  },
  planBadge: {
    marginTop: 16,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  missionCard: {
    borderRadius: 20,
    marginBottom: 20
  },
  missionHighlight: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginTop: 16
  },
  donationTierRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16
  },
  donationChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14
  },
  signOutButton: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  }
});

export default ProfileScreen;
