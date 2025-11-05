import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

const CollaborateScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <LinearGradient colors={[colors.primary, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="people" size={16} color="#fff" />
          <Text style={styles.heroBadgeText}>Share your free AI decks instantly</Text>
        </View>
        <Text style={[styles.heading, { color: '#fff', fontSize: typography.fontSize.xl + 2 }]}>Learn with your crew</Text>
        <Text style={[styles.heroCopy, { marginTop: spacing.sm }]}>Launch group quizzes, share flashcard decks, and annotate lessons together in real time.</Text>
      </LinearGradient>

      <LinearGradient colors={[colors.surface, colors.primary + '14']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, { padding: spacing.lg }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Study nebula: Neuro Finals</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>12 members · 48 shared flashcards</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]}> 
          <Text style={styles.buttonText}>Join live quiz</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={[colors.surface, colors.secondary + '14']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, { padding: spacing.lg }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Add collaborators</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
          Generate an invite link and co-create decks with friends or classmates.
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}> 
          <Text style={styles.buttonText}>Create invite</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={[colors.surface, colors.accent + '14']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, { padding: spacing.lg }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Community challenges</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>Weekly streak race · Research sprint</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]}> 
          <Text style={styles.buttonText}>View leaderboard</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

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
  card: {
    borderRadius: 22,
    marginBottom: 20
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 18
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600'
  }
});

export default CollaborateScreen;
