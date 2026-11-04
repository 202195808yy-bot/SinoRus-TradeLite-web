import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';
import type { DealStage } from '../types/models';
import type { Lang } from '../i18n/strings';

/**
 * 交易六阶段进度条（规范 1.5）。
 * 订单详情页顶部用它显示「这单走到哪一步了」。
 */

export const DEAL_STAGES: { key: DealStage; name: Record<Lang, string> }[] = [
  { key: 'rfq', name: { ru: 'Запрос', zh: '询价', en: 'RFQ' } },
  { key: 'quote', name: { ru: 'Предложение', zh: '报价', en: 'Quote' } },
  { key: 'order', name: { ru: 'Заказ', zh: '订单', en: 'Order' } },
  { key: 'fulfilment', name: { ru: 'Исполнение', zh: '履约', en: 'Fulfilment' } },
  { key: 'logistics', name: { ru: 'Логистика', zh: '单证与运输', en: 'Logistics' } },
  { key: 'settlement', name: { ru: 'Расчёты', zh: '结算', en: 'Settlement' } },
];

type Props = {
  current: DealStage;
  lang: Lang;
};

export function StageProgress({ current, lang }: Props) {
  const currentIndex = DEAL_STAGES.findIndex((s) => s.key === current);

  return (
    <View style={styles.wrap}>
      <View style={styles.track}>
        {DEAL_STAGES.map((stage, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <View key={stage.key} style={styles.segWrap}>
              <View
                style={[
                  styles.seg,
                  done && styles.segDone,
                  active && styles.segActive,
                ]}
              />
            </View>
          );
        })}
      </View>

      <View style={styles.labels}>
        {DEAL_STAGES.map((stage, index) => (
          <Text
            key={stage.key}
            style={[
              styles.label,
              index === currentIndex && styles.labelActive,
              index < currentIndex && styles.labelDone,
            ]}
            numberOfLines={2}
          >
            {stage.name[lang]}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: SPACING.sm },
  track: { flexDirection: 'row', gap: 4 },
  segWrap: { flex: 1 },
  seg: {
    height: 6,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceAlt,
  },
  segDone: { backgroundColor: COLORS.primary },
  segActive: { backgroundColor: COLORS.accent },
  labels: { flexDirection: 'row', gap: 4 },
  label: {
    flex: 1,
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  labelActive: { color: COLORS.accent, fontWeight: '700' },
  labelDone: { color: COLORS.primary },
});
