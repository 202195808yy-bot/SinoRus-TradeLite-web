import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { ListRow } from '../../components/ListRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { useSync } from '../../context/SyncContext';
import { DOCUMENTS } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';
import { DOC_STATUS_KEY, DOC_STATUS_TONE } from '../../utils/format';

/**
 * FM5 / FR-023 单证齐备性检查、FR-024 有效期到期提醒、FR-025 离线查看。
 *
 * 需求原文（FR-023）：按订单或批次检查单证是否齐备，缺失项高亮提示。
 * 需求原文（FR-025）：无网络时查看此前已加载的单证；文件保存在设备本地缓存中。
 *
 * 这一页是报关代理在口岸查验时的主界面（场景 SC-03）：
 * 网络不稳定，所以「离线可看」标记必须显眼 —— 列表里直接标出
 * 哪些文件已经在本地缓存里。
 */
export default function DocumentsScreen() {
  const router = useRouter();
  const { t, lang } = useLang();
  const { online } = useSync();
  const [filter, setFilter] = useState<'all' | 'expiring' | 'missing'>('all');

  const list = useMemo(
    () => (filter === 'all' ? DOCUMENTS : DOCUMENTS.filter((d) => d.status === filter)),
    [filter],
  );

  const missing = DOCUMENTS.filter((d) => d.status === 'missing').length;
  const expiring = DOCUMENTS.filter((d) => d.status === 'expiring').length;
  const cached = DOCUMENTS.filter((d) => d.cached).length;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('docsTitle')} subtitle="FM5 · FR-023/024/025" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 齐备性概览 */}
        <Card title={t('docChecklist')} subtitle={`${DOCUMENTS.length} ${t('docsTitle')}`}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: COLORS.danger }]}>{missing}</Text>
              <Text style={styles.statLabel}>{t('docMissing')}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: COLORS.warning }]}>{expiring}</Text>
              <Text style={styles.statLabel}>{t('docExpiry')}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: COLORS.success }]}>{cached}</Text>
              <Text style={styles.statLabel}>{t('docCached')}</Text>
            </View>
          </View>
          {!online ? (
            <Text style={styles.offlineNote}>
              {t('offline')}: доступны только документы с пометкой «{t('docCached')}».
            </Text>
          ) : null}
        </Card>

        <PrimaryButton
          label={`+ ${t('docUpload')}`}
          onPress={() => router.push('/documents/upload')}
        />

        {/* 筛选：统一使用 Chip 组件 */}
        <View style={styles.chips}>
          {(['all', 'expiring', 'missing'] as const).map((key) => (
            <Chip
              key={key}
              label={key === 'all' ? t('all') : key === 'expiring' ? t('docExpiry') : t('docMissing')}
              active={filter === key}
              onPress={() => setFilter(key)}
            />
          ))}
        </View>

        {/* 单证列表 */}
        <View style={styles.listCard}>
          {list.map((doc, index) => (
            <ListRow
              key={doc.id}
              mark={doc.status === 'missing' ? '!' : 'ДК'}
              markColor={
                doc.status === 'ok'
                  ? COLORS.success
                  : doc.status === 'expiring'
                    ? COLORS.warning
                    : COLORS.danger
              }
              title={doc.typeLabel[lang]}
              subtitle={`${doc.orderNo} · ${t('docValidUntil')} ${doc.validUntil}`}
              right={<Badge label={t(DOC_STATUS_KEY[doc.status])} tone={DOC_STATUS_TONE[doc.status]} />}
              value={doc.cached ? '⤓' : undefined}
              onPress={() => undefined}
              last={index === list.length - 1}
            />
          ))}
        </View>

        <Text style={styles.legend}>
          ⤓ — {t('docCached')} · {t('docOffline')}
        </Text>

        <SectionHeading title={t('docReminders')} />
        <Card>
          <Text style={styles.note}>
            {t('docExpiry')}: {expiring}. {t('docReminderNote')}
          </Text>
        </Card>

        <SkeletonNote
          frCodes={['FR-022', 'FR-023', 'FR-024', 'FR-025']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/documents/?order=&status= — список документов',
            'Локальный кэш файлов (op-sqlite + файловая система) для офлайн-просмотра',
            'Автоматическая очистка старых файлов при превышении 300 МБ (NFR-08)',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  statsRow: { flexDirection: 'row', gap: SPACING.md },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { fontSize: FONTS.h2, fontWeight: '700' },
  statLabel: { fontSize: FONTS.tiny, color: COLORS.textMuted, textAlign: 'center' },
  offlineNote: { fontSize: FONTS.tiny, color: COLORS.warning, lineHeight: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  legend: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  note: { fontSize: FONTS.small, color: COLORS.textMuted, lineHeight: 18 },
});
