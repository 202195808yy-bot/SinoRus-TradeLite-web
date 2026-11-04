/**
 * 设计令牌（design tokens）。
 * 全项目所有组件的 StyleSheet 都只引用这里，
 * 不写死颜色与尺寸——改主题只需改这一个文件。
 *
 * 取值与 Web 端 `static/css/style.css` 的变量保持一致，
 * 使移动端与 Web 端视觉同源（规范 1.2：两端共用数据与规则）。
 *
 * 视觉规格（对照 1.html 的整改表）：
 *   · 正文字号 14–16，辅助文字下限 12 —— 不再出现 10px 小字；
 *   · 触控目标下限 44×44（见 TOUCH）；
 *   · 圆角、间距、边框、阴影只有本文件里的这几档，页面里不许自创。
 */

export const COLORS = {
  background: '#F4F6F9',
  surface: '#FFFFFF',
  surfaceAlt: '#EDF2F8',
  primary: '#1B4F8A',
  primaryDark: '#143A66',
  primarySoft: '#E3EDF8',
  accent: '#D97706',
  accentSoft: '#FDF1E0',
  text: '#1B2430',
  textMuted: '#63707F',
  border: '#DCE4EC',
  success: '#1E7A46',
  successSoft: '#E4F2EA',
  warning: '#B26A00',
  warningSoft: '#FBF0DA',
  danger: '#B3261E',
  dangerSoft: '#FBE9E8',
  /** 商品价格专用色（暖红，白底上对比度 ≥ 4.5:1）。 */
  price: '#C2410C',
  russia: '#1B4F8A',
  china: '#B3261E',
  overlay: 'rgba(20, 34, 51, 0.45)',
} as const;

/**
 * hero 卡（汇率卡、指标总览这类主视觉卡片）的渐变两端。
 * 取 primary 邻近的靛蓝，与主色同族，不会像外来组件。
 */
export const GRADIENT = {
  heroFrom: '#1B4F8A',
  heroTo: '#3E3A8C',
  heroText: '#FFFFFF',
  heroTextMuted: '#C9D6E8',
  heroChip: 'rgba(255, 255, 255, 0.18)',
  /** 深色渐变卡上的涨跌色：涨红跌绿（中国习惯），取亮色以保证对比度。 */
  up: '#FF9B8A',
  down: '#6EE7A8',
  flat: '#C9D6E8',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

/**
 * 字号梯度。
 * tiny 是**下限**：整改表要求辅助文字不低于 12px，因此不再有 10px 这一档。
 */
export const FONTS = {
  h1: 26,
  h2: 20,
  h3: 16,
  bodyLg: 16,
  body: 14,
  small: 13,
  tiny: 12,
} as const;

/** 行高：正文 1.5，长说明 1.6。 */
export const LINE_HEIGHT = {
  body: 21,
  relaxed: 22,
} as const;

/** 阴影（iOS 用 shadow*，Android 用 elevation）。 */
export const SHADOW = {
  card: {
    shadowColor: '#14314F',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  hero: {
    shadowColor: '#1B2A6B',
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  bar: {
    shadowColor: '#14314F',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
} as const;

/**
 * 触控规格。整改表要求「触控目标建议至少 44×44px」。
 *
 * 用法：
 *   · 主控件（按钮、列表行、标签页、快捷入口）直接 minHeight: TOUCH.min；
 *   · 视觉上必须做小的控件（筛选药丸、返回键）用 minHeight: TOUCH.compact
 *     再配 hitSlop: TOUCH.slop，把有效热区补到 44。
 */
export const TOUCH = {
  /** 主控件最小边长。 */
  min: 44,
  /** 紧凑控件的最小视觉高度。 */
  compact: 36,
  /** 紧凑控件补足热区的扩展量（36 + 4×2 = 44）。 */
  slop: { top: 4, bottom: 4, left: 4, right: 4 },
} as const;

/** 底部标签栏高度（不含安全区）。 */
export const TAB_BAR_HEIGHT = 70;
