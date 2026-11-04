import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING, TOUCH } from '../theme/theme';

/**
 * 区块标题：左侧竖色条 + 标题，右侧可选操作文字。
 * 工作台、设置页用它把卡片分组。
 *
 * 整改：右侧的「全部 / 更多」原来是一段纯文本，点了没反应；
 * 现在传入 onAction 时渲染成真正的按钮，并补足 44 的触控高度。
 */

type Props = {
  title: string;
  action?: string;
  onAction?: () => void;
};

export function SectionHeading({ title, action, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.left}>
        <View style={styles.bar} />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {action ? (
        onAction ? (
          <Pressable
            onPress={onAction}
            hitSlop={TOUCH.slop}
            accessibilityRole="button"
            accessibilityLabel={action}
            style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
          >
            <Text style={styles.action}>{action} ›</Text>
          </Pressable>
        ) : (
          <Text style={styles.action}>{action}</Text>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, flexShrink: 1 },
  bar: { width: 3, height: 16, borderRadius: 2, backgroundColor: COLORS.primary },
  title: { fontSize: FONTS.h3, fontWeight: '700', color: COLORS.text, flexShrink: 1 },
  actionBtn: {
    minHeight: TOUCH.compact,
    justifyContent: 'center',
    paddingLeft: SPACING.sm,
  },
  pressed: { opacity: 0.6 },
  action: { fontSize: FONTS.small, color: COLORS.primary, fontWeight: '600' },
});
