import os
import glob

def fix_imports():
    src_dir = r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src"
    
    # 변경할 문자열 페어 (from, to)
    replacements = [
        ('../i18n', '@/i18n'),
        ('../data', '@/data'),
        ('../firebase', '@/firebase'),
        ('../components', '@/components'),
        ('../LanguageContext', '@/LanguageContext'),
        ('./LanguageContext', '@/LanguageContext'),
        ('./firebase', '@/firebase'),
        ('./components', '@/components'),
    ]

    count = 0
    # src 폴더 하위의 모든 .js, .jsx 파일 탐색
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.tsx', '.ts')):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                originalText = content
                for old_val, new_val in replacements:
                    content = content.replace(old_val, new_val)
                    
                if content != originalText:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"✅ Fixed imports in: {filepath}")
                    count += 1
                    
    print(f"\n🎉 총 {count}개 파일의 경로 치환(리팩토링)을 완료했습니다!")

if __name__ == "__main__":
    fix_imports()
