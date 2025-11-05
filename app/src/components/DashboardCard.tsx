import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/ThemeProvider';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, subtitle, accentColor, style }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <LinearGradient
      colors={[colors.surface, (accentColor ?? colors.primary) + '1A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      <View style={[styles.cardContent, { padding: spacing.lg }]}>
        <View style={[styles.accent, { backgroundColor: accentColor ?? colors.primary }]} />
        <Text style={[styles.title, { color: colors.muted, fontSize: typography.fontSize.sm }]}>{title}</Text>
        <Text style={[styles.value, { color: colors.text, fontSize: typography.fontSize.xl }]}>{value}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.muted, fontSize: typography.fontSize.sm }]}>{subtitle}</Text>
        ) : null}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    flexGrow: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5
  },
  cardContent: {
    flex: 1
  },
  accent: {
    width: 6,
    borderRadius: 6,
    position: 'absolute',
    left: 0,
    top: 18,
    bottom: 18
  },
  title: {
    marginLeft: 12,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  value: {
    marginLeft: 12,
    fontWeight: '700'
  },
  subtitle: {
    marginLeft: 12,
    marginTop: 4
  }
});

export default DashboardCard;
