import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { COLORS, FONTS, SPACING } from '../theme/theme';

/**
 * FM0 / FR-001　启动与首次加载。
 *
 * 职责（对应需求原文）：检查版本 → 恢复已保存的会话 → 显示首页或登录页。
 *
 * 骨架实现：等待 1.2 秒模拟「检查版本 + 恢复会话」，
 * 然后按登录态跳转。真实实现时这里应：
 *   · 读取 Keychain / Keystore 里的访问令牌；
 *   · 调 GET /api/me/ 校验令牌是否仍有效；
 *   · 令牌过期则尝试刷新，失败则跳登录页。
 */
export default function SplashScreen() {
  const router = useRouter();
  const { signedIn } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(signedIn ? '/workbench' : '/login');
    }, 1200);
    return () => clearTimeout(timer);
  }, [router, signedIn]);

  return (
    <View style={styles.wrap}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>SR</Text>
      </View>
      <Text style={styles.name}>{t('appName')}</Text>
      <Text style={styles.tagline}>{t('appTagline')}</Text>
      <ActivityIndicator color={COLORS.primary} style={styles.spinner} />
      <Text style={styles.hint}>FR-001 · {t('loading')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    gap: SPACING.sm,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoText: { color: COLORS.surface, fontSize: 30, fontWeight: '800', letterSpacing: 1 },
  name: { fontSize: FONTS.h2, fontWeight: '700', color: COLORS.text },
  tagline: { fontSize: FONTS.small, color: COLORS.textMuted },
  spinner: { marginTop: SPACING.xl },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted },
});
