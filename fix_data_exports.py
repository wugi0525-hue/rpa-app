import os

def fix_data_exports():
    data_files = [
        ("glossary.js", "glossary"),
        ("categories.js", "rpaCategories"),
        ("questionnaire.js", "rpaQuestionnaire")
    ]
    
    src_dir = r"c:\Users\김민욱\Project\rpa-app\src\data"
    dest_dir = r"c:\Users\김민욱\Project\rpa-app\rpa-app-next\src\data"
    
    os.makedirs(dest_dir, exist_ok=True)
    
    for file_name, var_name in data_files:
        src_path = os.path.join(src_dir, file_name)
        dest_path = os.path.join(dest_dir, file_name)
        
        if not os.path.exists(src_path):
            print(f"❌ 원본 파일 없음: {src_path}")
            continue
            
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 변수 선언부에 export 추가
        target_str = f"const {var_name} ="
        if target_str in content and f"export const {var_name} =" not in content:
            content = content.replace(target_str, f"export {target_str}")
            
        # 혹시 let으로 되어있다면?
        target_str_let = f"let {var_name} ="
        if target_str_let in content and f"export let {var_name} =" not in content:
            content = content.replace(target_str_let, f"export {target_str_let}")
            
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"✅ {file_name} 복구 및 export 수정 완료!")

if __name__ == "__main__":
    fix_data_exports()
