import os
import shutil

def migrate_page(src, dest):
    print(f"Migrating {src} -> {dest}")
    
    # 1. 원본 파일 읽기
    if not os.path.exists(src):
        print(f"❌ 원본 파일이 없습니다: {src}")
        return
        
    with open(src, 'r', encoding='utf-8') as f:
        content = f.read()

    # 2. Next.js 호환 문법으로 자동 치환
    replacements = {
        # 라우터 치환
        "import { Link } from 'react-router-dom'": "import Link from 'next/link'",
        'import { Link } from "react-router-dom"': "import Link from 'next/link'",
        "import { useNavigate } from 'react-router-dom'": "import { useRouter } from 'next/navigation'",
        'import { useNavigate } from "react-router-dom"': "import { useRouter } from 'next/navigation'",
        "import { useNavigate, useLocation } from 'react-router-dom'": "import { useRouter, usePathname } from 'next/navigation'",
        "const navigate = useNavigate()": "const router = useRouter()",
        "const location = useLocation()": "const pathname = usePathname()",
        "navigate(": "router.push(",
        "Maps(": "router.push(",
        "<Link to=": "<Link href=",
        
        # 절대 경로 Alias 치환
        "../i18n": "@/i18n",
        "../data": "@/data",
        "../firebase": "@/firebase",
        "../components": "@/components",
        "../LanguageContext": "@/LanguageContext",
        "./LanguageContext": "@/LanguageContext",
        "./firebase": "@/firebase",
        "./components": "@/components",
        
        # Magazine.jsx 내부의 navigate( -1 ) 처리
        "router.push(-1)": "router.back()", 
        "router.push( -1 )": "router.back()",
    }

    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # 3. 최상단에 "use client" 부착 (없다면)
    if '"use client"' not in content and "'use client'" not in content:
        content = '"use client";\n' + content
        
    # 4. export default 확인 (단순 보정 로직)
    # 기존 코드들이 export default function Dashboard 형식으로 이미 작성되어 있는지 체크.
    # 만일의 경우에 대비해 확인만 하고 덮어씁니다.
    
    # 목적지 폴더 생성
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"✅ 완료: {dest}")

def main():
    pages = [
        (r"c:\Users\김민욱\Project\rpa-app\src\pages\Dashboard.jsx", r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src\app\page.jsx"),
        (r"c:\Users\김민욱\Project\rpa-app\src\pages\AuditForm.jsx", r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src\app\audit\page.jsx"),
        (r"c:\Users\김민욱\Project\rpa-app\src\pages\Magazine.jsx", r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src\app\magazine\page.jsx"),
        (r"c:\Users\김민욱\Project\rpa-app\src\pages\Profile.jsx", r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src\app\profile\page.jsx"),
        (r"c:\Users\김민욱\Project\rpa-app\src\pages\CheatSheet.jsx", r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src\app\guide\page.jsx"),
    ]
    
    for src, dest in pages:
        migrate_page(src, dest)

if __name__ == "__main__":
    main()
