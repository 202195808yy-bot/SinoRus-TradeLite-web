import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { FormField } from '../../components/FormField';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM9 / FR-039　通知分类设置。
 *
 * 需求原文：按类别开关通知，并设置免打扰时段。
 *
 * 分类与业务模块一一对应（新报价、订单状态、单证到期、款项到账），
 * 因此开关状态最终要同步到服务端的推送规则里 —— 否则
 * 服务端仍会推送用户已经关掉的类别。
 */
export default function NotificationSettingsScreen() {
  const { t, lang } = useLang();
  const [push, setPush] = useState(true);
  const [dnd, setDnd] = useState(true);
  const [categories, setCategories] = useState({
    quote: true,
    order: true,
    document: true,
    payment: false,
  });

  const CATEGORY_LABELS =
    lang === 'zh'
      ? { quote: '新报价', order: '订单状态变更', document: '单证到期', payment: '款项到账' }
      : lang === 'en'
        ? { quote: 'New quote', order: 'Order status', document: 'Document expiry', payment: 'Payment received' }
        : { quote: 'Новое предложение', order: 'Статус заказа', document: 'Срок документа', payment: 'Поступление средств' };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('notifSettings')} subtitle="FM9 · FR-039" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <View style={styles.switchRow}>
            <Text style={styles.label}>{t('notifPush')}</Text>
            <Switch value={push} onValueChange={setPush} trackColor={{ true: COLORS.primary }} />
          </View>
        </Card>

        <SectionHeading title={t('notifCategories')} />
        <View style={styles.listCard}>
          {(Object.keys(categories) as (keyof typeof categories)[]).map((key) => (
            <View key={key} style={styles.switchRowPadded}>
              <Text style={styles.label}>{CATEGORY_LABELS[key]}</Text>
              <Switch
                value={categories[key]}
                onValueChange={(next) => setCategories((prev) => ({ ...prev, [key]: next }))}
                trackColor={{ true: COLORS.primary }}
              />
            </View>
          ))}
        </View>

        <SectionHeading title={t('notifDnd')} />
        <Card>
          <View style={styles.switchRow}>
            <Text style={styles.label}>{t('notifDnd')}</Text>
            <Switch value={dnd} onValueChange={setDnd} trackColor={{ true: COLORS.primary }} />
          </View>
          <FormField label={t('notifDndFrom')} value="22:00" onChangeText={() => undefined} />
          <FormField label={t('notifDndTo')} value="08:00" onChangeText={() => undefined} />
        </Card>

        <SkeletonNote
          frCodes={['FR-038', 'FR-039']}
          note={t('skeletonNote')}
          todo={[
            'expo-notifications: запрос разрешения и регистрация токена',
            'Синхронизация категорий с серверными правилами push',
            'Тихие уведомления в часы «не беспокоить»',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  switchRowPadded: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  label: { fontSize: FONTS.body, color: COLORS.text, flex: 1 },
  listCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
