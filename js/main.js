document.addEventListener("DOMContentLoaded", () => {

  /* SCREENS */
  const bootScreen     = document.getElementById("bootScreen");
  const roomsScreen    = document.getElementById("roomsScreen");
  const identityScreen = document.getElementById("identityScreen");
  const chatScreen     = document.getElementById("chatScreen");

  const allScreens = [bootScreen, roomsScreen, identityScreen, chatScreen];

  const terminalOutput = document.getElementById("terminalOutput");

  /* SALAS */
  const rooms = document.querySelectorAll(".room");
  const roomCounts = document.querySelectorAll(".room-count");
  const globalCount = document.getElementById("globalCount");

  /* IDENTIDAD */
  const joiningRoomTitle = document.getElementById("joiningRoomTitle");
  const nicknameInput = document.getElementById("nicknameInput");
  const randomNickBtn = document.getElementById("randomNick");
  const enterChatBtn = document.getElementById("enterChatBtn");
  const backToRoomsBtn = document.getElementById("backToRooms");

  /* CHAT */
  const messagesBox = document.getElementById("messages");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");

  let nickname = "";
  let selectedRoom = "";

  /* ===============================
     SCREEN CONTROL (FORZADO)
     =============================== */
  function show(screen) {
    allScreens.forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
  }

  /* ===============================
     BOOT SEQUENCE
     =============================== */
  const bootLines = [
    "Inicializando UMBRALA...",
    "Cargando núcleo efímero",
    "Anónimo",
    "Sin rastros",
    "Sin identidad",
    "Efímero",
    "Mensajes desaparecen",
    "Seguro",
    "Conexión encriptada",
    "Privado",
    "No log",
    "No tracking",
    "Sistema listo",
    "Accediendo a salas..."
  ];

  let bootIndex = 0;

  function bootSequence() {
    if (bootIndex < bootLines.length) {
      terminalOutput.textContent += bootLines[bootIndex] + "\n";
      bootIndex++;
      setTimeout(bootSequence, 420);
    } else {
      setTimeout(() => {
        show(roomsScreen);
      }, 700);
    }
  }

  /* ===============================
     CONTADORES (SIMULADOS)
     =============================== */
  let totalUsers = Math.floor(Math.random() * 12) + 3;
  globalCount.textContent = totalUsers;

  roomCounts.forEach(c => {
    c.textContent = "👤 " + (Math.floor(Math.random() * 8) + 1);
  });

  /* ===============================
     SALAS
     =============================== */
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

  /* ===============================
     IDENTIDAD
     =============================== */
  function generateNick() {
    return "anon_" + Math.floor(Math.random() * 9000 + 1000);
  }

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

  /* ===============================
     CHAT
     =============================== */
  function systemMessage(text) {
    const div = document.createElement("div");
    div.textContent = text;
    messagesBox.appendChild(div);
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }

  sendBtn.onclick = () => {
    if (!chatInput.value.trim()) return;
    systemMessage(`${nickname}: ${chatInput.value}`);
    chatInput.value = ""
    
  };

  // ===============================
// ENVIAR MENSAJE CON ENTER
// ===============================

  
sendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // evita salto de línea
    sendMessage();
  }
});
  
  
  /* ===============================
     START (CLAVE)
     =============================== */
  allScreens.forEach(s => s.classList.remove("active")); // ← CLAVE
  terminalOutput.textContent = "";
  show(bootScreen);
  bootSequence();

});

// ===============================
// BOTÓN TOGGLE USUARIOS (MÓVIL)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const usersList = document.getElementById("usersList");
  const chatScreen = document.getElementById("chatScreen");

  if (!usersList || !chatScreen) return;

  // crear botón
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "users-toggle";
  toggleBtn.textContent = "☰";

  chatScreen.appendChild(toggleBtn);

  // toggle usuarios
  toggleBtn.addEventListener("click", () => {
    usersList.classList.toggle("active");
  });
});
