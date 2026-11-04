import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * 指标磁贴（FR-008 关键指标概览）。
 * 用 `tone` 区分语义色：默认中性，`accent` 用于金额，`danger` 用于逾期。
 */

type Tone = 'default' | 'accent' | 'danger' | 'success';

type Props = {
  label: string;
  value: string;
  hint?: string;
  tone?: Tone;
};

const TONE: Record<Tone, { bg: string; value: string }> = {
  default: { bg: COLORS.primarySoft, value: COLORS.primary },
  accent: { bg: COLORS.accentSoft, value: COLORS.accent },
  danger: { bg: COLORS.dangerSoft, value: COLORS.danger },
  success: { bg: COLORS.successSoft, value: COLORS.success },
};

export function StatTile({ label, value, hint, tone = 'default' }: Props) {
  const palette = TONE[tone];
  return (
    <View style={[styles.tile, { backgroundColor: palette.bg }]}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.value, { color: palette.value }]} numberOfLines={1}>
        {value}
      </Text>
      {hint ? (
        <Text style={styles.hint} numberOfLines={1}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 140,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 2,
  },
  label: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  value: { fontSize: FONTS.h2, fontWeight: '700' },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted },
});
