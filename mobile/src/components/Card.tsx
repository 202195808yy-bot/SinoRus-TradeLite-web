import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * 通用卡片容器。
 * - `onPress` 传入时整卡可点（用于列表项）；
 * - `title` / `footer` 可选，减少页面里重复写标题与页脚。
 */

type Props = {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export function Card({ title, subtitle, right, footer, onPress, style, children }: Props) {
  const body = (
    <>
      {title || right ? (
        <View style={styles.head}>
          <View style={styles.headText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {right}
        </View>
      ) : null}
      {children}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={[title, subtitle].filter(Boolean).join(', ') || undefined}
        style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}
      >
        {body}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{body}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  pressed: { backgroundColor: COLORS.surfaceAlt },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  headText: { flex: 1, gap: 2 },
  title: { fontSize: FONTS.h3, fontWeight: '600', color: COLORS.text },
  subtitle: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    marginTop: SPACING.xs,
  },
});
