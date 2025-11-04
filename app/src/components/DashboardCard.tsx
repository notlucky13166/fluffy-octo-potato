import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  accentColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, subtitle, accentColor }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, padding: spacing.lg }]}> 
      <View style={[styles.accent, { backgroundColor: accentColor ?? colors.primary }]} />
      <Text style={[styles.title, { color: colors.muted, fontSize: typography.fontSize.sm }]}>{title}</Text>
      <Text style={[styles.value, { color: colors.text, fontSize: typography.fontSize.xl }]}>{value}</Text>
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.muted, fontSize: typography.fontSize.sm }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative'
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
