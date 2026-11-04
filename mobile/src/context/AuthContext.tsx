import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CURRENT_USER, ENTERPRISES } from '../data/mock';
import type { Enterprise, UserProfile } from '../types/models';

/**
 * 认证与账号上下文（FM1）。
 *
 * FR-004 账号密码登录、FR-005 生物识别快速登录、FR-007 切换所属企业。
 *
 * 骨架行为：`signIn()` 不请求服务端，直接把状态置为已登录，
 * 便于演示导航流程。真实实现时把它换成 `api/client.ts` 的
 * POST /api/auth/login/，并把返回的令牌写进 Keychain / Keystore
 * （NFR-06：令牌不得落到日志里）。
 */

type AuthContextValue = {
  /** 是否已登录。未登录时根布局会把用户送到 /login。 */
  signedIn: boolean;
  user: UserProfile;
  activeEnterprise: Enterprise;
  /** 是否已启用生物识别（FR-005）。 */
  biometricEnabled: boolean;
  signIn: () => void;
  signOut: () => void;
  switchEnterprise: (id: string) => void;
  setBiometricEnabled: (on: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const signIn = useCallback(() => setSignedIn(true), []);
  const signOut = useCallback(() => setSignedIn(false), []);

  const switchEnterprise = useCallback((id: string) => {
    setUser((prev) => ({ ...prev, activeEnterpriseId: id }));
  }, []);

  const activeEnterprise = useMemo(
    () => user.enterprises.find((e) => e.id === user.activeEnterpriseId) ?? ENTERPRISES[0],
    [user],
  );

  const value = useMemo(
    () => ({
      signedIn,
      user,
      activeEnterprise,
      biometricEnabled,
      signIn,
      signOut,
      switchEnterprise,
      setBiometricEnabled,
    }),
    [signedIn, user, activeEnterprise, biometricEnabled, signIn, signOut, switchEnterprise],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth должен вызываться внутри <AuthProvider>');
  }
  return ctx;
}
