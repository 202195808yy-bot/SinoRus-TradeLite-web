import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * 骨架说明条。
 *
 * 每个页面底部都放一条，标明「这一页对应哪条需求、哪一步是占位」。
 * 答辩时逐页翻过去，评审老师一眼就能看出页面与需求编号的对应关系，
 * 也能看出哪些是结构、哪些还没实现。
 */

type Props = {
  /** 该页对应的需求编号，例如 ['FR-016', 'FR-017']。 */
  frCodes: string[];
  /** 说明文字，通常传 t('skeletonNote')。 */
  note: string;
  /** 下一步要补的实现要点。 */
  todo?: string[];
};

export function SkeletonNote({ frCodes, note, todo }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.tag}>КАРКАС / 骨架</Text>
        <Text style={styles.codes}>{frCodes.join(' · ')}</Text>
      </View>
      <Text style={styles.note}>{note}</Text>
      {todo && todo.length > 0 ? (
        <View style={styles.todoWrap}>
          {todo.map((item) => (
            <Text key={item} style={styles.todo}>
              · {item}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceAlt,
    padding: SPACING.md,
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  tag: {
    fontSize: FONTS.tiny,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  codes: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  note: { fontSize: FONTS.tiny, color: COLORS.textMuted, lineHeight: 16 },
  todoWrap: { gap: 2, marginTop: 2 },
  todo: { fontSize: FONTS.tiny, color: COLORS.textMuted, lineHeight: 16 },
});
