let nick = "";
let room = "Norte";

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");

input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function saveNick() {
  const value = document.getElementById("nickInput").value.trim();
  if (!value) return;
  nick = value;
  document.getElementById("nickModal").classList.remove("active");
}

function sendMessage(content = null, type = "text", duration = 60000) {
  const text = content || input.value.trim();
  if (!text && !fileInput.files.length) return;

  const msg = document.createElement("div");
  msg.className = "message";
  msg.style.transitionDuration = duration + "ms";

  if (type === "image") {
    const img = document.createElement("img");
    img.src = content;
    img.style.maxWidth = "120px";
    msg.appendChild(img);
  } else if (type === "audio") {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = content;
    msg.appendChild(audio);
  } else {
    msg.textContent = nick + ": " + text;
  }

  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;

  setTimeout(() => msg.style.opacity = "0", 50);
  setTimeout(() => msg.remove(), duration);

  input.value = "";
  document.getElementById("sendSound").play();
}

function openFile() {
  fileInput.click();
}

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    if (file.type.startsWith("image"))
      sendMessage(e.target.result, "image", 60000);
    if (file.type.startsWith("audio"))
      sendMessage(e.target.result, "audio", 30000);
  };
  reader.readAsDataURL(file);
});

function leaveRoom() {
  location.reload();
}
