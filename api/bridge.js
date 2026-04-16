from http.server import BaseHTTPRequestHandler, HTTPServer
from collections import defaultdict

sessions = defaultdict(list)

class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        session_id = self.headers.get("x-session-id")

        length = int(self.headers.get('Content-Length', 0))
        data = self.rfile.read(length)

        # ذخیره دیتا
        sessions[session_id].append(data)

        # برگردوندن دیتاهای قبلی (simulate downstream)
        response = b"".join(sessions[session_id])
        sessions[session_id].clear()

        self.send_response(200)
        self.send_header("Content-Type", "application/octet-stream")
        self.end_headers()
        self.wfile.write(response)

    def log_message(self, *args):
        return

server = HTTPServer(("0.0.0.0", 8080), Handler)
print("Session server running")
server.serve_forever()
