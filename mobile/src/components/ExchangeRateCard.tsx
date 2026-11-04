import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLang } from '../context/LangContext';
import { FONTS, GRADIENT, RADIUS, SHADOW, SPACING } from '../theme/theme';
import { formatRate } from '../utils/format';
import type { ExchangeRate } from '../types/models';

/**
 * 汇率卡（工作台首屏主视觉）。
 *
 * 对应 1.html 里的 `from-blue-600 to-indigo-700` 渐变卡，但改掉了它的
 * 三个问题：
 *   1. 不再硬编码「实时汇率」——标题只写「汇率参考」，真实来源由
 *      下方的 DataNote 说明（由使用方传入，见 workbench）。
 *   2. 「今日 +0.12%」按涨跌上色：涨红跌绿（中国习惯），
 *      而不是原型的单一浅蓝底。
 *   3. 数值、涨跌、更新时间都来自 `ExchangeRate` 类型，
 *      接入接口后换数据源即可，组件不用改。
 */

type Props = {
  rate: ExchangeRate;
};

/** 涨跌上色：中国习惯 —— 涨红、跌绿、平灰。 */
function changeTone(pct: number) {
  if (pct > 0) return GRADIENT.up;
  if (pct < 0) return GRADIENT.down;
  return GRADIENT.flat;
}

export function ExchangeRateCard({ rate }: Props) {
  const { t } = useLang();
  const up = rate.changePct >= 0;
  const arrow = rate.changePct === 0 ? '·' : up ? '▲' : '▼';

  return (
    <LinearGradient
      colors={[GRADIENT.heroFrom, GRADIENT.heroTo]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* 装饰：右上角半透明圆环，替代原型的 FontAwesome 水印图标 */}
      <View style={styles.decorOuter} pointerEvents="none" />
      <View style={styles.decorInner} pointerEvents="none" />

      <Text style={styles.label}>{t('exchangeRate')}</Text>

      <View style={styles.valueRow}>
        <Text style={styles.base}>1 {rate.base}</Text>
        <Text style={styles.equals}>=</Text>
        <Text style={styles.quote}>
          {formatRate(rate.value)} {rate.quote}
        </Text>
      </View>

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Text style={[styles.chipText, { color: changeTone(rate.changePct) }]}>
            {arrow} {t('exchangeToday')} {up ? '+' : ''}
            {rate.changePct.toFixed(2)}%
          </Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            {t('exchangeUpdated')} {rate.updatedAt}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: SPACING.sm,
    overflow: 'hidden',
    ...SHADOW.hero,
  },
  decorOuter: {
    position: 'absolute',
    right: -34,
    top: -34,
    width: 132,
    height: 132,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  decorInner: {
    position: 'absolute',
    right: 6,
    top: 22,
    width: 56,
    height: 56,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  label: { fontSize: FONTS.small, color: GRADIENT.heroTextMuted, fontWeight: '600' },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm, flexWrap: 'wrap' },
  base: { fontSize: FONTS.h2, fontWeight: '700', color: GRADIENT.heroText },
  equals: { fontSize: FONTS.h3, color: GRADIENT.heroTextMuted },
  quote: { fontSize: FONTS.h1, fontWeight: '800', color: GRADIENT.heroText },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.xs },
  chip: {
    backgroundColor: GRADIENT.heroChip,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 5,
  },
  // 卡片内的辅助文字也保持 12px 下限。
  chipText: { fontSize: FONTS.tiny, color: GRADIENT.heroText, fontWeight: '600' },
});
