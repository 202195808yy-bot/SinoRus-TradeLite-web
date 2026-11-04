import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { DataNote } from '../../components/DataNote';
import { EmptyState } from '../../components/EmptyState';
import { KeyValue } from '../../components/KeyValue';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SectionHeading } from '../../components/SectionHeading';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { listingOf } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';
import { formatPrice, formatQty } from '../../utils/format';
import type { Lang } from '../../i18n/strings';

/**
 * 商品详情（FM3 / FR-013 → FR-012）。
 *
 * 新增页面。1.html 的商品卡点不动、没有详情；这里补上详情，
 * 并且把采购方真正会看的字段（起订量、产地、计量单位、HS 编码、
 * 供货方、是否现货）一次列全，末尾直接给一个「加入询价」的入口 ——
 * 也就是整改表里「补页面切换、详情、查询及明确的演示反馈」中的「详情」。
 */
export default function GoodsDetailScreen() {
  const router = useRouter();
  const { t, lang } = useLang();
  const { id } = useLocalSearchParams<{ id: string }>();

  const listing = listingOf(String(id ?? ''));

  if (!listing) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={t('goodsDetail')} />
        <EmptyState title={t('logisticsNoResult')} hint={t('emptyHint')} icon="▤" />
      </View>
    );
  }

  const altLang: Lang = lang === 'ru' ? 'zh' : 'ru';
  const name = listing.goods.name[lang];

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('goodsDetail')} subtitle="FM3 · FR-013" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 图片占位（骨架阶段） */}
        <View style={styles.thumb}>
          <Text style={styles.thumbGlyph}>▤</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.altName}>{listing.goods.name[altLang]}</Text>
        </View>

        <View style={styles.badges}>
          {listing.inStock ? <Badge label={t('goodsInStock')} tone="success" /> : null}
          {listing.wholesale ? <Badge label={t('goodsWholesale')} tone="info" /> : null}
        </View>

        {/* 价格 */}
        <Card>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(listing.price, listing.currency)}</Text>
            <Text style={styles.priceUnit}>{listing.priceUnit}</Text>
          </View>
          <DataNote source="mock" />
        </Card>

        {/* 采购要点 */}
        <SectionHeading title={t('goodsPick')} />
        <Card>
          <KeyValue label={t('goodsMoq')} value={formatQty(listing.moq)} emphasis />
          <KeyValue label={t('goodsOrigin')} value={listing.origin[lang]} />
          <KeyValue label={t('goodsUnit')} value={listing.goods.unit} />
          <KeyValue label="HS" value={listing.goods.hsCode ?? '—'} />
          <KeyValue label={t('counterparty')} value={listing.supplier} />
        </Card>

        {/* 明确的下一步：加入询价 */}
        <PrimaryButton
          label={t('goodsAddToRfq')}
          onPress={() => router.push('/rfq/new')}
        />
        <Text style={styles.hint}>{t('demoActionHint')}</Text>

        <SkeletonNote
          frCodes={['FR-012', 'FR-013']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/listings/{id}/ — карточка товара с полными атрибутами',
            'POST /api/rfqs/ — добавление позиции в запрос (количество, срок)',
            'Проверка кода ТН ВЭД и ограничений на ввоз',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  thumb: {
    height: 180,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbGlyph: { fontSize: 56, color: COLORS.border },
  titleBlock: { gap: 2 },
  name: { fontSize: FONTS.h2, fontWeight: '700', color: COLORS.text },
  altName: { fontSize: FONTS.small, color: COLORS.textMuted },
  badges: { flexDirection: 'row', gap: SPACING.sm },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: SPACING.sm },
  price: { fontSize: FONTS.h1, fontWeight: '800', color: COLORS.price },
  priceUnit: { fontSize: FONTS.small, color: COLORS.textMuted },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted, textAlign: 'center' },
});
