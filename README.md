# NovaAI

NovaAI is a dark-themed AI chat interface built with HTML, CSS, and
vanilla JavaScript. It provides a chat-style experience with
conversation history, quick-start prompts, a responsive sidebar, and a
backend API connection for generating replies.

> **Project status:** This README is based on the frontend files
> currently provided (`index.html`, `style.css`, and `script.js`). The
> backend implementation has not been reviewed yet, so the AI model,
> backend framework, and exact server setup are not specified here.

## Features

-   **Chat interface** with user and assistant message bubbles.
-   **Backend-powered replies** through a `POST /chat` request.
-   **Conversation history** saved in the browser using `localStorage`.
-   **Multiple conversations** with new-chat, switch-conversation, and
    delete-conversation actions.
-   **Automatic conversation titles** based on the first user message.
-   **Quick prompts** for the current time, today's date, latest news,
    and learning something interesting.
-   **Responsive layout** with a mobile sidebar menu.
-   **Typing indicator** while a response is being generated.
-   **Keyboard support:** press `Enter` to send and `Shift + Enter` to
    add a new line.
-   **Dark UI** styled with custom CSS, Tailwind CSS, and Google Fonts /
    Material Symbols.

## Tech Stack

### Frontend

-   HTML5
-   CSS3
-   JavaScript (vanilla)
-   Tailwind CSS via CDN
-   Google Fonts (Geist and Inter)
-   Material Symbols

### Backend integration

The frontend sends messages to:

``` text
POST http://127.0.0.1:8000/chat
Content-Type: application/json
```

Request body:

``` json
{
  "message": "Your message here"
}
```

The frontend expects a JSON response containing a `reply` field, for
example:

``` json
{
  "reply": "Assistant response goes here"
}
```

These request and response details are inferred from the current
frontend JavaScript. Confirm them against the backend before publishing
the final README.

## Project Structure

``` text
NovaAI/
├── index.html     # Main chat interface
├── style.css      # Custom styling and animations
├── script.js      # Chat interactions, local history, and API calls
└── README.md
```

The backend should be documented alongside these files or in its own
folder/repository, depending on how the project is organized.

## Getting Started

### Prerequisites

-   A modern web browser
-   A local static web server or development server
-   The NovaAI backend running at `http://127.0.0.1:8000`, with a
    `POST /chat` endpoint

The backend framework, language, AI provider, and any environment
variables need to be confirmed from the backend source code.

### Run the frontend

1.  Place `index.html`, `style.css`, and `script.js` in the same
    directory.

2.  Start a local static web server from that directory. For example, if
    Python is installed:

    ``` bash
    python -m http.server 5500
    ```

3.  Open `http://localhost:5500` in your browser.

4.  Start the backend separately and make sure it serves the expected
    `/chat` endpoint on port `8000`.

> Opening the HTML file directly may work for parts of the interface,
> but using a local web server is recommended. Chat replies will not
> work unless the backend is running and reachable.

## How It Works

1.  The user enters a message or chooses a suggested prompt.
2.  JavaScript saves the message to the current conversation in browser
    `localStorage`.
3.  The frontend sends the message as JSON to the backend's `/chat`
    endpoint.
4.  While waiting, the interface displays a typing indicator.
5.  The frontend reads the response's `reply` field and displays it in
    the chat.
6.  Conversation data and the current conversation ID are saved in
    `localStorage` so they can be restored on a later visit in the same
    browser.

## Configuration

The backend URL is currently defined near the top of `script.js`:

``` javascript
const API_URL = "http://127.0.0.1:8000/chat";
```

Change this value if your backend runs at a different URL. For
deployment, configure the correct reachable backend URL and use HTTPS
where appropriate. If the frontend and backend are hosted on different
origins, the backend may also need suitable CORS configuration.

## Current Limitations / Notes

-   Chat responses depend on the backend; the provided frontend files do
    not contain the AI model implementation.
-   Conversation history is stored in the current browser's
    `localStorage`, not in a shared cloud database.
-   The frontend displays a connection error message when the backend
    request fails.
-   The sidebar includes Analytics, Discovery, Settings, and Profile
    items, but their full functionality is not established by the
    provided files.
-   The page loads Tailwind CSS and fonts from external CDNs, so those
    resources require internet access.
-   Do not commit API keys, credentials, or other secrets to a public
    repository.

## Future Improvements

-   Add a settings panel for backend configuration.
-   Add loading, retry, and more descriptive error states.
-   Support message editing, copying, and chat export.
-   Add authentication and synchronized chat history if needed.
-   Improve accessibility and test the interface across browsers and
    screen sizes.
-   Document backend installation, model/provider setup, environment
    variables, and deployment once the backend source is reviewed.

## License

No license information was provided. Add a `LICENSE` file before
presenting this project as open source.

## Author

**Sameer Kumar Singh**

-   GitHub: [SAmEer3-hub](https://github.com/SAmEer3-hub)
# NOVA-chatbot-
