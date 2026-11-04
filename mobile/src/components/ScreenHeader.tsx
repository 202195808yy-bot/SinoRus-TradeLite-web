import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useLang } from '../context/LangContext';
import { COLORS, FONTS, RADIUS, SPACING, TOUCH } from '../theme/theme';

/**
 * 二级页面的顶部栏：返回箭头 + 标题 +（可选）副标题 +（可选）右侧操作。
 * 底部导航的四个主页面不使用它，它们直接把自己的标题画在内容里。
 *
 * 整改：返回键原来只有 36×36，低于 44 的触控下限；现在做成
 * 44×44（TOUCH.min），读屏标签也不再写死俄语，改走 t('back')。
 */

type Props = {
  title: string;
  subtitle?: string;
  /** 是否显示返回箭头，默认显示。 */
  showBack?: boolean;
  /** 右侧操作区。 */
  right?: React.ReactNode;
};

export function ScreenHeader({ title, subtitle, showBack = true, right }: Props) {
  const router = useRouter();
  const { t } = useLang();

  return (
    <View style={styles.wrap}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          hitSlop={TOUCH.slop}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.back} />
      )}

      <View style={styles.titleWrap}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  back: {
    width: TOUCH.min,
    height: TOUCH.min,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { backgroundColor: COLORS.surfaceAlt },
  backIcon: {
    fontSize: 28,
    lineHeight: 30,
    color: COLORS.primary,
    fontWeight: '600',
  },
  titleWrap: { flex: 1, gap: 2 },
  title: { fontSize: FONTS.h3, fontWeight: '700', color: COLORS.text },
  subtitle: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  right: { minWidth: TOUCH.min, alignItems: 'flex-end' },
});
