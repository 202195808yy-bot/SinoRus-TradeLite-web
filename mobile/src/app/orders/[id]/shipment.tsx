import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '../../../components/Card';
import { FormField } from '../../../components/FormField';
import { ListRow } from '../../../components/ListRow';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { SectionHeading } from '../../../components/SectionHeading';
import { SkeletonNote } from '../../../components/SkeletonNote';
import { useLang } from '../../../context/LangContext';
import { orderOf } from '../../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../theme/theme';

/**
 * FM4 / FR-019　确认发货批次。
 *
 * 需求原文：从订单商品行中组批，填写数量与发货日期，并关联运输单证。
 *
 * 「组批」是这一页的实质：一批货可能只包含订单里的部分数量，
 * 因此这里要能按商品行分配本次发货数量。
 */
export default function ShipmentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const order = orderOf(id ?? '');

  const [shipDate, setShipDate] = useState('2026-10-26');
  const [docNo, setDocNo] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('shipmentTitle')} subtitle="FM4 · FR-019" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card title={order?.no ?? '—'} subtitle={t('shipmentBatch')}>
          <FormField label={t('shipmentDate')} value={shipDate} onChangeText={setShipDate} required />
          <FormField
            label={t('shipmentDoc')}
            value={docNo}
            onChangeText={setDocNo}
            placeholder="PL-2026-00XX"
          />
        </Card>

        <SectionHeading title={t('orderTabLines')} />
        <View style={styles.listCard}>
          {(order?.lines ?? []).map((line, index) => (
            <ListRow
              key={line.id}
              mark={String(index + 1)}
              title={line.goods.name[lang]}
              subtitle={`${t('shipmentQty')}: ${line.qty} ${line.goods.unit}`}
              value={String(line.qty)}
              onPress={() => undefined}
              last={index === (order?.lines.length ?? 1) - 1}
            />
          ))}
        </View>

        <Text style={styles.hint}>
          {t('shipmentQty')} — распределяется по позициям заказа; при частичной отгрузке
          остаток переносится в следующую партию.
        </Text>

        <PrimaryButton label={t('confirm')} onPress={() => router.back()} />

        <SkeletonNote
          frCodes={['FR-019']}
          note={t('skeletonNote')}
          todo={[
            'POST /api/orders/{id}/batches/ — создание партии',
            'Связь партии с транспортным документом (FM5)',
            'Проверка: сумма партий не должна превышать количество в заказе',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted, lineHeight: 16 },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
