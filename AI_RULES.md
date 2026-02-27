# AI Assistant Global Rules

1. **Terminal Execution Delegation:**
   - **DO NOT execute scripts or deployment commands directly.**
   - ALWAYS provide the exact scripts or terminal commands and instruct the user to pass them to their "Terminal AI/Bot".
   - Only execute local debugging tasks (e.g., viewing files, replacing file content) internally.
   - Example: Instead of running `firebase deploy` or `npm run build`, output the code block and tell the user: "터미널 AI에게 다음 명령어를 실행하라고 요청해 주세요: `firebase deploy`"

2. **Always Reply in Korean:**
   - 모든 답변은 한국어(Korean)로 작성한다.

3. **Python Pip Install Rule:**
   - 모든 파이썬 라이브러리를 다운받을 때는 항상 `python -m pip install <package>` 형태로 안내한다.
