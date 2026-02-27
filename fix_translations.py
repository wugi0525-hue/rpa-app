import os

def fix_translations():
    src_path = r"c:\Users\김민욱\Project\rpa-app\src\i18n\translations.js"
    dest_path = r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src\i18n\translations.js"
    
    if not os.path.exists(src_path):
        print(f"Error: 원본 파일이 존재하지 않습니다. {src_path}")
        return

    with open(src_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 이미 export const translations 로 되어있는지 확인
    if "export const translations" not in content:
        # 2. const translations = { 로 되어있다면 export 를 붙여줌
        if "const translations =" in content:
            content = content.replace("const translations =", "export const translations =")
        
    # 만약 맨 밑에 export default translations 가 있다면 지우거나 추가 처리를 방지
    # (이미 export const translations를 해줬으므로)

    # 폴더가 없으면 생성
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)

    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"✅ translations.js export 수정 및 복사 완료! ({dest_path})")

if __name__ == "__main__":
    fix_translations()
