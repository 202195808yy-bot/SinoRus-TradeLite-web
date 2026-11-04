import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { ListRow } from '../../components/ListRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { useSync } from '../../context/SyncContext';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM10 / FR-041 无网可用、FR-042 待同步队列、FR-043 自动同步、FR-044 冲突处理。
 *
 * 这是 Web 端没有对应模块的独有模块（规范表 1 的说明）：
 * 「无网可用与待同步队列正是移动客户端的固有属性」。
 *
 * 骨架里网络开关可以手动切换，方便答辩时现场演示
 * 「断网 → 操作进队列 → 恢复网络 → 自动提交」这条完整链路。
 */
export default function SyncScreen() {
  const { t, lang } = useLang();
  const { online, setOnline, queue, conflicts, lastSyncAt, syncing, syncNow } = useSync();

  const failed = queue.filter((op) => op.status === 'failed').length;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('syncTitle')} subtitle="FM10 · FR-041…FR-044" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 网络状态（演示开关） */}
        <Card title={t('syncTitle')}>
          <View style={styles.switchRow}>
            <Text style={styles.label}>{online ? t('online') : t('offline')}</Text>
            <Switch value={online} onValueChange={setOnline} trackColor={{ true: COLORS.primary }} />
          </View>
          <Text style={styles.hint}>
            Демонстрационный переключатель: в приложении состояние сети приходит
            из @react-native-community/netinfo.
          </Text>
        </Card>

        {/* FR-043 自动同步 */}
        <Card title={t('syncTrigger')} subtitle={t('syncLastOk')}>
          <View style={styles.kvRow}>
            <Text style={styles.label}>{lastSyncAt ?? t('never')}</Text>
            <Badge label={syncing ? '…' : online ? t('online') : t('offline')} tone={online ? 'success' : 'warning'} />
          </View>
          <PrimaryButton
            label={syncing ? t('loading') : t('syncNow')}
            loading={syncing}
            disabled={!online}
            onPress={syncNow}
          />
          {!online ? <Text style={styles.hint}>{t('offlineHint')}</Text> : null}
        </Card>

        {/* FR-042 待同步队列 */}
        <SectionHeading title={`${t('syncQueueTitle')} (${queue.length})`} />
        {queue.length === 0 ? (
          <EmptyState title={t('syncQueueEmpty')} icon="✓" />
        ) : (
          <View style={styles.listCard}>
            {queue.map((op, index) => (
              <ListRow
                key={op.id}
                mark={op.status === 'failed' ? '!' : '↑'}
                markColor={op.status === 'failed' ? COLORS.danger : COLORS.primary}
                title={op.label[lang]}
                subtitle={op.createdAt}
                right={
                  <Badge
                    label={op.status === 'failed' ? 'failed' : t('pendingOps')}
                    tone={op.status === 'failed' ? 'danger' : 'info'}
                  />
                }
                last={index === queue.length - 1}
              />
            ))}
          </View>
        )}
        {failed > 0 ? (
          <Text style={styles.warn}>
            {failed} операц. не отправлены — проверьте соединение и повторите синхронизацию.
          </Text>
        ) : null}

        {/* FR-044 冲突处理 */}
        <SectionHeading title={`${t('syncConflicts')} (${conflicts.length})`} />
        {conflicts.length === 0 ? (
          <EmptyState title={t('empty')} hint={t('emptyHint')} />
        ) : (
          conflicts.map((conflict) => (
            <Card key={conflict.id} title={conflict.objectLabel[lang]} subtitle={t('syncConflictHint')}>
              <View style={styles.conflict}>
                <Text style={styles.conflictTitle}>Локально · {conflict.localUpdatedAt}</Text>
                <Text style={styles.conflictText}>{conflict.localSummary[lang]}</Text>
              </View>
              <View style={styles.conflict}>
                <Text style={styles.conflictTitle}>Сервер · {conflict.serverUpdatedAt}</Text>
                <Text style={styles.conflictText}>{conflict.serverSummary[lang]}</Text>
              </View>
              <View style={styles.conflictActions}>
                <PrimaryButton
                  label="Оставить локальную"
                  variant="secondary"
                  style={styles.half}
                  onPress={() => undefined}
                />
                <PrimaryButton
                  label="Принять серверную"
                  style={styles.half}
                  onPress={() => undefined}
                />
              </View>
            </Card>
          ))
        )}

        <SkeletonNote
          frCodes={['FR-041', 'FR-042', 'FR-043', 'FR-044']}
          note={t('skeletonNote')}
          todo={[
            'op-sqlite: очередь операций и локальный кэш данных',
            'POST /api/sync/ — пакетная отправка с ключами идемпотентности',
            'Разрешение конфликтов по updated_at и явному выбору пользователя',
            'Фоновая синхронизация с ограничением по расходу батареи (NFR-11)',
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
  kvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  label: { fontSize: FONTS.body, color: COLORS.text, flex: 1 },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted, lineHeight: 16 },
  warn: { fontSize: FONTS.tiny, color: COLORS.danger },
  conflict: {
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    gap: 2,
  },
  conflictTitle: { fontSize: FONTS.tiny, color: COLORS.textMuted, fontWeight: '700' },
  conflictText: { fontSize: FONTS.small, color: COLORS.text },
  conflictActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs },
  half: { flex: 1 },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
