import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CONFLICTS, QUEUE } from '../data/mock';
import type { QueuedOperation, VersionConflict } from '../types/models';

/**
 * 离线与同步上下文（FM10 —— Web 端没有的模块）。
 *
 * FR-041 无网可用、FR-042 待同步操作队列、FR-043 自动同步、FR-044 冲突处理。
 *
 * 骨架行为：用一个 `online` 开关模拟网络状态（页面上可直接切换，便于演示），
 * 队列与冲突用 mock 数据填充。真实实现时：
 *   - 网络状态改用 @react-native-community/netinfo 监听；
 *   - 队列持久化到 op-sqlite；
 *   - `syncNow()` 调 POST /api/sync/ 批量提交，并携带幂等键。
 */

type SyncContextValue = {
  /** 当前是否有网络。 */
  online: boolean;
  setOnline: (next: boolean) => void;
  /** 待同步操作队列。 */
  queue: QueuedOperation[];
  /** 版本冲突列表。 */
  conflicts: VersionConflict[];
  /** 上次成功同步时间；null 表示从未同步。 */
  lastSyncAt: string | null;
  /** 是否正在同步。 */
  syncing: boolean;
  /** 触发一次同步（FR-043）。 */
  syncNow: () => void;
};

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export function SyncProvider({ children }: { children: React.ReactNode }) {
  // 默认离线：移动端的典型场景就是无网，先让演示看到离线态提示。
  const [online, setOnline] = useState(false);
  const [queue, setQueue] = useState<QueuedOperation[]>(QUEUE);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>('2026-10-11 08:30');
  const [syncing, setSyncing] = useState(false);

  const syncNow = useCallback(() => {
    if (syncing) return;
    setSyncing(true);
    // 骨架：延迟 900 ms 后把队列清空，模拟一次成功同步。
    setTimeout(() => {
      setQueue([]);
      setLastSyncAt(new Date().toISOString().slice(0, 16).replace('T', ' '));
      setSyncing(false);
    }, 900);
  }, [syncing]);

  const value = useMemo(
    () => ({
      online,
      setOnline,
      queue,
      conflicts: CONFLICTS,
      lastSyncAt,
      syncing,
      syncNow,
    }),
    [online, queue, lastSyncAt, syncing, syncNow],
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync(): SyncContextValue {
  const ctx = useContext(SyncContext);
  if (!ctx) {
    throw new Error('useSync должен вызываться внутри <SyncProvider>');
  }
  return ctx;
}
