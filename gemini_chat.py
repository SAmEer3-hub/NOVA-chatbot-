import os
from datetime import datetime
from typing import List, Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def _system_instruction() -> str:
    now = datetime.now()
    return (
        "You are NovaAI, a friendly, knowledgeable, general-purpose AI assistant. "
        "You can help with absolutely anything the user brings up: casual chat, "
        "factual questions, explanations, advice, writing, coding, math, current "
        "events, or anything else \u2014 the same way any capable AI assistant would. "
        "Don't restrict yourself to a fixed menu of topics or commands. "
        "If a question needs current or live information (news, prices, scores, "
        "recent events, etc.), use Google Search to check facts before answering. "
        f"For reference, right now it is {now.strftime('%A, %B %d, %Y, %I:%M %p')}. "
        "Keep answers clear and reasonably concise unless the user asks for more detail."
    )


async def get_ai_response(message: str, history: Optional[List[dict]] = None) -> str:
    if not client:
        return "AI service isn't configured yet. Please add a GEMINI_API_KEY in the .env file."

    # Turn stored conversation history into Gemini's expected format.
    # Our frontend stores roles as "user" / "bot" -> Gemini wants "user" / "model".
    contents = []
    for turn in (history or []):
        role = "model" if turn.get("role") == "bot" else "user"
        text = (turn.get("text") or "").strip()
        if text:
            contents.append(types.Content(role=role, parts=[types.Part(text=text)]))

    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))

    try:
        response = client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=_system_instruction(),
                tools=[types.Tool(google_search=types.GoogleSearch())],
            ),
        )
        return response.text or "Sorry, I couldn't come up with a response."
    except Exception as e:
        return f"Sorry, something went wrong talking to the AI: {str(e)}"