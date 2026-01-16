const screens = {
  init: document.getElementById("screen-init"),
  rooms: document.getElementById("screen-rooms"),
  chat: document.getElementById("screen-chat")
};

let isRoot = false;
let myNick = "anon-" + Math.floor(Math.random()*9999);
let currentRoom = "";

const channel = new BroadcastChannel("umbrala");

function show(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[screen].classList.add("active");
}

/* INIT */
document.getElementById("initBtn").onclick = () => show("rooms");

document.getElementById("rootLoginBtn").onclick = () => {
  const u = rootUser.value;
  const p = rootPass.value;
  if (u === "root" && p === "umbrala") {
    isRoot = true;
    document.getElementById("rootRoomBtn").classList.remove("hidden");
    alert("Root activo");
  }
};

/* NAV */
goHome.onclick = () => show("init");
exitBtn.onclick = () => show("init");

function enterRoom(room) {
  currentRoom = room;
  roomName.textContent = "Sala: " + room;
  show("chat");
}

function backToRooms() {
  show("rooms");
}

/* CHAT */
chatForm.onsubmit = e => {
  e.preventDefault();
  if (!messageInput.value) return;
  send({ type:"text", text: messageInput.value });
  messageInput.value = "";
};

imageBtn.onclick = () => imageInput.click();

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => send({ type:"image", data: reader.result });
  reader.readAsDataURL(file);
};

function send(payload) {
  payload.nick = myNick;
  payload.room = currentRoom;
  channel.postMessage(payload);
  render(payload);
}

channel.onmessage = e => {
  if (e.data.room !== currentRoom) return;
  if (e.data.nick === myNick) return;
  render(e.data);
};

function render(data) {
  const m = document.createElement("div");
  m.className = "message";

  if (data.type === "text") {
    m.textContent = `${data.nick}: ${data.text}`;
  } else {
    const img = document.createElement("img");
    img.src = data.data;
    m.append(`${data.nick}:`, img);
  }

  const t = document.createElement("span");
  t.className = "timer";
  let s = 8;
  t.textContent = s+"s";
  m.appendChild(t);

  messages.appendChild(m);
  setInterval(()=>{ 
    s--; 
    t.textContent=s+"s"; 
    if(s<=0) m.remove();
  },1000);
}
