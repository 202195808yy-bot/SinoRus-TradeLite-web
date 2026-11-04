import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormField } from '../components/FormField';
import { SkeletonNote } from '../components/SkeletonNote';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * FM1 / FR-004　账号密码登录（含 FR-005 生物识别入口）。
 *
 * 需求原文：使用账号密码登录，并限制尝试次数；成功后发放有期限的访问令牌。
 *
 * 骨架实现：点「登录」直接置为已登录并进入工作台，不发请求。
 * 真实实现时：
 *   · POST /api/auth/login/ 取 access + refresh 令牌；
 *   · 令牌写入 Keychain / Keystore（NFR-06），不得进日志；
 *   · 连续失败 5 次锁定，提示剩余尝试次数。
 */
export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { t, lang, setLang } = useLang();

  const [login, setLogin] = useState('yan.yao@example.cn');
  const [password, setPassword] = useState('demo1234');

  const handleSignIn = () => {
    signIn();
    router.replace('/workbench');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* 品牌区 */}
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>SR</Text>
          </View>
          <Text style={styles.appName}>{t('appName')}</Text>
          <Text style={styles.appTagline}>{t('appTagline')}</Text>
        </View>

        <Text style={styles.title}>{t('loginTitle')}</Text>
        <Text style={styles.subtitle}>{t('loginSubtitle')}</Text>

        <FormField
          label={t('fieldLogin')}
          value={login}
          onChangeText={setLogin}
          keyboardType="email-address"
          required
        />
        <FormField
          label={t('fieldPassword')}
          value={password}
          onChangeText={setPassword}
          required
          hint={t('loginHint')}
        />

        <PrimaryButton label={t('loginButton')} onPress={handleSignIn} />

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>или / 或</Text>
          <View style={styles.line} />
        </View>

        {/* FR-005 生物识别：骨架里禁用，说明启用条件 */}
        <PrimaryButton
          label={t('biometric')}
          variant="secondary"
          disabled
          onPress={() => undefined}
        />
        <Text style={styles.bioHint}>{t('biometricHint')}</Text>

        {/* 语言切换：登录页也要能切（FM11 / FR-045） */}
        <View style={styles.langRow}>
          {(['ru', 'zh', 'en'] as const).map((code) => (
            <Text
              key={code}
              onPress={() => setLang(code)}
              style={[styles.langItem, lang === code && styles.langActive]}
            >
              {code === 'ru' ? 'Русский' : code === 'zh' ? '中文' : 'English'}
            </Text>
          ))}
        </View>

        <SkeletonNote
          frCodes={['FR-004', 'FR-005', 'FR-045']}
          note={t('skeletonNote')}
          todo={[
            'POST /api/auth/login/ — получить access/refresh-токены',
            'Токены в Keychain / Keystore, ограничить попытки входа',
            'Биометрия (expo-local-authentication) после первого входа',
          ]}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl, gap: SPACING.lg, paddingBottom: SPACING.xxl },
  brand: { alignItems: 'center', gap: SPACING.xs, marginTop: SPACING.xl },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: COLORS.surface, fontSize: 26, fontWeight: '800' },
  appName: { fontSize: FONTS.h2, fontWeight: '700', color: COLORS.text },
  appTagline: { fontSize: FONTS.small, color: COLORS.textMuted },
  title: { fontSize: FONTS.h2, fontWeight: '700', color: COLORS.text, marginTop: SPACING.md },
  subtitle: { fontSize: FONTS.small, color: COLORS.textMuted, marginTop: -SPACING.md },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  line: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  bioHint: { fontSize: FONTS.tiny, color: COLORS.textMuted, textAlign: 'center', marginTop: -SPACING.sm },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  langItem: {
    fontSize: FONTS.small,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langActive: {
    color: COLORS.primary,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
    fontWeight: '700',
  },
});
