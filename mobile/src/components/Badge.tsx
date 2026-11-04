import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * 状态标签。用 `tone` 表达语义：
 * neutral 草稿/关闭，info 进行中，success 已完成，warning 即将到期，danger 异常。
 */

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const TONE: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: COLORS.surfaceAlt, fg: COLORS.textMuted },
  info: { bg: COLORS.primarySoft, fg: COLORS.primary },
  success: { bg: COLORS.successSoft, fg: COLORS.success },
  warning: { bg: COLORS.warningSoft, fg: COLORS.warning },
  danger: { bg: COLORS.dangerSoft, fg: COLORS.danger },
};

type Props = {
  label: string;
  tone?: BadgeTone;
};

export function Badge({ label, tone = 'neutral' }: Props) {
  const palette = TONE[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.text, { color: palette.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  text: { fontSize: FONTS.tiny, fontWeight: '600' },
});
