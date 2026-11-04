import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';

/**
 * 表单字段：标签 + 输入框（或只读值）。登录、发起询价、
 * 阶段打卡、异常上报等表单统一用它。
 *
 * 骨架阶段不做校验，`required` 只用于在标签后画一个星号，
 * 校验规则留到接入服务端时按后端的序列化器对齐。
 */

type Props = {
  label: string;
  value?: string;
  onChangeText?: (next: string) => void;
  placeholder?: string;
  /** 只读展示（不可编辑的值，例如订单号）。 */
  readOnly?: boolean;
  multiline?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  required?: boolean;
  hint?: string;
  /** 右侧补充内容，例如「选择」按钮。 */
  right?: React.ReactNode;
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  readOnly = false,
  multiline = false,
  keyboardType = 'default',
  required = false,
  hint,
  right,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.star}> *</Text> : null}
        </Text>
        {right}
      </View>

      {readOnly ? (
        <View style={[styles.input, styles.readOnly]}>
          <Text style={styles.readOnlyText}>{value ?? '—'}</Text>
        </View>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType={keyboardType}
          multiline={multiline}
          style={[styles.input, multiline && styles.multiline]}
        />
      )}

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: SPACING.xs },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { fontSize: FONTS.small, color: COLORS.textMuted, fontWeight: '600' },
  star: { color: COLORS.danger },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.body,
    color: COLORS.text,
  },
  multiline: { minHeight: 88, textAlignVertical: 'top' },
  readOnly: {
    backgroundColor: COLORS.surfaceAlt,
    justifyContent: 'center',
  },
  readOnlyText: { fontSize: FONTS.body, color: COLORS.text },
  hint: { fontSize: FONTS.tiny, color: COLORS.textMuted },
});
