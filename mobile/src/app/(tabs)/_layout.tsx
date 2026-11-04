import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tabs } from 'expo-router';
import { COLORS, FONTS, RADIUS, TAB_BAR_HEIGHT } from '../../theme/theme';
import { useLang } from '../../context/LangContext';
import { CONVERSATIONS } from '../../data/mock';

/**
 * FM0 / FR-002　底部标签导航。
 *
 * 需求原文：常驻底部面板，含四个主分区（工作台、订单、消息、我的）；
 * 当前分区高亮，退出后仍保留上次位置。
 *
 * 四个分区与模块的对应关系（规范表 1）：
 *   workbench → FM2 工作台与待办
 *   orders    → FM3/FM4/FM5/FM6/FM7（询价、订单、单证、物流、结算）
 *   messages  → FM8 消息与翻译
 *   profile   → FM1/FM9/FM10/FM11（账号、通知、离线、设置）
 *
 * 骨架阶段没有引入图标库，用字形代替；接入时换成
 * @expo/vector-icons 的 Ionicons 即可，其余代码不动。
 */

const GLYPH = {
  workbench: '⌂',
  orders: '☰',
  messages: '✉',
  profile: '☺',
} as const;

function TabGlyph({ glyph, color }: { glyph: string; color: string }) {
  return <Text style={[styles.glyph, { color }]}>{glyph}</Text>;
}

export default function TabsLayout() {
  const { t } = useLang();
  const unread = CONVERSATIONS.reduce((sum, c) => sum + c.unread, 0);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.bar,
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.item,
        sceneStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Tabs.Screen
        name="workbench"
        options={{
          title: t('tabWorkbench'),
          tabBarIcon: ({ color }) => <TabGlyph glyph={GLYPH.workbench} color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('tabOrders'),
          tabBarIcon: ({ color }) => <TabGlyph glyph={GLYPH.orders} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('tabMessages'),
          tabBarBadge: unread > 0 ? unread : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color }) => <TabGlyph glyph={GLYPH.messages} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabProfile'),
          tabBarIcon: ({ color }) => <TabGlyph glyph={GLYPH.profile} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: TAB_BAR_HEIGHT,
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    paddingTop: 0,
  },
  item: { paddingVertical: 2 },
  label: { fontSize: FONTS.tiny, fontWeight: '600' },
  glyph: { fontSize: 20, lineHeight: 22 },
  badge: {
    backgroundColor: COLORS.danger,
    fontSize: FONTS.tiny,
    borderRadius: RADIUS.pill,
  },
});
