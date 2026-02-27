import os
import asyncio
import json
import datetime
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

# Import the generation pipeline
from magazine_generator import generate_and_publish_article

# Replace with your Telegram Bot Token and your user ID (so only you can command it)
BOT_TOKEN = "8739013685:AAFli3DfBh_wmK21brh6kKe93yqskuRhS9s"
AUTHORIZED_USER_ID = 7222279833 # 0 means disabled until the user finds their ID

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    if AUTHORIZED_USER_ID == 0:
        await update.message.reply_text(f"환영합니다! 대표님의 User ID는 [{user_id}] 입니다.\n이 ID를 빈 공간에 복사해서 AI에게 건네주어 등록을 완료하세요.")
        print(f"!!! USER ID IDENTIFIED: {user_id} !!!")
        return
        
    if user_id != AUTHORIZED_USER_ID:
        await update.message.reply_text("Unauthorized user.")
        return
    await update.message.reply_text(
        "안녕하세요 대표님! AI 매거진 자동화 봇입니다.\n\n"
        "작성을 원하시는 주제를 입력해주세요.\n"
        "작성이 시작되면 실시간으로 진행 상황을 보여드리고 발행(예약)까지 완료합니다!"
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    if AUTHORIZED_USER_ID == 0:
        await update.message.reply_text(f"환영합니다! 대표님의 User ID는 [{user_id}] 입니다.\n이 ID를 빈 공간에 복사해서 AI에게 건네주어 등록을 완료하세요.")
        print(f"!!! USER ID IDENTIFIED: {user_id} !!!")
        return

    if user_id != AUTHORIZED_USER_ID:
        return
    
    user_text = update.message.text
    
    # Simple parse: if text starts with "예약", extract date logic (simplified for now to just post immediately or a specific date if you want to expand)
    # Right now, any text is treated as the topic for immediate drafting.
    topic = user_text
    
    msg = await update.message.reply_text(f"💡 [{topic}] 주제 접수 완료!\n1단계: NotebookLM 웹 조사 및 레퍼런스 수집을 시작합니다... (약 1~2분 소요)")
    
    try:
        # Generate the article
        title = await generate_and_publish_article(topic)
        await msg.reply_text(f"✅ [{title}] 글 분석 및 작성이 완료되어 Firestore에 업로드 되었습니다!\n웹사이트 관리자 페이지에서 확인 및 최종 발행/수정이 가능합니다.")
    except Exception as e:
        await msg.reply_text(f"❌ 작성 중 오류가 발생했습니다: {str(e)}")

def main() -> None:
    print("Telegram Bot Started...")
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    app.run_polling()

if __name__ == '__main__':
    main()
