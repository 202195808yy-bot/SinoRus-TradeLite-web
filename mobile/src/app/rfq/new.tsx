import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { ListRow } from '../../components/ListRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { ORDERS, RFQS } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM3 / FR-013　手机端发起询价。
 *
 * 需求原文：基于模板发起询价：从商品目录选择商品、填写数量与回复期限并发送给对方。
 *
 * 这是移动端「随时随地」价值的典型体现（场景 SC-01 展会现场）：
 * 供应商业务员在展台用手机就能发出询价，不必回到工位。
 *
 * 骨架实现：表单结构与交互齐全，商品选择用一个可点列表代替
 * 真实的目录选择器（后者需要先接入 GET /api/goods/）。
 */
export default function RfqCreateScreen() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [deadline, setDeadline] = useState('2026-10-25');
  const [note, setNote] = useState('');

  // 商品目录先借订单里的商品行演示「从目录选商品」这一步
  const catalogue = ORDERS.flatMap((o) => o.lines.map((l) => l.goods)).slice(0, 3);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('rfqCreateTitle')} subtitle="FM3 · FR-013" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card title={t('rfqCreateTitle')} subtitle={t('rfqNew')}>
          <FormField label={t('counterparty')} value="ООО «Урал-Маш»" readOnly />
          <FormField
            label={t('rfqDeadline')}
            value={deadline}
            onChangeText={setDeadline}
            placeholder="ГГГГ-ММ-ДД"
            required
          />
          <FormField
            label={t('milestoneNote')}
            value={note}
            onChangeText={setNote}
            placeholder="—"
            multiline
          />
        </Card>

        <SectionHeading title={`${t('rfqGoods')} (${catalogue.length})`} />
        <View style={styles.listCard}>
          {catalogue.map((goods, index) => (
            <ListRow
              key={goods.id}
              mark="＋"
              title={goods.name[lang]}
              subtitle={`${goods.unit}${goods.hsCode ? ` · ТН ВЭД ${goods.hsCode}` : ''}`}
              value="1"
              valueHint={t('rfqQty')}
              onPress={() => undefined}
              last={index === catalogue.length - 1}
            />
          ))}
        </View>

        <PrimaryButton label={t('submit')} onPress={() => router.back()} />
        <Text style={styles.tip}>
          {t('rfqNo')}: RFQ-2026-0149 (будет присвоен сервером)
        </Text>

        <SkeletonNote
          frCodes={['FR-013']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/goods/ — выбор товара из каталога с поиском',
            'POST /api/rfqs/ — создание запроса вместе с позициями',
            'Очередь при отсутствии сети: запрос уходит после восстановления связи (FR-042)',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  tip: { fontSize: FONTS.tiny, color: COLORS.textMuted, textAlign: 'center' },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
