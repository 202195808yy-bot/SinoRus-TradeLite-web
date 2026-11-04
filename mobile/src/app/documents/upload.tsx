import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/Card';
import { Chip } from '../../components/Chip';
import { FormField } from '../../components/FormField';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM5 / FR-022　拍照上传单证。
 *
 * 需求原文：拍照采集单证，自动裁边并增强对比度，选择单证类型后上传服务器。
 *
 * 场景来源：SC-05 外出签单 —— 负责人在对方公司现场拍摄已签合同
 * 并上传到订单详情。这是移动端相对 Web 端最直接的价值：
 * Web 端要「先扫描、再拷到电脑、再上传」，移动端拍完即传。
 */
export default function DocumentUploadScreen() {
  const router = useRouter();
  const { t } = useLang();
  const [docType, setDocType] = useState(0);
  const [orderNo, setOrderNo] = useState('PO-2026-0071');

  // 单证类型走文案字典，不再在页面里按语言手写三个数组。
  const TYPE_KEYS = [
    'docTypeInvoice',
    'docTypePacking',
    'docTypeOrigin',
    'docTypeConformity',
    'docTypeWaybill',
  ] as const;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('docUpload')} subtitle="FM5 · FR-022" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* 拍摄区 */}
        <Card title={t('docTakePhoto')}>
          <View style={styles.cameraBox}>
            <Text style={styles.cameraGlyph}>▣</Text>
            <Text style={styles.cameraText}>{t('docTakePhoto')}</Text>
            <Text style={styles.cameraHint}>
              Vision Camera · автообрезка · повышение контраста
            </Text>
          </View>
        </Card>

        {/* 单证类型：统一使用 Chip 组件 */}
        <Card title={t('docType')} subtitle={t('required')}>
          <View style={styles.chips}>
            {TYPE_KEYS.map((key, index) => (
              <Chip
                key={key}
                label={t(key)}
                active={docType === index}
                onPress={() => setDocType(index)}
              />
            ))}
          </View>
          <FormField
            label={t('orderNo')}
            value={orderNo}
            onChangeText={setOrderNo}
            placeholder="PO-2026-00XX"
          />
        </Card>

        <PrimaryButton
          label={t('submit')}
          onPress={() => {
            // 真实实现：POST /api/documents/upload/ (multipart)
            // 无网络：文件先落本地，进队列，联网后自动上传（FR-042）
            router.back();
          }}
        />

        <Text style={styles.hint}>{t('docCacheHint')}</Text>

        <SkeletonNote
          frCodes={['FR-022', 'FR-025', 'FR-042']}
          note={t('skeletonNote')}
          todo={[
            'Vision Camera: съёмка, обрезка края, повышение контраста',
            'POST /api/documents/upload/ (multipart, сжатие перед отправкой)',
            'Загрузка в фоне с докачкой при обрыве связи',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  cameraBox: {
    height: 160,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  cameraGlyph: { fontSize: 30, color: COLORS.textMuted },
  cameraText: { fontSize: FONTS.body, color: COLORS.textMuted },
  cameraHint: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted, lineHeight: 16 },
});
