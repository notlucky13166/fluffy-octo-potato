import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FlashcardCarousel from '../components/FlashcardCarousel';
import { useContentStore } from '../store/useContentStore';
import { useTheme } from '../theme/ThemeProvider';

const PracticeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const flashcards = useContentStore((state) => state.flashcards);
  const questions = useContentStore((state) => state.questions);
  const folders = useContentStore((state) => state.folders);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [fadeAnim]);

  const dueFlashcards = useMemo(
    () =>
      flashcards.filter((card) => {
        if (!card.nextReview) {
          return true;
        }
        const next = new Date(card.nextReview).getTime();
        return Number.isFinite(next) ? next <= Date.now() : true;
      }),
    [flashcards]
  );

  const upcomingReviews = useMemo(() => {
    return [...flashcards]
      .filter((card) => card.nextReview)
      .sort((a, b) => new Date(a.nextReview ?? 0).getTime() - new Date(b.nextReview ?? 0).getTime())
      .slice(0, 4)
      .map((card) => ({
        id: card.id,
        title: card.front,
        nextReview: card.nextReview
      }));
  }, [flashcards]);

  const folderSummaries = useMemo(
    () =>
      folders
        .map((folder) => ({
          id: folder.id,
          name: folder.name,
          mastery: folder.mastery,
          insights: folder.insights
        }))
        .filter((folder) => folder.mastery.due > 0 || folder.insights?.flashcardSummary || folder.insights?.quizSummary),
    [folders]
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <LinearGradient
        colors={[colors.surface, colors.primary + '55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroBadge}>
          <Ionicons name="flash" size={16} color="#fff" />
          <Text style={styles.heroBadgeText}>Instant practice from your free AI decks</Text>
        </View>
        <Text style={[styles.heading, { color: '#fff', fontSize: typography.fontSize.xl + 2 }]}>Adaptive Practice</Text>
        <Text style={[styles.heroCopy, { marginTop: spacing.sm }]}>Tap a flashcard to flip, swipe through quick quizzes, and watch your mastery climb across devices.</Text>
      </LinearGradient>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
        <View style={[styles.spacedGrid, { marginBottom: spacing.lg }]}>
          <LinearGradient
            colors={[colors.primary + '66', colors.primary + '11']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.metricCard, { padding: spacing.lg }]}
          >
            <Text style={[styles.metricLabel, { color: 'rgba(255,255,255,0.8)' }]}>Due today</Text>
            <Text style={[styles.metricValue, { color: '#fff' }]}>{dueFlashcards.length}</Text>
            <Text style={[styles.metricHint, { color: 'rgba(255,255,255,0.7)' }]}>Spaced reviews ready</Text>
          </LinearGradient>
          <LinearGradient
            colors={[colors.secondary + '66', colors.secondary + '11']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.metricCard, { padding: spacing.lg }]}
          >
            <Text style={[styles.metricLabel, { color: 'rgba(255,255,255,0.8)' }]}>Upcoming</Text>
            <Text style={[styles.metricValue, { color: '#fff' }]}>{upcomingReviews.length}</Text>
            <Text style={[styles.metricHint, { color: 'rgba(255,255,255,0.7)' }]}>Next 24 hours</Text>
          </LinearGradient>
        </View>

        <FlashcardCarousel items={flashcards.length ? flashcards : sampleFlashcards} />

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.subheading, { color: colors.text }]}>Today's quiz mix</Text>
          {(questions.length ? questions : sampleQuestions).map((question) => (
            <LinearGradient
              key={question.id}
              colors={[colors.surface, colors.primary + '1A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.questionCard, { padding: spacing.lg }]}
            >
              <View style={styles.questionHeader}>
                <View style={[styles.typeBadge, { backgroundColor: colors.primary + '22' }]}> 
                  <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 12 }}>{question.type.toUpperCase()}</Text>
                </View>
                <Text style={{ color: colors.secondary }}>Free</Text>
              </View>
              <Text style={{ color: colors.text, fontWeight: '600', lineHeight: 22 }}>{question.prompt}</Text>
              <Text style={{ color: colors.secondary, marginTop: 8 }}>Difficulty {Math.round(question.difficulty * 100)}%</Text>
            </LinearGradient>
          ))}
        </View>

        <TouchableOpacity style={[styles.cta, { padding: spacing.lg }]}> 
          <LinearGradient colors={[colors.primary, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ctaGradient}>
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Start smart quiz</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4, fontSize: 12 }}>
              Adaptive sessions tuned to your free AI flashcards
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.subheading, { color: colors.text }]}>Spaced repetition timeline</Text>
          {upcomingReviews.length ? (
            upcomingReviews.map((review) => (
              <LinearGradient
                key={review.id}
                colors={[colors.surface, colors.primary + '14']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.timelineCard, { padding: spacing.md }]}
              >
                <Text style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>
                  {review.title}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Ionicons name="time-outline" size={14} color={colors.secondary} />
                  <Text style={{ color: colors.secondary, marginLeft: 6 }}>
                    {new Date(review.nextReview ?? Date.now()).toLocaleString()}
                  </Text>
                </View>
              </LinearGradient>
            ))
          ) : (
            <View style={[styles.emptyTimeline, { borderColor: colors.primary + '44' }]}>
              <Text style={{ color: colors.muted }}>Start reviewing a deck to populate your schedule.</Text>
            </View>
          )}
        </View>

        {folderSummaries.length ? (
          <View style={{ marginTop: spacing.xl }}>
            <Text style={[styles.subheading, { color: colors.text }]}>Folder mastery & AI notes</Text>
            {folderSummaries.map((folder) => (
              <LinearGradient
                key={folder.id}
                colors={[colors.surface, colors.secondary + '14']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.folderCard, { padding: spacing.lg }]}
              >
                <View style={styles.folderHeader}>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>{folder.name}</Text>
                  <View style={[styles.folderBadge, { backgroundColor: colors.secondary + '22' }]}>
                    <Text style={{ color: colors.secondary, fontSize: 12 }}>Due {folder.mastery.due}</Text>
                  </View>
                </View>
                <View style={styles.masteryRow}>
                  {[
                    { label: 'Easy', value: folder.mastery.easy, color: colors.success },
                    { label: 'Medium', value: folder.mastery.medium, color: colors.accent },
                    { label: 'Hard', value: folder.mastery.hard, color: colors.danger }
                  ].map((item) => (
                    <View key={item.label} style={styles.masteryPill}>
                      <View style={[styles.masteryDot, { backgroundColor: item.color }]} />
                      <Text style={{ color: colors.text, fontWeight: '600' }}>{item.value}</Text>
                      <Text style={{ color: colors.muted, fontSize: 12, marginLeft: 4 }}>{item.label}</Text>
                    </View>
                  ))}
                </View>
                {folder.insights?.flashcardSummary ? (
                  <Text style={{ color: colors.text, marginTop: spacing.md }}>
                    {folder.insights.flashcardSummary}
                  </Text>
                ) : null}
                {folder.insights?.followUps?.length ? (
                  <View style={{ marginTop: spacing.sm }}>
                    {folder.insights.followUps.map((task) => (
                      <View key={task} style={[styles.followUpPill, { backgroundColor: colors.surface }]}> 
                        <Ionicons name="sparkles" size={14} color={colors.primary} />
                        <Text style={{ color: colors.text, marginLeft: 6 }}>{task}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </LinearGradient>
            ))}
          </View>
        ) : null}
      </Animated.View>
    </ScrollView>
  );
};

const sampleFlashcards = [
  {
    id: 'bio-1',
    front: 'What organelle is responsible for producing ATP via oxidative phosphorylation?',
    back: 'The mitochondrion, specifically the inner mitochondrial membrane.',
    difficulty: 'medium',
    tags: ['biology']
  },
  {
    id: 'hist-1',
    front: 'Summarize the key points of the Treaty of Versailles.',
    back: 'Imposed reparations on Germany, redrew national boundaries, and established the League of Nations.',
    difficulty: 'hard',
    tags: ['history']
  }
];

const sampleQuestions = [
  {
    id: 'calc-1',
    prompt: 'Differentiate f(x) = 3x^3 - 2x^2 + 4x - 5.',
    type: 'open-ended' as const,
    difficulty: 0.62
  },
  {
    id: 'phy-2',
    prompt: 'A 2kg mass accelerates at 3m/s^2. What is the applied force?',
    type: 'multiple-choice' as const,
    difficulty: 0.48,
    choices: ['5N', '6N', '7N', '8N']
  }
];

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700'
  },
  hero: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 24
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  heroBadgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13
  },
  heroCopy: {
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22
  },
  subheading: {
    fontWeight: '600',
    marginBottom: 12
  },
  questionCard: {
    borderRadius: 20,
    marginBottom: 12
  },
  cta: {
    borderRadius: 18,
    marginTop: 24
  },
  ctaGradient: {
    borderRadius: 18,
    padding: 18
  },
  spacedGrid: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap'
  },
  metricCard: {
    borderRadius: 20,
    flexBasis: '48%'
  },
  metricLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 6
  },
  metricHint: {
    marginTop: 8,
    fontSize: 12
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  timelineCard: {
    borderRadius: 18,
    marginBottom: 12
  },
  emptyTimeline: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center'
  },
  folderCard: {
    borderRadius: 22,
    marginBottom: 16
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  folderBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  masteryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12
  },
  masteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(148, 163, 184, 0.15)'
  },
  masteryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8
  },
  followUpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 6
  }
});

export default PracticeScreen;
