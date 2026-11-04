import { useMemo } from 'react';
import type { Href } from 'expo-router';
import { useLang } from '../context/LangContext';
import type { QuickAction } from '../components/QuickActions';

/**
 * 快捷入口的集中定义（FR-010）。
 *
 * 整改表第二条要求「集中管理数据、状态和事件」：原型的四个入口直接写在
 * 页面的 HTML 里，既没有路由也没有事件。现在入口清单只此一份，
 * 工作台渲染它、别的页面（如「更多」）也能复用同一份定义。
 *
 * 每个入口显式绑定 `route`，点击后由 QuickActions 组件真正跳转。
 */

export function useQuickActions(): QuickAction[] {
  const { t } = useLang();

  return useMemo<QuickAction[]>(
    () => [
      { key: 'scan', label: t('qaScan'), glyph: '▣', route: '/scan' as Href },
      { key: 'catalog', label: t('hotGoods'), glyph: '▤', route: '/catalog' as Href },
      { key: 'track', label: t('logisticsTrack'), glyph: '⇄', route: '/logistics/track' as Href },
      { key: 'rfq', label: t('qaNewRfq'), glyph: '✎', route: '/rfq/new' as Href },
      { key: 'doc', label: t('qaUploadDoc'), glyph: '⇧', route: '/documents/upload' as Href },
      { key: 'contact', label: t('qaContact'), glyph: '✉', route: '/messages' as Href },
      { key: 'tasks', label: t('todayTasks'), glyph: '☑', route: '/tasks' as Href },
      { key: 'billing', label: t('billingTitle'), glyph: '◫', route: '/billing' as Href },
    ],
    [t],
  );
}
