import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { ListRow } from '../../components/ListRow';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM11 / FR-046 字典维护、FR-047 操作日志、FR-048 用户与权限管理。
 *
 * 这三条需求只面向平台管理员（R6），优先级都是「中」。
 * 移动端做管理功能的取舍：只做「查看 + 轻量修改」，
 * 批量导入导出、权限矩阵编辑这类重操作留在 Web 端（规范 1.6）。
 */
export default function AdminScreen() {
  const { t, lang } = useLang();

  const DICTS =
    lang === 'zh'
      ? ['单证类型', '计量单位', '贸易条件 (Incoterms)', '口岸']
      : lang === 'en'
        ? ['Document types', 'Units of measure', 'Incoterms', 'Border crossings']
        : ['Типы документов', 'Единицы измерения', 'Условия поставки (Incoterms)', 'Пункты пропуска'];

  const LOGS =
    lang === 'zh'
      ? [
          { who: 'А.О. Евдокимов', what: '确认报价 RFQ-2026-0137', time: '今天 09:12' },
          { who: '严耀', what: '创建询价 RFQ-2026-0148', time: '昨天 16:40' },
          { who: 'system', what: '同步 3 笔离线操作', time: '昨天 08:30' },
        ]
      : lang === 'en'
        ? [
            { who: 'A.O. Evdokimov', what: 'Accepted quote RFQ-2026-0137', time: 'today 09:12' },
            { who: 'Yan Yao', what: 'Created RFQ-2026-0148', time: 'yesterday 16:40' },
            { who: 'system', what: 'Synced 3 offline operations', time: 'yesterday 08:30' },
          ]
        : [
            { who: 'А.О. Евдокимов', what: 'Принято предложение по RFQ-2026-0137', time: 'сегодня 09:12' },
            { who: 'Янь Яо', what: 'Создан запрос RFQ-2026-0148', time: 'вчера 16:40' },
            { who: 'system', what: 'Синхронизировано 3 офлайн-операции', time: 'вчера 08:30' },
          ];

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('adminTitle')} subtitle="FM11 · FR-046/047/048" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* FR-046 字典维护 */}
        <SectionHeading title={t('adminDict')} />
        <View style={styles.listCard}>
          {DICTS.map((dict, index) => (
            <ListRow
              key={dict}
              mark="≡"
              title={dict}
              subtitle={t('adminDict')}
              onPress={() => undefined}
              last={index === DICTS.length - 1}
            />
          ))}
        </View>

        {/* FR-047 操作日志 */}
        <SectionHeading title={t('adminLog')} />
        <View style={styles.listCard}>
          {LOGS.map((log, index) => (
            <ListRow
              key={`${log.who}-${index}`}
              mark={log.who.slice(0, 1).toUpperCase()}
              markColor={COLORS.textMuted}
              title={log.what}
              subtitle={log.who}
              value={log.time}
              last={index === LOGS.length - 1}
            />
          ))}
        </View>

        {/* FR-048 用户与权限 */}
        <SectionHeading title={t('adminUsers')} />
        <Card>
          <View style={styles.rolesRow}>
            {['R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map((role) => (
              <Badge key={role} label={role} tone={role === 'R6' ? 'info' : 'neutral'} />
            ))}
          </View>
          <Text style={styles.hint}>
            {lang === 'zh'
              ? '六类角色（R1 采购商 … R6 平台管理员）。新增用户、分配角色与停用账号在本页完成；权限矩阵的编辑留在 Web 端。'
              : lang === 'en'
                ? 'Six roles (R1 buyer … R6 platform admin). Creating users and assigning roles happens here; editing the rights matrix stays on the web.'
                : 'Шесть ролей (R1 закупщик … R6 администратор платформы). Добавление пользователей и назначение ролей — здесь; редактирование матрицы прав остаётся в веб-версии.'}
          </Text>
        </Card>

        <SkeletonNote
          frCodes={['FR-046', 'FR-047', 'FR-048']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/dictionaries/, PATCH /api/dictionaries/{id}/',
            'GET /api/audit-logs/?user=&type=&from=&to=',
            'POST /api/users/ и назначение ролей (только R6)',
            'Разграничение доступа: R6 видит модуль, остальные — нет',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  rolesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  hint: { fontSize: FONTS.small, color: COLORS.textMuted, lineHeight: 18 },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
