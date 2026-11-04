import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/Card';
import { DataNote } from '../../components/DataNote';
import { FormField } from '../../components/FormField';
import { KeyValue } from '../../components/KeyValue';
import { ListRow } from '../../components/ListRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { Timeline } from '../../components/Timeline';
import { useLang } from '../../context/LangContext';
import { SHIPMENTS, TRACKING } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM6 / FR-026 运输状态跟踪、FR-027 路线与口岸地图、FR-028 运费试算、FR-029 联系司机。
 *
 * 需求原文（FR-027）：在地图上显示路线与已通过的口岸，并可点击查看口岸信息。
 * 骨架阶段不引入地图库（react-native-maps 需要原生构建，Expo Go 里跑不起来），
 * 用一个「路线示意条」表达同样的信息结构：起点 → 口岸1 → 口岸2 → 终点。
 */
export default function LogisticsScreen() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [weight, setWeight] = useState('2400');
  const [volume, setVolume] = useState('18');

  const shipment = SHIPMENTS[0];
  const waypoints = [shipment.routeFrom, ...shipment.crossings, shipment.routeTo];

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('logisticsTitle')} subtitle="FM6 · FR-026/027/028/029" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* FR-026 当前状态 */}
        <Card title={shipment.batchNo} subtitle={shipment.orderNo}>
          <KeyValue label={t('logisticsStatus')} value={shipment.status[lang]} emphasis tone="primary" />
          <KeyValue label={t('logisticsEta')} value={shipment.eta} />
        </Card>

        {/* 按单号查询：进入独立的查询页（原来点了没反应的入口现在有落点了） */}
        <PrimaryButton
          label={`⌕ ${t('logisticsTrack')}`}
          variant="secondary"
          onPress={() => router.push('/logistics/track')}
        />

        {/* FR-027 轨迹时间线 */}
        <SectionHeading title={t('logisticsEvents')} />
        <Card>
          <Timeline events={TRACKING} />
          <DataNote source="mock" />
        </Card>

        {/* FR-027 路线与口岸（地图占位） */}
        <SectionHeading title={t('logisticsRoute')} />
        <Card>
          <View style={styles.mapBox}>
            <Text style={styles.mapGlyph}>⌖</Text>
            <Text style={styles.mapText}>react-native-maps · карта маршрута</Text>
          </View>

          <View style={styles.route}>
            {waypoints.map((point, index) => (
              <View key={`${point}-${index}`} style={styles.routeItem}>
                <View
                  style={[
                    styles.routeDot,
                    index === 0 && styles.routeDotStart,
                    index === waypoints.length - 1 && styles.routeDotEnd,
                    index > 0 && index < waypoints.length - 1 && styles.routeDotCrossing,
                  ]}
                />
                <Text style={styles.routeText} numberOfLines={1}>
                  {point}
                  {index > 0 && index < waypoints.length - 1 ? `  (${t('logisticsCrossing')})` : ''}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* FR-029 联系司机 */}
        <PrimaryButton
          label={`${t('logisticsCallDriver')} · ${shipment.driverPhone}`}
          variant="secondary"
          onPress={() => undefined}
        />

        {/* FR-028 运费试算 */}
        <SectionHeading title={t('logisticsFreight')} />
        <Card>
          <FormField
            label={t('logisticsWeight')}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <FormField
            label={t('logisticsVolume')}
            value={volume}
            onChangeText={setVolume}
            keyboardType="numeric"
          />
          <PrimaryButton label={t('logisticsCalc')} onPress={() => undefined} />
          <View style={styles.divider} />
          <KeyValue label="Владимир → Чжэнчжоу" value="≈ ¥ 412 000" emphasis tone="primary" />
          <Text style={styles.hint}>{t('logisticsFreightNote')}</Text>
        </Card>

        <SectionHeading title="Партии в пути" />
        <View style={styles.listCard}>
          {SHIPMENTS.map((item, index) => (
            <ListRow
              key={item.id}
              mark="ПЛ"
              title={item.batchNo}
              subtitle={`${item.routeFrom} → ${item.routeTo}`}
              value={item.eta}
              last={index === SHIPMENTS.length - 1}
            />
          ))}
        </View>

        <SkeletonNote
          frCodes={['FR-026', 'FR-027', 'FR-028', 'FR-029']}
          note={t('skeletonNote')}
          todo={[
            'react-native-maps или Yandex Maps SDK (требует dev-build, не Expo Go)',
            'GET /api/shipments/{id}/ — статус, история переходов, ETA',
            'Звонок водителю через Linking.openURL("tel:…")',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  mapBox: {
    height: 130,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  mapGlyph: { fontSize: 28, color: COLORS.primary },
  mapText: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  route: { gap: SPACING.xs, marginTop: SPACING.xs },
  routeItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  routeDotStart: { backgroundColor: COLORS.russia },
  routeDotEnd: { backgroundColor: COLORS.china },
  routeDotCrossing: { backgroundColor: COLORS.accent },
  routeText: { flex: 1, fontSize: FONTS.tiny, color: COLORS.text },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xs },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
