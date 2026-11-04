import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { ListRow } from '../components/ListRow';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeading } from '../components/SectionHeading';
import { SkeletonNote } from '../components/SkeletonNote';
import { useLang } from '../context/LangContext';
import { TASKS } from '../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';
import { PRIORITY_TONE } from '../utils/format';

/**
 * FM2 / FR-009　今日待办列表。
 *
 * 需求原文：按期限排序的待办清单：确认报价、阶段打卡、上传单证、确认付款。
 * 因此每一条待办都带 `kind`，点进去分别落到对应模块的页面
 * —— 这正是移动端「待办驱动」的交互方式：不是先选模块再找任务，
 * 而是从任务直接跳到该做的事。
 */
export default function TasksScreen() {
  const router = useRouter();
  const { t, lang } = useLang();

  const routeFor = (kind: string) => {
    switch (kind) {
      case 'quote':
        return '/rfq';
      case 'milestone':
        return '/orders/ord-1/milestone';
      case 'document':
        return '/documents/upload';
      case 'payment':
        return '/billing';
      default:
        return '/tasks';
    }
  };

  const open = TASKS.filter((task) => !task.done);
  const done = TASKS.filter((task) => task.done);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('todayTasks')} subtitle="FM2 · FR-009" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeading title={`${t('todayTasks')} (${open.length})`} />
        {open.length === 0 ? (
          <EmptyState title={t('empty')} hint={t('emptyHint')} />
        ) : (
          <View style={styles.listCard}>
            {open.map((task, index) => (
              <ListRow
                key={task.id}
                mark={String(index + 1)}
                title={task.title[lang]}
                subtitle={task.due}
                right={<Badge label={t(task.priority)} tone={PRIORITY_TONE[task.priority]} />}
                onPress={() => router.push(routeFor(task.kind) as never)}
                last={index === open.length - 1}
              />
            ))}
          </View>
        )}

        {done.length > 0 ? (
          <>
            <SectionHeading title="Выполнено" />
            <View style={styles.listCard}>
              {done.map((task, index) => (
                <ListRow
                  key={task.id}
                  mark="✓"
                  markColor={COLORS.success}
                  title={task.title[lang]}
                  subtitle={task.due}
                  right={<Badge label="OK" tone="success" />}
                  last={index === done.length - 1}
                />
              ))}
            </View>
          </>
        ) : null}

        <SkeletonNote
          frCodes={['FR-009']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/tasks/?due=today — сортировка по сроку',
            'Свайп для быстрого выполнения задачи',
            'Локальный кэш: список должен открываться без сети (FR-041)',
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
});
