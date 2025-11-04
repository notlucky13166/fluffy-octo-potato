import React from 'react';
import { ScrollView, View, Text, StyleSheet, Switch } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useUserStore } from '../store/useUserStore';

const ProfileScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const name = useUserStore((state) => state.name);
  const streak = useUserStore((state) => state.streak);
  const badges = useUserStore((state) => state.badges);
  const themePreference = useUserStore((state) => state.themePreference);
  const setThemePreference = useUserStore((state) => state.setThemePreference);

  const toggleDarkMode = () => {
    setThemePreference(themePreference === 'dark' ? 'light' : 'dark');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <View style={[styles.header, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
        <Text style={{ color: colors.muted }}>Astral Alias</Text>
        <Text style={[styles.name, { color: colors.text, fontSize: typography.fontSize.xl }]}>{name}</Text>
        <Text style={{ color: colors.secondary }}>🔥 {streak} day streak</Text>
      </View>

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
          <Switch value={themePreference === 'dark'} onValueChange={toggleDarkMode} thumbColor={themePreference === 'dark' ? colors.primary : '#f4f3f4'} />
        </View>
        <View style={styles.preferenceRow}> 
          <View>
            <Text style={{ color: colors.text, fontWeight: '600' }}>AI coaching intensity</Text>
            <Text style={{ color: colors.muted }}>Balanced</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    borderRadius: 20,
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
  }
});

export default ProfileScreen;
