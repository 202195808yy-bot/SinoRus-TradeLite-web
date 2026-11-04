/**
 * 骨架用的示例数据（mock）。
 *
 * 目的：让每个页面在没有服务端的情况下也能渲染出真实结构，
 * 便于在答辩时演示「页面长什么样、数据放在哪里」。
 *
 * 后续接入服务端时，把这些常量替换为 `api/client.ts` 的请求结果即可
 * —— 页面只依赖 `types/models.ts` 里的类型，不关心数据来源。
 *
 * 数据形态参照 Web 端已有的领域实体（企业、商品、询价、订单、单证…），
 * 名称取中俄双方的真实业务口径（如「成套机械设备 / Комплектное оборудование」）。
 */

import type {
  AppNotification,
  Batch,
  Conversation,
  Enterprise,
  ExchangeRate,
  Goods,
  GoodsListing,
  Invoice,
  Milestone,
  Order,
  OrderLine,
  QueuedOperation,
  Rfq,
  Shipment,
  TaskItem,
  TimelineEvent,
  TradeDocument,
  UserProfile,
  VersionConflict,
} from '../types/models';

// --- 企业与用户 ---------------------------------------------------------

export const ENTERPRISES: Enterprise[] = [
  {
    id: 'ent-cn-01',
    name: { ru: 'ООО «Суньшань Машинери»', zh: '嵩山机械有限公司', en: 'Songshan Machinery Co., Ltd.' },
    country: 'CN',
    role: 'R1',
    inn: '91330100MA2XXXXXX',
  },
  {
    id: 'ent-cn-02',
    name: { ru: 'ООО «Чжунъюань Трейд»', zh: '中原贸易有限公司', en: 'Zhongyuan Trade Co., Ltd.' },
    country: 'CN',
    role: 'R2',
  },
  {
    id: 'ent-ru-01',
    name: { ru: 'ООО «Владимир-Логистик»', zh: '弗拉基米尔物流有限公司', en: 'Vladimir-Logistik LLC' },
    country: 'RU',
    role: 'R3',
  },
];

export const CURRENT_USER: UserProfile = {
  id: 'usr-001',
  name: '严耀',
  position: { ru: 'Менеджер по закупкам', zh: '采购经理', en: 'Procurement manager' },
  phone: '+86 138 0000 0000',
  email: 'yan.yao@example.cn',
  roles: ['R1'],
  enterprises: ENTERPRISES,
  activeEnterpriseId: 'ent-cn-01',
};

// --- 商品 ---------------------------------------------------------------

// 计量单位在移动端不区分语言（规范里「计量单位」属于字典，由 FM11 维护）
export const G_PRESS: Goods = {
  id: 'gd-001',
  name: { ru: 'Гидравлический пресс 200 т', zh: '200 吨液压机', en: 'Hydraulic press 200 t' },
  unit: 'шт. / 台',
  hsCode: '8462 91',
};

export const G_BEARING: Goods = {
  id: 'gd-002',
  name: { ru: 'Подшипник роликовый', zh: '圆柱滚子轴承', en: 'Cylindrical roller bearing' },
  unit: 'шт. / 套',
  hsCode: '8482 50',
};

export const G_VALVE: Goods = {
  id: 'gd-003',
  name: { ru: 'Клапан запорный DN50', zh: 'DN50 截止阀', en: 'Shut-off valve DN50' },
  unit: 'шт. / 只',
  hsCode: '8481 80',
};

/** 手机配件（对应 1.html 里的「国产智能手机配件」，中方出口）。 */
export const G_PHONE_ACC: Goods = {
  id: 'gd-004',
  name: { ru: 'Аксессуары для смартфонов', zh: '智能手机配件', en: 'Smartphone accessories' },
  unit: 'компл. / 套',
  hsCode: '8517 70',
};

/** 小麦面粉（对应 1.html 里的「俄罗斯进口面粉」，俄方出口）。 */
export const G_FLOUR: Goods = {
  id: 'gd-005',
  name: { ru: 'Мука пшеничная в/с', zh: '小麦面粉（高筋）', en: 'Wheat flour, premium' },
  unit: 'мешок / 袋',
  hsCode: '1101 00',
};

/** 桦木锯材（俄方出口，木材类）。 */
export const G_TIMBER: Goods = {
  id: 'gd-006',
  name: { ru: 'Пиломатериалы берёзовые', zh: '桦木锯材', en: 'Birch sawn timber' },
  unit: 'м³ / 立方米',
  hsCode: '4407 96',
};

// --- 汇率（FR-008 工作台首屏）------------------------------------------
//
// ⚠️ 演示数据。原型把 12.65 写死却标「实时汇率」；这里用 ExchangeRate
// 类型显式带 source 字段，页面上由 DataNote 标出「演示数据 + 更新时间」。
// 接入时改为 GET /api/rates/?base=CNY&quote=RUB（见 api/client.ts 第 21 条）。
export const EXCHANGE_RATE: ExchangeRate = {
  base: 'CNY',
  quote: 'RUB',
  value: 12.65,
  changePct: 0.12,
  updatedAt: '10:24',
  source: 'mock',
};

// --- 商品货盘（FR-013 商品目录）----------------------------------------

export const LISTINGS: GoodsListing[] = [
  {
    id: 'ls-1',
    goods: G_PHONE_ACC,
    price: 25,
    currency: 'CNY',
    priceUnit: 'компл. / 套',
    moq: 500,
    origin: { ru: 'Шэньчжэнь, КНР', zh: '中国 深圳', en: 'Shenzhen, China' },
    inStock: true,
    wholesale: true,
    supplier: 'ООО «Чжунъюань Трейд»',
  },
  {
    id: 'ls-2',
    goods: G_FLOUR,
    price: 120,
    currency: 'RUB',
    priceUnit: 'мешок / 袋',
    moq: 200,
    origin: { ru: 'Краснодар, РФ', zh: '俄罗斯 克拉斯诺达尔', en: 'Krasnodar, Russia' },
    inStock: true,
    wholesale: false,
    supplier: 'ООО «Кубань-Агро»',
  },
  {
    id: 'ls-3',
    goods: G_BEARING,
    price: 1180,
    currency: 'CNY',
    priceUnit: 'шт. / 套',
    moq: 100,
    origin: { ru: 'Лоян, КНР', zh: '中国 洛阳', en: 'Luoyang, China' },
    inStock: true,
    wholesale: true,
    supplier: 'ООО «Суньшань Машинери»',
  },
  {
    id: 'ls-4',
    goods: G_TIMBER,
    price: 1650,
    currency: 'CNY',
    priceUnit: 'м³ / 立方米',
    moq: 40,
    origin: { ru: 'Иркутск, РФ', zh: '俄罗斯 伊尔库茨克', en: 'Irkutsk, Russia' },
    inStock: false,
    wholesale: true,
    supplier: 'ООО «Сибирь-Лес»',
  },
  {
    id: 'ls-5',
    goods: G_VALVE,
    price: 1183,
    currency: 'CNY',
    priceUnit: 'шт. / 只',
    moq: 300,
    origin: { ru: 'Вэньчжоу, КНР', zh: '中国 温州', en: 'Wenzhou, China' },
    inStock: true,
    wholesale: false,
    supplier: 'ООО «Балт-Трейд»',
  },
  {
    id: 'ls-6',
    goods: G_PRESS,
    price: 2430000,
    currency: 'CNY',
    priceUnit: 'шт. / 台',
    moq: 1,
    origin: { ru: 'Цзинань, КНР', zh: '中国 济南', en: 'Jinan, China' },
    inStock: false,
    wholesale: false,
    supplier: 'ООО «Суньшань Машинери»',
  },
];

export function listingOf(id: string): GoodsListing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

// --- 物流轨迹（FR-027 运输跟踪）----------------------------------------
//
// 顺序：最新在上（与 1.html 的物流卡一致）。
// state 由 Timeline 组件决定视觉：current 高亮、done 深色、pending 浅色。

export const TRACKING: TimelineEvent[] = [
  {
    id: 'tr-1',
    title: { ru: 'Прибыл на таможню Москвы', zh: '已到达莫斯科海关', en: 'Arrived at Moscow customs' },
    place: { ru: 'Москва, РФ', zh: '俄罗斯 莫斯科', en: 'Moscow, Russia' },
    time: '今天 08:30',
    state: 'current',
  },
  {
    id: 'tr-2',
    title: { ru: 'Прошёл пункт пропуска Забайкальск', zh: '通过后贝加尔斯克口岸', en: 'Cleared Zabaikalsk crossing' },
    place: { ru: 'Забайкальск', zh: '后贝加尔斯克', en: 'Zabaikalsk' },
    time: '昨天 21:10',
    state: 'done',
  },
  {
    id: 'tr-3',
    title: { ru: 'Покинул склад Иу', zh: '离开义乌保税仓', en: 'Left Yiwu bonded warehouse' },
    place: { ru: 'Иу, КНР', zh: '中国 义乌', en: 'Yiwu, China' },
    time: '昨天 14:00',
    state: 'done',
  },
  {
    id: 'tr-4',
    title: { ru: 'Ожидается доставка получателю', zh: '预计送达收货方', en: 'Delivery to consignee' },
    place: { ru: 'Владимир, РФ', zh: '俄罗斯 弗拉基米尔', en: 'Vladimir, Russia' },
    time: '预计 11-20',
    state: 'pending',
  },
];

// --- 询价与报价 ---------------------------------------------------------

export const RFQS: Rfq[] = [
  {
    id: 'rfq-1',
    no: 'RFQ-2026-0148',
    counterparty: 'ООО «Урал-Маш»',
    status: 'quoted',
    deadline: '2026-10-18',
    lines: [
      { id: 'rl-1', goods: G_PRESS, qty: 2, unit: '台' },
      { id: 'rl-2', goods: G_BEARING, qty: 400, unit: '套' },
    ],
    quotes: [
      { id: 'q-1', supplier: 'ООО «Урал-Маш»', price: 4860000, currency: 'CNY', leadTimeDays: 45, incoterms: 'FCA Владимир' },
      { id: 'q-2', supplier: 'ООО «ТехноПром»', price: 5120000, currency: 'CNY', leadTimeDays: 38, incoterms: 'DAP Москва' },
      { id: 'q-3', supplier: 'АО «Станкоимпорт»', price: 4650000, currency: 'CNY', leadTimeDays: 60, incoterms: 'EXW' },
    ],
  },
  {
    id: 'rfq-2',
    no: 'RFQ-2026-0142',
    counterparty: 'ООО «Балт-Трейд»',
    status: 'open',
    deadline: '2026-10-22',
    lines: [{ id: 'rl-3', goods: G_VALVE, qty: 1200, unit: '只' }],
    quotes: [],
  },
  {
    id: 'rfq-3',
    no: 'RFQ-2026-0137',
    counterparty: 'АО «Сибирь-Агро»',
    status: 'accepted',
    deadline: '2026-10-05',
    lines: [{ id: 'rl-4', goods: G_BEARING, qty: 800, unit: '套' }],
    quotes: [
      { id: 'q-4', supplier: 'АО «Сибирь-Агро»', price: 1280000, currency: 'CNY', leadTimeDays: 30, incoterms: 'CPT', accepted: true },
    ],
  },
];

// --- 订单 ---------------------------------------------------------------

const MILESTONES = (orderId: string): Milestone[] => [
  { id: `${orderId}-m1`, name: { ru: 'Подтверждение заказа', zh: '订单确认', en: 'Order confirmation' }, plannedDate: '2026-09-20', actualDate: '2026-09-19', done: true },
  { id: `${orderId}-m2`, name: { ru: 'Производство', zh: '生产备货', en: 'Production' }, plannedDate: '2026-10-15', actualDate: '2026-10-14', done: true },
  { id: `${orderId}-m3`, name: { ru: 'Готовность к отгрузке', zh: '备妥待发', en: 'Ready to ship' }, plannedDate: '2026-10-25', done: false },
  { id: `${orderId}-m4`, name: { ru: 'Отгрузка', zh: '发运', en: 'Dispatch' }, plannedDate: '2026-11-02', done: false },
  { id: `${orderId}-m5`, name: { ru: 'Доставка', zh: '到货交付', en: 'Delivery' }, plannedDate: '2026-11-20', done: false },
];

const BATCHES = (orderId: string): Batch[] => [
  { id: `${orderId}-b1`, no: 'PL-2026-0031', qty: 120, shipDate: '2026-10-26', status: 'planned' },
  { id: `${orderId}-b2`, no: 'PL-2026-0032', qty: 80, shipDate: '2026-11-02', status: 'planned' },
];

const ORDER_LINES: OrderLine[] = [
  { id: 'ol-1', goods: G_PRESS, qty: 2, price: 2430000, unit: '台' },
  { id: 'ol-2', goods: G_BEARING, qty: 400, price: 1180, unit: '套' },
];

export const ORDERS: Order[] = [
  {
    id: 'ord-1',
    no: 'PO-2026-0071',
    counterparty: 'ООО «Урал-Маш»',
    amount: 5332000,
    currency: 'CNY',
    stage: 'fulfilment',
    status: 'active',
    updatedAt: '2026-10-11 09:20',
    lines: ORDER_LINES,
    milestones: MILESTONES('ord-1'),
    batches: BATCHES('ord-1'),
    docIds: ['doc-1', 'doc-2', 'doc-3'],
  },
  {
    id: 'ord-2',
    no: 'PO-2026-0068',
    counterparty: 'ООО «Балт-Трейд»',
    amount: 1420000,
    currency: 'CNY',
    stage: 'logistics',
    status: 'active',
    updatedAt: '2026-10-10 17:05',
    lines: [{ id: 'ol-3', goods: G_VALVE, qty: 1200, price: 1183, unit: '只' }],
    milestones: MILESTONES('ord-2'),
    batches: BATCHES('ord-2'),
    docIds: ['doc-2'],
  },
  {
    id: 'ord-3',
    no: 'PO-2026-0055',
    counterparty: 'АО «Сибирь-Агро»',
    amount: 944000,
    currency: 'CNY',
    stage: 'settlement',
    status: 'active',
    updatedAt: '2026-10-08 11:40',
    lines: [{ id: 'ol-4', goods: G_BEARING, qty: 800, price: 1180, unit: '套' }],
    milestones: MILESTONES('ord-3'),
    batches: BATCHES('ord-3'),
    docIds: ['doc-1'],
  },
  {
    id: 'ord-4',
    no: 'PO-2026-0041',
    counterparty: 'ООО «ТехноПром»',
    amount: 2100000,
    currency: 'CNY',
    stage: 'order',
    status: 'paused',
    updatedAt: '2026-09-29 08:15',
    lines: [{ id: 'ol-5', goods: G_PRESS, qty: 1, price: 2100000, unit: '台' }],
    milestones: MILESTONES('ord-4'),
    batches: [],
    docIds: [],
  },
];

export function orderOf(id: string): Order | undefined {
  return ORDERS.find((o) => o.id === id);
}

export function rfqOf(id: string): Rfq | undefined {
  return RFQS.find((r) => r.id === id);
}

// --- 单证 ---------------------------------------------------------------

export const DOCUMENTS: TradeDocument[] = [
  { id: 'doc-1', type: 'invoice', typeLabel: { ru: 'Коммерческий инвойс', zh: '商业发票', en: 'Commercial invoice' }, orderNo: 'PO-2026-0071', validUntil: '2026-12-31', status: 'ok', cached: true },
  { id: 'doc-2', type: 'packing', typeLabel: { ru: 'Упаковочный лист', zh: '装箱单', en: 'Packing list' }, orderNo: 'PO-2026-0071', validUntil: '2026-12-31', status: 'ok', cached: true },
  { id: 'doc-3', type: 'origin', typeLabel: { ru: 'Сертификат происхождения', zh: '原产地证书', en: 'Certificate of origin' }, orderNo: 'PO-2026-0071', validUntil: '2026-10-30', status: 'expiring', cached: false },
  { id: 'doc-4', type: 'waybill', typeLabel: { ru: 'Транспортная накладная', zh: '运单', en: 'Waybill' }, orderNo: 'PO-2026-0068', validUntil: '2026-11-15', status: 'missing', cached: false },
  { id: 'doc-5', type: 'certificate', typeLabel: { ru: 'Сертификат соответствия', zh: '合格证书', en: 'Certificate of conformity' }, orderNo: 'PO-2026-0068', validUntil: '2026-10-25', status: 'expiring', cached: true },
];

export function documentsOfOrder(orderNo: string): TradeDocument[] {
  return DOCUMENTS.filter((d) => d.orderNo === orderNo);
}

// --- 运输跟踪 -----------------------------------------------------------

export const SHIPMENTS: Shipment[] = [
  {
    id: 'shp-1',
    batchNo: 'PL-2026-0031',
    orderNo: 'PO-2026-0071',
    status: { ru: 'В пути', zh: '运输中', en: 'In transit' },
    routeFrom: 'Владимир, РФ',
    routeTo: 'Чжэнчжоу, КНР',
    crossings: ['Забайкальск', 'Маньчжурия'],
    eta: '2026-11-20',
    driverPhone: '+7 900 000 00 00',
  },
  {
    id: 'shp-2',
    batchNo: 'PL-2026-0028',
    orderNo: 'PO-2026-0068',
    status: { ru: 'На пункте пропуска', zh: '口岸待检', en: 'At border crossing' },
    routeFrom: 'Санкт-Петербург, РФ',
    routeTo: 'Шанхай, КНР',
    crossings: ['Торфяновка'],
    eta: '2026-11-05',
    driverPhone: '+7 900 111 11 11',
  },
];

export function shipmentOfOrder(orderNo: string): Shipment | undefined {
  return SHIPMENTS.find((s) => s.orderNo === orderNo);
}

// --- 结算 ---------------------------------------------------------------

export const INVOICES: Invoice[] = [
  { id: 'inv-1', no: 'INV-2026-0090', orderNo: 'PO-2026-0071', amount: 2132800, currency: 'CNY', dueDate: '2026-10-20', paid: false },
  { id: 'inv-2', no: 'INV-2026-0085', orderNo: 'PO-2026-0068', amount: 568000, currency: 'CNY', dueDate: '2026-10-12', paid: true, paidDate: '2026-10-09', reference: 'PAY-2026-0412' },
  { id: 'inv-3', no: 'INV-2026-0077', orderNo: 'PO-2026-0055', amount: 944000, currency: 'CNY', dueDate: '2026-10-05', paid: false },
];

// --- 消息 ---------------------------------------------------------------

export const CONVERSATIONS: Conversation[] = [
  {
    id: 'cnv-1',
    subject: 'PO-2026-0071',
    boundTo: 'order',
    counterparty: 'ООО «Урал-Маш»',
    unread: 2,
    lastTime: '10:42',
    messages: [
      { id: 'm-1', from: 'ru', text: 'Отгрузка первой партии согласована на 26 октября.', translation: '第一批货已商定于 10 月 26 日发运。', mine: false, time: '10:38' },
      { id: 'm-2', from: 'ru', text: 'Нужен упаковочный лист до отгрузки.', translation: '发运前需要装箱单。', mine: false, time: '10:42' },
      { id: 'm-3', from: 'zh', text: '好的，我今天把装箱单拍照上传到订单里。', translation: 'Хорошо, сегодня сфотографирую упаковочный лист и загружу в заказ.', mine: true, time: '10:45' },
    ],
  },
  {
    id: 'cnv-2',
    subject: 'RFQ-2026-0148',
    boundTo: 'rfq',
    counterparty: 'АО «Станкоимпорт»',
    unread: 0,
    lastTime: '昨天',
    messages: [
      { id: 'm-4', from: 'ru', text: 'Готовы дать скидку 3% при предоплате 50%.', translation: '如预付 50%，我们可以给 3% 折扣。', mine: false, time: '昨天 16:20' },
    ],
  },
  {
    id: 'cnv-3',
    subject: 'PO-2026-0068',
    boundTo: 'order',
    counterparty: 'ООО «Владимир-Логистик»',
    unread: 0,
    lastTime: '10-09',
    messages: [
      { id: 'm-5', from: 'ru', text: 'Груз на пункте пропуска Торфяновка, оформление идёт.', translation: '货物已到托尔菲亚诺夫卡口岸，正在办理手续。', mine: false, time: '10-09 09:10' },
    ],
  },
];

export function conversationOf(id: string): Conversation | undefined {
  return CONVERSATIONS.find((c) => c.id === id);
}

// --- 待办 ---------------------------------------------------------------

export const TASKS: TaskItem[] = [
  { id: 't-1', title: { ru: 'Согласовать предложение по RFQ-2026-0148', zh: '确认 RFQ-2026-0148 的报价', en: 'Approve quote for RFQ-2026-0148' }, due: '今天 18:00', priority: 'high', kind: 'quote', done: false },
  { id: 't-2', title: { ru: 'Отметить этап «Готовность к отгрузке»', zh: '「备妥待发」阶段打卡', en: 'Check in stage “Ready to ship”' }, due: '今天 20:00', priority: 'high', kind: 'milestone', done: false },
  { id: 't-3', title: { ru: 'Загрузить сертификат происхождения', zh: '上传原产地证书', en: 'Upload certificate of origin' }, due: '明天 12:00', priority: 'medium', kind: 'document', done: false },
  { id: 't-4', title: { ru: 'Подтвердить поступление по INV-2026-0085', zh: '确认 INV-2026-0085 到账', en: 'Confirm receipt for INV-2026-0085' }, due: '10-14', priority: 'medium', kind: 'payment', done: true },
];

// --- 通知 ---------------------------------------------------------------

export const NOTIFICATIONS: AppNotification[] = [
  { id: 'n-1', title: { ru: 'Новое предложение', zh: '收到新报价', en: 'New quote' }, body: { ru: 'ООО «ТехноПром» ответило на RFQ-2026-0148.', zh: 'ООО «ТехноПром» 回复了 RFQ-2026-0148。', en: 'OOO TekhnoProm replied to RFQ-2026-0148.' }, time: '10:31', read: false, module: 'FM3' },
  { id: 'n-2', title: { ru: 'Срок документа истекает', zh: '单证即将到期', en: 'Document expiring' }, body: { ru: 'Сертификат соответствия действителен до 25.10.2026.', zh: '合格证书有效期至 2026-10-25。', en: 'Certificate of conformity is valid until 25.10.2026.' }, time: '09:05', read: false, module: 'FM5' },
  { id: 'n-3', title: { ru: 'Изменение статуса заказа', zh: '订单状态变更', en: 'Order status changed' }, body: { ru: 'PO-2026-0068 передан на пункт пропуска.', zh: 'PO-2026-0068 已转入口岸查验。', en: 'PO-2026-0068 moved to border crossing.' }, time: '昨天 17:12', read: true, module: 'FM4' },
];

// --- 离线与同步 ---------------------------------------------------------

export const QUEUE: QueuedOperation[] = [
  { id: 'q-1', label: { ru: 'Отметка этапа: «Готовность к отгрузке»', zh: '阶段打卡：备妥待发', en: 'Stage check-in: Ready to ship' }, createdAt: '10:58', status: 'pending' },
  { id: 'q-2', label: { ru: 'Фото упаковочного листа (2 файла)', zh: '装箱单照片（2 个文件）', en: 'Packing list photos (2 files)' }, createdAt: '10:59', status: 'pending' },
  { id: 'q-3', label: { ru: 'Сообщение в диалоге PO-2026-0071', zh: '会话消息 PO-2026-0071', en: 'Message in PO-2026-0071' }, createdAt: '11:02', status: 'failed' },
];

export const CONFLICTS: VersionConflict[] = [
  {
    id: 'cf-1',
    objectLabel: { ru: 'Заказ PO-2026-0071', zh: '订单 PO-2026-0071', en: 'Order PO-2026-0071' },
    localUpdatedAt: '10:58 (на устройстве)',
    serverUpdatedAt: '10:57 (на сервере)',
    localSummary: { ru: 'Дата отгрузки партии PL-2026-0031 — 26.10', zh: '批次 PL-2026-0031 发货日期 10-26', en: 'Batch PL-2026-0031 ship date 26.10' },
    serverSummary: { ru: 'Дата отгрузки партии PL-2026-0031 — 28.10', zh: '批次 PL-2026-0031 发货日期 10-28', en: 'Batch PL-2026-0031 ship date 28.10' },
  },
];
