import os
import re

admin_dir = "/Users/mac/mekong-cli/FnB-Container-Caffe/admin"
files_to_scan = [
    "dashboard.html",
    "launch-monitor.html",
    "login.html",
    "loyalty-dashboard.html",
    "orders.html",
    "pos.html",
    "reservations.html",
    "staff.html"
]

banned_colors = {
    # Gold/Thổ
    "#FFD700": "Gold/Thổ",
    "#D4AF37": "Gold/Thổ",
    "#B8860B": "Gold/Thổ",
    "#FFE970": "Gold/Thổ",
    
    # Cam đỏ/Hỏa
    "#FF6B35": "Cam đỏ/Hỏa",
    "#FF1744": "Cam đỏ/Hỏa",
    "#FF5722": "Cam đỏ/Hỏa",
    "#FF0000": "Cam đỏ/Hỏa",
    "#F00": "Cam đỏ/Hỏa",
    
    # Nâu đất/Thổ
    "#8B4513": "Nâu đất/Thổ",
    "#C9A200": "Nâu đất/Thổ",
    "#C9A962": "Nâu đất/Thổ"
}

# Compile patterns
color_regexes = []
for hex_code, category in banned_colors.items():
    # Escaping # and creating a regex that is case-insensitive
    pattern = re.compile(re.escape(hex_code), re.IGNORECASE)
    color_regexes.append((hex_code, category, pattern))

# Special regex for 'red' as a CSS color or word boundary
red_pattern = re.compile(r'\b(red)\b', re.IGNORECASE)

print("Starting Color Audit...")
results = []

for filename in files_to_scan:
    filepath = os.path.join(admin_dir, filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    for line_num, line in enumerate(lines, 1):
        # 1. Search for hex colors
        for hex_code, category, pattern in color_regexes:
            matches = pattern.finditer(line)
            for m in matches:
                results.append({
                    "file": filename,
                    "line": line_num,
                    "snippet": line.strip(),
                    "matched": m.group(),
                    "category": category
                })
                
        # 2. Search for 'red' as a CSS value/color
        # To avoid false positives (like 'redirect', 'ordered', 'shared', etc.) we check if it is part of a CSS color declaration or class, or just raw red
        # Let's inspect if the line has css-like patterns, e.g., 'color: red', 'background: red', 'border: ... red', 'fill: red', or 'style="...red..."'
        if "red" in line.lower():
            # Let's look for common CSS properties that can take 'red' or text inside <style>
            css_red_match = re.search(r'(color|background|border|fill|stroke|box-shadow|outline|background-color)\s*:\s*([^;]*\b)red(\b|;)', line, re.IGNORECASE)
            # Also check for inline styles or general assignments like = "red" or = 'red'
            js_red_match = re.search(r'=\s*["\']red["\']', line, re.IGNORECASE)
            
            if css_red_match or js_red_match:
                matched_str = "red"
                results.append({
                    "file": filename,
                    "line": line_num,
                    "snippet": line.strip(),
                    "matched": matched_str,
                    "category": "Cam đỏ/Hỏa (red)"
                })

print(f"Audit Complete. Found {len(results)} matches.")
import json
print(json.dumps(results, indent=2))
