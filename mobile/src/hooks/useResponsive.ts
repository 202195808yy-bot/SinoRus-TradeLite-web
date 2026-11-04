import { useWindowDimensions } from 'react-native';

/**
 * 响应式栅格：按当前窗口宽度决定列数。
 *
 * 对应整改表的「响应式布局」一条，也对应规范 NFR-05
 * （4.7–7 英寸手机与平板、横竖屏都要正常）。
 *
 * 用 useWindowDimensions 而不是 Dimensions.get()：前者在旋转屏幕、
 * 分屏、折叠屏展开时会触发重新渲染，后者只在模块加载时取一次值。
 */

export interface Grid {
  /** 当前窗口宽度（dp）。 */
  width: number;
  /** 是否横屏（宽 > 高）。 */
  landscape: boolean;
  /** 是否平板级宽度（≥ 600dp，Android 的 sw600dp 断点）。 */
  tablet: boolean;
  /** 卡片网格列数：手机竖屏 2 列，横屏或平板 3–4 列。 */
  columns: number;
  /** 页面左右留白：平板放宽一点，避免内容贴边。 */
  gutter: number;
}

export function useGrid(): Grid {
  const { width, height } = useWindowDimensions();
  const landscape = width > height;
  const tablet = width >= 600;

  let columns = 2;
  if (tablet) columns = width >= 900 ? 4 : 3;
  else if (landscape) columns = 3;

  return {
    width,
    landscape,
    tablet,
    columns,
    gutter: tablet ? 24 : 16,
  };
}

/**
 * 计算一行里每个卡片的宽度。
 * `columns` 列、列间距 `gap`、容器左右各留 `gutter`。
 */
export function tileWidth(grid: Grid, gap = 12): number {
  const usable = grid.width - grid.gutter * 2 - gap * (grid.columns - 1);
  return Math.floor(usable / grid.columns);
}
