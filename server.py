# -*- coding: utf-8 -*-
"""
EDU-GUARD AI - LOCAL HTTP SERVER LAUNCHER
THCS & THPT Liên Việt Kontum
Giúp khởi chạy Web App trên giao thức http://localhost:5500
"""
import os
import sys
import time
import socket
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

# Đảm bảo mã hóa UTF-8 trên Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

def find_available_port(start_port=5500, max_port=5550):
    for port in range(start_port, max_port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    return 8080

class EduGuardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        web_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")
        super().__init__(*args, directory=web_dir, **kwargs)

    def log_message(self, format, *args):
        # Giảm log thừa thãi để màn hình console sạch đẹp
        pass

def main():
    port = find_available_port(5500)
    server_address = ('127.0.0.1', port)
    
    try:
        httpd = HTTPServer(server_address, EduGuardHandler)
    except Exception as e:
        print(f"Loi khoi dong server: {e}")
        sys.exit(1)

    url = f"http://localhost:{port}/login.html"
    
    print("=" * 68)
    print("  [+] HE THONG QUAN LY HOC SINH - THCS & THPT LIEN VIET KONTUM")
    print("  [+] TAC GIA THIET KE: TRAN LE GIA BAO - LOP 10A1")
    print("  [+] DU AN THAM GIA CUOC THI LVKT YOUNG INNOVATORS 2026")
    print("=" * 68)
    print(f"  [+] May chu Web Local dang hoat dong tai:")
    print(f"      >> {url} <<")
    print("  [+] Trinh duyet se tu dong mo trang web trong giay lat...")
    print("  [+] De ket thuc: Dong cua so hoac bam phim Ctrl + C.")
    print("=" * 68)

    def auto_open():
        time.sleep(0.8)
        try:
            webbrowser.open(url)
        except Exception:
            pass

    threading.Thread(target=auto_open, daemon=True).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[+] Da tat may chu.")
        httpd.server_close()

if __name__ == "__main__":
    main()
