import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useDashboardQuery } from '../api/hooks';
import DashboardCard from '../components/DashboardCard';
import ProgressChart from '../components/ProgressChart';
import { useTheme } from '../theme/ThemeProvider';
import { useProgressStore } from '../store/useProgressStore';
import { buildDailySchedule } from '../utils/schedule';

const HomeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { data } = useDashboardQuery();
  const mastery = useProgressStore((state) => state.mastery);

  const streak = data?.streak ?? 5;
  const recommendations: string[] = data?.recommendations ?? [
    'Focus on application questions for Calculus II',
    'Review your AI flashcards on Cellular Respiration',
    'Invite a friend to join your memory sprint'
  ];
  const schedule = buildDailySchedule();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize.xxl }]}>Welcome back 👋</Text>
      <Text style={{ color: colors.muted, marginBottom: spacing.xl }}>
        Here is a snapshot of your learning universe today.
      </Text>

      <View style={styles.cardGrid}>
        <DashboardCard title="Streak" value={`${streak} days`} subtitle="Keep the flame alive" accentColor={colors.accent} />
        <DashboardCard title="Mastery" value="68%" subtitle="Up 6% this week" accentColor={colors.secondary} />
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Skill Constellation</Text>
        <ProgressChart data={mastery} />
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Hyper-focus suggestions</Text>
        {recommendations.map((recommendation) => (
          <View key={recommendation} style={[styles.recommendation, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
            <Text style={{ color: colors.text }}>{recommendation}</Text>
          </View>
        ))}
      </View>

      <View style={{ marginTop: spacing.xl }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's schedule</Text>
        {schedule.map((session) => (
          <View key={session.id} style={[styles.schedule, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
            <Text style={{ color: colors.text, fontWeight: '600' }}>{session.title}</Text>
            <Text style={{ color: colors.muted }}>{session.focusArea}</Text>
            <Text style={{ color: colors.secondary }}>{session.durationMinutes} min · {session.recommendedStart}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700'
  },
  cardGrid: {
    flexDirection: 'row',
    gap: 16
  },
  section: {
    borderRadius: 20,
    marginTop: 24
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12
  },
  recommendation: {
    marginTop: 12,
    borderRadius: 16
  },
  schedule: {
    marginTop: 12,
    borderRadius: 16
  }
});

export default HomeScreen;
