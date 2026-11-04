/**
 * 显示格式化工具。
 *
 * 规范 NFR-09 要求「完整支持俄语、中文、英语，含日期与数字格式」，
 * 因此货币符号与数字分组集中在这里，不散落在页面里。
 * 骨架阶段用简单实现；接入时换成 Intl.NumberFormat / Intl.DateTimeFormat
 * （React Native 0.81 已内置完整 ICU）。
 */

import type { DealStage } from '../types/models';
import type { BadgeTone } from '../components/Badge';

/** 货币符号。人民币用 ¥（与 Web 端一致）。 */
export const CURRENCY_SYMBOL: Record<string, string> = {
  CNY: '¥',
  RUB: '₽',
  USD: '$',
};

/** 金额：12345678 → ¥12 345 678。 */
export function formatMoney(amount: number, currency: 'CNY' | 'RUB' | 'USD' = 'CNY'): string {
  const grouped = amount.toLocaleString('ru-RU').replace(/,/g, ' ');
  return `${CURRENCY_SYMBOL[currency] ?? ''}${grouped}`;
}

/** 数量：1200 → 1 200。 */
export function formatQty(value: number): string {
  return value.toLocaleString('ru-RU').replace(/,/g, ' ');
}

/** 商品单价：25 → ¥ 25.00（保留两位小数，与货盘报价口径一致）。 */
export function formatPrice(amount: number, currency: 'CNY' | 'RUB' | 'USD' = 'CNY'): string {
  return `${CURRENCY_SYMBOL[currency] ?? ''} ${amount.toFixed(2)}`;
}

/** 汇率数值：12.6500 → 12.65，12.6000 → 12.6（去掉末尾多余的 0）。 */
export function formatRate(value: number): string {
  return value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}

/** 日期：2026-10-26 → 26.10.2026（俄式写法，演示用）。 */
export function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return iso;
  return `${m[3]}.${m[2]}.${m[1]}`;
}

/** 订单状态 → 标签色调。 */
export const ORDER_STATUS_TONE: Record<string, BadgeTone> = {
  active: 'info',
  paused: 'warning',
  done: 'success',
};

/** 订单状态 → 文案键（用 t() 取当前语言的写法，不直接显示枚举值）。 */
export const ORDER_STATUS_KEY: Record<string, string> = {
  active: 'statusActive',
  paused: 'statusPaused',
  done: 'statusDone',
};

/** 询价状态 → 标签色调。 */
export const RFQ_STATUS_TONE: Record<string, BadgeTone> = {
  open: 'neutral',
  quoted: 'info',
  accepted: 'success',
  closed: 'neutral',
};

/** 单证状态 → 标签色调。 */
export const DOC_STATUS_TONE: Record<string, BadgeTone> = {
  ok: 'success',
  expiring: 'warning',
  missing: 'danger',
};

/** 单证状态 → 文案键。 */
export const DOC_STATUS_KEY: Record<string, string> = {
  ok: 'docStatusOk',
  expiring: 'docStatusExpiring',
  missing: 'docStatusMissing',
};

/** 优先级 → 标签色调。 */
export const PRIORITY_TONE: Record<string, BadgeTone> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
};

/** 交易阶段 → 中文/俄文短名，用于列表右侧展示。 */
export const STAGE_SHORT: Record<DealStage, { ru: string; zh: string; en: string }> = {
  rfq: { ru: 'Запрос', zh: '询价', en: 'RFQ' },
  quote: { ru: 'Предложение', zh: '报价', en: 'Quote' },
  order: { ru: 'Заказ', zh: '订单', en: 'Order' },
  fulfilment: { ru: 'Исполнение', zh: '履约', en: 'Fulfilment' },
  logistics: { ru: 'Логистика', zh: '单证运输', en: 'Logistics' },
  settlement: { ru: 'Расчёты', zh: '结算', en: 'Settlement' },
};

/** 交易阶段 → 序号 1–6（规范 1.5 的六个阶段），用于列表左侧的标记块。 */
export const STAGE_ORDER: Record<DealStage, number> = {
  rfq: 1,
  quote: 2,
  order: 3,
  fulfilment: 4,
  logistics: 5,
  settlement: 6,
};
