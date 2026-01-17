document.addEventListener("DOMContentLoaded", () => {

  const bootScreen = document.getElementById("bootScreen");
  const roomsScreen = document.getElementById("roomsScreen");
  const identityScreen = document.getElementById("identityScreen");
  const chatScreen = document.getElementById("chatScreen");

  const rooms = document.querySelectorAll(".room");
  const roomCounts = document.querySelectorAll(".room-count");
  const globalCount = document.getElementById("globalCount");

  const joiningRoomTitle = document.getElementById("joiningRoomTitle");
  const nicknameInput = document.getElementById("nicknameInput");
  const randomNickBtn = document.getElementById("randomNick");
  const enterChatBtn = document.getElementById("enterChatBtn");
  const backToRoomsBtn = document.getElementById("backToRooms");

  const messagesBox = document.getElementById("messages");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  let nickname = "";
  let selectedRoom = "";

  function show(screen) {
    [bootScreen, roomsScreen, identityScreen, chatScreen]
      .forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
  }

  function generateNick() {
    return "anon_" + Math.floor(Math.random() * 9000 + 1000);
  }

  /* CONTADORES */
  let totalUsers = Math.floor(Math.random() * 12) + 3;
  globalCount.textContent = totalUsers;

  roomCounts.forEach(c => {
    c.textContent = "👤 " + (Math.floor(Math.random() * 8) + 1);
  });

  /* SALAS */
  rooms.forEach(room => {
    room.onclick = () => {
      const counter = room.querySelector(".room-count");
      let n = parseInt(counter.textContent.replace(/\D/g, ""));
      counter.textContent = "👤 " + (n + 1);

      selectedRoom = room.dataset.room;
      joiningRoomTitle.textContent = `JOINING ROOM\n${room.textContent}`;
      show(identityScreen);
    };
  });

  randomNickBtn.onclick = () => {
    nicknameInput.value = generateNick();
  };

  backToRoomsBtn.onclick = () => {
    show(roomsScreen);
  };

  enterChatBtn.onclick = () => {
    if (!nicknameInput.value.trim()) {
      alert("Debes elegir un nickname");
      return;
    }
    nickname = nicknameInput.value.trim();
    messagesBox.innerHTML = "";
    systemMessage(`Has entrado a ${selectedRoom}`);
    systemMessage(`Tu identidad: ${nickname}`);
    show(chatScreen);
  };

  function systemMessage(text) {
    const div = document.createElement("div");
    div.textContent = text;
    messagesBox.appendChild(div);
  }

  sendBtn.onclick = () => {
    if (!chatInput.value.trim()) return;
    systemMessage(`${nickname}: ${chatInput.value}`);
    chatInput.value = "";
  };

  show(roomsScreen);
});
