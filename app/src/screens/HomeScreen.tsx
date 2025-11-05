import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardQuery } from '../api/hooks';
import DashboardCard from '../components/DashboardCard';
import ProgressChart from '../components/ProgressChart';
import { useTheme } from '../theme/ThemeProvider';
import { useProgressStore } from '../store/useProgressStore';
import { useContentStore } from '../store/useContentStore';
import { buildDailySchedule } from '../utils/schedule';

const HomeScreen: React.FC = () => {
  const { colors, spacing, typography } = useTheme();
  const { data } = useDashboardQuery();
  const mastery = useProgressStore((state) => state.mastery);
  const folders = useContentStore((state) => state.folders);
  const { width } = useWindowDimensions();
  const fadeIn = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(16)).current;

  const streak = data?.streak ?? 5;
  const recommendations: string[] = data?.recommendations ?? [
    'Focus on application questions for Calculus II',
    'Review your AI flashcards on Cellular Respiration',
    'Invite a friend to join your memory sprint'
  ];
  const schedule = buildDailySchedule();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  }, [fadeIn, heroTranslate]);

  const isCompact = width < 768;

  const totalReferences = folders.reduce((count, folder) => count + folder.files.length, 0);

  const featureCards = [
    {
      icon: 'sparkles-outline' as const,
      title: 'AI flashcards, free forever',
      description: 'Generate unlimited decks and quizzes without paywalls or tokens.'
    },
    {
      icon: 'image-outline' as const,
      title: 'Study from any image',
      description: 'Upload diagrams or handwritten notes to turn visuals into practice prompts.'
    },
    {
      icon: 'phone-portrait-outline' as const,
      title: 'Built for web & mobile',
      description: 'A single experience that feels at home on phones, tablets, and desktops.'
    }
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.xl }}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.hero, { padding: spacing.xl }]}
      >
        <Animated.View
          style={{
            opacity: fadeIn,
            transform: [{ translateY: heroTranslate }]
          }}
        >
          <View style={styles.heroBadge}>
            <Ionicons name="planet" size={16} color="#fff" />
            <Text style={styles.heroBadgeText}>AetherLearn is 100% free to create with AI</Text>
          </View>
          <Text style={[styles.heading, { color: '#fff', fontSize: typography.fontSize.xxl + 8 }]}>Your cosmic study co-pilot</Text>
          <Text style={[styles.heroCopy, { color: 'rgba(255,255,255,0.85)', marginTop: spacing.md }]}>
            Build flashcards and adaptive quizzes from notes, images, and lectures in seconds. Our AI toolkit is free on web and mobile.
          </Text>
          <View style={[styles.heroActions, { marginTop: spacing.lg }]}> 
            <TouchableOpacity style={[styles.primaryAction, { paddingVertical: spacing.md }]}> 
              <Text style={styles.primaryActionText}>Start a free study kit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.secondaryAction, { paddingVertical: spacing.md }]}> 
              <Text style={styles.secondaryActionText}>See how it works</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        <View style={styles.heroGlow}>
          <LinearGradient
            colors={[`${colors.background}00`, 'rgba(255,255,255,0.25)', `${colors.background}00`]}
            style={styles.heroGlowInner}
          />
        </View>
      </LinearGradient>

      <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: heroTranslate }] }}>
        <View style={[styles.cardGrid, { marginTop: spacing.xl }]}> 
          <DashboardCard
            title="Streak"
            value={`${streak} days`}
            subtitle="Keep the flame alive"
            accentColor={colors.accent}
            style={{ flexBasis: isCompact ? '100%' : '48%' }}
          />
          <DashboardCard
            title="Mastery"
            value="68%"
            subtitle="Up 6% this week"
            accentColor={colors.secondary}
            style={{ flexBasis: isCompact ? '100%' : '48%' }}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Skill constellation</Text>
          <ProgressChart data={mastery} />
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Why learners love AetherLearn</Text>
          <View style={[styles.featureGrid, { marginTop: spacing.md }]}>
            {featureCards.map((feature) => (
              <View
                key={feature.title}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: colors.surface,
                    padding: spacing.lg,
                    flexBasis: isCompact ? '100%' : '31%'
                  }
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: colors.primary + '22' }]}> 
                  <Ionicons name={feature.icon} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.featureTitle, { color: colors.text }]}>{feature.title}</Text>
                <Text style={{ color: colors.muted, marginTop: spacing.sm }}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your study library</Text>
          {folders.length ? (
            <View style={{ marginTop: spacing.md }}>
              {folders.slice(0, 3).map((folder) => (
                <LinearGradient
                  key={folder.id}
                  colors={[colors.surface, colors.secondary + '22']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.libraryCard, { padding: spacing.lg }]}
                >
                  <View style={styles.libraryHeader}>
                    <View style={[styles.folderIcon, { backgroundColor: colors.secondary + '22' }]}> 
                      <Ionicons name="folder" size={18} color={colors.secondary} />
                    </View>
                    <Text style={{ color: colors.secondary, fontWeight: '600' }}>Free</Text>
                  </View>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 16 }}>{folder.name}</Text>
                  {folder.description ? (
                    <Text style={{ color: colors.muted, marginTop: 4 }}>{folder.description}</Text>
                  ) : null}
                  <Text style={{ color: colors.secondary, marginTop: spacing.sm }}>
                    {folder.files.length} reference{folder.files.length === 1 ? '' : 's'} synced for AI study kits
                  </Text>
                </LinearGradient>
              ))}
              {folders.length > 3 ? (
                <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
                  +{folders.length - 3} more folders waiting in the Create tab
                </Text>
              ) : null}
              <Text style={{ color: colors.muted, marginTop: spacing.sm }}>
                {totalReferences} total files ready for flashcards and quizzes.
              </Text>
            </View>
          ) : (
            <View style={[styles.libraryEmpty, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
              <Ionicons name="folder-open" size={22} color={colors.secondary} />
              <Text style={{ color: colors.text, fontWeight: '600', marginTop: spacing.sm }}>Create your first folder</Text>
              <Text style={{ color: colors.muted, marginTop: 4, textAlign: 'center' }}>
                Visit the Create tab to add PDFs or images. Our AI will transform every upload into free flashcards and quizzes.
              </Text>
            </View>
          )}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hyper-focus suggestions</Text>
          {recommendations.map((recommendation) => (
            <View
              key={recommendation}
              style={[styles.recommendation, { backgroundColor: colors.surface, padding: spacing.lg }]}
            >
              <Text style={{ color: colors.text }}>{recommendation}</Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's schedule</Text>
          {schedule.map((session) => (
            <LinearGradient
              key={session.id}
              colors={[colors.surface, colors.secondary + '22']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.schedule, { padding: spacing.lg }]}
            >
              <Text style={{ color: colors.text, fontWeight: '600' }}>{session.title}</Text>
              <Text style={{ color: colors.muted }}>{session.focusArea}</Text>
              <Text style={{ color: colors.secondary }}>{session.durationMinutes} min · {session.recommendedStart}</Text>
            </LinearGradient>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: '700'
  },
  hero: {
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 240
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    lineHeight: 22
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  primaryAction: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 20
  },
  primaryActionText: {
    color: '#000',
    fontWeight: '700'
  },
  secondaryAction: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 20
  },
  secondaryActionText: {
    color: '#fff',
    fontWeight: '600'
  },
  heroGlow: {
    position: 'absolute',
    right: -60,
    bottom: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    overflow: 'hidden'
  },
  heroGlowInner: {
    width: '100%',
    height: '100%'
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  section: {
    borderRadius: 20,
    marginTop: 24
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12
  },
  recommendation: {
    marginTop: 12,
    borderRadius: 16
  },
  schedule: {
    marginTop: 12,
    borderRadius: 18
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16
  },
  featureCard: {
    borderRadius: 20,
    flexGrow: 1
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  featureTitle: {
    fontWeight: '600',
    fontSize: 16
  },
  libraryCard: {
    borderRadius: 20,
    marginBottom: 12
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  folderIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  libraryEmpty: {
    borderRadius: 20,
    alignItems: 'center'
  }
});

export default HomeScreen;
