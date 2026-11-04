import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLang } from '../context/LangContext';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';
import type { TimelineEvent } from '../types/models';

/**
 * 时间线（物流轨迹 FR-027 / 业务动态 FR-011 共用）。
 *
 * 整改表第三条：原型把「已发生」的节点写死成 `opacity-50`，
 * 于是**历史**节点反而最浅、最新节点最亮，阅读顺序颠倒。
 * 现在的规则：
 *   · done    —— 已发生：实心主色点 + 深色标题（正常字重偏粗）
 *   · current —— 当前节点：实心点带高亮环 + 主色加粗标题
 *   · pending —— 未发生：空心点 + 次级灰标题（语义上就该弱，但仍 ≥12px 可读）
 * 连接线的颜色跟随上一个节点，视觉上能看出「走到哪了」。
 */

type Props = {
  events: TimelineEvent[];
  onPressEvent?: (event: TimelineEvent) => void;
};

export function Timeline({ events, onPressEvent }: Props) {
  const { t, lang } = useLang();

  return (
    <View style={styles.wrap}>
      {events.map((event, index) => {
        const isFirst = index === 0;
        const isLast = index === events.length - 1;
        const isCurrent = event.state === 'current';
        const isPending = event.state === 'pending';

        // 本节点上方的线：取上一个节点的状态决定颜色。
        const topLine = isFirst
          ? 'transparent'
          : events[index - 1].state === 'done' || events[index - 1].state === 'current'
            ? COLORS.primary
            : COLORS.border;
        // 本节点下方的线：本节点已完成才画成主色。
        const bottomLine = isLast
          ? 'transparent'
          : event.state === 'pending'
            ? COLORS.border
            : COLORS.primary;

        const body = (
          <View style={[styles.body, isLast && styles.bodyLast]}>
            <Text
              style={[
                styles.title,
                isCurrent && styles.titleCurrent,
                isPending && styles.titlePending,
              ]}
            >
              {event.title[lang]}
            </Text>
            {event.place ? (
              <Text style={styles.place} numberOfLines={1}>
                {event.place[lang]}
              </Text>
            ) : null}
            <Text style={styles.time}>{event.time}</Text>
          </View>
        );

        return (
          <View key={event.id} style={styles.item}>
            {/* 左轨：上段线 + 圆点 + 下段线 */}
            <View style={styles.rail}>
              <View style={[styles.segTop, { backgroundColor: topLine }]} />
              <View
                style={[
                  styles.dot,
                  isCurrent && styles.dotCurrent,
                  isPending && styles.dotPending,
                ]}
              />
              <View style={[styles.segBottom, { backgroundColor: bottomLine }]} />
            </View>

            {onPressEvent ? (
              <Pressable
                onPress={() => onPressEvent(event)}
                accessibilityRole="button"
                accessibilityLabel={`${event.title[lang]}, ${event.time}`}
                style={({ pressed }) => [styles.pressWrap, pressed && styles.pressed]}
              >
                {body}
              </Pressable>
            ) : (
              <View style={styles.pressWrap} accessibilityRole="text">
                {body}
              </View>
            )}
          </View>
        );
      })}

      {events.length === 0 ? <Text style={styles.empty}>{t('empty')}</Text> : null}
    </View>
  );
}

const DOT = 12;

const styles = StyleSheet.create({
  wrap: { gap: 0 },
  item: { flexDirection: 'row' },
  rail: { width: 22, alignItems: 'center' },
  segTop: { width: 2, height: 6 },
  segBottom: { width: 2, flex: 1 },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  dotCurrent: {
    width: DOT + 4,
    height: DOT + 4,
    borderRadius: RADIUS.pill,
    borderColor: COLORS.primarySoft,
    borderWidth: 3,
  },
  dotPending: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 2,
  },
  pressWrap: { flex: 1 },
  pressed: { opacity: 0.7 },
  body: { paddingBottom: SPACING.lg, gap: 1 },
  bodyLast: { paddingBottom: 0 },
  title: { fontSize: FONTS.body, fontWeight: '600', color: COLORS.text },
  titleCurrent: { fontWeight: '700', color: COLORS.primary },
  titlePending: { fontWeight: '500', color: COLORS.textMuted },
  place: { fontSize: FONTS.small, color: COLORS.textMuted },
  time: { fontSize: FONTS.tiny, color: COLORS.textMuted, marginTop: 2 },
  empty: { fontSize: FONTS.small, color: COLORS.textMuted, paddingVertical: SPACING.md },
});
