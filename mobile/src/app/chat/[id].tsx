import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SkeletonNote } from '../../components/SkeletonNote';
import { useLang } from '../../context/LangContext';
import { conversationOf } from '../../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/theme';

/**
 * FM8 / FR-035 发送文字图片文件、FR-036 消息自动翻译、FR-037 常用语模板。
 *
 * 需求原文（FR-036）：在俄语与中文之间自动翻译收发消息，并可切换查看原文。
 *
 * 这一页是「双语沟通」模块的核心，也是整个项目最有辨识度的功能：
 * 双方各写母语，各自看到译文，必要时一键展开原文核对。
 * 因此每条气泡都同时持有原文与译文两个字段（见 types/models.ts 的 ChatMessage）。
 */
export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useLang();
  const conv = conversationOf(id ?? '');
  const [showOriginal, setShowOriginal] = useState(false);
  const [draft, setDraft] = useState('');

  if (!conv) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={t('chatTitle')} />
        <EmptyState title={t('empty')} hint={t('emptyHint')} />
      </View>
    );
  }

  const PHRASES = [
    'Уточните, пожалуйста, срок поставки.',
    'Просим предоставить упаковочный лист.',
    'Напоминаем о приближении срока оплаты.',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title={conv.subject} subtitle={`FM8 · ${conv.counterparty}`} />

      {/* 翻译开关 */}
      <View style={styles.toolbar}>
        <Badge label={`${t('translateOn')}: RU ⇄ ZH`} tone="info" />
        <Pressable onPress={() => setShowOriginal((prev) => !prev)} style={styles.toggle}>
          <Text style={styles.toggleText}>
            {showOriginal ? `✓ ${t('showOriginal')}` : t('showOriginal')}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
        {conv.messages.map((msg) => (
          <View key={msg.id} style={[styles.bubbleWrap, msg.mine && styles.bubbleWrapMine]}>
            <View style={[styles.bubble, msg.mine ? styles.bubbleMine : styles.bubbleOther]}>
              <Text style={[styles.bubbleText, msg.mine && styles.bubbleTextMine]}>
                {showOriginal ? msg.text : msg.translation}
              </Text>
              {showOriginal ? null : (
                <Text style={[styles.original, msg.mine && styles.originalMine]}>
                  {msg.from === 'ru' ? 'RU' : 'ZH'} · {msg.text}
                </Text>
              )}
              <Text style={[styles.time, msg.mine && styles.timeMine]}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 常用语模板 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.phrases}
      >
        {PHRASES.map((phrase) => (
          <Pressable key={phrase} onPress={() => setDraft(phrase)} style={styles.phrase}>
            <Text style={styles.phraseText} numberOfLines={1}>
              {phrase}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* 输入区 */}
      <View style={styles.composer}>
        <Pressable style={styles.attach} onPress={() => undefined}>
          <Text style={styles.attachGlyph}>＋</Text>
        </Pressable>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={t('typeMessage')}
          placeholderTextColor={COLORS.textMuted}
          style={styles.input}
        />
        <Pressable
          style={styles.send}
          onPress={() => {
            // 真实实现：POST /api/conversations/{id}/messages/
            // 服务端返回译文；无网络时进队列（FR-042）
            setDraft('');
          }}
        >
          <Text style={styles.sendText}>{t('send')}</Text>
        </Pressable>
      </View>

      <View style={styles.noteWrap}>
        <SkeletonNote
          frCodes={['FR-034', 'FR-035', 'FR-036', 'FR-037']}
          note={t('skeletonNote')}
          todo={[
            'POST /api/conversations/{id}/messages/ — сервер переводит и возвращает пару',
            'WebSocket-канал для мгновенной доставки и статуса прочтения',
            'Отправка вложений: камера и файловый менеджер (FR-035)',
          ]}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggle: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleText: { fontSize: FONTS.tiny, color: COLORS.primary },
  messages: { padding: SPACING.lg, gap: SPACING.md },
  bubbleWrap: { alignItems: 'flex-start' },
  bubbleWrapMine: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '82%',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  bubbleOther: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bubbleMine: { backgroundColor: COLORS.primary },
  bubbleText: { fontSize: FONTS.body, color: COLORS.text, lineHeight: 20 },
  bubbleTextMine: { color: COLORS.surface },
  original: { fontSize: FONTS.tiny, color: COLORS.textMuted, fontStyle: 'italic' },
  originalMine: { color: '#C7D8EA' },
  time: { fontSize: FONTS.tiny, color: COLORS.textMuted, alignSelf: 'flex-end' },
  timeMine: { color: '#C7D8EA' },
  phrases: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
    // 横向 ScrollView 默认 alignItems: stretch，会把圆角药丸拉成圆形
    alignItems: 'center',
  },
  phrase: {
    maxWidth: 240,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  phraseText: { fontSize: FONTS.tiny, color: COLORS.textMuted },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attach: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachGlyph: { fontSize: 20, color: COLORS.primary },
  input: {
    flex: 1,
    minHeight: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceAlt,
    paddingHorizontal: SPACING.md,
    fontSize: FONTS.body,
    color: COLORS.text,
  },
  send: {
    paddingHorizontal: SPACING.lg,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: COLORS.surface, fontSize: FONTS.small, fontWeight: '700' },
  noteWrap: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
});
