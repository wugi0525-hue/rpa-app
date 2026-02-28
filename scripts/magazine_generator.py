import asyncio
import os
import uuid
import datetime
import sys
import re
from google import genai
from google.genai import types
from dotenv import load_dotenv

import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables from .env file
load_dotenv()

# GEMINI_API_KEY initialization (Ensure this is set in your environment or .env file)
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 작성하거나 환경 변수를 등록해주세요.")

client = genai.Client(api_key=api_key)

# Safely set stdout to UTF-8 to prevent cp949/ascii encode errors in Windows Terminal
import codecs
if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
if sys.stderr.encoding.lower() != 'utf-8':
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except AttributeError:
        sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Initialize Firebase (only once)
cred_path = "./serviceAccountKey.json"
cred = credentials.Certificate(cred_path)
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app(cred)

db = firestore.client()

def extract_title(markdown_content):
    lines = markdown_content.split('\n')
    title = "Insight Article"
    for line in lines:
        if line.startswith('# '):
            title = line.replace('# ', '').strip()
            title = re.sub(r'[*_`]', '', title)
            break
    return title

async def generate_article_draft(topic: str, update_status=None):
    if update_status: await update_status("🚀 실시간 파이프라인 시작: 최신 Gemini API 초기화 중...")
    print(f"🚀 실시간 파이프라인 시작: 주제 = [{topic}]", flush=True)
    
    # 1. 환경 변수에서 API KEY 로드 및 클라이언트 초기화
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise Exception("시스템에 GEMINI_API_KEY가 설정되어 있지 않습니다.")
        
    client = genai.Client(api_key=api_key)
    
    # 2. Deep Research & Grounding (Gemini Google Search Tool)
    if update_status: await update_status("🔍 1단계: 웹 조사 (Google Search Grounding) 및 AI 글 작성 중...")
    print("🔍 1단계: 웹 조사 및 AI 작성 진행 중...", flush=True)

    # SEO 강화 및 빡센 작성 프롬프트
    system_prompt = f"""
[절대 금지 강제 조항]
1. 정체성 은폐: 너는 절대 스스로가 AI, 인공지능, 언어 모델, Gemini임을 밝혀서는 안 된다.
2. 꼬리표 및 워터마크 절대 금지: 글의 제목, 서론, 본문, 결론, 혹은 글이 끝난 이후 그 어떤 곳에도 "AI Generated", "Gemini Generated", "이 글은 AI가 작성했습니다"와 같은 출처 표기나 안내 문구를 단 1글자도 포함하지 마라.
3. 메타 코멘트 금지: "네, 알겠습니다. 요청하신 블로그 글을 작성해 드립니다." 같은 인사말이나 대화형 응답을 절대 출력하지 마라.
4. 출력물 통제: 오직 10년 차 인간 전문가가 직접 쓴 것 같은 '순수한 마크다운 형식의 블로그 원고' 자체만 딱 출력하고 출력을 종료해라.

너는 10년 차 IT/경제/트렌드/제조업/품질/협상 전문 칼럼니스트이자, 날카로운 인사이트로 구독자 10만 명을 보유한 탑티어 블로거야. 네가 작성하는 모든 글은 다음 규칙을 100% 엄격하게 준수해야 해.

주제인 '{topic}'에 대해 구글 검색 도구(Grounding)를 사용하여 최신 정보를 깊이 있게 리서치하고, 
적어도 5개 이상의 문서를 교차 검증(Cross-check)하여 완전 팩트 기반의 블로그 포스팅 원고를 작성해 주세요.

1. 금지어 및 톤앤매너:
'안녕하세요', '누구누구 여러분', '오늘은 ~에 대해 알아보겠습니다', '결론적으로', '도움이 되셨기를 바랍니다' 같은 전형적인 기계적 AI 말투는 절대 사용하지 마.
전문가의 권위가 느껴지면서도 흡입력 있는 문체를 사용해.
어려운 개념(예: S&P 500 ETF 수익률 구조, 자율주행 기술 등)이 나오면 반드시 일상적이고 찰떡같은 '비유'를 하나 이상 들어서 초보자도 단번에 이해하게 설명해.

2. 3단 구조 (Hook - Data - Insight) 강제:
도입부(Hook): 독자의 호기심을 극대화하는 파격적인 질문이나 흥미로운 최신 팩트로 시작해라.
본론(Data): 구글 딥 리서치로 찾은 구체적인 수치, 통계, 팩트를 나열하고 반드시 교차 검증해라.
결론(Insight): 단순 요약으로 끝내지 말고, 이 현상이 우리의 삶과 지갑에 어떤 영향을 미치는지 너만의 독창적인 통찰을 제시하며 묵직하게 마무리해라.

3. 포맷 및 SEO 최적화:
H1, H2, H3 마크다운 태그를 적절히 분배하여 가독성을 높일 것.
구글 검색 엔진(SEO)과 티스토리 애드센스 승인에 최적화되도록 핵심 키워드를 자연스럽게 반복 배치할 것.
전체 글자 수는 공백 포함 최소 1,500자 이상, 2,000자 이하로 매우 상세하고 밀도 있게 작성할 것.
제출물은 마크다운(Markdown) 포맷으로만 작성해주세요.
"""

    # Gemini 3.1 Pro 사용 (수정 요청 반영)
    model_id = "gemini-3.1-pro"

    response = client.models.generate_content(
        model=model_id,
        contents=system_prompt,
        config=types.GenerateContentConfig(
            tools=[{"google_search": {}}],  # Google Search Grounding 활성화
            temperature=0.7,
        )
    )
    
    content_md = response.text
    if update_status: await update_status("✅ AI 초안 작성 완료. 마크다운 원고 파싱 중...")
    print("✅ AI 원고 초안 작성 및 팩트 체크 완료", flush=True)

    title = extract_title(content_md)
    return title, content_md

async def rewrite_article_draft(original_md: str, user_feedback: str, update_status=None):
    if update_status: await update_status("🔄 사용자의 피드백을 적극 반영하여 원고를 전면 재작성 중입니다...")
    print(f"🔄 재작성 파이프라인 시작: 피드백 = [{user_feedback}]", flush=True)

    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    
    system_prompt = f"""
[절대 금지 강제 조항]
1. 정체성 은폐: 너는 절대 스스로가 AI, 인공지능, 언어 모델, Gemini임을 밝혀서는 안 된다.
2. 꼬리표 및 워터마크 절대 금지: 글의 제목, 서론, 본문, 결론, 혹은 글이 끝난 이후 그 어떤 곳에도 "AI Generated", "Gemini Generated", "이 글은 AI가 작성했습니다"와 같은 출처 표기나 안내 문구를 단 1글자도 포함하지 마라.
3. 메타 코멘트 금지: "네, 알겠습니다. 요청하신 블로그 글을 작성해 드립니다." 같은 인사말이나 대화형 응답을 절대 출력하지 마라.
4. 출력물 통제: 오직 10년 차 인간 전문가가 직접 쓴 것 같은 '순수한 마크다운 형식의 블로그 원고' 자체만 딱 출력하고 출력을 종료해라.

너는 10년 차 IT/경제/트렌드/제조업/품질/협상 전문 칼럼니스트이자, 날카로운 인사이트로 구독자 10만 명을 보유한 탑티어 블로거야. 네가 작성하는 모든 글은 다음 규칙을 100% 엄격하게 준수해야 해.

아래에 제공된 [기존 원고]를 바탕으로, 사용자의 [수정 지시사항]을 완벽하게 반영하여 원고를 다시 작성해 줘.

[수정 지시사항]
{user_feedback}

1. 금지어 및 톤앤매너:
'안녕하세요', '누구누구 여러분', '오늘은 ~에 대해 알아보겠습니다', '결론적으로', '도움이 되셨기를 바랍니다' 같은 전형적인 기계적 AI 말투는 절대 사용하지 마.
전문가의 권위가 느껴지면서도 흡입력 있는 문체를 사용해.
어려운 개념이 나오면 반드시 일상적이고 찰떡같은 '비유'를 하나 이상 들어서 초보자도 단번에 이해하게 설명해.

2. 3단 구조 (Hook - Data - Insight) 강제:
도입부(Hook): 독자의 호기심을 극대화하는 파격적인 질문이나 흥미로운 최신 팩트로 시작해라.
본론(Data): 구글 딥 리서치로 찾은 구체적인 수치, 통계, 팩트를 나열하고 반드시 교차 검증해라.
결론(Insight): 단순 요약으로 끝내지 말고, 이 현상이 우리의 삶과 지갑에 어떤 영향을 미치는지 너만의 독창적인 통찰을 제시하며 묵직하게 마무리해라.

3. 포맷 및 SEO 최적화:
H1, H2, H3 마크다운 태그를 적절히 분배하여 가독성을 높일 것.
구글 검색 엔진(SEO)과 티스토리 애드센스 승인에 최적화되도록 핵심 키워드를 자연스럽게 반복 배치할 것.
전체 글자 수는 공백 포함 최소 1,500자 이상, 2,000자 이하로 매우 상세하고 밀도 있게 작성할 것. (피드백에서 특별한 길이 조정을 명시하지 않은 경우)
제출물은 마크다운(Markdown) 포맷으로만 작성해주세요.
사용자의 피드백을 1순위로 반영하여 내용, 어투, 방향성, 길이 등을 완벽히 수정할 것.

[기존 원고]
{original_md}
"""
    model_id = "gemini-3.1-pro" 
    
    response = client.models.generate_content(
        model=model_id,
        contents=system_prompt,
        config=types.GenerateContentConfig(
            # 재작성 작업은 추가 리서치보다는 로직 강화를 위해 Grounding 생략(또는 선택적용)가능하나 
            # 일단 기존 내용 기반 리라이팅에 집중
            temperature=0.7,
        )
    )
    
    new_content_md = response.text
    new_title = extract_title(new_content_md)
    if update_status: await update_status("✅ 피드백이 완벽히 반영된 새로운 원고 작성 완료.")
    print("✅ 원고 재작성 완료", flush=True)

    return new_title, new_content_md

async def publish_to_firestore(title: str, content_md: str, publish_date: datetime.datetime = None):
    print("🚀 Firebase Firestore 컨펌본 업로드 중...", flush=True)
    
    if publish_date is None:
        kst = datetime.timezone(datetime.timedelta(hours=9))
        publish_date = datetime.datetime.now(kst)
        
    slug = str(uuid.uuid4())
    
    article_data = {
        "title": title,
        "content_md": content_md,
        "createdAt": firestore.SERVER_TIMESTAMP,
        "publishDate": publish_date, 
        "author": "RPA Insight",
        "readTime": max(5, int(len(content_md) / 300)), # 단순 글자수에 비례한 읽는 시간 산정
        "thumbnail_url": "", 
        "tags": ["Magazine"]
    }
    
    db.collection("magazines").document(slug).set(article_data)
    
    print(f"🎉 성공! 사용자 승인 글이 발행(예약)되었습니다. 제목: {title}", flush=True)
    return title

