import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
 * FM4 / FR-020　异常上报。
 *
 * 需求原文：登记订单异常：类型、描述、照片与受影响商品行；
 * 异常进入责任人的待办清单。
 *
 * 场景来源：SC-08 异常应急 —— 货物受损时物流人员拍照登记，
 * 通知同时送达采购商与报关代理。因此这一页提交后要产生
 * 两条副作用：① 异常记录；② 给相关角色的待办与推送。
 */
export default function ExceptionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, lang } = useLang();
  const order = orderOf(id ?? '');

  const TYPES =
    lang === 'zh'
      ? ['货物受损', '数量不符', '单证缺失', '交付延误']
      : lang === 'en'
        ? ['Damaged goods', 'Quantity mismatch', 'Missing document', 'Delivery delay']
        : ['Повреждение груза', 'Несоответствие количества', 'Отсутствие документа', 'Просрочка поставки'];

  const [type, setType] = useState(TYPES[0]);
  const [desc, setDesc] = useState('');

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('exceptionTitle')} subtitle="FM4 · FR-020" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card title={order?.no ?? '—'} subtitle={t('reportException')}>
          <Text style={styles.label}>{t('exceptionType')}</Text>
          <View style={styles.chips}>
            {TYPES.map((item) => (
              <Pressable
                key={item}
                onPress={() => setType(item)}
                style={[styles.chip, type === item && styles.chipActive]}
              >
                <Text style={[styles.chipText, type === item && styles.chipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          <FormField
            label={t('exceptionDesc')}
            value={desc}
            onChangeText={setDesc}
            placeholder="—"
            multiline
            required
          />
        </Card>

        <Card title={t('exceptionPhoto')}>
          <View style={styles.photoBox}>
            <Text style={styles.photoGlyph}>▣</Text>
            <Text style={styles.photoText}>{t('docTakePhoto')}</Text>
          </View>
        </Card>

        <PrimaryButton label={t('submit')} onPress={() => router.back()} />

        <Text style={styles.hint}>
          После отправки: уведомление придёт закупщику и таможенному брокеру,
          задача появится в их списке дел (FR-009, FR-038).
        </Text>

        <SkeletonNote
          frCodes={['FR-020']}
          note={t('skeletonNote')}
          todo={[
            'POST /api/orders/{id}/exceptions/ — регистрация проблемы',
            'Автосоздание задачи и push-уведомления ответственным ролям',
            'Указание пострадавших позиций заказа',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  label: { fontSize: FONTS.small, color: COLORS.textMuted, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipActive: { backgroundColor: COLORS.dangerSoft, borderColor: COLORS.danger },
  chipText: { fontSize: FONTS.small, color: COLORS.textMuted },
  chipTextActive: { color: COLORS.danger, fontWeight: '700' },
  photoBox: {
    height: 120,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  photoGlyph: { fontSize: 26, color: COLORS.textMuted },
  photoText: { fontSize: FONTS.small, color: COLORS.textMuted },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted, lineHeight: 16 },
});
