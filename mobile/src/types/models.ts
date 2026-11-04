/**
 * 移动端领域模型（TypeScript 类型）。
 *
 * 字段取自服务端 Django 的领域实体（`docs/models.zh.md`），
 * 只保留移动端实际用到的部分：移动端不重复 Web 端的全部字段，
 * 只呈现「此时此刻」需要确认与记录的内容（规范 1.2）。
 *
 * 命名约定：字段名用 lowerCamelCase，与后端 JSON 序列化后的键一致，
 * 便于后续接入 API 时直接映射，不需要中间转换层。
 */

import type { Lang } from '../i18n/strings';

/** 六类参与方（规范 1.3，R1–R6）。 */
export type RoleCode = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6';

/** 模块代码（规范 2.2，FM0–FM11）。 */
export type ModuleCode =
  | 'FM0' | 'FM1' | 'FM2' | 'FM3' | 'FM4' | 'FM5'
  | 'FM6' | 'FM7' | 'FM8' | 'FM9' | 'FM10' | 'FM11';

/** 优先级（规范 2.6）。 */
export type Priority = 'high' | 'medium' | 'low';

/** 交易六阶段（规范 1.5）。 */
export type DealStage =
  | 'rfq'        // 1 询价
  | 'quote'      // 2 报价
  | 'order'      // 3 订单
  | 'fulfilment' // 4 履约
  | 'logistics'  // 5 单证与运输
  | 'settlement';// 6 结算

/** 企业（用户所属组织，可多个 —— FR-007）。 */
export interface Enterprise {
  id: string;
  name: Record<Lang, string>;
  country: 'RU' | 'CN';
  role: RoleCode;
  inn?: string;
}

/** 当前用户。 */
export interface UserProfile {
  id: string;
  name: string;
  position: Record<Lang, string>;
  phone: string;
  email: string;
  roles: RoleCode[];
  enterprises: Enterprise[];
  activeEnterpriseId: string;
}

/** 商品。 */
export interface Goods {
  id: string;
  name: Record<Lang, string>;
  unit: string;
  hsCode?: string;
}

/**
 * 商品挂牌（商品目录里的一个货盘条目）。
 *
 * 对应 FR-013「从商品目录选择商品」以及 1.html 里的「热门货盘」卡片：
 * 商品目录需要价格、起订量、产地这些采购方真正会看的字段。
 */
export interface GoodsListing {
  id: string;
  goods: Goods;
  price: number;
  currency: 'CNY' | 'RUB' | 'USD';
  /** 价格单位，例如「/ 台」「/ kg」。 */
  priceUnit: string;
  /** 起订量。 */
  moq: number;
  origin: Record<Lang, string>;
  inStock: boolean;
  wholesale: boolean;
  supplier: string;
}

/** 时间线的一个节点（物流轨迹、业务动态都用它）。 */
export interface TimelineEvent {
  id: string;
  title: Record<Lang, string>;
  place?: Record<Lang, string>;
  time: string;
  /** done = 已发生（深色），current = 当前节点（高亮），pending = 未发生（浅色）。 */
  state: 'done' | 'current' | 'pending';
}

/**
 * 汇率（CNY/RUB）。
 *
 * ⚠️ 演示数据：真实实现应取服务端接口（或第三方汇率源），
 * 页面上必须标出来源与更新时间，不能像原型的「实时汇率」那样硬编码却称实时。
 */
export interface ExchangeRate {
  base: string;
  quote: string;
  value: number;
  changePct: number;
  updatedAt: string;
  /** 数据来源标记；骨架阶段固定为 mock。 */
  source: 'mock' | 'api';
}

/** 询价单商品行。 */
export interface RfqLine {
  id: string;
  goods: Goods;
  qty: number;
  unit: string;
}

/** 询价单（FR-012/013）。 */
export interface Rfq {
  id: string;
  no: string;
  counterparty: string;
  status: 'open' | 'quoted' | 'accepted' | 'closed';
  deadline: string;
  lines: RfqLine[];
  quotes: Quote[];
}

/** 报价（FR-014/015）。 */
export interface Quote {
  id: string;
  supplier: string;
  price: number;
  currency: 'CNY' | 'RUB' | 'USD';
  leadTimeDays: number;
  incoterms: string;
  accepted?: boolean;
}

/** 订单商品行。 */
export interface OrderLine {
  id: string;
  goods: Goods;
  qty: number;
  price: number;
  unit: string;
}

/** 履约阶段（FR-018）。 */
export interface Milestone {
  id: string;
  name: Record<Lang, string>;
  plannedDate: string;
  actualDate?: string;
  done: boolean;
  note?: string;
}

/** 发货批次（FR-019）。 */
export interface Batch {
  id: string;
  no: string;
  qty: number;
  shipDate: string;
  status: 'planned' | 'shipped' | 'delivered';
}

/** 订单（FR-016/017）。 */
export interface Order {
  id: string;
  no: string;
  counterparty: string;
  amount: number;
  currency: 'CNY' | 'RUB' | 'USD';
  stage: DealStage;
  status: 'active' | 'paused' | 'done';
  updatedAt: string;
  lines: OrderLine[];
  milestones: Milestone[];
  batches: Batch[];
  docIds: string[];
}

/** 单证（FR-021–025）。 */
export interface TradeDocument {
  id: string;
  type: string;
  typeLabel: Record<Lang, string>;
  orderNo: string;
  validUntil: string;
  status: 'ok' | 'expiring' | 'missing';
  cached: boolean;
}

/** 运输批次跟踪（FR-026/027）。 */
export interface Shipment {
  id: string;
  batchNo: string;
  orderNo: string;
  status: Record<Lang, string>;
  routeFrom: string;
  routeTo: string;
  crossings: string[];
  eta: string;
  driverPhone: string;
}

/** 账单（FR-030/031）。 */
export interface Invoice {
  id: string;
  no: string;
  orderNo: string;
  amount: number;
  currency: 'CNY' | 'RUB' | 'USD';
  dueDate: string;
  paid: boolean;
  paidDate?: string;
  reference?: string;
}

/** 会话消息（FR-034–036）。 */
export interface ChatMessage {
  id: string;
  /** 原文语言。 */
  from: Lang;
  /** 原文。 */
  text: string;
  /** 自动翻译结果（目标语言）。 */
  translation: string;
  /** 是否为自己发出。 */
  mine: boolean;
  time: string;
}

/** 会话（绑定到订单或询价 —— FR-034）。 */
export interface Conversation {
  id: string;
  subject: string;
  boundTo: string;
  counterparty: string;
  unread: number;
  lastTime: string;
  messages: ChatMessage[];
}

/** 待办任务（FR-009）。 */
export interface TaskItem {
  id: string;
  title: Record<Lang, string>;
  due: string;
  priority: Priority;
  kind: 'quote' | 'milestone' | 'document' | 'payment';
  done: boolean;
}

/** 通知（FR-040）。 */
export interface AppNotification {
  id: string;
  title: Record<Lang, string>;
  body: Record<Lang, string>;
  time: string;
  read: boolean;
  module: ModuleCode;
}

/** 待同步操作（FR-042）。 */
export interface QueuedOperation {
  id: string;
  label: Record<Lang, string>;
  createdAt: string;
  status: 'pending' | 'syncing' | 'failed';
}

/** 版本冲突（FR-044）。 */
export interface VersionConflict {
  id: string;
  objectLabel: Record<Lang, string>;
  localUpdatedAt: string;
  serverUpdatedAt: string;
  localSummary: Record<Lang, string>;
  serverSummary: Record<Lang, string>;
}
