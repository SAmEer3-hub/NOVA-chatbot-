const API_URL = "http://127.0.0.1:8000/chat";
const STORAGE_KEY = "novaai_conversations";
const CURRENT_KEY = "novaai_current";

const sidebar = document.getElementById("sidebar");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
const conversationList = document.getElementById("conversationList");
const newChatBtn = document.getElementById("newChatBtn");
const contextHeader = document.getElementById("contextHeader");
const currentTitleEl = document.getElementById("currentTitle");
const emptyState = document.getElementById("emptyState");
const chatWindow = document.getElementById("chatWindow");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let conversations = [];
let currentId = null;

// ---------- storage ----------

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  localStorage.setItem(CURRENT_KEY, currentId);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    conversations = raw ? JSON.parse(raw) : [];
  } catch {
    conversations = [];
  }
  currentId = localStorage.getItem(CURRENT_KEY);
  const stillExists = conversations.some((c) => c.id === currentId);
  if (!stillExists) {
    currentId = conversations.length ? conversations[0].id : null;
  }
  if (!conversations.length) {
    createConversation();
  }
}

function getCurrent() {
  return conversations.find((c) => c.id === currentId);
}

// ---------- conversation actions ----------

function createConversation() {
  const convo = { id: uid(), title: "New chat", createdAt: Date.now(), messages: [] };
  conversations.unshift(convo);
  currentId = convo.id;
  saveState();
  renderSidebar();
  renderMain();
  closeSidebarMobile();
}

function switchConversation(id) {
  currentId = id;
  saveState();
  renderSidebar();
  renderMain();
  closeSidebarMobile();
}

function deleteConversation(id) {
  conversations = conversations.filter((c) => c.id !== id);
  if (currentId === id) {
    currentId = conversations.length ? conversations[0].id : null;
  }
  if (!conversations.length) {
    createConversation();
    return;
  }
  saveState();
  renderSidebar();
  renderMain();
}

// ---------- rendering: sidebar ----------

function renderSidebar() {
  conversationList.innerHTML = "";
  if (!conversations.length) return;

  conversations.forEach((c) => {
    const item = document.createElement("a");
    item.href = "#";
    item.className =
      "group flex items-center gap-3 py-2 px-4 mx-xs rounded-xl font-body-md text-sm truncate transition-all duration-200 " +
      (c.id === currentId
        ? "bg-white/5 text-on-surface border border-white/5"
        : "text-on-surface-variant hover:bg-white/5");

    item.innerHTML = `
      <span class="material-symbols-outlined text-sm ${c.id === currentId ? "text-primary" : ""}">chat_bubble${c.id === currentId ? "" : "_outline"}</span>
      <span class="truncate flex-1">${escapeHtml(c.title)}</span>
      <button class="delete-btn opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-error p-1 rounded-md" title="Delete conversation" aria-label="Delete conversation">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    `;

    item.addEventListener("click", (e) => {
      if (e.target.closest(".delete-btn")) return;
      e.preventDefault();
      switchConversation(c.id);
    });
    item.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteConversation(c.id);
    });

    conversationList.appendChild(item);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- rendering: main area ----------

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderMain() {
  const convo = getCurrent();
  if (!convo) return;

  currentTitleEl.textContent = convo.title;

  if (convo.messages.length === 0) {
    emptyState.classList.remove("hidden");
    chatWindow.classList.add("hidden");
    chatWindow.classList.remove("flex");
    contextHeader.classList.add("hidden");
    contextHeader.classList.remove("md:flex");
  } else {
    emptyState.classList.add("hidden");
    chatWindow.classList.remove("hidden");
    chatWindow.classList.add("flex");
    contextHeader.classList.remove("hidden");
    contextHeader.classList.add("md:flex");
    chatWindow.innerHTML = "";
    convo.messages.forEach((m) => renderBubble(m.role, m.text, m.time));
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
}

function renderBubble(role, text, time) {
  const wrap = document.createElement("div");

  if (role === "user") {
    wrap.className = "flex justify-end w-full";
    wrap.innerHTML = `
      <div class="max-w-[85%] md:max-w-[70%] bg-surface-container-high rounded-2xl rounded-br-sm p-5 border border-primary/20 shadow-lg shadow-black/20">
        <p class="font-body-md text-body-md text-on-surface whitespace-pre-wrap">${escapeHtml(text)}</p>
      </div>
      <div class="w-8 h-8 rounded-full bg-surface-container ml-3 flex-shrink-0 border border-white/10 flex items-center justify-center mt-auto">
        <span class="material-symbols-outlined text-on-surface-variant text-sm">person</span>
      </div>
    `;
  } else {
    wrap.className = "flex justify-start w-full";
    wrap.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary-container mr-3 flex-shrink-0 shadow-lg flex items-center justify-center mt-auto">
        <span class="material-symbols-outlined text-on-primary-container text-sm">auto_awesome</span>
      </div>
      <div class="max-w-[85%] md:max-w-[75%] bg-surface-container/40 backdrop-blur-md rounded-2xl rounded-bl-sm p-5 border border-white/10 shadow-sm">
        <p class="font-body-md text-body-md text-on-surface whitespace-pre-wrap">${escapeHtml(text)}</p>
      </div>
    `;
  }
  chatWindow.appendChild(wrap);
}

function showThinking(show) {
  const existing = document.getElementById("thinkingRow");
  if (show && !existing) {
    const row = document.createElement("div");
    row.id = "thinkingRow";
    row.className = "flex justify-start w-full mt-2";
    row.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-surface-container mr-3 flex-shrink-0 flex items-center justify-center mt-auto opacity-50">
        <span class="material-symbols-outlined text-primary text-sm">smart_toy</span>
      </div>
      <div class="bg-surface-container/40 backdrop-blur-md rounded-2xl rounded-bl-sm px-5 py-4 border border-white/5 flex items-center gap-1">
        <div class="typing-indicator flex gap-1"><span></span><span></span><span></span></div>
        <span class="text-xs font-label-md text-on-surface-variant ml-2">Nova is generating...</span>
      </div>
    `;
    chatWindow.appendChild(row);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } else if (!show && existing) {
    existing.remove();
  }
}

// ---------- message handling ----------

function addMessage(text, role) {
  const convo = getCurrent();
  const wasEmpty = convo.messages.length === 0;
  const time = Date.now();
  convo.messages.push({ role, text, time });

  if (role === "user" && convo.title === "New chat") {
    convo.title = text.length > 32 ? text.slice(0, 32) + "…" : text;
  }

  saveState();

  if (wasEmpty) {
    renderMain();
  } else {
    renderBubble(role, text, time);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }
  renderSidebar();
  currentTitleEl.textContent = convo.title;
}

async function sendMessage(overrideText) {
  const text = (overrideText ?? messageInput.value).trim();
  if (!text) return;

  addMessage(text, "user");
  messageInput.value = "";
  autoResize();
  sendBtn.disabled = true;
  showThinking(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    showThinking(false);
    addMessage(data.reply, "bot");
  } catch (error) {
    showThinking(false);
    addMessage("Connection lost. Check that the backend server is running.", "bot");
  } finally {
    sendBtn.disabled = false;
    messageInput.focus();
  }
}

function autoResize() {
  messageInput.style.height = "auto";
  messageInput.style.height = Math.min(messageInput.scrollHeight, 128) + "px";
}

// ---------- sidebar toggle (mobile) ----------

function openSidebarMobile() {
  sidebar.classList.remove("hidden");
  sidebar.classList.add("flex");
  sidebarBackdrop.classList.remove("hidden");
}
function closeSidebarMobile() {
  if (window.innerWidth >= 768) return; // desktop keeps sidebar always visible
  sidebar.classList.add("hidden");
  sidebar.classList.remove("flex");
  sidebarBackdrop.classList.add("hidden");
}

// ---------- events ----------

sendBtn.addEventListener("click", () => sendMessage());

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
messageInput.addEventListener("input", autoResize);

newChatBtn.addEventListener("click", createConversation);
mobileMenuBtn.addEventListener("click", openSidebarMobile);
sidebarCloseBtn.addEventListener("click", closeSidebarMobile);
sidebarBackdrop.addEventListener("click", closeSidebarMobile);

document.querySelectorAll(".suggestion-card").forEach((card) => {
  card.addEventListener("click", () => sendMessage(card.dataset.prompt));
});

// keep sidebar visible on desktop resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) {
    sidebar.classList.remove("hidden");
    sidebar.classList.add("flex");
    sidebarBackdrop.classList.add("hidden");
  }
});

// ---------- init ----------

loadState();
renderSidebar();
renderMain();
if (window.innerWidth >= 768) {
  sidebar.classList.remove("hidden");
  sidebar.classList.add("flex");
}