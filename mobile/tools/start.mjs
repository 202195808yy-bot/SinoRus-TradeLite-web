#!/usr/bin/env node
/**
 * 启动 Expo 开发服务器，并强制使用「真实的局域网 IP」。
 *
 * 为什么需要这个脚本：
 *   本机装了代理（Mihomo / Clash），TUN 模式会创建一张虚拟网卡 198.18.0.1。
 *   Expo CLI 取的是 os.networkInterfaces() 里第一个非回环 IPv4，正好命中这张
 *   虚拟网卡，于是二维码里变成 exp://198.18.0.1:8081 —— 手机根本到不了，
 *   扫码必然失败。同理，VirtualBox / VMware 的网卡也会干扰。
 *
 * 挑选规则（从上到下，先排除再优先）：
 *   1. 排除回环、APIPA（169.254/16）、代理 fake-IP（198.18/15）
 *   2. 排除 VirtualBox / VMware / Hyper-V / Docker 等虚拟网卡
 *   3. 剩下的里优先 WLAN / Wi-Fi / 以太网
 *   4. 都没有才退回到任意一个非回环 IPv4
 * 选中结果写进 REACT_NATIVE_PACKAGER_HOSTNAME，再启动 expo。
 *
 * 用法：
 *   npm start                    # 局域网模式（自动选 IP）
 *   npm run start:tunnel         # 隧道模式，跨网段/跨网络也能扫
 *   npm run start:usb            # 本机模式，配合 adb reverse 走 USB
 */

import { networkInterfaces } from 'node:os';
import { spawn } from 'node:child_process';

// ── 排除规则 ──────────────────────────────────────────────
/** 不可能是「手机能访问到的局域网地址」的网段。 */
const BLOCKED_RANGES = [
  /^127\./, // 回环
  /^169\.254\./, // APIPA：网线没插或没拿到 DHCP
  /^198\.1[89]\./, // 代理 TUN 的 fake-IP 段（Clash / Mihomo / Surge）
];

/** 虚拟网卡的名字特征。 */
const VIRTUAL_HINTS =
  /vmware|virtualbox|vbox|hyper-?v|vethernet|docker|wsl|loopback|tap|tun|mihomo|clash|vpn|zerotier|tailscale/i;

/** 真实网卡的名字特征（命中则优先）。 */
const PHYSICAL_HINTS = /wlan|wi-?fi|wireless|以太网|ethernet|eth\d/i;

/** 收集所有候选 IPv4。 */
function collectCandidates() {
  const list = [];
  for (const [name, addrs] of Object.entries(networkInterfaces())) {
    for (const addr of addrs ?? []) {
      if (addr.family !== 'IPv4' || addr.internal) continue;
      const blocked = BLOCKED_RANGES.some((re) => re.test(addr.address));
      list.push({
        name,
        address: addr.address,
        blocked,
        virtual: VIRTUAL_HINTS.test(name),
        physical: PHYSICAL_HINTS.test(name),
      });
    }
  }
  return list;
}

/** 按优先级排序，返回第一个可用地址。 */
function pickLanIp(candidates) {
  const usable = candidates.filter((c) => !c.blocked && !c.virtual);
  // 真实网卡优先，其次任意可用
  const preferred = usable.filter((c) => c.physical);
  const ordered = [...preferred, ...usable.filter((c) => !c.physical)];
  if (ordered.length > 0) return ordered[0];
  // 兜底：只剩被排除的，也总比没有强
  return candidates.find((c) => !BLOCKED_RANGES[0].test(c.address)) ?? null;
}

// ── 顺手生成一张「真的能扫」的二维码 ──────────────────────
// 终端里那个二维码是拿字符方块拼的，实测只有 216×216 像素、
// 单模块 7px、深色是 rgb(59,59,59) 而非纯黑、左侧白边只有约
// 1.7 个模块（规范要求 4 个）。软件解码器能读，手机摄像头在真实
// 光照下经常解不出来。所以这里按同一个地址再输出一张 1200px 的
// PNG，全屏打开即可扫。生成失败不影响启动。
async function writeQrPng(url) {
  try {
    const qr = await import('qrcode');
    const toFile = qr.toFile ?? qr.default?.toFile;
    if (!toFile) return;
    await toFile('qr-dev.png', url, {
      width: 1200,
      margin: 4, // 留 4 个模块白边，符合规范
      errorCorrectionLevel: 'Q',
      color: { dark: '#000000', light: '#FFFFFF' },
    });
    console.log(`  扫码图已更新：qr-dev.png（全屏打开再扫，比终端里的清楚）`);
  } catch {
    /* 没装 qrcode 就跳过 */
  }
}

// ── 主流程 ────────────────────────────────────────────────
const args = process.argv.slice(2);
const isTunnel = args.includes('--tunnel');
const isLocalhost = args.includes('--localhost');

const candidates = collectCandidates();
const chosen = pickLanIp(candidates);

if (!isTunnel && !isLocalhost) {
  if (chosen) {
    process.env.REACT_NATIVE_PACKAGER_HOSTNAME = chosen.address;
    console.log('');
    console.log(`  局域网地址：${chosen.address}  (${chosen.name})`);
    const others = candidates.filter((c) => c.address !== chosen.address);
    if (others.length > 0) {
      console.log(
        `  已忽略：${others.map((c) => `${c.address} ${c.name}`).join('、')}`,
      );
    }
    console.log(`  手机需与电脑连同一个 Wi-Fi，扫码后访问 exp://${chosen.address}:8081`);
    console.log('');
    await writeQrPng(`exp://${chosen.address}:8081`);
  } else {
    console.warn('[警告] 没找到可用的局域网地址，改用 Expo 默认选择。');
    console.warn('       若扫码失败，请检查 Wi-Fi 是否连接。');
  }
} else if (isTunnel) {
  console.log('');
  console.log('  隧道模式：手机可以用任意网络（4G 也行）。');
  console.log('  首次运行会提示安装 @expo/ngrok，同意即可。');
  console.log('');
} else {
  console.log('');
  console.log('  本机模式：先执行 adb reverse tcp:8081 tcp:8081，');
  console.log('  然后在 Expo Go 里手动打开 exp://127.0.0.1:8081');
  console.log('');
}

// 只生成二维码、不启动服务器（npm run qr）
if (args.includes('--qr-only')) {
  console.log('  只生成二维码，未启动开发服务器。');
  process.exit(0);
}

const child = spawn('npx', ['expo', 'start', ...args], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('exit', (code) => process.exit(code ?? 0));
