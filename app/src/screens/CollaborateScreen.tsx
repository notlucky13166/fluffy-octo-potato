import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useContentStore } from '../store/useContentStore';

const CollaborateScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const folders = useContentStore((state) => state.folders);
  const addCollaborator = useContentStore((state) => state.addCollaborator);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(folders[0]?.id ?? null);
  const [invitee, setInvitee] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const activeFolder = useMemo(() => folders.find((folder) => folder.id === activeFolderId) ?? null, [folders, activeFolderId]);

  const handleInvite = () => {
    if (!activeFolder) {
      setStatus('Choose a folder to share.');
      return;
    }
    const trimmed = invitee.trim();
    if (!trimmed) {
      setStatus('Enter an email or username to invite.');
      return;
    }
    addCollaborator(activeFolder.id, trimmed);
    setInvitee('');
    setStatus(`Invite link sent to ${trimmed}.`);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <LinearGradient colors={['#0B1120', '#1E1B4B', '#3B0764']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="people" size={16} color="#fff" />
          <Text style={styles.heroBadgeText}>Share your free AI decks instantly</Text>
        </View>
        <Text style={[styles.heading, { color: '#fff', fontSize: typography.fontSize.xl + 2 }]}>Learn with your crew</Text>
        <Text style={[styles.heroCopy, { marginTop: spacing.sm }]}>Launch group quizzes, share flashcard folders, and annotate lessons together in real time.</Text>
      </LinearGradient>

      <View style={[styles.card, { padding: spacing.lg, backgroundColor: colors.surface }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Shared study folders</Text>
        {folders.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.md }}>
            {folders.map((folder) => {
              const isActive = folder.id === activeFolderId;
              return (
                <TouchableOpacity
                  key={folder.id}
                  onPress={() => setActiveFolderId(folder.id)}
                  style={[styles.folderChip, { borderColor: isActive ? colors.secondary : colors.surface, backgroundColor: isActive ? colors.secondary + '22' : colors.surface }]}
                >
                  <Ionicons name="folder" size={18} color={isActive ? colors.secondary : colors.muted} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>{folder.name}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{folder.collaborators.length} collaborators · {folder.mastery.due} due</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <Text style={{ color: colors.muted, marginTop: spacing.md }}>Create a folder in the Create tab to start collaborating.</Text>
        )}

        {activeFolder ? (
          <View style={{ marginTop: spacing.lg }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{activeFolder.name}</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>
              {activeFolder.description ?? 'Invite friends to add notes, drop PDFs, and co-generate quizzes.'}
            </Text>

            <View style={[styles.inviteRow, { backgroundColor: colors.background, borderColor: colors.secondary + '33' }]}> 
              <Ionicons name="link-outline" size={18} color={colors.secondary} />
              <TextInput
                value={invitee}
                onChangeText={setInvitee}
                placeholder="Email or username"
                placeholderTextColor={colors.muted}
                style={{ flex: 1, color: colors.text, marginLeft: 8 }}
              />
              <TouchableOpacity style={[styles.inviteButton, { backgroundColor: colors.secondary }]} onPress={handleInvite}>
                <Text style={{ color: '#fff', fontWeight: '600' }}>Send</Text>
              </TouchableOpacity>
            </View>

            {status ? <Text style={{ color: colors.secondary, marginTop: spacing.sm }}>{status}</Text> : null}

            {activeFolder.collaborators.length ? (
              <View style={{ marginTop: spacing.md }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Current collaborators</Text>
                <View style={styles.collaboratorRow}>
                  {activeFolder.collaborators.map((person) => (
                    <View key={person} style={[styles.collaboratorChip, { backgroundColor: colors.primary + '22' }]}> 
                      <Ionicons name="person" size={14} color={colors.primary} />
                      <Text style={{ color: colors.primary, marginLeft: 6 }}>{person}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <Text style={{ color: colors.muted, marginTop: spacing.md }}>No collaborators yet — invite someone above.</Text>
            )}
          </View>
        ) : null}
      </View>

      <LinearGradient colors={[colors.surface, colors.primary + '14']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, { padding: spacing.lg }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Live quiz sessions</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>Spin up a mock exam from any folder and stream results to everyone in the room.</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]}>
          <Text style={styles.buttonText}>Start live quiz</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient colors={[colors.surface, colors.accent + '14']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, { padding: spacing.lg }]}> 
        <Text style={[styles.cardTitle, { color: colors.text }]}>Study signals</Text>
        <Text style={{ color: colors.muted, marginTop: spacing.sm }}>Real-time activity pings when teammates add files or mark cards as easy.</Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]}>
          <Text style={styles.buttonText}>View activity feed</Text>
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
  },
  folderChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    marginRight: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inviteRow: {
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  inviteButton: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  collaboratorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12
  },
  collaboratorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  }
});

export default CollaborateScreen;
