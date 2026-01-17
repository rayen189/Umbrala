const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");
const roomTitle = document.getElementById("roomTitle");

const messages = document.getElementById("messages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const backRooms = document.getElementById("backRooms");
const toggleUsers = document.getElementById("toggleUsers");
const usersList = document.getElementById("usersList");
const usersUl = document.getElementById("users");

// ===== ROOMS =====
document.querySelectorAll(".room-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    roomTitle.textContent = btn.dataset.room;
    roomsScreen.classList.remove("active");
    chatScreen.classList.add("active");
    messages.innerHTML = "";
  });
});

backRooms.addEventListener("click", () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");
});

// ===== USERS =====
toggleUsers.addEventListener("click", () => {
  usersList.classList.toggle("hidden");
});

// fake users demo
["Xime", "Oracle", "Specter"].forEach(u => {
  const li = document.createElement("li");
  li.textContent = u;
  usersUl.appendChild(li);
});

// ===== CHAT =====
function addMessage(author, text) {
  const div = document.createElement("div");
  div.className = "message " + (author === "yo" ? "me" : "");
  div.textContent = `${author}: ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  addMessage("yo", text);
  chatInput.value = "";
}

// botón
sendBtn.addEventListener("click", sendMessage);

// Enter (PC + móvil)
chatInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
