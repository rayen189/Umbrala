document.addEventListener("DOMContentLoaded", () => {

  const bootScreen     = document.getElementById("bootScreen");
  const roomsScreen    = document.getElementById("roomsScreen");
  const identityScreen = document.getElementById("identityScreen");
  const chatScreen     = document.getElementById("chatScreen");

  const rooms = document.querySelectorAll(".room");

  const joiningRoomTitle = document.getElementById("joiningRoomTitle");
  const nicknameInput = document.getElementById("nicknameInput");
  const randomNickBtn = document.getElementById("randomNick");
  const enterChatBtn = document.getElementById("enterChatBtn");
  const backToRoomsBtn = document.getElementById("backToRooms");

  const messagesBox = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const roomTitle = document.getElementById("roomTitle");
  const backRooms = document.getElementById("backRooms");

  let selectedRoom = "";
  let nickname = "";

  function showScreen(screen) {
    [bootScreen, roomsScreen, identityScreen, chatScreen]
      .forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
  }

  function generateNick() {
    return "anon_" + Math.floor(Math.random() * 9000 + 1000);
  }

  /* BOOT */
  setTimeout(() => showScreen(roomsScreen), 2000);

  /* SALAS */
  rooms.forEach(room => {
    room.addEventListener("click", () => {
      selectedRoom = room.textContent.trim();
      joiningRoomTitle.textContent = `JOINING ROOM: ${selectedRoom}`;
      nicknameInput.value = "";
      showScreen(identityScreen);
    });
  });

  randomNickBtn.onclick = () => {
    nicknameInput.value = generateNick();
  };

  backToRoomsBtn.onclick = () => showScreen(roomsScreen);

  enterChatBtn.onclick = () => {
    if (!nicknameInput.value.trim()) {
      alert("Elige un nickname");
      return;
    }
    nickname = nicknameInput.value.trim();
    enterChat();
  };

  function enterChat() {
    roomTitle.textContent = selectedRoom;
    messagesBox.innerHTML = "";
    showScreen(chatScreen);
    systemMessage(`Has entrado a ${selectedRoom}`);
    systemMessage(`Tu identidad: ${nickname}`);
  }

  function systemMessage(text) {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  function userMessage(text) {
    const div = document.createElement("div");
    div.className = "message";
    div.innerHTML = `<b>${nickname}:</b> ${text}`;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  sendBtn.onclick = sendMessage;
  msgInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = msgInput.value.trim();
    if (!text) return;
    userMessage(text);
    msgInput.value = "";
  }

  backRooms.onclick = () => showScreen(roomsScreen);

});
