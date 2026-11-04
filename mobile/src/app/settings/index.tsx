import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ListRow } from '../../components/ListRow';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { useSync } from '../../context/SyncContext';
import { LANG_LABELS } from '../../i18n/strings';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM11 / FR-045　设置总览。
 *
 * 四个设置分区：界面语言、通知、离线与同步、系统管理，
 * 分别落到 FM11、FM9、FM10、FM11 四个模块。
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { t, lang } = useLang();
  const { activeEnterprise } = useAuth();
  const { online, queue, lastSyncAt } = useSync();

  const pending = queue.filter((op) => op.status !== 'failed').length;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('settingsTitle')} subtitle="FM11" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeading title={t('settingsTitle')} />
        <View style={styles.listCard}>
          <ListRow
            mark="ЯЗ"
            title={t('setLanguage')}
            subtitle={t('languageHint')}
            value={LANG_LABELS[lang]}
            onPress={() => router.push('/settings/language')}
          />
          <ListRow
            mark="УВ"
            title={t('setNotifications')}
            subtitle="FM9 · FR-039"
            onPress={() => router.push('/settings/notifications')}
          />
          <ListRow
            mark="ОФ"
            title={t('setSync')}
            subtitle={`${online ? t('online') : t('offline')} · ${t('lastSync')}: ${lastSyncAt ?? t('never')}`}
            value={pending > 0 ? `${t('pendingOps')} ${pending}` : '✓'}
            onPress={() => router.push('/settings/sync')}
          />
          <ListRow
            mark="АД"
            title={t('setAdmin')}
            subtitle="FM11 · FR-046/047/048"
            onPress={() => router.push('/settings/admin')}
            last
          />
        </View>

        <SectionHeading title={t('setEnterprise')} />
        <View style={styles.listCard}>
          <ListRow
            mark={activeEnterprise.country}
            markColor={activeEnterprise.country === 'CN' ? COLORS.china : COLORS.russia}
            title={activeEnterprise.name[lang]}
            subtitle={`${activeEnterprise.role} · ${activeEnterprise.inn ?? '—'}`}
            onPress={() => router.push('/profile')}
            last
          />
        </View>

        <SectionHeading title={t('setAbout')} />
        <View style={styles.listCard}>
          <ListRow
            mark="i"
            title={t('setAbout')}
            subtitle="FM0–FM11 · 48 ФТ · 12 НФТ"
            onPress={() => router.push('/about')}
            last
          />
        </View>

        <Text style={styles.version}>
          {t('version')} 0.1.0 · Expo SDK 54 · React Native 0.81
        </Text>

        <SkeletonNote
          frCodes={['FR-045', 'FR-046', 'FR-047', 'FR-048']}
          note={t('skeletonNote')}
          todo={[
            'Сохранение выбранного языка в AsyncStorage',
            'Настройки — локальные + синхронизируемые с сервером',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  version: { fontSize: FONTS.tiny, color: COLORS.textMuted, textAlign: 'center' },
});
