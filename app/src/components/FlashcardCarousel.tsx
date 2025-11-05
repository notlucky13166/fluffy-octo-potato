import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Flashcard } from '../store/useContentStore';
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

  const handleFlip = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFlipped((prev) => !prev);
  };

  const handleNext = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex((prev) => (prev + 1) % items.length);
    setFlipped(false);
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
        colors={[colors.surface, colors.primary + '12']}
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
      <View style={styles.footer}>
        <Text style={{ color: colors.muted }}>
          {activeIndex + 1} / {items.length}
        </Text>
        <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: colors.primary }]}>
          <Text style={{ color: '#fff', marginRight: 4 }}>Next</Text>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
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
  }
});

export default FlashcardCarousel;
