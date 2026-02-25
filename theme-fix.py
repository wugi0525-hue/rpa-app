import re
import os

def fix_white(file_path):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex replacements
    content = re.sub(r"<h1(.*?)color: 'white'(.*?)>", r"<h1\1color: 'var(--text-primary)'\2>", content)
    content = re.sub(r"<h2(.*?)color: 'white'(.*?)>", r"<h2\1color: 'var(--text-primary)'\2>", content)
    content = re.sub(r"<span(.*?)color: 'white'(.*?)>", r"<span\1color: 'var(--text-primary)'\2>", content)
    
    # borders
    content = content.replace("rgba(255, 255, 255, 0.05)", "var(--glass-border)")
    content = content.replace("rgba(255,255,255,0.05)", "var(--glass-border)")
    content = content.replace("rgba(255,255,255,0.1)", "var(--glass-border)")
    content = content.replace("rgba(255, 255, 255, 0.1)", "var(--glass-border)")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

fix_white('src/pages/AuditForm.jsx')
fix_white('src/pages/Dashboard.jsx')
fix_white('src/pages/Login.jsx')

login_path = 'src/pages/Login.jsx'
if os.path.exists(login_path):
    with open(login_path, 'r', encoding='utf-8') as f:
        login_content = f.read()
    login_content = login_content.replace(
        "backgroundColor: 'rgba(0,0,0,0.8)'", 
        "backgroundColor: 'rgba(255,255,255,0.8)'"
    )
    login_content = login_content.replace(
        "backgroundColor: '#1e293b'", 
        "backgroundColor: 'var(--bg-secondary)'"
    )
    login_content = login_content.replace(
        "color: '#cbd5e1'", 
        "color: 'var(--text-secondary)'"
    )
    login_content = login_content.replace(
        "border: '1px solid #334155'", 
        "border: '1px solid var(--glass-border)', boxShadow: 'var(--shadow-warm)'"
    )
    with open(login_path, 'w', encoding='utf-8') as f:
        f.write(login_content)

print('UI colors updated')
