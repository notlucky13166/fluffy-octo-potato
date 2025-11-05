import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useGenerateFlashcards, useGenerateQuiz } from '../api/hooks';
import { useTheme } from '../theme/ThemeProvider';
import { useContentStore } from '../store/useContentStore';

const CreateScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const [subject, setSubject] = useState('Neuroscience Review');
  const [notes, setNotes] = useState('Highlight the hippocampus and synaptic plasticity.');
  const addFlashcards = useContentStore((state) => state.addFlashcards);
  const addQuestions = useContentStore((state) => state.addQuestions);
  const folders = useContentStore((state) => state.folders);
  const addFolder = useContentStore((state) => state.addFolder);
  const selectFolder = useContentStore((state) => state.selectFolder);
  const addFilesToFolder = useContentStore((state) => state.addFilesToFolder);
  const removeFileFromFolder = useContentStore((state) => state.removeFileFromFolder);
  const activeFolderId = useContentStore((state) => state.activeFolderId);
  const { mutateAsync: generateFlashcards, isLoading: flashcardsLoading } = useGenerateFlashcards();
  const { mutateAsync: generateQuiz, isLoading: quizLoading } = useGenerateQuiz();
  const [status, setStatus] = useState<string | null>(null);
  const [folderMessage, setFolderMessage] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('Exam Prep Library');
  const [newFolderDescription, setNewFolderDescription] = useState('Drop PDFs, slides, and images for this subject.');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const selectedFolder = useMemo(
    () => folders.find((folder) => folder.id === activeFolderId) ?? null,
    [folders, activeFolderId]
  );

  const fileCount = selectedFolder?.files.length ?? 0;
  const displayedFiles = selectedFolder?.files ?? [];

  useEffect(() => {
    if (selectedFolder && !subject.trim()) {
      setSubject(`${selectedFolder.name} study kit`);
    }
  }, [selectedFolder, subject]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true
        })
      ])
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [pulseAnim]);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      setFolderMessage('Name your folder so the AI knows the study focus.');
      return;
    }

    const id = `folder-${Date.now()}`;
    addFolder({
      id,
      name: newFolderName.trim(),
      description: newFolderDescription.trim() || undefined,
      files: [],
      createdAt: new Date().toISOString()
    });
    selectFolder(id);
    setFolderMessage('Folder ready — start adding references below.');
    if (!subject.trim()) {
      setSubject(`${newFolderName.trim()} study kit`);
    }
    setNewFolderName('');
    setNewFolderDescription('');
  };

  const requireFolderSelection = () => {
    if (!selectedFolder) {
      setFolderMessage('Create or select a folder before uploading study material.');
      return false;
    }
    return true;
  };

  const handlePickImage = async () => {
    if (!requireFolderSelection()) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All });
    if (!result.canceled && result.assets?.length) {
      const uris = result.assets.map((asset) => asset.uri).filter(Boolean) as string[];
      addFilesToFolder(selectedFolder!.id, uris);
      setFolderMessage(`${uris.length} file${uris.length > 1 ? 's' : ''} added to ${selectedFolder!.name}.`);
    }
  };

  const handlePickDocument = async () => {
    if (!requireFolderSelection()) {
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf'] });
    if (result.type === 'success') {
      addFilesToFolder(selectedFolder!.id, [result.uri]);
      setFolderMessage('PDF attached. The AI will parse key concepts for you.');
    }
  };

  const handleGenerate = async () => {
    if (!selectedFolder) {
      setStatus('Add a study folder with files before generating content.');
      return;
    }
    if (!selectedFolder.files.length) {
      setStatus('Drop at least one PDF or image in your folder for the AI to review.');
      return;
    }
    setStatus('Synthesizing study pack...');
    try {
      const flashcardResponse = await generateFlashcards({
        title: subject,
        files: selectedFolder.files,
        notes,
        folderId: selectedFolder.id
      });
      addFlashcards(flashcardResponse.flashcards);
      const quizResponse = await generateQuiz({
        subject,
        difficulty: 'adaptive',
        questionTypes: ['multiple-choice', 'open-ended', 'image'],
        references: selectedFolder.files,
        folderId: selectedFolder.id
      });
      addQuestions(quizResponse.questions);
      setStatus('Content ready! Review in Practice tab.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <LinearGradient colors={[colors.primary, colors.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="sparkles" size={16} color="#fff" />
          <Text style={styles.heroBadgeText}>Unlimited AI flashcards — still free</Text>
        </View>
        <Text style={[styles.heading, { color: '#fff', fontSize: typography.fontSize.xl + 4 }]}>Create with AI</Text>
        <Text style={[styles.heroCopy, { marginTop: spacing.sm }]}>Upload notes, snapshots, or documents to generate quizzes, flashcards, and summaries in seconds.</Text>
        <Animated.View style={{ transform: [{ scale: pulseAnim }], marginTop: spacing.lg }}>
          <View style={styles.heroSteps}>
            <View style={[styles.heroStep, { borderColor: 'rgba(255,255,255,0.4)' }]}> 
              <Ionicons name="document-text-outline" size={18} color="#fff" />
              <Text style={styles.heroStepText}>Drop your notes</Text>
            </View>
            <View style={[styles.heroStep, { borderColor: 'rgba(255,255,255,0.4)' }]}> 
              <Ionicons name="flash-outline" size={18} color="#fff" />
              <Text style={styles.heroStepText}>AI crafts decks</Text>
            </View>
            <View style={[styles.heroStep, { borderColor: 'rgba(255,255,255,0.4)' }]}> 
              <Ionicons name="happy-outline" size={18} color="#fff" />
              <Text style={styles.heroStepText}>Practice instantly</Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      <Text style={[styles.label, { color: colors.muted }]}>Study focus</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
        value={subject}
        onChangeText={setSubject}
        placeholder="e.g. Organic Chemistry Unit 3"
        placeholderTextColor={colors.muted}
      />

      <View style={{ marginBottom: spacing.lg }}>
        <View style={[styles.folderHeader, { marginBottom: spacing.sm }]}>
          <Text style={[styles.label, { color: colors.muted, marginBottom: 0 }]}>Study folders</Text>
          <TouchableOpacity onPress={handleCreateFolder} style={[styles.createFolderButton, { borderColor: colors.secondary }]}>
            <Ionicons name="add" size={16} color={colors.secondary} />
            <Text style={{ color: colors.secondary, fontWeight: '600', marginLeft: 6 }}>Create folder</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.folderForm, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.input, styles.folderInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={newFolderName}
            onChangeText={setNewFolderName}
            placeholder="Folder name (e.g. Anatomy Images)"
            placeholderTextColor={colors.muted}
          />
          <TextInput
            style={[styles.input, styles.folderInput, { backgroundColor: colors.surface, color: colors.text }]}
            value={newFolderDescription}
            onChangeText={setNewFolderDescription}
            placeholder="Optional notes about this folder"
            placeholderTextColor={colors.muted}
          />
        </View>

        {folders.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.md }}>
            {folders.map((folder) => {
              const isActive = folder.id === selectedFolder?.id;
              return (
                <TouchableOpacity
                  key={folder.id}
                  onPress={() => selectFolder(folder.id)}
                  style={[
                    styles.folderPill,
                    {
                      backgroundColor: isActive ? colors.secondary + '22' : colors.surface,
                      borderColor: isActive ? colors.secondary : colors.surface,
                      marginRight: spacing.sm
                    }
                  ]}
                >
                  <Ionicons name="folder" size={18} color={isActive ? colors.secondary : colors.muted} style={{ marginRight: 8 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: '600' }}>{folder.name}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>
                      {folder.files.length ? `${folder.files.length} reference${folder.files.length === 1 ? '' : 's'}` : 'No files yet'}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        {folderMessage ? <Text style={{ color: colors.secondary, marginTop: spacing.sm }}>{folderMessage}</Text> : null}
      </View>

      <Text style={[styles.label, { color: colors.muted }]}>Notes for the AI tutor</Text>
      <TextInput
        style={[styles.textarea, { backgroundColor: colors.surface, color: colors.text }]}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
        placeholder="Tell the AI what to emphasize."
        placeholderTextColor={colors.muted}
      />

      <TouchableOpacity onPress={handlePickImage} style={[styles.uploadButton, { borderColor: colors.primary }]}>
        <Ionicons name="cloud-upload-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={{ color: colors.primary, fontWeight: '600' }}>{fileCount ? 'Add more references' : 'Upload notes or diagrams'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handlePickDocument}
        style={[styles.uploadButton, { borderColor: colors.secondary, marginTop: spacing.sm }]}
      >
        <Ionicons name="document-outline" size={18} color={colors.secondary} style={{ marginRight: 8 }} />
        <Text style={{ color: colors.secondary, fontWeight: '600' }}>Attach PDF study guides</Text>
      </TouchableOpacity>

      {fileCount ? (
        <View style={{ marginTop: spacing.md }}>
          {displayedFiles.map((uri) => (
            <View key={uri} style={[styles.filePill, { backgroundColor: colors.secondary + '1A' }]}>
              <Ionicons name="image-outline" size={16} color={colors.secondary} />
              <Text style={{ color: colors.muted, flex: 1 }} numberOfLines={1}>
                {uri}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  removeFileFromFolder(selectedFolder!.id, uri);
                  setFolderMessage('File removed from this folder.');
                }}
              >
                <Ionicons name="close" size={16} color={colors.muted} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}

      <TouchableOpacity
        disabled={flashcardsLoading || quizLoading}
        onPress={handleGenerate}
        style={[
          styles.generateButton,
          { backgroundColor: colors.primary, opacity: flashcardsLoading || quizLoading ? 0.7 : 1 }
        ]}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
          {flashcardsLoading || quizLoading ? 'Generating...' : 'Generate study kit'}
        </Text>
      </TouchableOpacity>

      {status ? <Text style={{ color: colors.secondary, marginTop: spacing.md }}>{status}</Text> : null}

      <View style={[styles.infoBanner, { backgroundColor: colors.surface, borderColor: colors.primary + '33' }]}> 
        <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>Free AI generation</Text>
          <Text style={{ color: colors.muted }}>
            Every learner gets limitless flashcard and quiz creation. No trials, no cards — just focused study.
          </Text>
        </View>
      </View>
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
    marginBottom: 28
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
  heroSteps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  heroStep: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  heroStepText: {
    color: '#fff',
    fontWeight: '600'
  },
  label: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 8
  },
  input: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16
  },
  textarea: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    minHeight: 120,
    textAlignVertical: 'top'
  },
  uploadButton: {
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  generateButton: {
    borderRadius: 18,
    marginTop: 24,
    padding: 18
  },
  infoBanner: {
    marginTop: 28,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  folderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  createFolderButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  folderForm: {
    borderRadius: 20,
    padding: 16
  },
  folderInput: {
    marginBottom: 12
  },
  folderPill: {
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 200
  },
  filePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 8
  }
});

export default CreateScreen;
