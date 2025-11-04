import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const CollaborateScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize.xl }]}>Learn with your crew</Text>
      <Text style={{ color: colors.muted, marginBottom: spacing.lg }}>
        Launch group quizzes, share flashcard decks, and annotate lessons in real time.
      </Text>

      <View style={[styles.card, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Study nebula: Neuro Finals</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>12 members · 48 shared flashcards</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]}> 
          <Text style={styles.buttonText}>Join live quiz</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Add collaborators</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
          Generate an invite link and co-create decks with friends or classmates.
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}> 
          <Text style={styles.buttonText}>Create invite</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Community challenges</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>Weekly streak race · Research sprint</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]}> 
          <Text style={styles.buttonText}>View leaderboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700'
  },
  card: {
    borderRadius: 20,
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
