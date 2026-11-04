# SinoRus TradeLite — 移动端页面骨架

面向中俄跨境贸易协同平台的移动应用。**当前交付的是页面骨架**：
版式、导航、主题、三语本地化与数据结构已经就位，业务逻辑与服务端请求为占位实现。

> 俄语版：**[README.md](README.md)**

- **课程**：《移动应用开发技术》· ВлГУ
- **项目**：「SinoRus TradeLite」轻量级中俄跨境贸易协同平台
- **配套后端**：Django 4.2.30（`Python Web/course_project`）
- **所处阶段**：应用页面与导航设计（功能需求列表之后）

---

## 一、先看清后端：这是一个什么样的项目

动手写页面之前，先把 `course_project` 读了一遍，结论直接决定了移动端怎么做：

| 项目事实 | 对移动端的影响 |
|---|---|
| Django 4.2.30 + SQLite，**只有 Django Templates** | 后端目前只吐 HTML，移动端拿不到数据 |
| `requirements.txt` 里没有 DRF，没有任何视图返回 JSON | **必须先在后端补一层 API**，否则移动端无法联网 |
| 12 个应用（core / accounts / catalog / trading / logistics / documents / messaging / tasks / analytics / billing / system） | 移动端的 12 个模块 FM0–FM11 基本与之对应 |
| 43 个页面 / 12 个模块，由 `core/pages.py` 注册表驱动 | 移动端沿用「注册表驱动」的思路（`src/data/modules.ts`） |
| 9 大类 56 个领域实体 | 移动端只取其中用得到的字段（`src/types/models.ts`） |
| 三语机制（ru/zh/en，`core/i18n.py`） | 移动端同样做三语（`src/i18n/strings.ts`） |

需求侧看的是 `docs/mobile/mobileapp.zh.md`（第一阶段交付物）：
**12 个模块、48 条功能需求、12 条非功能需求**，技术栈已经选定 React Native。
所以移动端的页面清单不是拍脑袋定的，而是逐条对着需求编号来的。

## 二、已经做出来的东西

| 已完成 | 实现方式 |
|---|---|
| 项目骨架 | Expo SDK 54 + Expo Router 6（文件路由）+ TypeScript（strict） |
| 底部导航 4 个分区 | `src/app/(tabs)/` — 对应 FR-002 |
| 约 32 个页面 | FM0–FM11 每个模块都至少有一个页面 |
| 主题令牌 | `src/theme/theme.ts`，配色与 Web 端 `style.css` 同源；字号 / 圆角 / 间距 / 阴影 / 触控规格都只有「令牌里那几档」 |
| 响应式栅格 | `src/hooks/useResponsive.ts`，按窗口宽度算列数（竖屏 2 列、横屏 3 列、平板 3–4 列）—— 对应 NFR-05 |
| 三语本地化 | `src/i18n/strings.ts` + `LangContext`，211 键 × 3 语言，切换不重启（FR-045） |
| 组件库 | 19 个复用组件（卡片、指标磁贴、列表行、状态标签、表单字段、离线提示条、阶段进度、汇率卡、快捷入口、时间线、商品卡、筛选药丸、数据来源说明…） |
| 领域类型 | `src/types/models.ts`，按后端实体定义 |
| 演示数据 | `src/data/mock.ts`，每个实体都有贴近业务的样例 |
| 模块注册表 | `src/data/modules.ts`，12 模块 / 48 需求 / 优先级分布 |
| API 契约 | `src/api/client.ts`，列明后端需要补的 21 个接口 |

## 三、还没做的（也就是接下来的活）

1. **后端还没有 API。** 现有 Django 是纯服务端渲染，没有 DRF、没有 JSON 视图。
   移动端在服务端补出 API 层之前，物理上连不上。
   需要补哪些接口、URL 怎么设计，已经写在 `src/api/client.ts` 里。
2. **技术栈里的库还没接。** Redux Toolkit / RTK Query、op-sqlite、Vision Camera、
   FCM / APNs、i18next、Keychain / Keystore、Jest / Detox 目前都用**无原生依赖的
   替代实现**，目的是让骨架能直接在 Expo Go 里跑起来。替换点都在代码注释里标了。
3. **业务逻辑为空。** 表单提交不落到任何地方，没有字段校验；
   离线队列与冲突处理只做了界面演示，没有真正持久化。
4. **原生模块需要 dev-build。** 地图（react-native-maps）和相机（Vision Camera）
   在 Expo Go 里跑不了，需要 `npx expo prebuild` 后在真机/模拟器上构建。

## 四、怎么跑起来

```bash
cd mobile
npm install
npm start               # 启动开发服务器（自动选对局域网 IP）
npm run start:tunnel    # 扫码连不上时走隧道，跨网络也能连
npm run start:usb       # 走 USB：先 adb reverse tcp:8081 tcp:8081
npm run typecheck       # 类型检查
npm run check:i18n      # 三语文案完整性自检（漏译会报错）
```

**按 `w` 开网页是最快的查看方式**：骨架在浏览器里能完整跑通，
不用真机也能把各个页面逐个点一遍。

### 扫码连不上？多半是选错了网卡

`npm start` 不是 `npx expo start` 的别名，它多干了一件事：**挑对局域网 IP**。

Expo 取的是系统里第一个非回环 IPv4。电脑上如果装了代理（Clash / Mihomo 的 TUN
模式会建一张 `198.18.0.1` 的虚拟网卡）、VirtualBox、VMware，这个地址很容易被排到
最前面，二维码就变成 `exp://198.18.0.1:8081` —— 那是电脑内部的地址，手机永远连不上。

`tools/start.mjs` 的做法：排除 `127/8`、`169.254/16`（APIPA）、`198.18/15`（代理
fake-IP 段），排除 VirtualBox / VMware / Hyper-V / Docker 等虚拟网卡，优先 WLAN /
以太网，再把结果写进 `REACT_NATIVE_PACKAGER_HOSTNAME` 后启动 Expo。启动时会打印
实际使用的地址和忽略掉的网卡：

```
  局域网地址：192.168.0.108  (WLAN 2)
  已忽略：198.18.0.1 Mihomo、192.168.56.1 以太网 3
  手机需与电脑连同一个 Wi-Fi，扫码后访问 exp://192.168.0.108:8081
```

三种模式按网络环境选：

| 命令 | 适用场景 |
|---|---|
| `npm start` | 手机和电脑连同一个 Wi-Fi（默认） |
| `npm run start:tunnel` | 不在同一网段、公司网络隔离、用热点；首次会提示安装 `@expo/ngrok` |
| `npm run start:usb` | Android 插 USB：先 `adb reverse tcp:8081 tcp:8081`，再在 Expo Go 里手动打开 `exp://127.0.0.1:8081` |

`npm start` 还会顺带生成 `qr-dev.png`（1200px、纯黑白、四周留 4 个模块白边）。
终端里那个二维码是拿字符方块拼的，实测只有 216×216 像素、白边不足 4 个模块；
而且只要终端字符格不是严格的 1:2，它就会被拉成长方形（实测被拉到 216×332），
手机一律扫不出。**判断标准很简单：终端里的二维码看着不是正方形，就扫不出来。**
不想折腾终端字体，直接全屏打开 `qr-dev.png` 扫。

还连不上就按这个顺序查：手机与电脑是否同一个 Wi-Fi（不少路由器的「访客网络」会隔离
客户端）→ 防火墙是否放行 8081（本项目已加 TCP 8081-8112 规则）→ Expo Go 是否最新
（当前版本对应 SDK 58）。

### 不想装依赖？用已经导出的静态站点

仓库里已经有一份导出的 Web 站点（`dist/`，已被 .gitignore 忽略），
配一个做路径映射的小服务器就能直接看：

```bash
npm run preview                                    # 重新导出到 dist/
python tools/preview-server.py                     # 打开 http://127.0.0.1:8125/
```

`tools/preview-server.py` 存在的原因：`expo export` 产出的是 `workbench.html`
这类带后缀的文件，而应用内路由读的是 `/workbench`，直接用
`python -m http.server` 会得到 "Unmatched Route"。这个脚本负责把
路径映射到文件，并在找不到时回退给客户端路由（动态路由要靠它）。

## 五、目录结构

```
mobile/
├── app.json            Expo 配置（应用名、scheme、包名）
├── package.json        依赖
├── tsconfig.json       strict + 路径别名 @/* → src/*
└── src/
    ├── app/            路由（Expo Router：一个文件 = 一个路由）
    │   ├── _layout.tsx         根栈 + 三个状态提供者
    │   ├── index.tsx           启动页 · FR-001
    │   ├── login.tsx           FM1 · FR-004/005
    │   ├── (tabs)/             底部导航 · FR-002
    │   ├── orders/[id]/        订单详情 + FM4 的三个操作页
    │   ├── rfq/                FM3：列表、发起、比价
    │   ├── catalog.tsx         FM3 · FR-013 商品目录（栅格 + 筛选）
    │   ├── goods/[id].tsx      FM3 · FR-013 商品详情
    │   ├── documents/          FM5：单证列表、拍照上传
    │   ├── logistics/          FM6：物流主页 + track.tsx 按单号查询
    │   ├── billing/            FM7
    │   ├── chat/[id].tsx       FM8：带翻译的会话
    │   ├── settings/           FM9 / FM10 / FM11
    │   ├── scan.tsx            FM5 · FR-021
    │   ├── search.tsx          FM0 · FR-003
    │   ├── tasks.tsx           FM2 · FR-009
    │   └── about.tsx           模块地图（答辩用）
    ├── components/     19 个复用组件
    ├── context/        LangContext、AuthContext、SyncContext
    ├── data/           modules.ts（注册表）、mock.ts（数据）
    ├── hooks/          useResponsive.ts（响应式栅格）、useQuickActions.ts（快捷入口）
    ├── i18n/           strings.ts（ru/zh/en，211 个键）
    ├── theme/          theme.ts（令牌）、styles.ts（通用样式）
    ├── types/          models.ts（领域类型）
    └── utils/          format.ts（金额、日期、汇率、状态色）
├── tools/
│   ├── check-i18n.mjs      三语文案完整性自检
│   └── preview-server.py   本地预览静态站点
└── web-preview/        已导出的 Web 站点（构建产物，git 忽略）
```

## 六、模块 → 页面 对照

| 模块 | 名称 | 需求 | 路由 |
|---|---|---|---|
| FM0 | 通用与导航 | FR-001…003 | `/`、`/login`、`/search` |
| FM1 | 认证与账号 | FR-004…007 | `/login`、`/profile` |
| FM2 | 工作台与待办 | FR-008…011 | `/workbench`、`/tasks` |
| FM3 | 询价与报价 | FR-012…015 | `/rfq`、`/rfq/new`、`/rfq/[id]`、`/catalog`、`/goods/[id]` |
| FM4 | 订单与履约 | FR-016…020 | `/orders`、`/orders/[id]` + 3 个操作页 |
| FM5 | 单证与扫码 | FR-021…025 | `/documents`、`/documents/upload`、`/scan` |
| FM6 | 物流与跟踪 | FR-026…029 | `/logistics`、`/logistics/track` |
| FM7 | 结算与对账 | FR-030…033 | `/billing` |
| FM8 | 消息与翻译 | FR-034…037 | `/messages`、`/chat/[id]` |
| FM9 | 通知与推送 | FR-038…040 | `/notifications`、`/settings/notifications` |
| FM10 | 离线与同步 | FR-041…044 | `/settings/sync` |
| FM11 | 设置与管理 | FR-045…048 | `/settings`、`/settings/language`、`/settings/admin` |

## 七、开发分几步、每步干什么

每个页面底部都有一个虚线框「КАРКАС / 骨架」，写明这一页对应哪条需求、
还差什么。下面的十步就是把这些虚线框汇总起来的结果。

| 步骤 | 这一步做什么 | 做完的标志 |
|---|---|---|
| **1. 读后端 + 读需求** | 摸清 Django 的 12 个应用 / 43 个页面 / 56 个实体；读第一阶段 48 条需求，确定移动端到底要有哪些页面 | 拿到一份「需求编号 → 页面」的清单 |
| **2. 起项目 + 定主题** | Expo + Expo Router + TypeScript 初始化；把颜色、间距、圆角、字号抽成令牌 | 应用能启动，视觉风格统一 |
| **3. 搭导航骨架** | 根栈 + 启动页（FR-001）+ 底部四个分区（FR-002）+ 未登录跳转 | 四个分区之间能来回切，登录/退出闭环 |
| **4. 建组件库** | 13 个基础组件：卡片、指标磁贴、列表行、状态标签、表单字段、离线提示条、阶段进度条… | 页面开始「拼装」而不是「各写各的」 |
| **5. 三语 + 状态** | ru/zh/en 文案表；Lang / Auth / Sync 三个上下文 | 语言即时切换；离线态可以演示 |
| **6. 逐模块铺页面** | 按 FM0–FM11 把 29 个页面写完，全部先接演示数据 | 能完整走一遍：询价 → 报价 → 订单 → 履约 → 运输 → 结算 |
| **7. 后端补 API** | 加 DRF（或普通 JSON 视图），把 `src/api/client.ts` 里列的 21 个接口实现出来 | 移动端能真的取到数据 |
| **8. 接数据 + 离线** | 用 RTK Query 替掉 mock；op-sqlite 做本地库与待同步队列；netinfo 判断网络 | 断网能看、联网自动同步 |
| **9. 接原生能力** | Vision Camera（扫码 + 拍单证）、FCM / APNs、Keychain / Keystore、地图 | 做出 Web 端做不到的那些事 |
| **10. 测试与打包** | Jest 测逻辑、Detox 测流程、`expo prebuild` 出 Android / iOS 包 | 可以拿去答辩的完整应用 |

**第 1–6 步就是这次交付的内容**（页面骨架）；
第 7 步是分界线——在它完成之前，第 8 步无法开始。

## 八、几个刻意的取舍

- **移动端与 Web 端按「操作性质」分工，不按「数据范围」分工。**
  Web 端做计划、批量处理与管理（维护目录、配字典、出报表、编合同模板）；
  移动端做「此时此刻」的动作（扫码、拍照、打卡、审批、沟通）。
  两端共用同一套数据、字典与权限。
- **FM10 在 Web 端没有对应模块。** 离线可用与待同步队列是移动客户端的固有属性，
  不是附加功能——8 个使用场景里有 5 个处于弱网或无网环境。
- **模块只声明一处。** `src/data/modules.ts` 是单一数据源，
  底部导航、工作台、设置页、关于页都从它取数据；
  与后端 `core/pages.py` 的做法一致。
- **仓库里不放密钥。** 服务端地址集中在 `src/api/client.ts`，`.env` 已加进 `.gitignore`。

## 九、对照 `1.html` 原型的整改记录

`1.html` 的版式与交互方向是对的（汇率卡 → 快捷入口 → 物流时间线 → 商品卡 → 底部导航），
所以移动端按它的版式重做了工作台；但它作为单文件原型暴露出的六类问题逐条修掉了。
下表就是「问题 → 现在怎么做的」的对照，也是答辩时可以逐条翻的证据。

### 1. 页面布局

| 原型的问题 | 现在的做法 |
|---|---|
| 固定 `max-w-[375px] h-[812px]` 的手机外壳；屏幕比 812 短时出现「外壳滚动 + 内容滚动」两层滚动，底部导航被挤出首屏 | RN 里**没有外壳**。根容器 `flex: 1` 拆成三行：页头固定（不参与滚动）、内容 `ScrollView` 用 `style={{ flex: 1 }}` 独占剩余高度、底部导航由 Expo Router 的 `Tabs` 导航器固定在屏幕底部。「只让内容滚动」是布局结构本身保证的，不依赖任何高度魔法。旋转、分屏、折叠屏展开由 `useWindowDimensions` 触发重算（`src/hooks/useResponsive.ts`）。 |

### 2. 组件结构

| 原型的问题 | 现在的做法 |
|---|---|
| 展示、文案、事件全塞在一个 HTML 文件里；两张商品卡复制粘贴，改一处要改两处 | 抽出 6 个新组件，组件总数 **13 → 19**：`ExchangeRateCard`（汇率卡）、`QuickActions`（快捷入口宫格）、`Timeline`（物流 / 动态时间线）、`GoodsCard`（商品卡）、`Chip`（筛选药丸）、`DataNote`（数据来源说明）。数据集中在 `src/data/mock.ts`，快捷入口的事件集中在 `src/hooks/useQuickActions.ts`，筛选控件全项目只剩 `Chip` 一个实现（订单 / 单证 / 商品目录共用）。 |

### 3. 样式

| 原型的问题 | 现在的做法 |
|---|---|
| 大量 `text-[10px]` 小字；历史节点用 `opacity-50` 反而比当前节点更浅；间距、圆角、阴影各写各的 | 字号收敛为 6 档：`26 / 20 / 16 / 14 / 13 / 12`，**删掉 10px 这一档**，`FONTS.tiny = 12` 是硬下限；行高进令牌（`LINE_HEIGHT`）。圆角只有 `8 / 12 / 16 / 20 / pill`，间距只有 `4 / 8 / 12 / 16 / 24 / 32`，阴影只有 `card / hero / bar` 三档 —— 页面里不许自创数值。时间线改为：已发生 = 实心主色点 + 深色标题，当前 = 高亮环 + 主色加粗，只有「未发生」才用次级灰（语义上就该弱，但仍然 ≥ 12px 可读）。 |

### 4. 交互体验

| 原型的问题 | 现在的做法 |
|---|---|
| 快捷入口和底栏是 `cursor-pointer` 的 `div`，看起来能点，实际没有行为；没有触控尺寸概念 | 全部换成原生 `Pressable` + `accessibilityRole="button"` + `accessibilityLabel`。8 个快捷入口各绑一条真实路由；底栏是真正的 Tabs 导航器。新增三个落点：`/catalog`（商品目录）、`/goods/[id]`（商品详情）、`/logistics/track`（按单号查询）。物流查询是真查询：输入单号 → 点「查询」→ 命中出轨迹、未命中出空态，输入为空时按钮是 `disabled`。演示类操作统一给一句 `demoActionHint`（「演示操作：不请求服务器」）作为明确反馈。 |

### 5. 中俄切换

| 原型的问题 | 现在的做法 |
|---|---|
| 切换语言只换了 `<h1>` 和一个 `<p>`，卡片里的文案纹丝不动；俄语长词把按钮挤成三行 | 全量字典 **211 键 × 3 语言（ru / zh / en）**，覆盖全部页面文案；由 `LangContext` 提供，切换即时生效、不重启应用（FR-045）。`tools/check-i18n.mjs` 做自检：三语的键集合必须完全一致，代码里 `t('...')` 用到的键必须存在，漏一个就非零退出。长俄文适配靠三件事：字号下限 12、允许两行、卡片宽度由栅格计算而不是写死。 |

### 6. 依赖与数据

| 原型的问题 | 现在的做法 |
|---|---|
| 依赖 Tailwind CDN 和 FontAwesome CDN（离线即失效）；`12.65` 写死却标着「实时汇率」 | **不依赖任何 CDN**：图标用字形（接入时换 `@expo/vector-icons`），渐变用 `expo-linear-gradient`（本地 npm 包，已进 `package.json`）。汇率卡标题从「实时汇率」改为「汇率参考」，来源与更新时间由 `DataNote` 统一标注「演示数据 · 更新时间」；`ExchangeRate` 类型显式带 `source: 'mock' \| 'api'` 字段，接入接口后把 source 换成 `'api'` 即可，组件不用改。异常状态（查询未命中、列表为空、离线）都有明确空态，不会静默什么都不发生。 |

### 按你给的顺序推进

你建议的实施顺序，实际就是这么落地的：

1. **响应式布局、底栏交互、全文语言切换** —— `useResponsive.ts` 栅格 + Tabs 底栏 + 211 键三语字典。
2. **样式统一、可访问性、组件与数据分离** —— 主题令牌收敛（含 12px 下限与 44×44 触控规格）+ 6 个新组件 + `useQuickActions` 集中事件。
3. **商品详情、物流查询，以及按实际需求接入服务** —— `/goods/[id]`、`/logistics/track` 已就位；「接入服务」取决于后端补 API（见第三节第 1 条）。
