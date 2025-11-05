import React, { useEffect, useRef } from 'react';
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
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [fadeAnim]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <LinearGradient colors={[colors.secondary, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="flash" size={16} color="#fff" />
          <Text style={styles.heroBadgeText}>Instant practice from your free AI decks</Text>
        </View>
        <Text style={[styles.heading, { color: '#fff', fontSize: typography.fontSize.xl + 2 }]}>Adaptive Practice</Text>
        <Text style={[styles.heroCopy, { marginTop: spacing.sm }]}>Tap a flashcard to flip, swipe through quick quizzes, and watch your mastery climb across devices.</Text>
      </LinearGradient>

      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
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
  }
});

export default PracticeScreen;
