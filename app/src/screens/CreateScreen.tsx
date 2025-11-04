import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useGenerateFlashcards, useGenerateQuiz } from '../api/hooks';
import { useTheme } from '../theme/ThemeProvider';
import { useContentStore } from '../store/useContentStore';

const CreateScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const [subject, setSubject] = useState('Neuroscience Review');
  const [notes, setNotes] = useState('Highlight the hippocampus and synaptic plasticity.');
  const [files, setFiles] = useState<string[]>([]);
  const addFlashcards = useContentStore((state) => state.addFlashcards);
  const addQuestions = useContentStore((state) => state.addQuestions);
  const { mutateAsync: generateFlashcards, isLoading: flashcardsLoading } = useGenerateFlashcards();
  const { mutateAsync: generateQuiz, isLoading: quizLoading } = useGenerateQuiz();
  const [status, setStatus] = useState<string | null>(null);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, base64: true });
    if (!result.canceled) {
      setFiles((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const handleGenerate = async () => {
    setStatus('Synthesizing study pack...');
    try {
      const flashcardResponse = await generateFlashcards({ title: subject, files, notes });
      addFlashcards(flashcardResponse.flashcards);
      const quizResponse = await generateQuiz({
        subject,
        difficulty: 'adaptive',
        questionTypes: ['multiple-choice', 'open-ended', 'image'],
        references: files
      });
      addQuestions(quizResponse.questions);
      setStatus('Content ready! Review in Practice tab.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <Text style={[styles.heading, { color: colors.text, fontSize: typography.fontSize.xl }]}>Create with AI</Text>
      <Text style={{ color: colors.muted, marginBottom: spacing.xl }}>
        Upload notes, snapshots, or documents to generate quizzes, flashcards, and summaries in seconds.
      </Text>

      <Text style={[styles.label, { color: colors.muted }]}>Study focus</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surface, color: colors.text }]}
        value={subject}
        onChangeText={setSubject}
        placeholder="e.g. Organic Chemistry Unit 3"
        placeholderTextColor={colors.muted}
      />

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
        <Text style={{ color: colors.primary }}>{files.length ? 'Add more references' : 'Upload notes or diagrams'}</Text>
      </TouchableOpacity>

      {files.length ? (
        <View style={{ marginTop: spacing.md }}>
          {files.map((uri) => (
            <Text key={uri} style={{ color: colors.muted }}>
              {uri}
            </Text>
          ))}
        </View>
      ) : null}

      <TouchableOpacity
        disabled={flashcardsLoading || quizLoading}
        onPress={handleGenerate}
        style={[styles.generateButton, { backgroundColor: colors.primary, opacity: flashcardsLoading || quizLoading ? 0.7 : 1 }]}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
          {flashcardsLoading || quizLoading ? 'Generating...' : 'Generate study kit'}
        </Text>
      </TouchableOpacity>

      {status ? <Text style={{ color: colors.secondary, marginTop: spacing.md }}>{status}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700'
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
    alignItems: 'center'
  },
  generateButton: {
    borderRadius: 18,
    marginTop: 24,
    padding: 18
  }
});

export default CreateScreen;
