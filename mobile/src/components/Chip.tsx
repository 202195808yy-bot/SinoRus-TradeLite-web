import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, TOUCH } from '../theme/theme';

/**
 * 筛选药丸（Chip）。
 *
 * 整改前：订单 / 单证 / 询价 / 搜索四个页面各写一份「看起来能点、
 * 实际上点了没反应」的 View 标签，选中态也各写各的。
 * 整改后：全项目只有这一个筛选控件，订单、单证、询价、搜索统一用它。
 *
 * 可访问性：视觉高度 36（TOUCH.compact），再用 hitSlop 把热区补到 44，
 * 满足整改表「触控目标建议至少 44×44px」。
 */

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  /** 右侧计数，例如「进行中 3」。 */
  count?: number;
};

export function Chip({ label, active = false, onPress, count }: Props) {
  const text = count === undefined ? label : `${label} ${count}`;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={TOUCH.slop}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={text}
      style={({ pressed }) => [
        styles.chip,
        active && styles.chipActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, active && styles.textActive]} numberOfLines={1}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: TOUCH.compact,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pressed: { opacity: 0.75 },
  text: { fontSize: FONTS.small, fontWeight: '600', color: COLORS.textMuted },
  textActive: { color: COLORS.surface },
});
