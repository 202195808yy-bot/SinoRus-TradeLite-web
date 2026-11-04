import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../../components/Badge';
import { Chip } from '../../components/Chip';
import { EmptyState } from '../../components/EmptyState';
import { ListRow } from '../../components/ListRow';
import { OfflineBanner } from '../../components/OfflineBanner';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { ORDERS } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING, TOUCH } from '../../theme/theme';
import {
  formatMoney,
  ORDER_STATUS_KEY,
  ORDER_STATUS_TONE,
  STAGE_ORDER,
  STAGE_SHORT,
} from '../../utils/format';

/**
 * FM4 / FR-016　订单列表与筛选。
 *
 * 同时作为 FM3（询价）、FM5（单证）、FM6（物流）、FM7（结算）四个模块的入口
 * —— 规范表 1 把这四个模块都归到「订单」分区下，因为它们都围绕同一笔交易展开。
 *
 * 需求原文：可按角色、状态、往来单位与时间段筛选；支持按单号搜索。
 * 骨架实现：状态筛选可用，其余筛选项留空实现；搜索走全局搜索页（FR-003）。
 */
export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, lang } = useLang();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'done'>('all');

  const filtered = useMemo(
    () => (statusFilter === 'all' ? ORDERS : ORDERS.filter((o) => o.status === statusFilter)),
    [statusFilter],
  );

  const moduleShortcuts = [
    { key: 'rfq', label: t('rfqTitle'), route: '/rfq' as const, code: 'FM3' },
    { key: 'docs', label: t('docsTitle'), route: '/documents' as const, code: 'FM5' },
    { key: 'log', label: t('logisticsTitle'), route: '/logistics' as const, code: 'FM6' },
    { key: 'bill', label: t('billingTitle'), route: '/billing' as const, code: 'FM7' },
  ];

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.title}>{t('ordersTitle')}</Text>
        <Pressable onPress={() => router.push('/search')} style={styles.searchBar}>
          <Text style={styles.searchGlyph}>⌕</Text>
          <Text style={styles.searchText}>{t('searchPlaceholder')}</Text>
        </Pressable>
      </View>

      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 四个模块入口 */}
        <SectionHeading title={t('filterRole')} />
        <View style={styles.shortcuts}>
          {moduleShortcuts.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => router.push(item.route)}
              style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}
            >
              <Text style={styles.shortcutCode}>{item.code}</Text>
              <Text style={styles.shortcutLabel} numberOfLines={2}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 状态筛选（FR-016）—— 统一使用 Chip 组件 */}
        <SectionHeading title={t('filterStatus')} />
        <View style={styles.chips}>
          {(['all', 'active', 'paused', 'done'] as const).map((key) => (
            <Chip
              key={key}
              label={
                key === 'all'
                  ? t('all')
                  : key === 'active'
                    ? t('statusActive')
                    : key === 'paused'
                      ? t('statusPaused')
                      : t('statusDone')
              }
              active={statusFilter === key}
              onPress={() => setStatusFilter(key)}
            />
          ))}
        </View>

        {/* 订单列表 */}
        {filtered.length === 0 ? (
          <EmptyState title={t('empty')} hint={t('emptyHint')} />
        ) : (
          <View style={styles.listCard}>
            {filtered.map((order, index) => (
              <ListRow
                key={order.id}
                mark={String(STAGE_ORDER[order.stage])}
                markColor={order.status === 'paused' ? COLORS.warning : COLORS.primary}
                title={`${order.no} · ${order.counterparty}`}
                subtitle={`${t('stage')}: ${STAGE_SHORT[order.stage][lang]} · ${t('updatedAt')} ${order.updatedAt}`}
                value={formatMoney(order.amount, order.currency)}
                last={index === filtered.length - 1}
                right={
                  <Badge
                    label={t(ORDER_STATUS_KEY[order.status])}
                    tone={ORDER_STATUS_TONE[order.status]}
                  />
                }
                onPress={() => router.push(`/orders/${order.id}`)}
              />
            ))}
          </View>
        )}

        <SkeletonNote
          frCodes={['FR-016']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/orders/?status=&role=&from=&to=&q=',
            'Фильтры по контрагенту и периоду — выпадающие панели',
            'Пагинация FlatList + pull-to-refresh',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  top: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: FONTS.h1, fontWeight: '700', color: COLORS.text },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    // 整改：搜索入口也是触控目标，高度提到 44。
    minHeight: TOUCH.min,
  },
  searchGlyph: { fontSize: 18, color: COLORS.textMuted },
  searchText: { fontSize: FONTS.small, color: COLORS.textMuted },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  shortcuts: { flexDirection: 'row', gap: SPACING.sm },
  shortcut: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    gap: 2,
  },
  shortcutCode: { fontSize: FONTS.tiny, fontWeight: '700', color: COLORS.accent },
  shortcutLabel: { fontSize: FONTS.tiny, color: COLORS.text, textAlign: 'center' },
  pressed: { opacity: 0.8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
