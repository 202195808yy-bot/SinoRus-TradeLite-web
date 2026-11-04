import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge } from '../../../components/Badge';
import { Card } from '../../../components/Card';
import { EmptyState } from '../../../components/EmptyState';
import { KeyValue } from '../../../components/KeyValue';
import { ListRow } from '../../../components/ListRow';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { SkeletonNote } from '../../../components/SkeletonNote';
import { StageProgress } from '../../../components/StageProgress';
import { useLang } from '../../../context/LangContext';
import { DOCUMENTS, ORDERS, orderOf, shipmentOfOrder } from '../../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../theme/theme';
import {
  DOC_STATUS_KEY,
  DOC_STATUS_TONE,
  formatMoney,
  formatQty,
  ORDER_STATUS_KEY,
} from '../../../utils/format';

type TabKey = 'lines' | 'stages' | 'batches' | 'docs' | 'messages';

/**
 * FM4 / FR-017　订单详情。
 *
 * 需求原文：订单完整信息：商品行、金额、阶段、批次、单证与关联消息，
 * 以标签页集中在一个页面。
 *
 * 「标签页集中在一个页面」是需求明确要求的形态 —— 移动端不做
 * Web 端那种多页跳转，而是把一单的全部信息收在一屏之内切换。
 * 顶部再加一条六阶段进度条（规范 1.5），一眼看出走到哪一步。
 */
export default function OrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const [tab, setTab] = useState<TabKey>('lines');

  const order = orderOf(id ?? '') ?? ORDERS[0];
  const shipment = shipmentOfOrder(order.no);
  const docs = DOCUMENTS.filter((d) => order.docIds.includes(d.id));

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'lines', label: t('orderTabLines') },
    { key: 'stages', label: t('orderTabStages') },
    { key: 'batches', label: t('orderTabBatches') },
    { key: 'docs', label: t('orderTabDocs') },
    { key: 'messages', label: t('orderTabMessages') },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader title={order.no} subtitle={`FM4 · ${order.counterparty}`} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 概览 */}
        <Card title={order.counterparty} subtitle={order.updatedAt}>
          <KeyValue label={t('amount')} value={formatMoney(order.amount, order.currency)} emphasis tone="primary" />
          <KeyValue label={t('status')} value={t(ORDER_STATUS_KEY[order.status])} />
          {shipment ? <KeyValue label={t('logisticsStatus')} value={shipment.status[lang]} /> : null}
        </Card>

        {/* 六阶段进度 */}
        <Card title={t('stage')}>
          <StageProgress current={order.stage} lang={lang} />
        </Card>

        {/* 三个移动端专属操作（FR-018/019/020） */}
        <View style={styles.actions}>
          <PrimaryButton
            label={t('stageCheckin')}
            onPress={() => router.push(`/orders/${order.id}/milestone`)}
          />
          <View style={styles.actionRow}>
            <PrimaryButton
              label={t('shipmentBatch')}
              variant="secondary"
              style={styles.actionHalf}
              onPress={() => router.push(`/orders/${order.id}/shipment`)}
            />
            <PrimaryButton
              label={t('reportException')}
              variant="secondary"
              style={styles.actionHalf}
              onPress={() => router.push(`/orders/${order.id}/exception`)}
            />
          </View>
        </View>

        {/* 标签页 */}
        <View style={styles.tabs}>
          {TABS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => setTab(item.key)}
              style={[styles.tab, tab === item.key && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === item.key && styles.tabTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 商品行 */}
        {tab === 'lines' ? (
          <View style={styles.listCard}>
            {order.lines.map((line, index) => (
              <ListRow
                key={line.id}
                mark={String(index + 1)}
                title={line.goods.name[lang]}
                subtitle={`${line.goods.unit}${line.goods.hsCode ? ` · ТН ВЭД ${line.goods.hsCode}` : ''}`}
                value={formatMoney(line.price, order.currency)}
                valueHint={`× ${formatQty(line.qty)}`}
                last={index === order.lines.length - 1}
              />
            ))}
          </View>
        ) : null}

        {/* 履约阶段 */}
        {tab === 'stages' ? (
          <View style={styles.listCard}>
            {order.milestones.map((ms, index) => (
              <ListRow
                key={ms.id}
                mark={ms.done ? '✓' : String(index + 1)}
                markColor={ms.done ? COLORS.success : COLORS.textMuted}
                title={ms.name[lang]}
                subtitle={`${t('milestoneDate')}: ${ms.actualDate ?? '—'} / план ${ms.plannedDate}`}
                right={<Badge label={ms.done ? 'OK' : '—'} tone={ms.done ? 'success' : 'neutral'} />}
                onPress={() => router.push(`/orders/${order.id}/milestone`)}
                chevron={false}
                last={index === order.milestones.length - 1}
              />
            ))}
          </View>
        ) : null}

        {/* 发货批次 */}
        {tab === 'batches' ? (
          order.batches.length === 0 ? (
            <EmptyState title={t('empty')} hint={t('emptyHint')} />
          ) : (
            <View style={styles.listCard}>
              {order.batches.map((batch, index) => (
                <ListRow
                  key={batch.id}
                  mark="ПЛ"
                  title={batch.no}
                  subtitle={`${t('shipmentDate')}: ${batch.shipDate}`}
                  value={formatQty(batch.qty)}
                  onPress={() => router.push('/logistics')}
                  last={index === order.batches.length - 1}
                />
              ))}
            </View>
          )
        ) : null}

        {/* 单证 */}
        {tab === 'docs' ? (
          docs.length === 0 ? (
            <EmptyState title={t('empty')} hint={t('emptyHint')} />
          ) : (
            <View style={styles.listCard}>
              {docs.map((doc, index) => (
                <ListRow
                  key={doc.id}
                  mark="ДК"
                  markColor={doc.status === 'ok' ? COLORS.success : COLORS.warning}
                  title={doc.typeLabel[lang]}
                  subtitle={`${t('docValidUntil')} ${doc.validUntil}${doc.cached ? ` · ${t('docCached')}` : ''}`}
                  right={<Badge label={t(DOC_STATUS_KEY[doc.status])} tone={DOC_STATUS_TONE[doc.status]} />}
                  onPress={() => router.push('/documents')}
                  last={index === docs.length - 1}
                />
              ))}
            </View>
          )
        ) : null}

        {/* 关联消息 */}
        {tab === 'messages' ? (
          <View style={styles.listCard}>
            <ListRow
              title={`${order.no} · ${order.counterparty}`}
              subtitle={t('translateOn')}
              value="10:42"
              onPress={() => router.push('/chat/cnv-1')}
              last
            />
          </View>
        ) : null}

        <SkeletonNote
          frCodes={['FR-017']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/orders/{id}/ — агрегированный ответ со всеми блоками',
            'Ленивая подгрузка вкладок (документы и сообщения — отдельными запросами)',
            'Кэш карточки заказа в локальной БД для офлайн-просмотра (FR-041)',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  actions: { gap: SPACING.sm },
  actionRow: { flexDirection: 'row', gap: SPACING.sm },
  actionHalf: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  tab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.surface, fontWeight: '700' },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
