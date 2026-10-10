import re
from datetime import datetime

GREETING_PATTERNS = [
    r'\bhi+\b', r'\bhe+llo+\b', r'\bhe+y+\b',
    r'good morning', r'good afternoon', r'good evening', r'\bhola\b'
]

TIME_KEYWORDS = ['what time', 'current time', 'time is it', 'tell me the time']
DATE_KEYWORDS = ['what date', "today's date", 'todays date', 'what day is it', 'current date']
NEWS_KEYWORDS = ['news', 'headlines', 'latest news', "what's happening", 'whats happening']


def is_greeting(message: str) -> bool:
    msg = message.lower()
    return any(re.search(p, msg) for p in GREETING_PATTERNS)


def is_time_query(message: str) -> bool:
    msg = message.lower()
    return any(k in msg for k in TIME_KEYWORDS)


def is_date_query(message: str) -> bool:
    msg = message.lower()
    return any(k in msg for k in DATE_KEYWORDS)


def is_news_query(message: str) -> bool:
    msg = message.lower()
    return any(k in msg for k in NEWS_KEYWORDS)


def get_greeting_response() -> str:
    return "Hello! 👋 I'm NovaAI. How can I help you today?"


def get_time_response() -> str:
    now = datetime.now()
    return f"The current time is {now.strftime('%I:%M %p')}."


def get_date_response() -> str:
    now = datetime.now()
    return f"Today's date is {now.strftime('%B %d, %Y')}."