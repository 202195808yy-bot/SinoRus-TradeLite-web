import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { ListRow } from '../components/ListRow';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeading } from '../components/SectionHeading';
import { SkeletonNote } from '../components/SkeletonNote';
import { useLang } from '../context/LangContext';
import { NOTIFICATIONS } from '../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * FM9 / FR-040　应用内通知中心（并作为 FR-039 通知分类设置的入口）。
 *
 * 需求原文：应用内全部通知的历史记录，可跳转到关联对象。
 * 因此每条通知都带 `module` 字段，点击后按模块路由到对应页面。
 */
export default function NotificationsScreen() {
  const router = useRouter();
  const { t, lang } = useLang();

  const routeForModule = (code: string) => {
    switch (code) {
      case 'FM3':
        return '/rfq';
      case 'FM4':
        return '/orders/ord-2';
      case 'FM5':
        return '/documents';
      default:
        return '/notifications';
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('notifTitle')} subtitle="FM9 · FR-040" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.rowBetween}>
          <Text style={styles.count}>
            {NOTIFICATIONS.filter((n) => !n.read).length} / {NOTIFICATIONS.length}
          </Text>
          <Text style={styles.action}>{t('notifMarkRead')}</Text>
        </View>

        <View style={styles.listCard}>
          {NOTIFICATIONS.map((item, index) => (
            <ListRow
              key={item.id}
              mark={item.module.replace('FM', '')}
              markColor={item.read ? COLORS.textMuted : COLORS.accent}
              title={item.title[lang]}
              subtitle={item.body[lang]}
              value={item.time}
              right={!item.read ? <Badge label="new" tone="danger" /> : undefined}
              onPress={() => router.push(routeForModule(item.module) as never)}
              last={index === NOTIFICATIONS.length - 1}
            />
          ))}
        </View>

        <SectionHeading title={t('notifSettings')} />
        <Card>
          <Text style={styles.note}>{t('notifCategories')} · {t('notifDnd')} · {t('notifPush')}</Text>
        </Card>
        <PrimaryButton
          label={t('notifSettings')}
          variant="secondary"
          onPress={() => router.push('/settings/notifications')}
        />

        <SkeletonNote
          frCodes={['FR-038', 'FR-039', 'FR-040']}
          note={t('skeletonNote')}
          todo={[
            'FCM (Android) и APNs (iOS): токен устройства регистрируется при входе',
            'GET /api/notifications/ + отметка прочитанного',
            'Категории и «не беспокоить» — локальные настройки + серверные правила',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: { fontSize: FONTS.small, color: COLORS.textMuted },
  action: { fontSize: FONTS.small, color: COLORS.primary, fontWeight: '600' },
  note: { fontSize: FONTS.small, color: COLORS.textMuted },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
