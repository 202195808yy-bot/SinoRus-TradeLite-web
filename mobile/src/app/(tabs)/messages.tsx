import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Badge } from '../../components/Badge';
import { ListRow } from '../../components/ListRow';
import { OfflineBanner } from '../../components/OfflineBanner';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { CONVERSATIONS } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM8 / FR-034　与业务绑定的会话。
 *
 * 需求原文：会话在具体订单或询价的上下文中进行；可从会话跳转到业务对象本身。
 * 因此列表每一行都同时显示「会话主题 = 业务单号」，这是移动端与
 * 普通聊天软件的关键区别：消息不是孤立的，它挂在交易上。
 *
 * 骨架里第三条会话显示的是「上次同步时间」占位，用来演示
 * 列表底部的离线说明（FR-043）。
 */
export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useLang();

  return (
    <View style={styles.screen}>
      <View style={[styles.top, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.title}>{t('messagesTitle')}</Text>
        <Text style={styles.subtitle}>{t('translateOn')}: RU ⇄ ZH</Text>
      </View>

      <OfflineBanner />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeading title={t('chatTitle')} />
        <View style={styles.listCard}>
          {CONVERSATIONS.map((conv, index) => (
            <ListRow
              key={conv.id}
              mark={conv.boundTo === 'order' ? 'ЗК' : 'ЗП'}
              markColor={conv.boundTo === 'order' ? COLORS.primary : COLORS.accent}
              title={`${conv.subject} · ${conv.counterparty}`}
              subtitle={conv.messages[conv.messages.length - 1]?.translation ?? ''}
              value={conv.lastTime}
              last={index === CONVERSATIONS.length - 1}
              right={conv.unread > 0 ? <Badge label={String(conv.unread)} tone="danger" /> : undefined}
              onPress={() => router.push(`/chat/${conv.id}`)}
            />
          ))}
        </View>

        <SkeletonNote
          frCodes={['FR-034', 'FR-035', 'FR-036', 'FR-037']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/conversations/ — список диалогов по сделкам',
            'POST /api/conversations/{id}/messages/ — сервер возвращает перевод',
            'WebSocket или long-polling для живых сообщений',
            'Шаблоны фраз — GET /api/phrases/ (FR-037)',
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
    gap: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { fontSize: FONTS.h1, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
