import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lang, translate } from '../i18n/strings';

/**
 * 界面语言上下文（FM11 / FR-045）。
 *
 * 对照 1.html 的整改表，这一块要满足三件事：
 *
 *   1. 全文翻译字典 —— 所有文案走 `t(key)`，字典在 `src/i18n/strings.ts`，
 *      `tools/check-i18n.mjs` 负责保证三语不残缺。
 *   2. 保存语言偏好 —— 选择写进 AsyncStorage（原生）与 localStorage（Web），
 *      下次打开仍是上次选的语言，而不是每次都回到默认值。
 *   3. 同步 html.lang —— Web 上同步 `<html lang>`，读屏与浏览器断词、
 *      字体回退都依赖这个属性；原生端没有 DOM，这一步自动跳过。
 *
 * 切换语言只改状态、不重启应用：`lang` 一变，订阅它的页面重新渲染。
 */

type LangContextValue = {
  lang: Lang;
  /** 取文案。 */
  t: (key: string) => string;
  setLang: (next: Lang) => void;
  /** 是否已从存储里读完偏好（读完前不要覆盖用户已存的值）。 */
  ready: boolean;
};

const STORAGE_KEY = 'sinorus.lang';
const SUPPORTED: Lang[] = ['ru', 'zh', 'en'];

const LangContext = createContext<LangContextValue | undefined>(undefined);

function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (SUPPORTED as string[]).includes(value);
}

/**
 * Web 预览时允许用 ?lang=zh 直接指定语言 —— 答辩演示中
 * 想直接打开中文界面给老师看时很有用。原生端没有 URL，直接忽略。
 */
function langFromUrl(): Lang | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('lang');
  return isLang(value) ? value : null;
}

/** 同步 <html lang>，让浏览器与读屏知道当前语言。 */
function syncHtmlLang(lang: Lang) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  // 默认俄语：面向俄罗斯高校答辩场景，演示时先看到俄文界面。
  const [lang, setLangState] = useState<Lang>(() => langFromUrl() ?? 'ru');
  const [ready, setReady] = useState(false);

  // 启动时读回上次选择；URL 参数优先级最高（显式指定 > 上次保存 > 默认）。
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && isLang(saved) && !langFromUrl()) {
          setLangState(saved);
        }
      } catch {
        // 读不到就用默认值，不阻塞启动。
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // html.lang 随语言走（含首帧）。
  useEffect(() => {
    syncHtmlLang(lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    // 写失败也不影响本次会话，只影响「下次记住」。
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  const value = useMemo(() => ({ lang, t, setLang, ready }), [lang, t, setLang, ready]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error('useLang должен вызываться внутри <LangProvider>');
  }
  return ctx;
}
