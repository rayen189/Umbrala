let currentRoom = null;
let currentUser = null;
let users = [];

function switchScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ===== ROOMS ===== */
function goToRooms(){
  switchScreen('roomsScreen');
}

/* ===== OPEN ROOM ===== */
function openRoom(room){
  currentRoom = room;
  joinRoomName.textContent = room;
  joinScreen.classList.remove('hidden');
}

/* ===== RANDOM NICK ===== */
randomNick.onclick = ()=>{
  const base = ["Ghost","Umbra","Void","Echo","Null"];
  nicknameInput.value =
    base[Math.floor(Math.random()*base.length)] +
    Math.floor(Math.random()*99);
};

/* ===== ENTER CHAT ===== */
enterChat.onclick = ()=>{
  const nick = nicknameInput.value.trim();
  if(!nick) return alert("Elige un nickname");

  currentUser = nick;
  users = [nick];

  joinScreen.classList.add('hidden');
  roomTitle.textContent = currentRoom;
  switchScreen('chatScreen');

  messages.innerHTML="";
  addSystem(`Has entrado a ${currentRoom}`);
  updateUsers();
};

/* ===== SEND MESSAGE ===== */
function sendMessage(){
  const txt = msgInput.value.trim();
  if(!txt) return;
  addMessage(currentUser, txt);
  msgInput.value="";
}

function addMessage(user,text){
  const d = document.createElement('div');
  d.className="message";
  d.textContent = `${user}: ${text}`;
  messages.appendChild(d);
  messages.scrollTop = messages.scrollHeight;
}

function addSystem(text){
  const d = document.createElement('div');
  d.className="message";
  d.textContent = `[SYSTEM] ${text}`;
  messages.appendChild(d);
}

/* ===== USERS ===== */
function updateUsers(){
  userCount.textContent = `👥 ${users.length}`;
}

/* ===== BACK ===== */
function backToRooms(){
  switchScreen('roomsScreen');
}

/* ===== ROOT ===== */
function openRoot(){
  rootPanel.classList.toggle('hidden');
}

/* ===== IMAGE UPLOAD ===== */
imgInput.onchange = ()=>{
  const f = imgInput.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  const img = document.createElement("img");
  img.src = url;
  img.style.maxWidth="160px";
  img.style.border="1px solid #3cff8f";
  messages.appendChild(img);
};
