import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { KeyValue } from '../../components/KeyValue';
import { ListRow } from '../../components/ListRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { StatTile } from '../../components/StatTile';
import { useLang } from '../../context/LangContext';
import { INVOICES } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';
import { formatMoney } from '../../utils/format';

/**
 * FM7 / FR-030 账单与付款、FR-031 到账确认、FR-032 按订单对账、FR-033 导出 PDF。
 *
 * 需求原文（FR-031）：登记款项到账，填写日期、金额与付款凭证号。
 * 需求原文（FR-032）：比对订单的应收与实收，输出差额与期末余额。
 *
 * 财务专员（R5）是唯一以本模块为主的角色，因此页面的主操作
 * 只有两个：确认到账、导出对账单。
 */
export default function BillingScreen() {
  const { t } = useLang();

  const unpaid = INVOICES.filter((i) => !i.paid);
  const dueTotal = unpaid.reduce((sum, i) => sum + i.amount, 0);
  const paidTotal = INVOICES.filter((i) => i.paid).reduce((sum, i) => sum + i.amount, 0);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('billingTitle')} subtitle="FM7 · FR-030/031/032/033" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tiles}>
          <StatTile label={t('invoiceAmount')} value={formatMoney(dueTotal)} tone="accent" hint={t('invoiceDue')} />
          <StatTile label={t('invoicePaid')} value={formatMoney(paidTotal)} tone="success" />
        </View>

        {/* FR-030 账单列表 */}
        <SectionHeading title={t('billingTitle')} />
        <View style={styles.listCard}>
          {INVOICES.map((inv, index) => (
            <ListRow
              key={inv.id}
              mark={inv.paid ? '✓' : '!'}
              markColor={inv.paid ? COLORS.success : COLORS.danger}
              title={`${inv.no} · ${inv.orderNo}`}
              subtitle={`${t('invoiceDue')}: ${inv.dueDate}${inv.reference ? ` · ${inv.reference}` : ''}`}
              value={formatMoney(inv.amount, inv.currency)}
              right={
                <Badge label={inv.paid ? t('invoicePaid') : '—'} tone={inv.paid ? 'success' : 'danger'} />
              }
              onPress={() => undefined}
              last={index === INVOICES.length - 1}
            />
          ))}
        </View>

        {/* FR-031 到账确认 */}
        <SectionHeading title={t('confirmPayment')} />
        <Card title="INV-2026-0090" subtitle={formatMoney(2132800)}>
          <FormField label={t('paymentDate')} value="2026-10-12" onChangeText={() => undefined} />
          <FormField
            label={t('paymentRef')}
            value="PAY-2026-0413"
            onChangeText={() => undefined}
          />
          <PrimaryButton label={t('confirmPayment')} onPress={() => undefined} />
        </Card>

        {/* FR-032 按订单对账 */}
        <SectionHeading title={t('reconcile')} />
        <Card title="PO-2026-0071">
          <KeyValue label={t('billingAccrued')} value={formatMoney(5332000)} />
          <KeyValue label={t('billingReceived')} value={formatMoney(3199200)} />
          <View style={styles.divider} />
          <KeyValue label={t('billingDiff')} value={formatMoney(2132800)} emphasis tone="danger" />
        </Card>

        {/* FR-033 导出 PDF */}
        <PrimaryButton label={t('exportPdf')} variant="secondary" onPress={() => undefined} />

        <SkeletonNote
          frCodes={['FR-030', 'FR-031', 'FR-032', 'FR-033']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/invoices/ и POST /api/invoices/{id}/payment/',
            'Сверка по заказу: серверный расчёт расхождения и остатка',
            'Экспорт PDF: expo-print + expo-sharing (только на устройстве)',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  tiles: { flexDirection: 'row', gap: SPACING.md },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
