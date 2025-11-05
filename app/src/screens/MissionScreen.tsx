import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { useTheme } from '../theme/ThemeProvider';
import { useAuthStore } from '../store/useAuthStore';

const missionPillars = [
  {
    title: 'Free forever',
    copy: 'AI flashcards, quizzes, and study folders stay 100% free thanks to efficient Supabase infrastructure and GPT-4o mini workloads.'
  },
  {
    title: 'Built for every device',
    copy: 'We obsess over responsive design so your study flow syncs seamlessly from desktop to mobile.'
  },
  {
    title: 'Community powered',
    copy: 'Collaborative folders and shared mastery dashboards keep cohorts aligned on progress without paywalls.'
  }
];

const roadmap = [
  'Accessibility upgrades: captions, dyslexia-friendly fonts, keyboard navigation',
  'Deeper analytics: mastery forecasting, AI-powered review plans, study streak insights',
  'Expanded AI labs: conversational tutors, live quiz jams, and curriculum-aligned templates'
];

type MissionScreenProps = NativeStackScreenProps<AuthStackParamList, 'Mission'>;

const MissionScreen: React.FC<MissionScreenProps> = ({ navigation }) => {
  const { colors, spacing, typography } = useTheme();
  const missionStatement = useAuthStore((state) => state.missionStatement);
  const donationVision = useAuthStore((state) => state.donationVision);

  return (
    <LinearGradient colors={[colors.background, colors.surface]} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl }}>
        <Text style={{ color: colors.secondary, fontWeight: '600' }}>Our mission</Text>
        <Text
          style={{
            color: colors.text,
            fontSize: typography.fontSize.xl,
            fontWeight: '700',
            marginTop: spacing.sm,
            lineHeight: 30
          }}
        >
          {missionStatement}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.secondary + '33', marginTop: spacing.xl }]}> 
          <Text style={{ color: colors.text, fontWeight: '600' }}>How we bring it to life</Text>
          {missionPillars.map((pillar) => (
            <View key={pillar.title} style={[styles.pillarRow, { borderColor: colors.muted + '22' }]}> 
              <Text style={{ color: colors.text, fontWeight: '600' }}>{pillar.title}</Text>
              <Text style={{ color: colors.muted, marginTop: 6 }}>{pillar.copy}</Text>
            </View>
          ))}
        </View>

        <LinearGradient
          colors={[colors.primary + '44', colors.secondary + '33']}
          style={[styles.card, { marginTop: spacing.xl }]}
        >
          <Text style={{ color: colors.text, fontWeight: '700' }}>Optional supporter roadmap</Text>
          <Text style={{ color: colors.muted, marginTop: spacing.sm }}>{donationVision}</Text>
          <View style={{ marginTop: spacing.md }}>
            {roadmap.map((item) => (
              <View key={item} style={styles.roadmapItem}>
                <View style={[styles.bullet, { backgroundColor: colors.primary }]} />
                <Text style={{ color: colors.text, flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <Text style={{ color: colors.muted, textAlign: 'center', marginTop: spacing.xl }} onPress={() => navigation.goBack()}>
          ← Back to sign in
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1
  },
  pillarRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1
  },
  roadmapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 999
  }
});

export default MissionScreen;
