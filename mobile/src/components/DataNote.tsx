import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLang } from '../context/LangContext';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * 数据来源说明条。
 *
 * 整改表最后一条：原型的汇率卡硬编码了 12.65，却标着「实时汇率」。
 * 现在凡是从 mock 来的数据，都必须紧跟一条说明：数据来源 + 更新时间。
 * 接入接口后把 `source` 换成 'api'，本组件会自动改成接口口径，
 * 页面代码不用动。
 */

type Props = {
  /** 'mock' = 骨架占位数据；'api' = 已接服务端。 */
  source?: 'mock' | 'api';
  /** 数据时间，例如 '10:24'。 */
  updatedAt?: string;
};

export function DataNote({ source = 'mock', updatedAt }: Props) {
  const { t } = useLang();
  const isMock = source === 'mock';

  return (
    <View style={styles.wrap} accessibilityRole="text">
      <View style={[styles.dot, { backgroundColor: isMock ? COLORS.accent : COLORS.success }]} />
      <Text style={styles.text} numberOfLines={2}>
        {t('dataSource')}: {isMock ? t('dataSourceMock') : t('online')}
        {updatedAt ? ` · ${t('exchangeUpdated')} ${updatedAt}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
  },
  dot: { width: 8, height: 8, borderRadius: RADIUS.pill },
  // 辅助文字下限 12px（FONTS.tiny），不再出现 10px。
  text: { flex: 1, fontSize: FONTS.tiny, color: COLORS.textMuted, lineHeight: 17 },
});
