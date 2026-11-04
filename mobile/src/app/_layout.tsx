import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { LangProvider } from '../context/LangContext';
import { SyncProvider } from '../context/SyncContext';
import { COLORS } from '../theme/theme';

/**
 * 应用根布局。
 *
 * 三层状态提供者的顺序有意义：
 *   1. LangProvider  —— 语言，最先，所有文案都依赖它；
 *   2. AuthProvider  —— 登录态与所属企业；
 *   3. SyncProvider  —— 离线队列与同步（依赖登录态，故在其后）。
 *
 * 页面栈用 Stack，底部导航在 (tabs) 分组里单独实现（FR-002）。
 * 所有页面自带标题栏，因此这里统一 headerShown: false。
 */
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LangProvider>
        <AuthProvider>
          <SyncProvider>
            <StatusBar style="dark" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: COLORS.background },
              }}
            />
          </SyncProvider>
        </AuthProvider>
      </LangProvider>
    </SafeAreaProvider>
  );
}
