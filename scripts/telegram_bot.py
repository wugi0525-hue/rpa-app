import os
import asyncio
import datetime
import re
from telegram import Update, ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes, ConversationHandler, CallbackQueryHandler

# Import the generation pipeline
from magazine_generator import generate_article_draft, rewrite_article_draft, publish_to_firestore
from dotenv import load_dotenv

load_dotenv()

# Replace with your Telegram Bot Token and your user ID (so only you can command it)
BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN") or "8739013685:AAFli3DfBh_wmK21brh6kKe93yqskuRhS9s"
AUTHORIZED_USER_ID = 7222279833 # 0 means disabled until the user finds their ID

# States
TOPIC, PUBLISH_TIME, DRAFT_VERIFICATION, FEEDBACK = range(4)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    if AUTHORIZED_USER_ID == 0:
        await update.message.reply_text(f"환영합니다! 대표님의 User ID는 [{user_id}] 입니다.\n이 ID를 빈 공간에 복사해서 AI에게 건네주어 등록을 완료하세요.")
        print(f"!!! USER ID IDENTIFIED: {user_id} !!!")
        return ConversationHandler.END
        
    if user_id != AUTHORIZED_USER_ID:
        await update.message.reply_text("Unauthorized user.")
        return ConversationHandler.END

    await update.message.reply_text(
        "안녕하세요 대표님! AI 매거진 양방향 봇입니다.\n\n"
        "✨ [Gemini V2 딥 리서치 엔진] 구동 완료 ✨\n"
        "작성을 원하시는 주제를 편하게 입력해주세요."
    )
    return TOPIC

async def receive_topic(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    if user_id != AUTHORIZED_USER_ID:
        return ConversationHandler.END

    topic = update.message.text
    context.user_data['topic'] = topic
    
    await update.message.reply_text(
        f"🚀 주제 [{topic}] 접수 완료! 키보드를 숨깁니다.",
        reply_markup=ReplyKeyboardRemove()
    )
    msg = await update.message.reply_text("딥 리서치 및 고품질 초안 작성 파이프라인 가동 중...")
    
    async def status_callback(text):
        try:
            await msg.edit_text(f"💡 [{topic}] 초안 생성 진행 상황:\n\n{text}")
        except Exception:
            pass
            
    try:
        title, content_md = await generate_article_draft(topic, update_status=status_callback)
        context.user_data['draft_title'] = title
        context.user_data['draft_content'] = content_md
        
        await send_draft_and_ask_action(update, context, title, content_md)
            
    except Exception as e:
        await update.message.reply_text(f"❌ 초안 작성 중 시스템 오류가 발생했습니다: {str(e)}")
        return ConversationHandler.END
        
    return DRAFT_VERIFICATION

def parse_korean_time(time_str: str) -> datetime.datetime:
    kst = datetime.timezone(datetime.timedelta(hours=9))
    now = datetime.datetime.now(kst)
    
    # Try YYYY-MM-DD HH:MM pattern first
    m_date = re.search(r'(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})', time_str)
    if m_date:
        return datetime.datetime(
            int(m_date.group(1)), int(m_date.group(2)), int(m_date.group(3)),
            int(m_date.group(4)), int(m_date.group(5)), tzinfo=kst
        )

    time_str = time_str.replace(" ", "").lower()
    
    if "지금" in time_str or "바로" in time_str:
        return now
    
    if "내일" in time_str:
        target_date = now + datetime.timedelta(days=1)
        hour = 12
        m = re.search(r'(\d+)시', time_str)
        if m:
            hour = int(m.group(1))
            if "오후" in time_str and hour < 12:
                hour += 12
        return target_date.replace(hour=hour, minute=0, second=0, microsecond=0)
        
    if "모레" in time_str:
        target_date = now + datetime.timedelta(days=2)
        hour = 12
        m = re.search(r'(\d+)시', time_str)
        if m:
            hour = int(m.group(1))
            if "오후" in time_str and hour < 12:
                hour += 12
        return target_date.replace(hour=hour, minute=0, second=0, microsecond=0)

    # 기본값
    return now

async def send_draft_and_ask_action(update: Update, context: ContextTypes.DEFAULT_TYPE, title: str, content_md: str, query=None):
    # 텔레그램 메시지 길이 제한(4096자) 극복을 위한 분할 전송
    chat_id = update.effective_chat.id if update else query.message.chat_id
    bot = context.bot

    await bot.send_message(chat_id, f"✅ [{title}] 초안 텍스트 파싱을 완료했습니다.\n원고 내용을 아래에 연달아 보내드립니다. 👇")
    
    MAX_MSG_LEN = 4000
    for i in range(0, len(content_md), MAX_MSG_LEN):
        chunk = content_md[i:i+MAX_MSG_LEN]
        await bot.send_message(chat_id, chunk)
        await asyncio.sleep(0.5)

    keyboard = [
        [InlineKeyboardButton("✅ 완벽함! 이대로 매거진에 최종 발행하기", callback_data='publish')],
        [InlineKeyboardButton("✍️ 디자인/내용 수정 지시 (피드백)", callback_data='edit')],
        [InlineKeyboardButton("🔄 버려, 아예 처음부터 다른 시각으로 다시 써", callback_data='retry')],
        [InlineKeyboardButton("❌ 작업 취소 및 지우기", callback_data='cancel')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await bot.send_message(
        chat_id, 
        "대표님! 위 초안을 확인해주세요. 마음에 드시나요? 🤔\n(업로드 전이므로 수정은 DB상에 남지 않습니다.)", 
        reply_markup=reply_markup
    )

async def receive_time_and_publish(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    publish_time_str = update.message.text
    publish_date = parse_korean_time(publish_time_str)
    
    title = context.user_data.get('draft_title')
    content_md = context.user_data.get('draft_content')
    
    await update.message.reply_text(f"🕒 예약 시간: {publish_date.strftime('%Y년 %m월 %d일 %H:%M')}", reply_markup=ReplyKeyboardRemove())
    msg = await update.message.reply_text("Firestore 매거진 DB에 업로드 중...")
    
    try:
        await publish_to_firestore(title, content_md, publish_date)
        await msg.edit_text(
            text=f"🎉 성공! 사용자 승인본이 매거진에 최종 발행(예약)되었습니다.\n"
                 f"시간: {publish_date.strftime('%Y년 %m월 %d일 %H:%M')}\n"
                 f"나중에 세부 내용 수정이 필요하다면 rpa-app 웹사이트 매거진 어드민에서 직접 수정 가능합니다."
        )
    except Exception as e:
        await msg.edit_text(text=f"❌ DB 업로드 오류 발생: {str(e)}")
        
    return ConversationHandler.END

async def draft_action(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    
    action = query.data
    
    if action == 'publish':
        await query.edit_message_text(text="[승인됨] 발행 시간 입력을 대기합니다.")
        
        reply_markup = ReplyKeyboardMarkup(
            [["지금 바로 발행"]],
            one_time_keyboard=True,
            resize_keyboard=True
        )
        await context.bot.send_message(
            chat_id=query.message.chat_id,
            text="🚀 최종 승인하셨습니다! 작성된 글을 언제 발행할까요?\n"
                 "(예: '지금', '내일 오후 3시', '2024-11-01 10:00')",
            reply_markup=reply_markup
        )
        return PUBLISH_TIME
        
    elif action == 'edit':
        await query.edit_message_text(text="✍️ 수정하실 내용을 답변으로 자세히 적어 보내주세요.\n(예: '서론에서 RPA의 정의 부분을 좀 더 전문적으로 길게 써주고 어투를 좀 더 부드럽게 해줘')")
        return FEEDBACK
        
    elif action == 'retry':
        topic = context.user_data.get('topic')
        msg = await query.edit_message_text(text="🔄 기존 초안을 폐기하고 주제 관련 최신 자료를 재조사하여 완전히 새롭게 작성합니다...")
        
        async def status_callback(text):
            try:
                await msg.edit_text(f"💡 [{topic}] 전면 재작성 진행 상황:\n\n{text}")
            except Exception:
                pass
                
        try:
            title, content_md = await generate_article_draft(topic, update_status=status_callback)
            context.user_data['draft_title'] = title
            context.user_data['draft_content'] = content_md
            await send_draft_and_ask_action(None, context, title, content_md, query=query)
        except Exception as e:
            await context.bot.send_message(chat_id=query.message.chat_id, text=f"❌ 재작성 중 오류 발생: {str(e)}")
            return ConversationHandler.END
            
        return DRAFT_VERIFICATION
        
    elif action == 'cancel':
        await query.edit_message_text(text="❌ 매거진 생성 작업이 취소되었습니다. 저장 및 발행되지 않았습니다.")
        return ConversationHandler.END

async def receive_feedback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_feedback = update.message.text
    original_md = context.user_data.get('draft_content')
    
    msg = await update.message.reply_text("🔄 피드백 접수 완료! 대표님의 지시사항에 완벽하게 맞추어 초안 내용을 대대적으로 수정하고 있습니다...")
    
    async def status_callback(text):
        try:
            await msg.edit_text(f"💡 피드백 기반 리라이팅: \n\n{text}")
        except Exception:
            pass
            
    try:
        new_title, new_content_md = await rewrite_article_draft(original_md, user_feedback, update_status=status_callback)
        context.user_data['draft_title'] = new_title
        context.user_data['draft_content'] = new_content_md
        
        await send_draft_and_ask_action(update, context, new_title, new_content_md)
    except Exception as e:
        await update.message.reply_text(f"❌ 수정 중 오류 발생: {str(e)}")
        return ConversationHandler.END
        
    return DRAFT_VERIFICATION

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text("명령이 취소되었습니다.", reply_markup=ReplyKeyboardRemove())
    return ConversationHandler.END

def main() -> None:
    print("Telegram Bot Started... (Gemini Edition + Two-Way Interactive)")
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[
            CommandHandler("start", start),
            MessageHandler(filters.TEXT & ~filters.COMMAND, receive_topic)
        ],
        states={
            TOPIC: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_topic)],
            PUBLISH_TIME: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_time_and_publish)],
            DRAFT_VERIFICATION: [CallbackQueryHandler(draft_action)],
            FEEDBACK: [MessageHandler(filters.TEXT & ~filters.COMMAND, receive_feedback)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    app.add_handler(conv_handler)
    app.run_polling()

if __name__ == '__main__':
    main()
