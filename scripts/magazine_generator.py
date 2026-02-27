import asyncio
import json
import os
import uuid
import datetime
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import firebase_admin
from firebase_admin import credentials, firestore
import re

# Initialize Firebase (only once)
cred_path = r"C:\Users\김민욱\Project\Items\rpa-app\serviceAccountKey.json"
cred = credentials.Certificate(cred_path)
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Hardcoded Notebook ID (the selected notebook from earlier list)
NOTEBOOK_ID = "58ae35a6-500f-4766-bf16-5aebe3f431dc"

def extract_title(markdown_content):
    lines = markdown_content.split('\n')
    title = "Insight Article"
    for line in lines:
        if line.startswith('# '):
            title = line.replace('# ', '').strip()
            # remove formatting if any
            title = re.sub(r'[*_`]', '', title)
            break
    return title

async def generate_and_publish_article(topic: str, publish_date: datetime.datetime = None):
    print(f"🚀 실시간 파이프라인 시작: 주제 = [{topic}]")
    server_params = StdioServerParameters(
        command="python",
        args=["-m", "notebooklm_tools.mcp.server", "--transport", "stdio"],
        env=os.environ.copy()
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            # --- 1. Web Research ---
            print("🔍 1단계: 웹 조사 (Web Research) 진행 중...")
            res = await session.call_tool("research_start", {
                "query": topic,
                "source": "web",
                "mode": "fast",
                "notebook_id": NOTEBOOK_ID
            })
            task_id = json.loads(res.content[0].text).get("task_id")
            
            while True:
                status_res = await session.call_tool("research_status", {
                    "notebook_id": NOTEBOOK_ID,
                    "task_id": task_id,
                    "max_wait": 30
                })
                status_data = json.loads(status_res.content[0].text)
                if status_data.get("status") == "completed":
                    break
                print("   ...자료 검색 중...")
                await asyncio.sleep(5)
                
            # Import the discoveries
            await session.call_tool("research_import", {
                "notebook_id": NOTEBOOK_ID,
                "task_id": task_id
            })
            print("✅ 자료 수집 완료.")
            
            # --- 2. Generate Blog Post ---
            print("✍️ 2단계: NotebookLM AI 글 작성 중 (애드센스 포맷 반영)...")
            custom_prompt = (
                f"목적: 구글 애드센스 승인을 위한 블로그 포스트.\n"
                f"주제: {topic}.\n"
                f"조건:\n"
                f"- 공백 제외 1500자 이상.\n"
                f"- h1, h2, h3 태그를 완벽하게 포함한 마크다운 형식으로 작성.\n"
                f"- 로봇같지 않은 자연스러운 사람(전문 블로거) 어투(예: ~입니다, ~했습니다, 알아볼까요? 등) 사용.\n"
                f"- 결론 요약 포함."
            )
            
            await session.call_tool("studio_create", {
                "notebook_id": NOTEBOOK_ID,
                "artifact_type": "report",
                "report_format": "Blog Post",
                "custom_prompt": custom_prompt,
                "confirm": True
            })
            
            artifact_id = None
            while True:
                studio_res = await session.call_tool("studio_status", {
                    "notebook_id": NOTEBOOK_ID
                })
                studio_data = json.loads(studio_res.content[0].text)
                artifacts = studio_data.get("artifacts", [])
                
                reports = [a for a in artifacts if a.get("type") == "report"]
                if reports:
                    latest_report = reports[0] # Usually the most recent is first
                    if latest_report.get("status") == "completed":
                        artifact_id = latest_report.get("artifact_id")
                        break
                    elif latest_report.get("status") == "failed":
                        raise Exception("AI 글스기(Artifact generation) 실패.")
                print("   ...AI 글 작성 진행 중...")
                await asyncio.sleep(10)
            print("✅ 글 작성 완료.")

            # --- 3. Download the artifact ---
            print("📥 3단계: 완성된 마크다운 결과물 다운로드 중...")
            download_path = "temp_article.md"
            await session.call_tool("download_artifact", {
                "notebook_id": NOTEBOOK_ID,
                "artifact_type": "report",
                "artifact_id": artifact_id,
                "output_path": download_path
            })
            
            with open(download_path, "r", encoding="utf-8") as f:
                content_md = f.read()

            try:
                os.remove(download_path)
            except:
                pass

            # --- 4. Firestore Upload ---
            print("🚀 4단계: Firebase Firestore 업로드 중...")
            title = extract_title(content_md)
            
            # Default to now if publish_date is none
            if publish_date is None:
                publish_date = datetime.datetime.now()
            
            slug = str(uuid.uuid4()) # Use UUID for document ID to avoid slug parsing issues
            
            article_data = {
                "title": title,
                "content_md": content_md,
                "createdAt": firestore.SERVER_TIMESTAMP,
                "publishDate": publish_date, 
                "author": "NotebookLM AI",
                "readTime": 5,
                "thumbnail_url": "", # We can inject dynamic images later
                "tags": ["AI-Generated", "Magazine"]
            }
            
            db.collection("magazines").document(slug).set(article_data)
            print(f"🎉 성공! 글이 발행(예약)되었습니다. 제목: {title}")
            return title

if __name__ == "__main__":
    # For testing manually
    asyncio.run(generate_and_publish_article("RPA 도입의 기초와 효과적인 사례"))
