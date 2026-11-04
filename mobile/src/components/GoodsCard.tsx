import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { Badge } from './Badge';
import { useLang } from '../context/LangContext';
import { COLORS, FONTS, RADIUS, SHADOW, SPACING } from '../theme/theme';
import { formatPrice } from '../utils/format';
import type { GoodsListing } from '../types/models';
import type { Lang } from '../i18n/strings';

/**
 * 商品卡（热门货盘 / 商品目录共用）。
 *
 * 整改表第二条：原型的商品卡在页面里重复了两遍，改一处要改两处。
 * 现在只有这一个组件，工作台横向轮播和商品目录栅格都用它，
 * 宽度由外部传入（轮播固定宽，栅格用 useGrid 算出来的 tileWidth）。
 *
 * 整改表第三条：原型的价格、副标题、徽标都是 10px。这里
 * 主标题 14、副标题 12、价格 16 加粗，副语言名称单独一行 —— 
 * 中俄两种语言都能看清，不会像原型那样挤在一行被 truncate 掉。
 */

type Props = {
  listing: GoodsListing;
  onPress?: () => void;
  /** 固定宽度（横向轮播用）；不传则自适应父容器。 */
  width?: number;
  style?: ViewStyle;
};

export function GoodsCard({ listing, onPress, width, style }: Props) {
  const { t, lang } = useLang();
  // 副语言名称：当前是俄语就显示中文名，反之亦然（英语界面则显示俄语名）。
  const altLang: Lang = lang === 'ru' ? 'zh' : 'ru';
  const name = listing.goods.name[lang];
  const altName = listing.goods.name[altLang];
  const price = formatPrice(listing.price, listing.currency);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${price} ${listing.priceUnit}`}
      style={({ pressed }) => [
        styles.card,
        width !== undefined && { width },
        pressed && styles.pressed,
        style,
      ]}
    >
      {/* 图片占位：骨架阶段用色块 + 字形；接入时换成 <Image source={...} /> */}
      <View style={styles.thumb}>
        <Text style={styles.thumbGlyph}>▤</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
        <Text style={styles.altName} numberOfLines={1}>
          {altName}
        </Text>

        {/* 价格独占一行：卡片最窄只有 164（工作台轮播），
            价格和起订量并排会把「¥ 1180.00」截断成「¥118…」。
            宁可多一行，也不能让价格显示不全。 */}
        <Text style={styles.price} numberOfLines={1}>
          {price}
        </Text>
        <Text style={styles.moq} numberOfLines={1}>
          {t('goodsMoq')} {listing.moq}
        </Text>

        <View style={styles.badges}>
          {listing.inStock ? <Badge label={t('goodsInStock')} tone="success" /> : null}
          {listing.wholesale ? <Badge label={t('goodsWholesale')} tone="info" /> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOW.card,
  },
  pressed: { opacity: 0.8 },
  thumb: {
    height: 84,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbGlyph: { fontSize: 28, color: COLORS.border },
  body: { padding: SPACING.md, gap: 2 },
  name: { fontSize: FONTS.body, fontWeight: '600', color: COLORS.text, lineHeight: 19 },
  altName: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  price: { fontSize: FONTS.bodyLg, fontWeight: '800', color: COLORS.price, marginTop: 4 },
  moq: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: 4 },
});
