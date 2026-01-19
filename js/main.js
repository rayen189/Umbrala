const screens = {
  boot: document.getElementById("bootScreen"),
  rooms: document.getElementById("roomsScreen"),
  chat: document.getElementById("chatScreen")
};

const modal = document.getElementById("nickModal");
const modalTitle = document.getElementById("modalTitle");
const nickInput = document.getElementById("nickInput");
const nickError = document.getElementById("nickError");
const chatHeader = document.getElementById("chatHeader");

let currentRoom = "";
let nickname = "";

/* ===== SCREEN SWITCH ===== */
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo(0, 0);
}

/* ===== BOOT ===== */
setTimeout(() => {
  showScreen("rooms");
}, 2000);

/* ===== SALAS ===== */
document.addEventListener("click", e => {
  const room = e.target.closest(".room");
  if (!room) return;

  currentRoom = room.textContent.trim();
  modalTitle.textContent = currentRoom;
  nickInput.value = "";
  nickError.textContent = "";
  modal.classList.add("active");
});

/* ===== ENTRAR ===== */
document.getElementById("enterRoom").onclick = () => {
  const value = nickInput.value.trim();
  if (value.length < 2) {
    nickError.textContent = "Nickname muy corto";
    return;
  }

  nickname = value;
  modal.classList.remove("active");
  chatHeader.textContent = currentRoom;
  showScreen("chat");
};

/* ===== RANDOM NICK ===== */
document.getElementById("randomNick").onclick = () => {
  nickInput.value = "anon" + Math.floor(Math.random() * 9999);
};

/* ===== VOLVER ===== */
document.getElementById("backBtn").onclick = () => {
  showScreen("rooms");
};
