import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '../../components/Badge';
import { ListRow } from '../../components/ListRow';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { RFQS } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';
import { RFQ_STATUS_TONE } from '../../utils/format';

/**
 * FM3 / FR-012　询价单列表。
 *
 * 需求原文：询价单列表，可按状态、往来单位与日期筛选；显示商品行数与回复期限。
 */
export default function RfqListScreen() {
  const router = useRouter();
  const { t, lang } = useLang();

  const statusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return lang === 'zh' ? '待回复' : lang === 'en' ? 'Open' : 'Ожидает';
      case 'quoted':
        return lang === 'zh' ? '已报价' : lang === 'en' ? 'Quoted' : 'Есть предложения';
      case 'accepted':
        return lang === 'zh' ? '已接受' : lang === 'en' ? 'Accepted' : 'Принят';
      default:
        return lang === 'zh' ? '已关闭' : lang === 'en' ? 'Closed' : 'Закрыт';
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('rfqTitle')} subtitle="FM3 · FR-012" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PrimaryButton label={`+ ${t('rfqNew')}`} onPress={() => router.push('/rfq/new')} />

        <View style={styles.listCard}>
          {RFQS.map((rfq, index) => (
            <ListRow
              key={rfq.id}
              mark="ЗП"
              markColor={COLORS.accent}
              title={`${rfq.no} · ${rfq.counterparty}`}
              subtitle={`${t('rfqLines')}: ${rfq.lines.length} · ${t('rfqDeadline')}: ${rfq.deadline}`}
              right={
                <Badge label={statusLabel(rfq.status)} tone={RFQ_STATUS_TONE[rfq.status]} />
              }
              value={rfq.quotes.length > 0 ? `${rfq.quotes.length} 📄` : undefined}
              onPress={() => router.push(`/rfq/${rfq.id}`)}
              last={index === RFQS.length - 1}
            />
          ))}
        </View>

        <Text style={styles.legend}>
          {t('rfqCompare')}: {t('quotePrice')} / {t('quoteLeadTime')} / {t('quoteTerms')}
        </Text>

        <SkeletonNote
          frCodes={['FR-012']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/rfqs/?status=&counterparty=&from=&to=',
            'Счётчик непрочитанных предложений на строке',
            'Сортировка по сроку ответа',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  legend: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
