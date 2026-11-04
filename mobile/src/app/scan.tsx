import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SkeletonNote } from '../components/SkeletonNote';
import { useLang } from '../context/LangContext';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * FM5 / FR-021　条码与二维码扫描。
 *
 * 需求原文：用相机扫描商品条码与单证二维码；识别后直接打开关联对象。
 *
 * 骨架实现：画一个取景框占位，不做真实取景。真实实现时把中间的
 * View 换成 react-native-vision-camera 的 <Camera>，并加
 * useCodeScanner 回调；识别到编码后按前缀路由：
 *   PO-… → /orders/{id}　RFQ-… → /rfq/{id}　DOC-… → /documents
 *
 * 这是移动端相对 Web 端不可替代的能力之一（规范 1.8），
 * 也是「扫码 → 直接打开对象」这一交互的价值所在。
 */
export default function ScanScreen() {
  const router = useRouter();
  const { t } = useLang();

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('scanTitle')} subtitle="FM5 · FR-021" />

      <View style={styles.viewfinder}>
        <View style={styles.frame}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <Text style={styles.frameText}>{t('scanFrame')}</Text>
        </View>
        <Text style={styles.hint}>{t('scanHint')}</Text>
      </View>

      <View style={styles.bottom}>
        {/* 骨架里用两个按钮演示「识别到编码之后会发生什么」 */}
        <PrimaryButton
          label="PO-2026-0071 → /orders/ord-1"
          onPress={() => router.push('/orders/ord-1')}
        />
        <PrimaryButton
          label="RFQ-2026-0148 → /rfq/rfq-1"
          variant="secondary"
          onPress={() => router.push('/rfq/rfq-1')}
        />

        <SkeletonNote
          frCodes={['FR-021']}
          note={t('skeletonNote')}
          todo={[
            'react-native-vision-camera + useCodeScanner (EAN-13, QR)',
            'Разрешение на камеру и обработка отказа (NFR-10)',
            'Маршрутизация по префиксу кода к объекту сделки',
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  viewfinder: {
    flex: 1,
    backgroundColor: '#0E1A26',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    padding: SPACING.xl,
  },
  frame: {
    width: 220,
    height: 220,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: COLORS.accent,
  },
  tl: { top: -1, left: -1, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: -1, right: -1, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: -1, left: -1, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: -1, right: -1, borderBottomWidth: 3, borderRightWidth: 3 },
  frameText: { color: 'rgba(255,255,255,0.5)', fontSize: FONTS.tiny },
  hint: { color: '#C7D8EA', fontSize: FONTS.small, textAlign: 'center' },
  bottom: {
    padding: SPACING.lg,
    gap: SPACING.md,
    backgroundColor: COLORS.background,
  },
});
