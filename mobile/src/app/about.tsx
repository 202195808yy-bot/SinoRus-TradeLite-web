import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { KeyValue } from '../components/KeyValue';
import { ListRow } from '../components/ListRow';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeading } from '../components/SectionHeading';
import { StatTile } from '../components/StatTile';
import { useLang } from '../context/LangContext';
import { MOBILE_MODULES, MODULE_STATS } from '../data/modules';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * 关于 / 骨架总览。
 *
 * 这一页不是需求里的功能页，而是给评审看的地图：
 * 把 12 个模块、48 条功能需求、页面路由与实现状态集中在一屏，
 * 用来证明「页面骨架与需求列表是一一对应的」。
 *
 * 数据全部来自 `src/data/modules.ts` 的注册表 —— 与 Web 端
 * `core/pages.py` 的做法一致：单一数据源，页面只是渲染它。
 */
export default function AboutScreen() {
  const router = useRouter();
  const { t, lang } = useLang();

  const routes: Record<string, string> = {
    FM0: '/  ·  /login  ·  /search',
    FM1: '/login  ·  /profile',
    FM2: '/workbench  ·  /tasks',
    FM3: '/rfq  ·  /rfq/new  ·  /rfq/[id]',
    FM4: '/orders  ·  /orders/[id]  ·  …/milestone  ·  …/shipment  ·  …/exception',
    FM5: '/documents  ·  /documents/upload  ·  /scan',
    FM6: '/logistics',
    FM7: '/billing',
    FM8: '/messages  ·  /chat/[id]',
    FM9: '/notifications  ·  /settings/notifications',
    FM10: '/settings/sync',
    FM11: '/settings  ·  /settings/language  ·  /settings/admin',
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('setAbout')} subtitle="SinoRus TradeLite · 0.1.0" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 规模指标 */}
        <View style={styles.tiles}>
          <StatTile label="Модулей / 模块" value={String(MODULE_STATS.modules)} />
          <StatTile label="Требований / 需求" value={String(MODULE_STATS.requirements)} tone="accent" />
        </View>
        <View style={styles.tiles}>
          <StatTile label={t('high')} value={String(MODULE_STATS.high)} tone="danger" />
          <StatTile label={t('medium')} value={String(MODULE_STATS.medium)} />
          <StatTile label={t('low')} value={String(MODULE_STATS.low)} tone="success" />
        </View>

        {/* 技术栈 */}
        <SectionHeading title="Стек / 技术栈" />
        <Card>
          <KeyValue label="Framework" value="React Native 0.81 + Expo SDK 54" />
          <KeyValue label="Language" value="TypeScript 5.9 (strict)" />
          <KeyValue label="Navigation" value="Expo Router 6 (файловая маршрутизация)" />
          <KeyValue label="State" value="React Context (骨架) → Redux Toolkit / RTK Query" />
          <KeyValue label="i18n" value="ru / zh / en — своя таблица → i18next" />
          <KeyValue label="Offline" value="mock → op-sqlite + netinfo" />
          <KeyValue label="Backend" value="Django 4.2.30 (пока без REST API)" />
        </Card>

        {/* 模块总览 */}
        <SectionHeading title="Модули FM0–FM11" />
        <View style={styles.listCard}>
          {MOBILE_MODULES.map((module, index) => (
            <ListRow
              key={module.code}
              mark={module.code.replace('FM', '')}
              markColor={module.webModule ? COLORS.primary : COLORS.accent}
              title={`${module.code} · ${module.name[lang]}`}
              subtitle={`${routes[module.code] ?? module.route}`}
              value={`${module.frCount} ФТ`}
              right={
                <Badge
                  label={module.webModule ? module.webModule : '—'}
                  tone={module.webModule ? 'info' : 'warning'}
                />
              }
              onPress={() => router.push(module.route as never)}
              last={index === MOBILE_MODULES.length - 1}
            />
          ))}
        </View>

        <Text style={styles.footnote}>
          {lang === 'zh'
            ? 'FM10「离线与同步」在 Web 端没有对应模块——这是移动客户端的固有属性。'
            : lang === 'en'
              ? 'FM10 “Offline and sync” has no web counterpart — it is intrinsic to a mobile client.'
              : 'Модуль FM10 «Офлайн-режим и синхронизация» не имеет соответствия в веб-версии — это неотъемлемое свойство мобильного клиента.'}
        </Text>

        {/* 状态说明 */}
        <SectionHeading title="Статус / 当前状态" />
        <Card>
          <KeyValue label="Экраны / 页面" value="≈ 29 маршрутов" />
          <KeyValue label="Навигация / 导航" value="✓ 4 нижних вкладки + стек" />
          <KeyValue label="Данные / 数据" value="mock (src/data/mock.ts)" />
          <KeyValue label="Сеть / 网络" value="нет (USE_MOCK = true)" />
          <KeyValue label="Тесты / 测试" value="не подключены (Jest + Detox в плане)" />
        </Card>

        <Text style={styles.footnote}>
          {t('skeletonNote')}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  tiles: { flexDirection: 'row', gap: SPACING.md },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  footnote: { fontSize: FONTS.tiny, color: COLORS.textMuted, lineHeight: 16 },
});
