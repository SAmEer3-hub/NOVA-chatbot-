from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from chatbot import (
    is_greeting, is_time_query, is_date_query, is_news_query,
    get_greeting_response, get_time_response, get_date_response
)
from news import get_latest_news
from gemini_chat import get_ai_response

app = FastAPI(title="NovaAI Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.get("/")
def root():
    return {"status": "NovaAI backend is running"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    message = request.message.strip()

    if not message:
        return ChatResponse(reply="Please type something so I can help you!")

    if is_news_query(message):
        reply = await get_latest_news()
    elif is_time_query(message):
        reply = get_time_response()
    elif is_date_query(message):
        reply = get_date_response()
    elif is_greeting(message):
        reply = get_greeting_response()
    else:
        reply = await get_ai_response(message)

    return ChatResponse(reply=reply)