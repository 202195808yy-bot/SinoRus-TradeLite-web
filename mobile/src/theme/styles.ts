/**
 * 通用样式片段。各页面 StyleSheet 里用展开运算符复用，
 * 避免同样的「卡片 / 页容器 / 行」样式在 30 个文件里各写一遍。
 *
 * 整改要求「统一间距、圆角、边框和轻阴影」——所有取值都来自
 * `theme.ts`，这里只做组合，不新造数值。
 */

import { StyleSheet } from 'react-native';
import { COLORS, FONTS, LINE_HEIGHT, RADIUS, SHADOW, SPACING, TOUCH } from './theme';

export const common = StyleSheet.create({
  /** 页面根容器：浅灰底，纵向排列。 */
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  /** 页面内容：左右留白 16。 */
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  /** 白底圆角卡片。 */
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOW.card,
  },
  /** 无阴影的轻卡片（用于嵌套在卡片内部的区块）。 */
  cardFlat: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  /** 把若干 ListRow 包成一个圆角块（列表统一外观）。 */
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  /** 标题。 */
  h1: { fontSize: FONTS.h1, fontWeight: '700', color: COLORS.text },
  h2: { fontSize: FONTS.h2, fontWeight: '700', color: COLORS.text },
  h3: { fontSize: FONTS.h3, fontWeight: '600', color: COLORS.text },
  body: { fontSize: FONTS.body, color: COLORS.text, lineHeight: LINE_HEIGHT.body },
  muted: { fontSize: FONTS.small, color: COLORS.textMuted },
  /** 两栏 / 三栏并排。 */
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  /** 分隔线。 */
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  /** 列表底部留白，避免被底部标签栏遮住。 */
  listBottom: { paddingBottom: SPACING.xxl },
});

/**
 * 触控目标的通用写法。
 * 需要「视觉小、热区大」时，把 touchableCompact 与 TOUCH.slop 一起用。
 */
export const touchable = {
  minHeight: TOUCH.min,
  minWidth: TOUCH.min,
  justifyContent: 'center' as const,
};

export const touchableCompact = {
  minHeight: TOUCH.compact,
  justifyContent: 'center' as const,
};
