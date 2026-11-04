/**
 * 移动端模块注册表（单一数据源）。
 *
 * 与 Web 端 `core/pages.py` 的 PAGES 注册表是同一套思路：
 * 把「模块 → 名称 → 需求 → 页面路由」集中声明在一处，
 * 底部导航、工作台、设置页、骨架说明页都从这里取数据，
 * 新增模块时不需要在多处改代码。
 *
 * 数据来源：`docs/mobile/mobileapp.zh.md` 表 7 / 表 21 / 附录 Б。
 */

import type { ModuleCode, Priority } from '../types/models';
import type { Lang } from '../i18n/strings';

export interface MobileModule {
  /** 模块代码 FM0–FM11。 */
  code: ModuleCode;
  /** 三语名称。 */
  name: Record<Lang, string>;
  /** 对应的 Web 端模块代码（M0–M11），无对应时为 null（FM10）。 */
  webModule: string | null;
  /** 该模块的功能需求条数。 */
  frCount: number;
  /** 需求编号列表。 */
  frCodes: string[];
  /** 优先级分布。 */
  priorities: Record<Priority, number>;
  /** 归属的底部导航分区；无分区表示通过二级页面进入。 */
  tab: 'workbench' | 'orders' | 'messages' | 'profile' | null;
  /** 骨架里对应的入口路由（expo-router 路径）。 */
  route: string;
  /** 一句话职责说明。 */
  summary: Record<Lang, string>;
}

export const MOBILE_MODULES: MobileModule[] = [
  {
    code: 'FM0',
    name: { ru: 'Общие экраны и навигация', zh: '通用与导航', en: 'Common screens and navigation' },
    webModule: 'M0',
    frCount: 3,
    frCodes: ['FR-001', 'FR-002', 'FR-003'],
    priorities: { high: 2, medium: 1, low: 0 },
    tab: null,
    route: '/',
    summary: {
      ru: 'Стартовый экран, нижняя навигация и глобальный поиск.',
      zh: '启动页、底部导航与全局搜索，其余模块赖以运行的骨架。',
      en: 'Launch screen, bottom navigation and global search.',
    },
  },
  {
    code: 'FM1',
    name: { ru: 'Аутентификация и профиль', zh: '认证与账号', en: 'Authentication and profile' },
    webModule: 'M1',
    frCount: 4,
    frCodes: ['FR-004', 'FR-005', 'FR-006', 'FR-007'],
    priorities: { high: 2, medium: 2, low: 0 },
    tab: 'profile',
    route: '/login',
    summary: {
      ru: 'Вход по паролю и биометрии, профиль, смена предприятия.',
      zh: '密码登录、生物识别、个人资料与切换所属企业。',
      en: 'Password and biometric sign-in, profile, enterprise switching.',
    },
  },
  {
    code: 'FM2',
    name: { ru: 'Главный экран и задачи', zh: '工作台与待办', en: 'Workbench and tasks' },
    webModule: 'M8',
    frCount: 4,
    frCodes: ['FR-008', 'FR-009', 'FR-010', 'FR-011'],
    priorities: { high: 2, medium: 2, low: 0 },
    tab: 'workbench',
    route: '/(tabs)',
    summary: {
      ru: 'Показатели, задачи на сегодня, быстрые действия и лента событий.',
      zh: '关键指标、今日待办、快捷操作与业务动态时间线。',
      en: 'KPIs, today’s tasks, quick actions and activity feed.',
    },
  },
  {
    code: 'FM3',
    name: { ru: 'Запросы и предложения', zh: '询价与报价', en: 'RFQs and quotes' },
    webModule: 'M3',
    frCount: 4,
    frCodes: ['FR-012', 'FR-013', 'FR-014', 'FR-015'],
    priorities: { high: 3, medium: 1, low: 0 },
    tab: 'orders',
    route: '/rfq',
    summary: {
      ru: 'Список запросов, создание с телефона, сравнение и принятие предложений.',
      zh: '询价列表、手机端发起询价、比价并接受报价。',
      en: 'RFQ list, mobile RFQ creation, quote comparison and acceptance.',
    },
  },
  {
    code: 'FM4',
    name: { ru: 'Заказы и исполнение', zh: '订单与履约', en: 'Orders and fulfilment' },
    webModule: 'M4',
    frCount: 5,
    frCodes: ['FR-016', 'FR-017', 'FR-018', 'FR-019', 'FR-020'],
    priorities: { high: 3, medium: 2, low: 0 },
    tab: 'orders',
    route: '/orders',
    summary: {
      ru: 'Список и карточка заказа, отметка этапов, партии, регистрация проблем.',
      zh: '订单列表与详情、阶段打卡、发货批次与异常上报。',
      en: 'Order list and detail, stage check-in, batches, issue reporting.',
    },
  },
  {
    code: 'FM5',
    name: { ru: 'Документы и сканирование', zh: '单证与扫码', en: 'Documents and scanning' },
    webModule: 'M6',
    frCount: 5,
    frCodes: ['FR-021', 'FR-022', 'FR-023', 'FR-024', 'FR-025'],
    priorities: { high: 3, medium: 2, low: 0 },
    tab: 'orders',
    route: '/documents',
    summary: {
      ru: 'Сканирование кодов, фотофиксация документов, комплектность, сроки, офлайн.',
      zh: '条码二维码扫描、拍照上传、齐备性检查、到期提醒与离线查看。',
      en: 'Code scanning, photo capture, completeness, expiry, offline access.',
    },
  },
  {
    code: 'FM6',
    name: { ru: 'Логистика и отслеживание', zh: '物流与跟踪', en: 'Logistics and tracking' },
    webModule: 'M5',
    frCount: 4,
    frCodes: ['FR-026', 'FR-027', 'FR-028', 'FR-029'],
    priorities: { high: 1, medium: 1, low: 2 },
    tab: 'orders',
    route: '/logistics',
    summary: {
      ru: 'Статус перевозки, маршрут с пунктами пропуска, расчёт стоимости, связь с водителем.',
      zh: '运输状态、含口岸的路线、运费试算与联系司机。',
      en: 'Shipment status, route with crossings, freight estimate, driver contact.',
    },
  },
  {
    code: 'FM7',
    name: { ru: 'Расчёты и сверка', zh: '结算与对账', en: 'Settlements and reconciliation' },
    webModule: 'M10',
    frCount: 4,
    frCodes: ['FR-030', 'FR-031', 'FR-032', 'FR-033'],
    priorities: { high: 1, medium: 2, low: 1 },
    tab: 'orders',
    route: '/billing',
    summary: {
      ru: 'Счета и оплата, подтверждение поступления, сверка по заказу, экспорт PDF.',
      zh: '账单与付款、到账确认、按订单对账与导出 PDF。',
      en: 'Invoices and payments, receipt confirmation, reconciliation, PDF export.',
    },
  },
  {
    code: 'FM8',
    name: { ru: 'Сообщения и перевод', zh: '消息与翻译', en: 'Messages and translation' },
    webModule: 'M7',
    frCount: 4,
    frCodes: ['FR-034', 'FR-035', 'FR-036', 'FR-037'],
    priorities: { high: 3, medium: 0, low: 1 },
    tab: 'messages',
    route: '/chat',
    summary: {
      ru: 'Диалоги внутри сделки, текст/фото/файлы, автоперевод, шаблоны фраз.',
      zh: '与业务绑定的会话、发送文字图片文件、自动翻译与常用语模板。',
      en: 'Deal-bound conversations, text/photo/files, auto-translation, phrases.',
    },
  },
  {
    code: 'FM9',
    name: { ru: 'Уведомления и push', zh: '通知与推送', en: 'Notifications and push' },
    webModule: 'M8',
    frCount: 3,
    frCodes: ['FR-038', 'FR-039', 'FR-040'],
    priorities: { high: 1, medium: 2, low: 0 },
    tab: 'profile',
    route: '/notifications',
    summary: {
      ru: 'Push о событиях сделки, настройка категорий, центр уведомлений.',
      zh: '业务事件推送、通知分类设置与应用内通知中心。',
      en: 'Deal event push, category settings, in-app notification centre.',
    },
  },
  {
    code: 'FM10',
    name: { ru: 'Офлайн-режим и синхронизация', zh: '离线与同步', en: 'Offline mode and sync' },
    webModule: null,
    frCount: 4,
    frCodes: ['FR-041', 'FR-042', 'FR-043', 'FR-044'],
    priorities: { high: 3, medium: 1, low: 0 },
    tab: 'profile',
    route: '/settings/sync',
    summary: {
      ru: 'Работа без сети, очередь операций, автосинхронизация, конфликты версий.',
      zh: '无网可用、待同步队列、自动同步与版本冲突处理。Web 端没有的模块。',
      en: 'Offline reading, operation queue, auto-sync, version conflicts.',
    },
  },
  {
    code: 'FM11',
    name: { ru: 'Настройки и администрирование', zh: '设置与管理', en: 'Settings and administration' },
    webModule: 'M11',
    frCount: 4,
    frCodes: ['FR-045', 'FR-046', 'FR-047', 'FR-048'],
    priorities: { high: 1, medium: 3, low: 0 },
    tab: 'profile',
    route: '/settings',
    summary: {
      ru: 'Смена языка, справочники, журнал операций, пользователи и права.',
      zh: '界面语言切换、字典维护、操作日志与用户权限管理。',
      en: 'Language switch, dictionaries, audit log, users and rights.',
    },
  },
];

/** 统计：模块数、需求总数、优先级分布。 */
export const MODULE_STATS = {
  modules: MOBILE_MODULES.length,
  requirements: MOBILE_MODULES.reduce((sum, m) => sum + m.frCount, 0),
  high: MOBILE_MODULES.reduce((sum, m) => sum + m.priorities.high, 0),
  medium: MOBILE_MODULES.reduce((sum, m) => sum + m.priorities.medium, 0),
  low: MOBILE_MODULES.reduce((sum, m) => sum + m.priorities.low, 0),
};

/** 按模块代码取模块。 */
export function moduleOf(code: ModuleCode): MobileModule | undefined {
  return MOBILE_MODULES.find((m) => m.code === code);
}

/** 取某模块的三语名称。 */
export function moduleName(code: ModuleCode, lang: Lang): string {
  return moduleOf(code)?.name[lang] ?? code;
}
