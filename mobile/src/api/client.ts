/**
 * 服务端接口客户端（骨架）。
 *
 * ⚠️ 重要前提：现有 Django 后端（`course_project`）目前**只有服务端渲染的
 * HTML 页面，没有 REST/JSON 接口**（`requirements.txt` 里只有 Django，
 * 没有 Django REST Framework，全部视图返回 HttpResponse）。
 *
 * 因此移动端要真正联网，必须先在服务端补一层 API。本文件先把
 * 「移动端需要哪些接口、请求长什么样、令牌怎么带」定下来，
 * 骨架阶段全部走 `USE_MOCK = true` 的本地数据。
 *
 * 服务端需要补的接口（与 Web 端 43 个页面一一对应，只是输出 JSON）：
 *
 *   POST /api/auth/login/            账号密码登录，返回 access/refresh 令牌
 *   POST /api/auth/refresh/          刷新令牌
 *   GET  /api/me/                    当前用户 + 所属企业列表（FR-007）
 *   GET  /api/orders/                订单列表，支持 ?status=&role=&q=（FR-016）
 *   GET  /api/orders/{id}/           订单详情（含商品行/阶段/批次/单证）（FR-017）
 *   POST /api/orders/{id}/milestones/ 阶段打卡（FR-018）
 *   POST /api/orders/{id}/batches/   发货批次（FR-019）
 *   POST /api/orders/{id}/exceptions/ 异常上报（FR-020）
 *   GET  /api/rfqs/                  询价列表（FR-012）
 *   POST /api/rfqs/                  发起询价（FR-013）
 *   GET  /api/rfqs/{id}/quotes/      报价比价（FR-014）
 *   POST /api/quotes/{id}/accept/    接受报价（FR-015）
 *   GET  /api/documents/             单证列表（FR-022/023/025）
 *   POST /api/documents/upload/      单证上传（multipart，FR-022）
 *   GET  /api/shipments/{id}/        运输跟踪（FR-026/027）
 *   GET  /api/invoices/              账单（FR-030/031）
 *   GET  /api/conversations/         会话列表（FR-034）
 *   POST /api/conversations/{id}/messages/ 发消息（FR-035，服务端返回译文）
 *   GET  /api/notifications/         通知中心（FR-040）
 *   POST /api/sync/                  批量提交离线队列（FR-042/043）
 */

import { Platform } from 'react-native';

/** 骨架阶段为 true：所有页面读本地 mock，不发网络请求。 */
export const USE_MOCK = true;

/**
 * 服务端地址。
 * - Android 模拟器访问宿主机用 10.0.2.2（不是 localhost）
 * - iOS 模拟器与 Web 直接用 localhost
 * - 真机联调时改成电脑在局域网里的 IP，例如 http://192.168.1.20:8000
 */
export const API_BASE_URL =
  Platform.select({
    android: 'http://10.0.2.2:8000',
    default: 'http://127.0.0.1:8000',
  }) ?? 'http://127.0.0.1:8000';

export const API_PREFIX = '/api';

/** 统一的请求选项。 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** 访问令牌；服务端应放在 Authorization: Bearer 头里。 */
  token?: string | null;
  /** 离线队列里的操作需要幂等键，避免重复提交。 */
  idempotencyKey?: string;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 基础请求函数。
 * 骨架阶段直接抛错，避免误以为已经在联网；接入服务端时删掉这个判断即可。
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (USE_MOCK) {
    throw new ApiError(
      0,
      `[skeleton] ${options.method ?? 'GET'} ${path} — интерфейс ещё не подключён, данные берутся из src/data/mock.ts`,
    );
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;

  const response = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new ApiError(response.status, `${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}
