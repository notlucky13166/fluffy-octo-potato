import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Flashcard, ReviewGrade, useContentStore } from '../store/useContentStore';
import { useTheme } from '../theme/ThemeProvider';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FlashcardCarouselProps {
  items: Flashcard[];
}

const FlashcardCarousel: React.FC<FlashcardCarouselProps> = ({ items }) => {
  const { colors, spacing, typography } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const reviewFlashcard = useContentStore((state) => state.reviewFlashcard);

  const handleFlip = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFlipped((prev) => !prev);
  };

  const handleNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex((prev) => (prev + 1) % items.length);
    setFlipped(false);
  };

  const handleGrade = (grade: ReviewGrade) => {
    const current = items[activeIndex];
    if (!current) {
      return;
    }
    reviewFlashcard(current.id, grade);
    handleNext();
  };

  const relativeReviewTime = (iso?: string) => {
    if (!iso) {
      return 'Review now';
    }
    const target = new Date(iso).getTime();
    if (!Number.isFinite(target)) {
      return 'Review now';
    }
    const deltaMinutes = Math.round((target - Date.now()) / (1000 * 60));
    if (deltaMinutes <= 0) {
      return 'Due now';
    }
    if (deltaMinutes < 60) {
      return `In ${deltaMinutes} min`;
    }
    const deltaHours = Math.round(deltaMinutes / 60);
    if (deltaHours < 24) {
      return `In ${deltaHours} hr`;
    }
    const deltaDays = Math.round(deltaHours / 24);
    return `In ${deltaDays} day${deltaDays === 1 ? '' : 's'}`;
  };

  const card = items[activeIndex];

  if (!card) {
    return (
      <View style={[styles.emptyState, { borderColor: colors.muted }]}> 
        <Text style={{ color: colors.muted }}>No flashcards yet.</Text>
      </View>
    );
  }

  return (
    <View>
      <LinearGradient
        colors={[colors.surface, colors.primary + '22']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { padding: spacing.xl }]}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={handleFlip} style={{ flex: 1 }}>
          <View style={styles.cardHeader}>
            <View style={[styles.difficultyBadge, { backgroundColor: colors.primary + '22' }]}> 
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: typography.fontSize.sm }}>
                {card.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={styles.freePill}> 
              <Ionicons name="sparkles-outline" size={14} color={colors.secondary} />
              <Text style={{ color: colors.secondary, fontSize: typography.fontSize.sm, fontWeight: '600' }}>Free AI</Text>
            </View>
          </View>
          <Text style={[styles.content, { color: colors.text, fontSize: typography.fontSize.lg }]}>
            {flipped ? card.back : card.front}
          </Text>
          <Text style={{ color: colors.secondary, marginTop: spacing.md }}>
            Tap to {flipped ? 'view prompt' : 'reveal answer'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={[styles.metaRow, { marginTop: spacing.md }]}>
        <View style={[styles.metaPill, { backgroundColor: colors.primary + '22' }]}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={{ color: colors.primary, marginLeft: 6, fontSize: typography.fontSize.sm }}>
            {relativeReviewTime(card.nextReview)}
          </Text>
        </View>
        <View style={[styles.metaPill, { backgroundColor: colors.secondary + '22' }]}>
          <Ionicons name="repeat-outline" size={14} color={colors.secondary} />
          <Text style={{ color: colors.secondary, marginLeft: 6, fontSize: typography.fontSize.sm }}>
            {card.reviewCount ?? 0} review{(card.reviewCount ?? 0) === 1 ? '' : 's'}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={{ color: colors.muted }}>
          {activeIndex + 1} / {items.length}
        </Text>
        <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#fff', marginRight: 4 }}>Skip</Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={[styles.gradeRow, { marginTop: spacing.md }]}>
        <TouchableOpacity
          onPress={() => handleGrade('again')}
          style={[styles.gradeButton, { backgroundColor: colors.danger + '33' }]}
        >
          <Ionicons name="close" size={16} color={colors.danger} />
          <Text style={{ color: colors.danger, marginLeft: 6 }}>Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleGrade('hard')}
          style={[styles.gradeButton, { backgroundColor: colors.accent + '33' }]}
        >
          <Ionicons name="cloudy" size={16} color={colors.accent} />
          <Text style={{ color: colors.accent, marginLeft: 6 }}>Hard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleGrade('good')}
          style={[styles.gradeButton, { backgroundColor: colors.secondary + '33' }]}
        >
          <Ionicons name="thumbs-up" size={16} color={colors.secondary} />
          <Text style={{ color: colors.secondary, marginLeft: 6 }}>Good</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleGrade('easy')}
          style={[styles.gradeButton, { backgroundColor: colors.success + '33' }]}
        >
          <Ionicons name="sparkles" size={16} color={colors.success} />
          <Text style={{ color: colors.success, marginLeft: 6 }}>Easy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    minHeight: 220,
    justifyContent: 'space-between'
  },
  content: {
    fontWeight: '600'
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nextButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  freePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  gradeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  gradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8
  }
});

export default FlashcardCarousel;
