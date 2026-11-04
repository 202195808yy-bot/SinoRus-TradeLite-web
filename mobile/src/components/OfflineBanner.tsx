import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SPACING } from '../theme/theme';
import { useLang } from '../context/LangContext';
import { useSync } from '../context/SyncContext';

/**
 * 离线提示条（FR-041 / FR-042）。
 *
 * 无网络时在页面顶部显示：告知用户数据来自本地缓存，
 * 并且新操作会进入待同步队列。这是移动端独有的状态提示，
 * Web 端没有对应组件。
 */

export function OfflineBanner() {
  const { online, queue } = useSync();
  const { t } = useLang();

  if (online) return null;

  const pending = queue.filter((op) => op.status !== 'failed').length;

  return (
    <View style={styles.wrap}>
      <View style={styles.dot} />
      <Text style={styles.text} numberOfLines={2}>
        <Text style={styles.strong}>{t('offline')}. </Text>
        {t('offlineHint')}
        {pending > 0 ? `  ${t('pendingOps')}: ${pending}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.warningSoft,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.warning,
  },
  text: { flex: 1, fontSize: FONTS.tiny, color: COLORS.warning, lineHeight: 15 },
  strong: { fontWeight: '700' },
});
