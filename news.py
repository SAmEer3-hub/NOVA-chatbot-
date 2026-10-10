import os
import httpx
from dotenv import load_dotenv

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"


async def get_latest_news(country: str = "us", page_size: int = 5) -> str:
    if not NEWS_API_KEY:
        return "News service isn't configured yet. Please add a NEWS_API_KEY in the .env file."

    params = {
        "country": country,
        "pageSize": page_size,
        "apiKey": NEWS_API_KEY,
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(NEWS_API_URL, params=params)
            response.raise_for_status()
            data = response.json()

        articles = data.get("articles", [])
        if not articles:
            return "I couldn't find any news right now. Try again later."

        headlines = []
        for i, article in enumerate(articles, start=1):
            title = article.get("title", "No title")
            source = article.get("source", {}).get("name", "Unknown source")
            headlines.append(f"{i}. {title} ({source})")

        return "📰 Here are the latest headlines:\n\n" + "\n".join(headlines)

    except httpx.HTTPStatusError as e:
        return f"Sorry, I couldn't fetch the news right now (error {e.response.status_code})."
    except Exception:
        return "Sorry, something went wrong while fetching the news."