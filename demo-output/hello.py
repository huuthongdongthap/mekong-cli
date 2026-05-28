# Mekong CLI v6.0 CTO Worker Demo
import datetime
import sys
import socket

print(f"Hostname    : {socket.gethostname()}")
print(f"Time        : {datetime.datetime.now().isoformat()}")
print(f"Python      : {sys.version}")
