import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useGrid } from '../hooks/useResponsive';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING, TOUCH } from '../theme/theme';

/**
 * 快捷入口宫格（FR-010）。
 *
 * 整改表第二条「组件结构」：原型的快捷入口写在页面里、且是
 * `cursor-pointer` 的 div —— 看起来能点，实际没有行为。
 * 这里改成：
 *   · 原生 Pressable + accessibilityRole="button"，读屏能识别；
 *   · 每个入口显式带 route，点了真的跳转；
 *   · 列数由 useGrid 决定（竖屏 4 列、横屏/平板更多），不写死 grid-cols-4。
 */

export type QuickAction = {
  key: string;
  label: string;
  /** 骨架阶段用字形代替图标库；接入时换成 <Ionicons name={icon} />。 */
  glyph: string;
  route: Href;
};

type Props = {
  actions: QuickAction[];
};

export function QuickActions({ actions }: Props) {
  const router = useRouter();
  const grid = useGrid();
  // 快捷入口比商品卡窄一档：一行放 4 个（竖屏），横屏/平板放到 6 个。
  const columns = Math.min(grid.columns * 2, 6);
  const basis = `${100 / columns}%` as const;

  return (
    <View style={styles.wrap}>
      {actions.map((action) => (
        <Pressable
          key={action.key}
          onPress={() => router.push(action.route)}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={({ pressed }) => [styles.cell, { flexBasis: basis }, pressed && styles.pressed]}
        >
          <View style={styles.tile}>
            <Text style={styles.glyph}>{action.glyph}</Text>
            <Text style={styles.label} numberOfLines={2}>
              {action.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { paddingHorizontal: SPACING.xs / 2, paddingBottom: SPACING.sm },
  tile: {
    // 触控目标下限 44×44；实际做 72 高，更接近拇指操作习惯。
    minHeight: 72,
    minWidth: TOUCH.min,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    ...SHADOW.card,
  },
  pressed: { opacity: 0.7 },
  glyph: { fontSize: 22, color: COLORS.primary },
  // 原来这里是 text-[10px]；现在下限 12px，并且允许两行，
  // 俄语长词（如「Загрузить документ」）不会再被挤成三行截断。
  label: {
    fontSize: FONTS.tiny,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 16,
  },
});
