import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { DataNote } from '../../components/DataNote';
import { ExchangeRateCard } from '../../components/ExchangeRateCard';
import { GoodsCard } from '../../components/GoodsCard';
import { KeyValue } from '../../components/KeyValue';
import { ListRow } from '../../components/ListRow';
import { OfflineBanner } from '../../components/OfflineBanner';
import { QuickActions } from '../../components/QuickActions';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { StatTile } from '../../components/StatTile';
import { Timeline } from '../../components/Timeline';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { useSync } from '../../context/SyncContext';
import { EXCHANGE_RATE, LISTINGS, ORDERS, TASKS, TRACKING } from '../../data/mock';
import { useQuickActions } from '../../hooks/useQuickActions';
import { COLORS, FONTS, RADIUS, SPACING, TOUCH } from '../../theme/theme';
import { formatMoney, PRIORITY_TONE, STAGE_SHORT } from '../../utils/format';

/**
 * FM2 / FR-008 关键指标概览、FR-009 今日待办、FR-010 快捷操作、FR-011 业务动态。
 * 另含 FM3/FR-013 热门货盘与 FM6/FR-026 物流摘要。
 *
 * 这一页按 1.html 的版式重做，同时修掉它暴露出来的问题：
 *
 *   页面布局 —— 原型是固定 812px 的手机外壳，短屏会出现「外层滚动 + 内层滚动」
 *     两层滚动，底栏被挤出首屏。RN 里没有外壳：根容器 flex:1，
 *     页头固定、内容 ScrollView 独占剩余高度、底部导航由 Tabs 导航器
 *     固定在屏幕底部。所以「只让内容滚动」是布局本身保证的，
 *     不依赖任何高度魔法。
 *
 *   组件结构 —— 汇率卡、快捷入口、物流摘要、商品卡、区块标题全部抽成
 *     独立组件；数据来自 data/mock.ts，事件由 useQuickActions 集中定义。
 *
 *   依赖与数据 —— 汇率、货盘、物流轨迹都来自 mock，页面上用 DataNote
 *     明确标出「演示数据」，不再出现「硬编码却写实时」的情况。
 */

/** 热门货盘横向轮播里每张卡的宽度。 */
const CAROUSEL_CARD_WIDTH = 164;

export default function WorkbenchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, lang } = useLang();
  const { user, activeEnterprise } = useAuth();
  const { online } = useSync();
  const quickActions = useQuickActions();

  const activeOrders = ORDERS.filter((o) => o.status === 'active');
  const dueAmount = activeOrders.reduce((sum, o) => sum + o.amount, 0) / 4;
  const openTasks = TASKS.filter((task) => !task.done);
  const overdue = TASKS.filter((task) => !task.done && task.priority === 'high').length;
  const hotGoods = LISTINGS.filter((l) => l.inStock).slice(0, 6);
  // 物流摘要只取最近三个节点，完整的走「全部」进查询页。
  const trackingPreview = TRACKING.slice(0, 3);

  return (
    <>
    <View style={styles.screen}>
      {/* ── 第一行：页头（固定，不参与滚动） ───────────────────────── */}
      <View style={[styles.top, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.topRow}>
          <View style={styles.topText}>
            <Text style={styles.greeting}>
              {t('wbGreeting')}, {user.name}
            </Text>
            <Text style={styles.enterprise} numberOfLines={1}>
              {activeEnterprise.name[lang]} · {activeEnterprise.country === 'CN' ? 'КНР' : 'РФ'}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/search')}
            style={({ pressed }) => [styles.searchBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={t('search')}
            hitSlop={TOUCH.slop}
          >
            <Text style={styles.searchGlyph}>⌕</Text>
          </Pressable>
        </View>

        {/* 网络状态：可点击进入离线与同步设置，方便演示离线态 */}
        <Pressable
          onPress={() => router.push('/settings/sync')}
          accessibilityRole="button"
          accessibilityLabel={`${online ? t('online') : t('offline')} · ${t('setSync')}`}
          hitSlop={TOUCH.slop}
          style={styles.netBtn}
        >
          <Text style={styles.netHint}>
            {online ? `● ${t('online')}` : `○ ${t('offline')}`} · {t('setSync')} ›
          </Text>
        </Pressable>
      </View>

      <OfflineBanner />

      {/* ── 第二行：内容（唯一可滚动区域） ─────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        // 让内容占满剩余高度，短内容时底栏仍在屏幕底部，不会浮到中间。
        style={styles.scroll}
      >
        {/* 汇率卡（FR-008 概览主视觉） */}
        <ExchangeRateCard rate={EXCHANGE_RATE} />
        <DataNote source={EXCHANGE_RATE.source} updatedAt={EXCHANGE_RATE.updatedAt} />

        {/* FR-008 关键指标 */}
        <View style={styles.tiles}>
          <StatTile label={t('kpiActiveOrders')} value={String(activeOrders.length)} />
          <StatTile
            label={t('kpiDueAmount')}
            value={formatMoney(Math.round(dueAmount), 'CNY')}
            tone="accent"
          />
        </View>
        <View style={styles.tiles}>
          <StatTile label={t('kpiNextDeadline')} value="20.10" hint="INV-2026-0090" />
          <StatTile
            label={t('kpiOverdueTasks')}
            value={String(overdue)}
            tone={overdue > 0 ? 'danger' : 'success'}
          />
        </View>

        {/* FR-010 快捷操作 */}
        <SectionHeading title={t('quickActions')} />
        <QuickActions actions={quickActions} />

        {/* FR-026 物流摘要 */}
        <SectionHeading
          title={t('logisticsSummary')}
          action={t('seeAll')}
          onAction={() => router.push('/logistics/track')}
        />
        <Card>
          <Timeline events={trackingPreview} />
        </Card>

        {/* FR-013 热门货盘（横向轮播） */}
        <SectionHeading
          title={t('hotGoods')}
          action={t('more')}
          onAction={() => router.push('/catalog')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          // 关键：横向 ScrollView 默认 alignItems:'stretch'，会把卡片拉高；
          // 显式 center 让卡片保持自身高度。
          contentContainerStyle={styles.carousel}
        >
          {hotGoods.map((listing) => (
            <GoodsCard
              key={listing.id}
              listing={listing}
              width={CAROUSEL_CARD_WIDTH}
              onPress={() => router.push(`/goods/${listing.id}`)}
            />
          ))}
        </ScrollView>

        {/* FR-009 今日待办 */}
        <SectionHeading
          title={t('todayTasks')}
          action={t('seeAll')}
          onAction={() => router.push('/tasks')}
        />
        <View style={styles.listCard}>
          {openTasks.slice(0, 3).map((task, index) => (
            <ListRow
              key={task.id}
              title={task.title[lang]}
              subtitle={task.due}
              last={index === Math.min(openTasks.length, 3) - 1}
              right={<Badge label={t(task.priority)} tone={PRIORITY_TONE[task.priority]} />}
              onPress={() => router.push('/tasks')}
            />
          ))}
        </View>

        {/* FR-011 业务动态 */}
        <SectionHeading title={t('timeline')} />
        <Card>
          {activeOrders.slice(0, 3).map((order) => (
            <KeyValue
              key={order.id}
              label={order.updatedAt}
              value={`${order.no} · ${STAGE_SHORT[order.stage][lang]}`}
            />
          ))}
        </Card>

        <SkeletonNote
          frCodes={['FR-008', 'FR-009', 'FR-010', 'FR-011', 'FR-013', 'FR-026']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/orders/?status=active и /api/tasks/?due=today',
            'Автообновление при возврате на экран (refetchOnFocus)',
            'GET /api/rates/ — курс с источником и временем обновления',
            'GET /api/listings/?in_stock=true — горячие товары для карусели',
          ]}
        />
      </ScrollView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  top: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.xs,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  topText: { flex: 1, gap: 2 },
  greeting: { fontSize: FONTS.h2, fontWeight: '700', color: COLORS.surface },
  enterprise: { fontSize: FONTS.tiny, color: '#C7D8EA' },
  searchBtn: {
    width: TOUCH.min,
    height: TOUCH.min,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchGlyph: { color: COLORS.surface, fontSize: 20 },
  netBtn: { alignSelf: 'flex-start', minHeight: 28, justifyContent: 'center' },
  netHint: { fontSize: FONTS.tiny, color: '#C7D8EA' },
  pressed: { opacity: 0.8 },
  // flex:1 —— 内容区吃掉页头与底栏之间的全部高度，短内容也不会留出夹缝。
  scroll: { flex: 1 },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  tiles: { flexDirection: 'row', gap: SPACING.md },
  carousel: { gap: SPACING.md, alignItems: 'center', paddingVertical: SPACING.xs },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
