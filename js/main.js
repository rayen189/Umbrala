/* Screens */
const terminalScreen = document.getElementById("terminalScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

/* TERMINAL */
const terminal = document.getElementById("terminal");
const bootLines = [
  "booting umbrala.sys",
  "loading shadow.kernel",
  "mounting rooms.map",
  "syncing void.interface",
  "inicializando Umbrala..."
];

let line = 0;

function boot() {
  if (line < bootLines.length) {
    terminal.innerHTML += "> " + bootLines[line] + "<br>";
    line++;
    setTimeout(boot, 700);
  } else {
    setTimeout(() => {
      terminalScreen.classList.remove("active");
      roomsScreen.classList.add("active");
    }, 1000);
  }
}

boot();

/* SALAS */
document.querySelectorAll(".room").forEach(room => {
  room.onclick = () => {
    localStorage.setItem("room", room.dataset.room);
    roomsScreen.classList.remove("active");
    chatScreen.classList.add("active");
    document.getElementById("chatHeader").textContent =
      "Sala: " + room.textContent;
  };
});

/* CHAT */
const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const sendBtn = document.getElementById("sendBtn");

const banned = ["puta", "mierda", "fuck", "weon"];

function isClean(text) {
  return !banned.some(w => text.toLowerCase().includes(w));
}

function makeEphemeral(el) {
  let t = 30;
  const timer = setInterval(() => {
    t--;
    if (t <= 0) {
      el.style.opacity = 0;
      setTimeout(() => el.remove(), 500);
      clearInterval(timer);
    }
  }, 1000);
}

sendBtn.onclick = () => {
  if (input.value && isClean(input.value)) {
    const msg = document.createElement("div");
    msg.className = "message";
    msg.textContent = input.value;
    messages.appendChild(msg);
    makeEphemeral(msg);
  }

  if (fileInput.files[0]) {
    const f = fileInput.files[0];
    let el;

    if (f.type.startsWith("image")) {
      el = document.createElement("img");
      el.src = URL.createObjectURL(f);
      el.style.maxWidth = "200px";
    } else {
      el = document.createElement("audio");
      el.src = URL.createObjectURL(f);
      el.controls = true;
    }

    el.className = "message";
    messages.appendChild(el);
    makeEphemeral(el);
  }

  input.value = "";
  fileInput.value = "";
};
