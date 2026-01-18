const terminalScreen = document.getElementById("terminalScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

const terminal = document.getElementById("terminal");

const bootLines = [
  "ejecutando kernel.um",
  "cargando shadow.core",
  "montando rooms.map",
  "sincronizando void.interface",
  "estado: estable",
  "inicializando UMBRALA..."
];

let i = 0;

function boot() {
  if (i < bootLines.length) {
    terminal.innerHTML += "> " + bootLines[i] + "<br>";
    i++;
    setTimeout(boot, 700);
  } else {
    setTimeout(() => {
      terminalScreen.classList.remove("active");
      roomsScreen.classList.add("active");
    }, 1200);
  }
}
boot();

/* SALAS */
document.querySelectorAll(".room").forEach(room => {
  room.onclick = () => {
    roomsScreen.classList.remove("active");
    chatScreen.classList.add("active");
    document.getElementById("chatHeader").textContent = room.textContent;
  };
});

/* VOLVER */
document.getElementById("backBtn").onclick = () => {
  chatScreen.classList.remove("active");
  roomsScreen.classList.add("active");
};

/* CHAT */
const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const sendBtn = document.getElementById("sendBtn");

const banned = ["puta", "mierda", "fuck", "weon"];

function clean(text) {
  return !banned.some(w => text.toLowerCase().includes(w));
}

function ephemeral(el) {
  setTimeout(() => {
    el.style.opacity = 0;
    setTimeout(() => el.remove(), 500);
  }, 30000);
}

sendBtn.onclick = () => {
  if (input.value && clean(input.value)) {
    const m = document.createElement("div");
    m.className = "message";
    m.textContent = input.value;
    messages.appendChild(m);
    ephemeral(m);
  }

  if (fileInput.files[0]) {
    const f = fileInput.files[0];
    let el = f.type.startsWith("image")
      ? Object.assign(document.createElement("img"), { src: URL.createObjectURL(f), style: "max-width:200px" })
      : Object.assign(document.createElement("audio"), { src: URL.createObjectURL(f), controls: true });

    el.className = "message";
    messages.appendChild(el);
    ephemeral(el);
  }

  input.value = "";
  fileInput.value = "";
};
