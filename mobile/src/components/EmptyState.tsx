import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';

/**
 * 空态 / 占位块。列表为空、功能未接入时统一用它，
 * 避免每个页面各写一套「什么都没有」的样式。
 */

type Props = {
  title: string;
  hint?: string;
  icon?: string;
};

export function EmptyState({ title, hint, icon = '□' }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  icon: { fontSize: 32, color: COLORS.border },
  title: { fontSize: FONTS.body, fontWeight: '600', color: COLORS.textMuted },
  hint: { fontSize: FONTS.small, color: COLORS.textMuted, textAlign: 'center' },
});
