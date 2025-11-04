import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
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
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleFlip}
        style={[styles.card, { backgroundColor: colors.surface, padding: spacing.xl }]}
      >
        <Text style={{ color: colors.muted, textTransform: 'uppercase', fontSize: typography.fontSize.sm }}>
          {card.difficulty.toUpperCase()}
        </Text>
        <Text style={[styles.content, { color: colors.text, fontSize: typography.fontSize.lg }]}>
          {flipped ? card.back : card.front}
        </Text>
        <Text style={{ color: colors.secondary, marginTop: spacing.md }}>
          Tap to {flipped ? 'view prompt' : 'reveal answer'}
        </Text>
      </TouchableOpacity>
      <View style={styles.footer}> 
        <Text style={{ color: colors.muted }}>
          {activeIndex + 1} / {items.length}
        </Text>
        <TouchableOpacity onPress={handleNext} style={[styles.nextButton, { backgroundColor: colors.primary }]}> 
          <Text style={{ color: '#fff' }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    minHeight: 200,
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
    borderRadius: 12
  },
  emptyState: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center'
  }
});

export default FlashcardCarousel;
