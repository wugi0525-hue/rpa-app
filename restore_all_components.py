import os
import shutil

def restore_and_migrate():
    vite_src = r"c:\Users\김민욱\Project\rpa-app\src"
    next_src = r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src"
    
    folders_to_restore = ["components", "i18n", "data"]
    
    for folder in folders_to_restore:
        src_path = os.path.join(vite_src, folder)
        dest_path = os.path.join(next_src, folder)
        
        # 1. 0바이트로 깨진 기존 타겟 폴더 삭제
        if os.path.exists(dest_path):
            shutil.rmtree(dest_path)
            
        # 2. 깨끗한 원본 복사
        shutil.copytree(src_path, dest_path)
        print(f"✅ 폴더 복사 완료: {folder}")
        
    # 3. Next.js App Router용 코드 치환 (라우팅, 절대 경로, use client)
    replacements = {
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
        "router.push(-1)": "router.back()",
        
        "../i18n": "@/i18n",
        "../data": "@/data",
        "../firebase": "@/firebase",
        "../components": "@/components",
        "../LanguageContext": "@/LanguageContext",
        "./LanguageContext": "@/LanguageContext",
        "./firebase": "@/firebase",
        "./components": "@/components",
    }
    
    for folder in folders_to_restore:
        dest_folder = os.path.join(next_src, folder)
        for root, _, files in os.walk(dest_folder):
            for file in files:
                if file.endswith(('.js', '.jsx')):
                    filepath = os.path.join(root, file)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # 치환
                    for old, new in replacements.items():
                        content = content.replace(old, new)
                        
                    # 데이터 파일들 (translations, glossary 등) export 자동 수정
                    if folder == "data" or folder == "i18n":
                        if "const translations =" in content and "export const translations" not in content:
                            content = content.replace("const translations =", "export const translations =")
                        if "const glossary =" in content and "export const glossary" not in content:
                            content = content.replace("const glossary =", "export const glossary =")
                        if "const rpaCategories =" in content and "export const rpaCategories" not in content:
                            content = content.replace("const rpaCategories =", "export const rpaCategories =")
                        if "const rpaQuestionnaire =" in content and "export const rpaQuestionnaire" not in content:
                            content = content.replace("const rpaQuestionnaire =", "export const rpaQuestionnaire =")
                            
                    # components 안의 jsx 파일이면 "use client" 부착
                    elif folder == "components" and file.endswith('.jsx'):
                        if '"use client"' not in content and "'use client'" not in content:
                            content = '"use client";\n' + content
                            
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                        
    print("🎉 모든 컴포넌트, i18n, data 파일의 복원 및 Next.js 문법 치환이 성공적으로 완료되었습니다!")

if __name__ == "__main__":
    restore_and_migrate()
