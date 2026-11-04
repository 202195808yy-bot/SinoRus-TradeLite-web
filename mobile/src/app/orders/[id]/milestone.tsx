import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Card } from '../../../components/Card';
import { FormField } from '../../../components/FormField';
import { PrimaryButton } from '../../../components/PrimaryButton';
import { ScreenHeader } from '../../../components/ScreenHeader';
import { SkeletonNote } from '../../../components/SkeletonNote';
import { useLang } from '../../../context/LangContext';
import { orderOf } from '../../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../../theme/theme';

/**
 * FM4 / FR-018　履约阶段打卡。
 *
 * 需求原文：记录阶段实际完成情况，含日期、备注与照片凭证；该阶段转为「已完成」。
 *
 * 场景来源：SC-02 仓库收货、SC-07 车间确认 —— 都发生在没有工位的地方，
 * 而且往往没有网络。因此这一页是离线队列（FR-042）最主要的入口之一：
 * 提交时若无网络，应写入队列而不是报错。
 */
export default function MilestoneScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const order = orderOf(id ?? '');
  const nextMilestone = order?.milestones.find((m) => !m.done);

  const [date, setDate] = useState('2026-10-25');
  const [note, setNote] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('milestoneTitle')} subtitle="FM4 · FR-018" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card title={order?.no ?? '—'} subtitle={t('stageCheckin')}>
          <FormField label={t('stage')} value={nextMilestone?.name[lang] ?? '—'} readOnly />
          <FormField label={t('milestoneDate')} value={date} onChangeText={setDate} required />
          <FormField label={t('milestoneNote')} value={note} onChangeText={setNote} multiline />
        </Card>

        {/* 照片凭证：骨架用占位框，真实实现接相机 */}
        <Card title={t('milestonePhoto')}>
          <View style={styles.photoBox}>
            <Text style={styles.photoGlyph}>▣</Text>
            <Text style={styles.photoText}>{t('docTakePhoto')}</Text>
          </View>
          <Text style={styles.hint}>
            Vision Camera · автообрезка края и повышение контраста (FR-022)
          </Text>
        </Card>

        <PrimaryButton
          label={t('submit')}
          onPress={() => {
            // 真实实现：POST /api/orders/{id}/milestones/{mid}/checkin/
            // 无网络时：写入 op-sqlite 队列，联网后自动提交（FR-042）
            router.back();
          }}
        />

        <SkeletonNote
          frCodes={['FR-018', 'FR-042']}
          note={t('skeletonNote')}
          todo={[
            'POST /api/orders/{id}/milestones/ — отметка этапа',
            'Загрузка фото (multipart) с сжатием на устройстве (NFR-08)',
            'Офлайн: операция в очередь, повторная отправка при появлении сети',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  photoBox: {
    height: 140,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  photoGlyph: { fontSize: 28, color: COLORS.textMuted },
  photoText: { fontSize: FONTS.small, color: COLORS.textMuted },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted },
});
