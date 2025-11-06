import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardQuery } from '../api/hooks';
import DashboardCard from '../components/DashboardCard';
import ProgressChart from '../components/ProgressChart';
import { useTheme } from '../theme/ThemeProvider';
import { useProgressStore } from '../store/useProgressStore';
import { useContentStore } from '../store/useContentStore';
import { buildDailySchedule } from '../utils/schedule';

const featureShortcuts = [
  { icon: 'scan-outline' as const, title: 'AI Scanner', gradient: ['#F97316', '#FB923C'] },
  { icon: 'create-outline' as const, title: 'AI Summary', gradient: ['#22C55E', '#4ADE80'] },
  { icon: 'newspaper-outline' as const, title: 'Mock Exam', gradient: ['#0EA5E9', '#38BDF8'] },
  { icon: 'sparkles-outline' as const, title: 'Quiz Creator', gradient: ['#8B5CF6', '#A855F7'] }
];

const suggestionPrompts = [
  'Explain neural plasticity in simple terms',
  'Quiz me on 19th century art',
  'Summarize the carbon cycle PDF'
];

const HomeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { data } = useDashboardQuery();
  const mastery = useProgressStore((state) => state.mastery);
  const folders = useContentStore((state) => state.folders);
  const { width } = useWindowDimensions();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;

  const streak = data?.streak ?? 5;
  const recommendations: string[] = data?.recommendations ?? [
    'Focus on application questions for Calculus II',
    'Review your AI flashcards on Cellular Respiration',
    'Invite a friend to join your memory sprint'
  ];
  const schedule = buildDailySchedule();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  }, [fadeIn, heroTranslate]);

  const isCompact = width < 768;

  const totalReferences = useMemo(
    () => folders.reduce((count, folder) => count + folder.files.length, 0),
    [folders]
  );

  const totalDue = useMemo(
    () => folders.reduce((count, folder) => count + (folder.mastery?.due ?? 0), 0),
    [folders]
  );

  const collaboratorCount = useMemo(
    () => folders.reduce((count, folder) => count + folder.collaborators.length, 0),
    [folders]
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <LinearGradient colors={['#0B1120', '#1E1B4B', '#3B0764']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, { padding: spacing.xl }]}> 
        <Animated.View
          style={{
            opacity: fadeIn,
            transform: [{ translateY: heroTranslate }]
          }}
        >
          <View style={styles.heroBadge}>
            <Ionicons name="planet" size={16} color="#fff" />
            <Text style={styles.heroBadgeText}>AetherLearn is 100% free to create with AI</Text>
          </View>
          <Text style={[styles.heroPrompt, { color: '#fff', fontSize: typography.fontSize.xxl + 4 }]}>How can I help you?</Text>
          <View style={styles.suggestionColumn}>
            {suggestionPrompts.map((prompt) => (
              <View key={prompt} style={styles.suggestionPill}>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: typography.fontSize.sm }}>{prompt}</Text>
              </View>
            ))}
          </View>
          <View style={styles.promptBar}>
            <Ionicons name="add" size={18} color="rgba(255,255,255,0.7)" />
            <Text style={{ color: 'rgba(255,255,255,0.7)', flex: 1, marginLeft: 10 }}>Ask anything…</Text>
            <View style={styles.promptIcons}>
              <Ionicons name="image-outline" size={18} color="#fff" />
              <Ionicons name="mic-outline" size={18} color="#fff" style={{ marginLeft: 12 }} />
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: heroTranslate }] }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: spacing.lg, paddingHorizontal: spacing.xl }}
          style={{ marginHorizontal: -spacing.xl }}
        >
          <View style={styles.shortcutRow}>
            {featureShortcuts.map((feature) => (
              <LinearGradient
                key={feature.title}
                colors={feature.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.shortcutCard, { padding: spacing.md }]}
              >
                <View style={styles.shortcutIcon}>
                  <Ionicons name={feature.icon} size={20} color="#fff" />
                </View>
                <Text style={{ color: '#fff', fontWeight: '600', marginTop: spacing.sm }}>{feature.title}</Text>
              </LinearGradient>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.cardGrid, { marginTop: spacing.xl }]}>
          <DashboardCard
            title="Streak"
            value={`${streak} days`}
            subtitle="Keep the flame alive"
            accentColor={colors.accent}
            style={{ flexBasis: isCompact ? '100%' : '48%' }}
          />
          <DashboardCard
            title="Reviews due"
            value={totalDue.toString()}
            subtitle="Spaced for today"
            accentColor={colors.secondary}
            style={{ flexBasis: isCompact ? '100%' : '48%' }}
          />
          <DashboardCard
            title="Collaborators"
            value={collaboratorCount.toString()}
            subtitle="Friends in your study nebula"
            accentColor={colors.primary}
            style={{ flexBasis: '100%' }}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, padding: spacing.lg }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Skill constellation</Text>
          <ProgressChart data={mastery} />
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your study library</Text>
          {folders.length ? (
            <View style={{ marginTop: spacing.md }}>
              {folders.slice(0, 3).map((folder) => (
                <LinearGradient
                  key={folder.id}
                  colors={[colors.surface, colors.primary + '22']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.libraryCard, { padding: spacing.lg }]}
                >
                  <View style={styles.libraryHeader}>
                    <View style={[styles.folderIcon, { backgroundColor: colors.secondary + '22' }]}> 
                      <Ionicons name="folder" size={18} color={colors.secondary} />
                    </View>
                    <Text style={{ color: colors.secondary, fontWeight: '600' }}>Free</Text>
                  </View>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>{folder.name}</Text>
                  {folder.description ? (
                    <Text style={{ color: colors.muted, marginTop: 4 }}>{folder.description}</Text>
                  ) : null}
                  <View style={styles.libraryMetaRow}>
                    <View style={styles.libraryPill}>
                      <Ionicons name="time-outline" size={14} color={colors.secondary} />
                      <Text style={{ color: colors.secondary, marginLeft: 6, fontSize: 12 }}>{folder.mastery.due} due</Text>
                    </View>
                    <View style={styles.libraryPill}>
                      <Ionicons name="document-text-outline" size={14} color={colors.primary} />
                      <Text style={{ color: colors.primary, marginLeft: 6, fontSize: 12 }}>{folder.files.length} files</Text>
                    </View>
                    {folder.collaborators.length ? (
                      <View style={styles.libraryPill}>
                        <Ionicons name="people-outline" size={14} color={colors.accent} />
                        <Text style={{ color: colors.accent, marginLeft: 6, fontSize: 12 }}>
                          {folder.collaborators.length} collaborators
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  {folder.insights?.flashcardSummary ? (
                    <Text style={{ color: colors.muted, marginTop: spacing.sm }} numberOfLines={2}>
                      {folder.insights.flashcardSummary}
                    </Text>
                  ) : null}
                </LinearGradient>
              ))}
              {folders.length > 3 ? (
                <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
                  +{folders.length - 3} more folders waiting in the Create tab
                </Text>
              ) : null}
              <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
                {totalReferences} total files ready for flashcards and quizzes.
              </Text>
            </View>
          ) : (
            <View style={[styles.libraryEmpty, { backgroundColor: colors.surface, padding: spacing.lg }]}>
              <Ionicons name="folder-open" size={22} color={colors.secondary} />
              <Text style={{ color: colors.text, fontWeight: '600', marginTop: spacing.sm }}>Create your first folder</Text>
              <Text style={{ color: colors.muted, marginTop: 4, textAlign: 'center' }}>
                Visit the Create tab to add PDFs or images. Our AI will transform every upload into free flashcards and quizzes.
              </Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hyper-focus suggestions</Text>
          {recommendations.map((recommendation) => (
            <View
              key={recommendation}
              style={[styles.recommendation, { backgroundColor: colors.surface, padding: spacing.lg }]}
            >
              <Text style={{ color: colors.text }}>{recommendation}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's schedule</Text>
          {schedule.map((session) => (
            <LinearGradient
              key={session.id}
              colors={[colors.surface, colors.secondary + '22']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.schedule, { padding: spacing.lg }]}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>{session.title}</Text>
              <Text style={{ color: colors.muted }}>{session.focusArea}</Text>
              <Text style={{ color: colors.secondary }}>{session.durationMinutes} min · {session.recommendedStart}</Text>
            </LinearGradient>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700'
  },
  hero: {
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 260
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  heroBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  },
  heroPrompt: {
    fontWeight: '700',
    marginTop: 18
  },
  suggestionColumn: {
    marginTop: 16,
    gap: 10
  },
  suggestionPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16
  },
  promptBar: {
    marginTop: 20,
    backgroundColor: 'rgba(15,23,42,0.7)',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  promptIcons: {
    flexDirection: 'row'
  },
  shortcutRow: {
    flexDirection: 'row',
    gap: 16
  },
  shortcutCard: {
    borderRadius: 24,
    width: 140
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    borderRadius: 18
  },
  libraryCard: {
    borderRadius: 20,
    marginBottom: 12
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  folderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  libraryMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  },
  libraryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.08)'
  },
  libraryEmpty: {
    borderRadius: 20,
    alignItems: 'center'
  }
});

export default HomeScreen;
