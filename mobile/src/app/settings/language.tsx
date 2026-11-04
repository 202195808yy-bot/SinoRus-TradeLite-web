import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card } from '../../components/Card';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { LANG_LABELS, type Lang } from '../../i18n/strings';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM11 / FR-045　界面语言切换。
 *
 * 需求原文：在俄语、中文与英语之间切换界面语言，无需重启应用。
 *
 * 三语是项目的硬要求（NFR-09：完整支持俄语、中文、英语，含日期与数字格式）。
 * 骨架里切换是即时生效的：`setLang` 改状态 → 所有用 `t()` 的页面重渲染。
 */
export default function LanguageScreen() {
  const { t, lang, setLang } = useLang();

  const OPTIONS: { code: Lang; sample: string }[] = [
    { code: 'ru', sample: 'Русский язык интерфейса' },
    { code: 'zh', sample: '界面语言：中文' },
    { code: 'en', sample: 'Interface language: English' },
  ];

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('languageTitle')} subtitle="FM11 · FR-045" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>{t('languageHint')}</Text>

        {OPTIONS.map((option) => (
          <Pressable key={option.code} onPress={() => setLang(option.code)}>
            <Card>
              <View style={styles.row}>
                <View style={styles.textWrap}>
                  <Text style={styles.langName}>{LANG_LABELS[option.code]}</Text>
                  <Text style={styles.sample}>{option.sample}</Text>
                </View>
                <View style={[styles.radio, lang === option.code && styles.radioActive]}>
                  {lang === option.code ? <Text style={styles.check}>✓</Text> : null}
                </View>
              </View>
            </Card>
          </Pressable>
        ))}

        <SkeletonNote
          frCodes={['FR-045', 'NFR-09']}
          note={t('skeletonNote')}
          todo={[
            'Хранение выбора языка между запусками (AsyncStorage)',
            'Intl.NumberFormat / DateTimeFormat для форматов дат и чисел',
            'Перевод серверных данных (названия товаров, справочники)',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  hint: { fontSize: FONTS.small, color: COLORS.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  textWrap: { flex: 1, gap: 2 },
  langName: { fontSize: FONTS.h3, fontWeight: '600', color: COLORS.text },
  sample: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  radio: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.pill,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  check: { color: COLORS.primary, fontSize: FONTS.small, fontWeight: '700' },
});
