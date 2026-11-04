import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';

/**
 * 键值行：左标签、右取值。订单详情、单证详情、设置页大量使用。
 * `emphasis` 让取值加粗（用于金额、单号这类关键信息）。
 */

type Props = {
  label: string;
  value: string;
  emphasis?: boolean;
  /** 取值的语义色。 */
  tone?: 'default' | 'primary' | 'danger' | 'success';
};

const TONE = {
  default: COLORS.text,
  primary: COLORS.primary,
  danger: COLORS.danger,
  success: COLORS.success,
} as const;

export function KeyValue({ label, value, emphasis = false, tone = 'default' }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text
        style={[
          styles.value,
          emphasis && styles.emphasis,
          { color: TONE[tone] },
        ]}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.md,
    paddingVertical: 3,
  },
  label: { fontSize: FONTS.small, color: COLORS.textMuted, flexShrink: 0 },
  value: {
    fontSize: FONTS.body,
    flex: 1,
    textAlign: 'right',
  },
  emphasis: { fontWeight: '700' },
});
