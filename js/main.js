const bootScreen = document.getElementById("bootScreen");
const roomsScreen = document.getElementById("roomsScreen");
const chatScreen = document.getElementById("chatScreen");

const terminalOutput = document.getElementById("terminalOutput");
const roomTitle = document.getElementById("roomTitle");
const messagesBox = document.getElementById("messages");

const privateTab = document.getElementById("privateTab");
const privateUserSpan = document.getElementById("privateUser");
const closePrivateBtn = document.getElementById("closePrivate");

let currentRoom = null;
let privateChatUser = null;

/* TERMINAL */
const bootLines = [
  "> UMBRALA SYSTEM v3.0",
  "> Initializing anonymous core...",
  "> [OK] Encryption enabled",
  "> [OK] No logs policy active",
  "> Loading rooms...",
  "",
  "> Ready."
];

let line = 0;
function typeTerminal(){
  if(line < bootLines.length){
    terminalOutput.textContent += bootLines[line] + "\n";
    line++;
    setTimeout(typeTerminal, 420);
  }else{
    setTimeout(()=>{
      bootScreen.classList.remove("active");
      roomsScreen.classList.add("active");
    }, 900);
  }
}
typeTerminal();

/* SALAS */
document.querySelectorAll(".room").forEach(btn=>{
  btn.onclick = ()=>{
    currentRoom = btn.textContent;
    openChat();
  };
});

function openChat(){
  roomsScreen.classList.remove("active");
  chatScreen.classList.add("active");
  roomTitle.textContent = currentRoom;
}

/* MENSAJES */
function addMessage(text, type="public"){
  const div = document.createElement("div");
  div.className = "message" + (type==="private" ? " private":"");
  div.textContent = text;
  messagesBox.appendChild(div);
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

/* CHAT PRIVADO */
document.querySelectorAll(".user-item").forEach(u=>{
  u.onclick = ()=>{
    openPrivateChat(u.dataset.nick);
  };
});

function openPrivateChat(nick){
  privateChatUser = nick;
  privateUserSpan.textContent = "@"+nick;
  privateTab.classList.remove("hidden");
  addMessage(`Chat privado con @${nick}`);
}

closePrivateBtn.onclick = ()=>{
  privateChatUser = null;
  privateTab.classList.add("hidden");
  addMessage("Volviste a la sala");
};

/* INPUT */
document.getElementById("sendBtn").onclick = ()=>{
  const input = document.getElementById("msgInput");
  if(!input.value.trim()) return;

  if(privateChatUser){
    addMessage(`(Privado → @${privateChatUser}) ${input.value}`,"private");
  }else{
    addMessage(input.value);
  }
  input.value="";
};
