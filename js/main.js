const screens = {
  boot: boot,
  rooms: rooms,
  join: join,
  chat: chat
};

function show(id) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  id.classList.add("active");
}

/* BOOT */
const bootLines = [
  "> UMBRALA SYSTEM v2.4.1",
  "> Initializing secure connection...",
  "> [OK] Encryption module loaded",
  "> [OK] Anonymous routing enabled",
  "> [OK] No logs policy active",
  "> Loading chat nodes..."
];

let i = 0;
const bootText = document.getElementById("bootText");

const interval = setInterval(() => {
  bootText.textContent += bootLines[i] + "\n";
  i++;
  if (i === bootLines.length) {
    clearInterval(interval);
    setTimeout(() => show(rooms), 1000);
  }
}, 600);

/* SALAS */
document.querySelectorAll(".room-card").forEach(card => {
  card.onclick = () => {
    roomName.textContent = card.dataset.room;
    show(join);
  };
});

/* JOIN */
randomNick.onclick = () => {
  nickname.value = "anon" + Math.floor(Math.random()*9999);
};

enterChat.onclick = () => {
  if (!nickname.value) return;
  chatRoom.textContent = roomName.textContent;
  show(chat);
};

/* CHAT */
sendBtn.onclick = send;
messageInput.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function send() {
  if (!messageInput.value) return;
  const div = document.createElement("div");
  div.className = "msg";
  div.textContent = nickname.value + ": " + messageInput.value;
  messages.appendChild(div);
  messageInput.value = "";
  messages.scrollTop = messages.scrollHeight;
}

imgBtn.onclick = () => imageInput.click();
