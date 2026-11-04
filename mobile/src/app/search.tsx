import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '../components/EmptyState';
import { FormField } from '../components/FormField';
import { ListRow } from '../components/ListRow';
import { ScreenHeader } from '../components/ScreenHeader';
import { SectionHeading } from '../components/SectionHeading';
import { SkeletonNote } from '../components/SkeletonNote';
import { useLang } from '../context/LangContext';
import { DOCUMENTS, ORDERS, RFQS } from '../data/mock';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme/theme';
import { formatMoney } from '../utils/format';

/**
 * FM0 / FR-003　全局搜索。
 *
 * 需求原文：在统一搜索框中检索订单号、询价号、往来单位与商品；
 * 结果按对象类型分组。
 *
 * 骨架实现：在本地 mock 数组上做子串匹配，但已经按
 * 「订单 / 询价 / 单证」三类分组展示，交互形态与真实实现一致。
 */
export default function SearchScreen() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { orders: [], rfqs: [], docs: [] };
    return {
      orders: ORDERS.filter(
        (o) => o.no.toLowerCase().includes(q) || o.counterparty.toLowerCase().includes(q),
      ),
      rfqs: RFQS.filter(
        (r) => r.no.toLowerCase().includes(q) || r.counterparty.toLowerCase().includes(q),
      ),
      docs: DOCUMENTS.filter((d) => d.typeLabel[lang].toLowerCase().includes(q)),
    };
  }, [query, lang]);

  const total = results.orders.length + results.rfqs.length + results.docs.length;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t('search')} subtitle="FM0 · FR-003" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FormField
          label={t('search')}
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchPlaceholder')}
          hint={`${t('searchPlaceholder')} — введите, например, «PO-2026»`}
        />

        {!query.trim() ? (
          <EmptyState title={t('search')} hint={t('searchPlaceholder')} icon="⌕" />
        ) : total === 0 ? (
          <EmptyState title={t('empty')} hint={t('emptyHint')} />
        ) : (
          <>
            {results.orders.length > 0 ? (
              <>
                <SectionHeading title={`${t('ordersTitle')} (${results.orders.length})`} />
                <View style={styles.listCard}>
                  {results.orders.map((order, index) => (
                    <ListRow
                      key={order.id}
                      mark="ЗК"
                      title={`${order.no} · ${order.counterparty}`}
                      subtitle={t('orderNo')}
                      value={formatMoney(order.amount, order.currency)}
                      onPress={() => router.push(`/orders/${order.id}`)}
                      last={index === results.orders.length - 1}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {results.rfqs.length > 0 ? (
              <>
                <SectionHeading title={`${t('rfqTitle')} (${results.rfqs.length})`} />
                <View style={styles.listCard}>
                  {results.rfqs.map((rfq, index) => (
                    <ListRow
                      key={rfq.id}
                      mark="ЗП"
                      markColor={COLORS.accent}
                      title={`${rfq.no} · ${rfq.counterparty}`}
                      subtitle={t('rfqNo')}
                      onPress={() => router.push(`/rfq/${rfq.id}`)}
                      last={index === results.rfqs.length - 1}
                    />
                  ))}
                </View>
              </>
            ) : null}

            {results.docs.length > 0 ? (
              <>
                <SectionHeading title={`${t('docsTitle')} (${results.docs.length})`} />
                <View style={styles.listCard}>
                  {results.docs.map((doc, index) => (
                    <ListRow
                      key={doc.id}
                      mark="ДК"
                      markColor={COLORS.success}
                      title={doc.typeLabel[lang]}
                      subtitle={doc.orderNo}
                      onPress={() => router.push('/documents')}
                      last={index === results.docs.length - 1}
                    />
                  ))}
                </View>
              </>
            ) : null}
          </>
        )}

        <SkeletonNote
          frCodes={['FR-003']}
          note={t('skeletonNote')}
          todo={[
            'GET /api/search/?q= — единый поиск по всем типам объектов',
            'Серверный поиск с подсветкой совпадений',
            'История последних запросов в локальном хранилище',
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: SPACING.xxl },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
});
