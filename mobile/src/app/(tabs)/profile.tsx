import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { KeyValue } from '../../components/KeyValue';
import { ListRow } from '../../components/ListRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import { useSync } from '../../context/SyncContext';
import { LANG_LABELS } from '../../i18n/strings';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * 我的 —— FM1（账号）、FM9（通知）、FM10（离线）、FM11（设置）四个模块的入口。
 *
 * 对应底部导航第四个分区。四个模块都归到这里，是因为它们都属于
 * 「不针对某一笔交易」的全局性功能。
 */
export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, lang } = useLang();
  const { user, activeEnterprise, switchEnterprise, signOut } = useAuth();
  const { online, queue, lastSyncAt } = useSync();

  const pending = queue.filter((op) => op.status !== 'failed').length;

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.title}>{t('tabProfile')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 用户卡片 */}
        <Card>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.slice(0, 1)}</Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userMeta}>{user.position[lang]}</Text>
              <Text style={styles.userMeta}>{user.phone}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <KeyValue label={t('email')} value={user.email} />
          <KeyValue label={t('enterpriseSwitch')} value={activeEnterprise.name[lang]} emphasis />
        </Card>

        {/* FR-007 切换所属企业 */}
        <SectionHeading title={t('enterpriseSwitch')} />
        <View style={styles.listCard}>
          {user.enterprises.map((ent, index) => (
            <ListRow
              key={ent.id}
              mark={ent.country}
              markColor={ent.country === 'CN' ? COLORS.china : COLORS.russia}
              title={ent.name[lang]}
              subtitle={`${ent.role} · ${ent.country === 'CN' ? 'КНР' : 'РФ'}`}
              right={
                ent.id === activeEnterprise.id ? <Badge label="✓" tone="success" /> : undefined
              }
              onPress={() => switchEnterprise(ent.id)}
              chevron={false}
              last={index === user.enterprises.length - 1}
            />
          ))}
        </View>

        {/* FM11 / FM9 / FM10 设置入口 */}
        <SectionHeading title={t('settingsTitle')} />
        <View style={styles.listCard}>
          <ListRow
            mark="ЯЗ"
            title={t('setLanguage')}
            value={LANG_LABELS[lang]}
            onPress={() => router.push('/settings/language')}
          />
          <ListRow
            mark="УВ"
            title={t('setNotifications')}
            onPress={() => router.push('/settings/notifications')}
          />
          <ListRow
            mark="ОФ"
            title={t('setSync')}
            subtitle={`${online ? t('online') : t('offline')} · ${t('lastSync')}: ${lastSyncAt ?? t('never')}`}
            value={pending > 0 ? `${t('pendingOps')} ${pending}` : undefined}
            onPress={() => router.push('/settings/sync')}
          />
          <ListRow
            mark="АД"
            title={t('setAdmin')}
            subtitle="FM11"
            onPress={() => router.push('/settings/admin')}
          />
          <ListRow
            mark="?"
            title={t('setAbout')}
            subtitle={t('appName')}
            onPress={() => router.push('/about')}
            last
          />
        </View>

        {/* 通知中心入口（FR-040） */}
        <Pressable onPress={() => router.push('/notifications')}>
          <Card>
            <KeyValue label={t('notifTitle')} value="FM9 ›" tone="primary" />
          </Card>
        </Pressable>

        <PrimaryButton label={t('logout')} variant="secondary" onPress={handleSignOut} />

        <SkeletonNote
          frCodes={['FR-006', 'FR-007', 'FR-039', 'FR-045', 'FR-046', 'FR-047', 'FR-048']}
          note={t('skeletonNote')}
          todo={[
            'PATCH /api/me/ — редактирование профиля и загрузка аватара (FR-006)',
            'Выбор предприятия должен менять права и набор модулей (FR-007)',
            'FCM / APNs: регистрация токена устройства при входе (FR-038)',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  top: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: FONTS.h1, fontWeight: '700', color: COLORS.text },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.surface, fontSize: FONTS.h2, fontWeight: '700' },
  userText: { flex: 1, gap: 2 },
  userName: { fontSize: FONTS.h3, fontWeight: '700', color: COLORS.text },
  userMeta: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.sm },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
