import re

with open('assets/portal.js', 'r') as f:
    js_content = f.read()

# Extract the initResizers function
match = re.search(r'function initResizers\(\) \{.*?\}(?=\n|\s)', js_content, re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Not found by regex, fetching tail:")
    import os
    os.system("tail -n 60 assets/portal.js")
