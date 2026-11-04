import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Chip } from '../components/Chip';
import { DataNote } from '../components/DataNote';
import { EmptyState } from '../components/EmptyState';
import { GoodsCard } from '../components/GoodsCard';
import { ScreenHeader } from '../components/ScreenHeader';
import { SkeletonNote } from '../components/SkeletonNote';
import { useLang } from '../context/LangContext';
import { LISTINGS } from '../data/mock';
import { tileWidth, useGrid } from '../hooks/useResponsive';
import { COLORS, SPACING } from '../theme/theme';

/**
 * 商品目录（FM3 / FR-013「从商品目录选择商品」）。
 *
 * 新增页面。1.html 里的「热门货盘」只有两张写死的卡、不能点也不能筛；
 * 这里做成真正的目录：
 *   · 筛选用统一的 Chip 组件（全部 / 现货 / 批发），点了会重新过滤；
 *   · 栅格列数由 useGrid 决定（竖屏 2 列、横屏 3 列、平板 3–4 列），
 *     对应 NFR-05「不同屏幕尺寸与横竖屏都要正常」；
 *   · 点击卡片进入 /goods/[id] 商品详情。
 */

type Filter = 'all' | 'inStock' | 'wholesale';

const GAP = SPACING.md;

export default function CatalogScreen() {
  const router = useRouter();
  const { t } = useLang();
  const grid = useGrid();
  const [filter, setFilter] = useState<Filter>('all');

  const list = useMemo(() => {
    if (filter === 'inStock') return LISTINGS.filter((l) => l.inStock);
    if (filter === 'wholesale') return LISTINGS.filter((l) => l.wholesale);
    return LISTINGS;
  }, [filter]);

  const cardWidth = tileWidth(grid, GAP);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('all') },
    { key: 'inStock', label: t('goodsInStock') },
    { key: 'wholesale', label: t('goodsWholesale') },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('goodsCatalog')} subtitle="FM3 · FR-013" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: grid.gutter },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* 数据来源：目录里的价格与库存都是演示数据，必须标出来 */}
        <DataNote source="mock" />

        {/* 筛选：统一使用 Chip，选中态由 accessibilityState 一并暴露给读屏 */}
        <View style={styles.filters}>
          {filters.map((item) => (
            <Chip
              key={item.key}
              label={item.label}
              active={filter === item.key}
              onPress={() => setFilter(item.key)}
            />
          ))}
        </View>

        {list.length === 0 ? (
          <EmptyState title={t('empty')} hint={t('emptyHint')} icon="▤" />
        ) : (
          <View style={styles.grid}>
            {list.map((listing) => (
              <GoodsCard
                key={listing.id}
                listing={listing}
                width={cardWidth}
                onPress={() => router.push(`/goods/${listing.id}`)}
              />
            ))}
          </View>
        )}

        <SkeletonNote
          frCodes={['FR-013']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/listings/?in_stock=&wholesale= — каталог с фильтрами и пагинацией',
            'Полнотекстовый поиск по названию и коду ТН ВЭД (FR-012)',
            'Реальные изображения товаров (кэш на устройстве для офлайна)',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingVertical: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
});
