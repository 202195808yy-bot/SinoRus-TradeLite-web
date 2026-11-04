"""本地预览服务器：把 `expo export` 的 Web 产物当站点跑起来。

为什么需要它：`expo export --platform web` 输出的是带 `.html` 后缀的文件
（`workbench.html`），而应用内路由读的是 `location.pathname`（`/workbench`）。
直接用 `python -m http.server` 打开会得到 "Unmatched Route"。本脚本做两件事：

1. `/orders` → `orders.html`（同名文件优先于同名目录）；
2. 找不到文件时回退到 `index.html`，把动态路由（`/orders/ord-1` 之类）
   交给 expo-router 在客户端接管。

用法：
    npm run preview                              # 先导出静态站点到 web-preview/
    python tools/preview-server.py               # 默认 127.0.0.1:8125，站点目录 web-preview/
    python tools/preview-server.py 9000 dist     # 指定端口与目录

注意：默认目录必须与 package.json 里 `preview` 脚本的 --output-dir 一致，
否则服务器会去跑上一次的旧产物（曾经因为这个踩过一次坑）。
"""

import http.server
import os
import socketserver
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def make_handler(site_root: str):
    class Handler(http.server.SimpleHTTPRequestHandler):
        def translate_path(self, path):
            full = super().translate_path(path)
            # 1) 同名 .html 优先（orders → orders.html，而不是 orders/ 目录）
            if os.path.isfile(full + '.html'):
                return full + '.html'
            # 2) 目录 → 目录下的 index.html
            if os.path.isdir(full):
                index = os.path.join(full, 'index.html')
                if os.path.isfile(index):
                    return index
            # 3) 已存在的文件原样返回
            if os.path.isfile(full):
                return full
            # 4) 其余交给客户端路由
            return os.path.join(site_root, 'index.html')

        def log_message(self, *args):
            pass

    return Handler


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8125
    site_root = sys.argv[2] if len(sys.argv) > 2 else 'web-preview'
    site_root = os.path.join(PROJECT_ROOT, site_root)

    if not os.path.isdir(site_root):
        print(f'Нет каталога сборки: {site_root}')
        print('Сначала выполните: npm run preview')
        return 1

    os.chdir(site_root)
    with socketserver.TCPServer(('127.0.0.1', port), make_handler(site_root)) as httpd:
        print(f'Предпросмотр: http://127.0.0.1:{port}/')
        print('Остановить: Ctrl+C')
        httpd.serve_forever()
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
