import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Card } from '../../components/Card';
import { DataNote } from '../../components/DataNote';
import { EmptyState } from '../../components/EmptyState';
import { FormField } from '../../components/FormField';
import { KeyValue } from '../../components/KeyValue';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { Timeline } from '../../components/Timeline';
import { useLang } from '../../context/LangContext';
import { SHIPMENTS, TRACKING } from '../../data/mock';
import { COLORS, FONTS, SPACING } from '../../theme/theme';

/**
 * 物流查询（FM6 / FR-026 状态跟踪、FR-027 轨迹）。
 *
 * 新增页面。1.html 的「物流追踪」卡是写死的两条静态节点，没有输入框、
 * 也不能查。这里做成真的查询：
 *   · 输入批次号或订单号，点「查询」才出结果 —— 不是一个点了没反应的按钮；
 *   · 命中 → 显示该批次的路线、口岸、ETA 和完整轨迹时间线；
 *   · 未命中 → 明确的空态，而不是静默什么都不发生；
 *   · 页面底部给出可用的演示单号，答辩时照着输入即可。
 *
 * 骨架阶段匹配在本地 mock 数据上做；接入时换成
 * GET /api/shipments/?q={номер} 即可，页面结构不用改。
 */

export default function TrackScreen() {
  const { t, lang } = useLang();
  // 支持深链：/logistics/track?q=PL-2026-0031
  // （通知或会话里点「查看物流」时直接带上单号，不用用户再输一遍）
  const params = useLocalSearchParams<{ q?: string }>();
  const initialQuery = typeof params.q === 'string' ? params.q : '';
  const [query, setQuery] = useState(initialQuery);
  /** 已经提交查询的关键词（与输入框解耦，做到「点了才查」）。 */
  const [submitted, setSubmitted] = useState<string | null>(initialQuery || null);

  const result = useMemo(() => {
    if (!submitted) return undefined;
    const q = submitted.trim().toLowerCase();
    if (!q) return undefined;
    return SHIPMENTS.find(
      (s) => s.batchNo.toLowerCase().includes(q) || s.orderNo.toLowerCase().includes(q),
    );
  }, [submitted]);

  const notFound = Boolean(submitted && submitted.trim() && !result);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('logisticsTrack')} subtitle="FM6 · FR-026/027" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 查询表单 */}
        <Card title={t('logisticsTrack')}>
          <FormField
            label={t('logisticsTrackPlaceholder')}
            value={query}
            onChangeText={setQuery}
            placeholder={t('logisticsTrackPlaceholder')}
            hint={t('trackingHint')}
          />
          <PrimaryButton
            label={t('trackingQuery')}
            onPress={() => setSubmitted(query)}
            disabled={query.trim().length === 0}
          />
          <Text style={styles.demoHint}>{t('trackingDemo')}</Text>
          <DataNote source="mock" />
        </Card>

        {/* 查询结果 */}
        {notFound ? (
          <Card>
            <EmptyState title={t('logisticsNoResult')} hint={submitted ?? ''} icon="⌖" />
          </Card>
        ) : null}

        {result ? (
          <>
            <SectionHeading title={`${t('trackingFound')} ${result.batchNo}`} />
            <Card title={result.batchNo} subtitle={result.orderNo}>
              <KeyValue
                label={t('logisticsStatus')}
                value={result.status[lang]}
                emphasis
                tone="primary"
              />
              <KeyValue label={t('logisticsRoute')} value={`${result.routeFrom} → ${result.routeTo}`} />
              <KeyValue label={t('logisticsCrossing')} value={result.crossings.join(' · ')} />
              <KeyValue label={t('logisticsEta')} value={result.eta} />
              <KeyValue label={t('logisticsCallDriver')} value={result.driverPhone} />
            </Card>

            <SectionHeading title={t('logisticsEvents')} />
            <Card>
              <Timeline events={TRACKING} />
            </Card>
          </>
        ) : null}

        <SkeletonNote
          frCodes={['FR-026', 'FR-027']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/shipments/?q={номер партии или заказа} — поиск и история статусов',
            'Push-уведомление при смене статуса груза (FR-038)',
            'Карта маршрута (react-native-maps) — требует dev-build, не Expo Go',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  demoHint: { fontSize: FONTS.tiny, color: COLORS.textMuted },
});
