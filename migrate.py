import os
import shutil
import subprocess

def print_step(msg):
    print(f"\n{'='*50}\n🚀 {msg}\n{'='*50}")

def main():
    # 1. Next.js 보일러플레이트 자동 생성
    print_step("Step 1: Next.js 15 (App Router) 보일러플레이트 생성 중...")
    
    cmd = 'npx create-next-app@latest rpa-app-next --use-npm --typescript=false --tailwind --eslint --app --src-dir --import-alias "@/*" --yes'
    try:
        # 터미널 출력을 사용자에게 보여주기 위해 subprocess 실행
        subprocess.run(cmd, shell=True, check=True)
        print("✅ Next.js 프로젝트 생성 완료!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Next.js 프로젝트 생성 실패: {e}")
        return

    # 2. 폴더 및 파일 자동 이관 (포장이사)
    print_step("Step 2: 기존 자산 복사 및 이관 중...")

    def copy_item(src, dst):
        if not os.path.exists(src):
            print(f"  - ⚠️ 앗! 원본이 존재하지 않습니다: {src}")
            return
        
        # 목적지 상위 폴더가 없으면 생성
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        
        if os.path.isdir(src):
            if os.path.exists(dst):
                shutil.rmtree(dst) # 덮어쓰기를 위해 폴더 삭제
            shutil.copytree(src, dst)
            print(f"  - 📁 폴더 복사 완료: {src} -> {dst}")
        else:
            shutil.copy2(src, dst)
            print(f"  - 📄 파일 복사 완료: {src} -> {dst}")

    # 필수 자산 이관
    copy_item("src/firebase.js", "rpa-app-next/src/firebase.js")
    copy_item("src/components", "rpa-app-next/src/components")

    # 3. 라우팅 페이지 자동 이름 변경 및 복사
    print_step("Step 3: 라우팅 페이지 네이밍 변경 및 복사 중...")

    pages_to_migrate = [
        ("src/pages/Dashboard.jsx", "rpa-app-next/src/app/page.jsx"),
        ("src/pages/AuditForm.jsx", "rpa-app-next/src/app/audit/page.jsx"),
        ("src/pages/Magazine.jsx", "rpa-app-next/src/app/magazine/page.jsx")
    ]

    for src, dst in pages_to_migrate:
        copy_item(src, dst)

    # 4. 코드 내부 문법 자동 치환 (리팩토링)
    print_step("Step 4: React Router -> Next.js 문법 자동 치환 중 (리팩토링)...")

    # 치환할 문자열 딕셔너리
    replacements = {
        "import { Link } from 'react-router-dom'": "import Link from 'next/link'",
        'import { Link } from "react-router-dom"': "import Link from 'next/link'", # 쌍따옴표 예외처리
        "import { useNavigate } from 'react-router-dom'": "import { useRouter } from 'next/navigation'",
        'import { useNavigate } from "react-router-dom"': "import { useRouter } from 'next/navigation'",
        "const navigate = useNavigate()": "const router = useRouter()",
        "navigate(": "router.push(",
        "Maps(": "router.push(", # 요청하신 매핑 규칙
        "<Link to=": "<Link href="
    }

    def refactor_file(filepath):
        if not os.path.exists(filepath):
            return
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        original_content = content
        
        # 룰셋 치환
        for old, new in replacements.items():
            content = content.replace(old, new)
            
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  - 🔧 리팩토링 완료: {filepath}")
        else:
            print(f"  - ➖ 변경 사항 없음: {filepath}")

    # 옮겨진 페이지 파일들 치환 적용
    for _, dst in pages_to_migrate:
        refactor_file(dst)
        
    # components 내부의 파일들도 치환 적용
    components_dir = "rpa-app-next/src/components"
    if os.path.exists(components_dir):
        for root, _, files in os.walk(components_dir):
            for file in files:
                if file.endswith((".jsx", ".js")):
                    refactor_file(os.path.join(root, file))

    print_step("완료! 🎉 모든 마이그레이션이 끝났습니다!")
    print("이제 터미널에 다음 명령어를 입력하여 Next.js를 실행해보세요:")
    print("👉 cd rpa-app-next")
    print("👉 npm run dev")

if __name__ == "__main__":
    main()
