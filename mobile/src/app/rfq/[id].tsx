import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { KeyValue } from '../../components/KeyValue';
import { ListRow } from '../../components/ListRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { rfqOf } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';
import { formatMoney } from '../../utils/format';

/**
 * FM3 / FR-014　报价查看与比价、FR-015　接受报价。
 *
 * 需求原文（FR-014）：查看收到的报价，并在同一张表中按价格、交期与贸易条件比价。
 * 需求原文（FR-015）：确认选中的报价并锁定该版本；确认后自动生成订单。
 *
 * 比价表是这一页的核心：移动端的做法是把三家报价横向并列，
 * 最低价高亮，让采购方在手机上就能拍板（场景 SC-06 通勤中审批）。
 */
export default function RfqDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const rfq = rfqOf(id ?? '');
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  if (!rfq) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={t('rfqTitle')} />
        <EmptyState title={t('empty')} hint={t('emptyHint')} />
      </View>
    );
  }

  const bestPrice = Math.min(...rfq.quotes.map((q) => q.price));

  return (
    <View style={styles.screen}>
      <ScreenHeader title={rfq.no} subtitle={`FM3 · ${rfq.counterparty}`} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card title={t('rfqNo')} subtitle={rfq.counterparty}>
          <KeyValue label={t('rfqDeadline')} value={rfq.deadline} emphasis />
          <KeyValue label={t('rfqLines')} value={String(rfq.lines.length)} />
        </Card>

        {/* 商品行 */}
        <SectionHeading title={t('rfqLines')} />
        <View style={styles.listCard}>
          {rfq.lines.map((line, index) => (
            <ListRow
              key={line.id}
              mark={String(index + 1)}
              title={line.goods.name[lang]}
              subtitle={line.goods.unit}
              value={`${line.qty}`}
              last={index === rfq.lines.length - 1}
            />
          ))}
        </View>

        {/* FR-014 比价表 */}
        <SectionHeading title={t('rfqCompare')} />
        {rfq.quotes.length === 0 ? (
          <EmptyState title={t('empty')} hint={t('emptyHint')} />
        ) : (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHead]}>
              <Text style={[styles.cell, styles.cellHead, styles.colSupplier]}>{t('counterparty')}</Text>
              <Text style={[styles.cell, styles.cellHead, styles.colNum]}>{t('quotePrice')}</Text>
              <Text style={[styles.cell, styles.cellHead, styles.colNum]}>{t('quoteLeadTime')}</Text>
              <Text style={[styles.cell, styles.cellHead, styles.colTerms]}>{t('quoteTerms')}</Text>
            </View>

            {rfq.quotes.map((quote, index) => {
              const best = quote.price === bestPrice;
              const accepted = acceptedId === quote.id || quote.accepted;
              return (
                <Pressable
                  key={quote.id}
                  onPress={() => setAcceptedId(quote.id)}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 && styles.tableRowAlt,
                    accepted && styles.tableRowAccepted,
                  ]}
                >
                  <Text style={[styles.cell, styles.colSupplier]} numberOfLines={2}>
                    {quote.supplier}
                    {best ? ' ★' : ''}
                  </Text>
                  <Text style={[styles.cell, styles.colNum, best && styles.best]}>
                    {formatMoney(quote.price, quote.currency)}
                  </Text>
                  <Text style={[styles.cell, styles.colNum]}>{quote.leadTimeDays} дн.</Text>
                  <Text style={[styles.cell, styles.colTerms]} numberOfLines={2}>
                    {quote.incoterms}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Text style={styles.legend}>★ — минимальная цена · нажмите строку, чтобы выбрать</Text>

        {/* FR-015 接受报价 */}
        <PrimaryButton
          label={acceptedId ? t('quoteAccepted') : t('quoteAccept')}
          onPress={() => {
            setAcceptedId(acceptedId ?? rfq.quotes[0]?.id ?? null);
            // 真实实现：POST /api/quotes/{id}/accept/ → 服务端生成订单 → 跳订单详情
          }}
          disabled={rfq.quotes.length === 0}
        />

        {acceptedId ? (
          <Pressable onPress={() => router.push('/orders/ord-1')}>
            <Card>
              <KeyValue label="→ PO-2026-0071" value={t('orderDetail')} tone="primary" />
            </Card>
          </Pressable>
        ) : null}

        <SkeletonNote
          frCodes={['FR-014', 'FR-015']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/rfqs/{id}/quotes/ — предложения по запросу',
            'POST /api/quotes/{id}/accept/ — блокировка версии и создание заказа',
            'Учёт Incoterms 2020 при сравнении условий поставки',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: SPACING.sm,
  },
  tableHead: { backgroundColor: COLORS.surfaceAlt, borderTopWidth: 0 },
  tableRowAlt: { backgroundColor: '#FAFBFD' },
  tableRowAccepted: { backgroundColor: COLORS.successSoft },
  cell: { fontSize: FONTS.tiny, color: COLORS.text, paddingHorizontal: SPACING.xs },
  cellHead: { color: COLORS.textMuted, fontWeight: '700' },
  colSupplier: { flex: 1.6 },
  colNum: { flex: 1.1, textAlign: 'right' },
  colTerms: { flex: 1.3, textAlign: 'right' },
  best: { color: COLORS.success, fontWeight: '700' },
  legend: { fontSize: FONTS.tiny, color: COLORS.textMuted },
});
