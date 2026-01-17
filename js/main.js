const bootScreen = document.getElementById("bootScreen");
const roomsScreen = document.getElementById("roomsScreen");
const identityScreen = document.getElementById("identityScreen");
const chatScreen = document.getElementById("chatScreen");

const terminalOutput = document.getElementById("terminalOutput");
const roomTitle = document.getElementById("roomTitle");
const identityRoom = document.getElementById("identityRoom");

const nicknameInput = document.getElementById("nicknameInput");
const randomNick = document.getElementById("randomNick");
const enterChat = document.getElementById("enterChat");

const messages = document.getElementById("messages");
const msgInput = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");
const imgInput = document.getElementById("imgInput");
const backRooms = document.getElementById("backRooms");

let currentRoom = "";
let nickname = "";

/* BOOT */
const bootLines = [
  "> UMBRALA SYSTEM v2.4.1",
  "> Inicializando sistema...",
  "> Conexión anónima establecida",
  "> Cargando nodos...",
  "> Sistema listo."
];

let i = 0;
function boot() {
  if (i < bootLines.length) {
    terminalOutput.textContent += bootLines[i] + "\n";
    i++;
    setTimeout(boot, 400);
  } else {
    setTimeout(() => {
      bootScreen.classList.remove("active");
      roomsScreen.classList.add("active");
    }, 1000);
  }
}
window.onload = boot;

/* SALAS */
document.querySelectorAll(".room").forEach(btn => {
  btn.onclick = () => {
    currentRoom = btn.textContent;
    roomsScreen.classList.remove("active");
    identityScreen.classList.add("active");
    identityRoom.textContent = `JOINING ROOM: ${currentRoom}`;
  };
});

/* NICKNAME */
randomNick.onclick = () => {
  nicknameInput.value = "anon_" + Math.floor(Math.random() * 9999);
};

enterChat.onclick = () => {
  nickname = nicknameInput.value.trim();
  if (!nickname) return alert("Elige un nickname");

  identityScreen.classList.remove("active");
  chatScreen.classList.add("active");
  roomTitle.textContent = currentRoom;

  systemMsg(`${nickname} ha entrado`);
};

/* CHAT */
sendBtn.onclick = sendMsg;
msgInput.onkeypress = e => e.key === "Enter" && sendMsg();

function sendMsg() {
  if (!msgInput.value) return;
  addMsg(nickname, msgInput.value);
  msgInput.value = "";
}

imgInput.onchange = () => {
  const file = imgInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = document.createElement("img");
    img.src = reader.result;
    img.className = "chat-img";
    messages.appendChild(img);
    autoRemove(img);
  };
  reader.readAsDataURL(file);
};

function addMsg(user, text) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<strong>${user}:</strong> ${text}`;
  messages.appendChild(div);
  autoRemove(div);
}

function systemMsg(text) {
  const div = document.createElement("div");
  div.className = "message system";
  div.textContent = `[SYSTEM] ${text}`;
  messages.appendChild(div);
}

function autoRemove(el) {
  setTimeout(() => el.classList.add("fade"), 4000);
  setTimeout(() => el.remove(), 6000);
}

backRooms.onclick = () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");
};
