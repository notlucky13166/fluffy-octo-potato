import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FlashcardCarousel from '../components/FlashcardCarousel';
import { useContentStore } from '../store/useContentStore';
import { useTheme } from '../theme/ThemeProvider';

const PracticeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const flashcards = useContentStore((state) => state.flashcards);
  const questions = useContentStore((state) => state.questions);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize.xl }]}>Adaptive Practice</Text>
      <Text style={{ color: colors.muted, marginBottom: spacing.lg }}>
        Tap a flashcard to flip, swipe through quick quizzes, and track mastery.
      </Text>

      <FlashcardCarousel items={flashcards.length ? flashcards : sampleFlashcards} />

      <View style={{ marginTop: spacing.xl }}>
        <Text style={[styles.subheading, { color: colors.text }]}>Today's Quiz Mix</Text>
        {(questions.length ? questions : sampleQuestions).map((question) => (
          <View key={question.id} style={[styles.questionCard, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
            <Text style={{ color: colors.muted, marginBottom: 4 }}>{question.type.toUpperCase()}</Text>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{question.prompt}</Text>
            <Text style={{ color: colors.secondary, marginTop: 8 }}>Difficulty {Math.round(question.difficulty * 100)}%</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={[styles.cta, { backgroundColor: colors.primary, padding: spacing.lg }]}> 
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>Start smart quiz</Text>
      </TouchableOpacity>
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
  subheading: {
    fontWeight: '600',
    marginBottom: 12
  },
  questionCard: {
    borderRadius: 18,
    marginBottom: 12
  },
  cta: {
    borderRadius: 18,
    marginTop: 24
  }
});

export default PracticeScreen;
