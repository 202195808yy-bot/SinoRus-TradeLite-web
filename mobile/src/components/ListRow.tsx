import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING, TOUCH } from '../theme/theme';

/**
 * 通用列表行：左（可选）图标/标记、中间标题+副标题、右侧（可选）取值或箭头。
 * 订单、询价、单证、会话、账单等列表都用它，保证行高与留白一致。
 */

type Props = {
  title: string;
  subtitle?: string;
  /** 右侧主要取值，例如金额、时间。 */
  value?: string;
  /** 右侧次要说明。 */
  valueHint?: string;
  /** 左侧色块上的文字，例如阶段序号或国家代码。 */
  mark?: string;
  markColor?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  /** 是否显示右侧箭头，默认 onPress 存在时显示。 */
  chevron?: boolean;
  last?: boolean;
};

export function ListRow({
  title,
  subtitle,
  value,
  valueHint,
  mark,
  markColor = COLORS.primary,
  right,
  onPress,
  chevron,
  last = false,
}: Props) {
  const showChevron = chevron ?? Boolean(onPress);

  const content = (
    <View style={[styles.row, !last && styles.border]}>
      {mark ? (
        <View style={[styles.mark, { backgroundColor: markColor }]}>
          <Text style={styles.markText}>{mark}</Text>
        </View>
      ) : null}

      <View style={styles.mid}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {right ?? null}

      {value || valueHint ? (
        <View style={styles.right}>
          {value ? <Text style={styles.value}>{value}</Text> : null}
          {valueHint ? <Text style={styles.valueHint}>{valueHint}</Text> : null}
        </View>
      ) : null}

      {showChevron ? <Text style={styles.chevron}>›</Text> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={[title, subtitle, value].filter(Boolean).join(', ')}
        style={({ pressed }) => pressed && styles.pressed}
      >
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    // 整改：列表行是可点区域，行高不低于 44（实际约 58），
    // 避免出现「行与行之间点不中」的问题。
    minHeight: TOUCH.min,
  },
  border: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  pressed: { backgroundColor: COLORS.surfaceAlt },
  mark: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { color: COLORS.surface, fontSize: FONTS.tiny, fontWeight: '700' },
  mid: { flex: 1, gap: 2 },
  title: { fontSize: FONTS.body, fontWeight: '600', color: COLORS.text },
  subtitle: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  right: { alignItems: 'flex-end', gap: 2 },
  value: { fontSize: FONTS.body, fontWeight: '600', color: COLORS.text },
  valueHint: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  chevron: { fontSize: 22, color: COLORS.border, marginLeft: SPACING.xs },
});
