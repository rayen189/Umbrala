// =======================================
// UMBRALA :: MAIN.JS — FULL ROOT VERSION
// =======================================

// ---------- CONFIG ROOT ----------
const ROOT = {
  nick: 'root',
  password: 'root123',
  secondary: 'umbralaSecret'
};

let currentUser = null;
let isRoot = false;
let rootSecured = false;
let freezeGlobal = false;
let currentRoom = null;

// ---------- SALAS ----------
const rooms = ['Norte', 'Centro', 'Sur', 'La Serena', 'VIP'];
const hiddenRooms = ['Sala Fantasma', 'Observatorio'];

const usersByRoom = {};
const messagesByRoom = {};

// ---------- ELEMENTOS ----------
const landingScreen = document.getElementById('landing-screen');
const roomsScreen = document.getElementById('rooms-screen');
const chatScreen = document.getElementById('chat-screen');
const roomsList = document.getElementById('rooms-list');
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const sendFileBtn = document.getElementById('send-file-btn');
const chatFile = document.getElementById('chat-file');
const usersList = document.getElementById('users-list');
const userCount = document.getElementById('user-count');
const exitRoomBtn = document.getElementById('exit-room');
const initBtn = document.getElementById('init-btn');
const siteTitle = document.getElementById('site-title');

// ROOT
const rootBtn = document.getElementById('root-btn');
const rootLogin = document.getElementById('root-login');
const rootNickInput = document.getElementById('root-nick');
const rootPassInput = document.getElementById('root-pass');
const rootLoginBtn = document.getElementById('root-login-btn');
const rootError = document.getElementById('root-error');

const rootTerminal = document.getElementById('root-terminal');
const rootConsole = document.getElementById('root-console');
const rootCmd = document.getElementById('root-command');
const rootExec = document.getElementById('root-exec');
const rootExit = document.getElementById('root-exit');

// ---------- NAVEGACIÓN ----------
function goHome() {
  landingScreen.style.display = 'block';
  roomsScreen.style.display = 'none';
  chatScreen.style.display = 'none';
  rootLogin.style.display = 'none';
  rootTerminal.style.display = 'none';
}

siteTitle.onclick = goHome;
document.getElementById('home-btn')?.addEventListener('click', goHome);
document.getElementById('home-btn-2')?.addEventListener('click', goHome);

// ---------- INICIO ----------
initBtn.onclick = () => {
  currentUser = 'anon_' + Math.floor(Math.random() * 9999);
  landingScreen.style.display = 'none';
  roomsScreen.style.display = 'block';
  showRooms();
};

rootBtn.onclick = () => {
  landingScreen.style.display = 'none';
  rootLogin.style.display = 'block';
};

// ---------- LOGIN ROOT ----------
rootLoginBtn.onclick = () => {
  if (
    rootNickInput.value === ROOT.nick &&
    rootPassInput.value === ROOT.password
  ) {
    isRoot = true;
    currentUser = ROOT.nick;
    rootLogin.style.display = 'none';
    rootTerminal.style.display = 'block';
    initRootTerminal();
  } else {
    rootError.textContent = 'Credenciales incorrectas';
  }
};

// ---------- ROOT TERMINAL ----------
function rootPrint(text) {
  const div = document.createElement('div');
  div.textContent = text;
  rootConsole.appendChild(div);
  rootConsole.scrollTop = rootConsole.scrollHeight;
}

function initRootTerminal() {
  rootConsole.innerHTML = '';
  rootPrint('UMBRALA :: ROOT TERMINAL');
  rootPrint('Modo observador activo 👁️');
  rootPrint('Ingrese clave secundaria:');
}

rootExec.onclick = () => {
  if (!rootCmd.value.trim()) return;
  execRootCommand(rootCmd.value.trim());
  rootCmd.value = '';
};

rootCmd.addEventListener('keydown', e => {
  if (e.key === 'Enter') rootExec.click();
});

rootExit.onclick = () => location.reload();

// ---------- GOD VIEW ULTRA ----------
let mapInterval = null;

const ROOM_COLORS = {
  Norte: '#00ffff',
  Centro: '#ff00ff',
  Sur: '#ffff00',
  'La Serena': '#7a7cff',
  VIP: '#ff007f',
  'Sala Fantasma': '#888',
  Observatorio: '#555'
};

function startGodView() {
  if (!rootSecured) {
    rootPrint('🔐 Acceso denegado');
    return;
  }

  if (mapInterval) clearInterval(mapInterval);

  mapInterval = setInterval(() => {
    rootConsole.innerHTML = '';
    rootPrint('🌌 UMBRALA :: GOD VIEW');

    rooms.concat(hiddenRooms).forEach(room => {
      const users = usersByRoom[room] || [];
      const color = ROOM_COLORS[room] || '#0ff';
      const label = hiddenRooms.includes(room) ? `🔒 ${room}` : room;

      const header = document.createElement('div');
      header.innerHTML = `%c[${label}] → ${users.length} usuario(s)`;
      header.style.color = color;
      header.style.textShadow = `0 0 10px ${color}`;
      rootConsole.appendChild(header);

      users.forEach(u => {
        const last = (messagesByRoom[room] || []).filter(m => m.user === u).slice(-1)[0];
        const line = document.createElement('div');
        line.innerHTML = `• ${u} : ${last ? last.text : '[sin mensajes]'}`;
        line.style.color = color;
        line.style.textShadow = `0 0 8px ${color}`;
        rootConsole.appendChild(line);
      });

      rootConsole.appendChild(document.createElement('br'));
    });
  }, 1500);
}

function stopGodView() {
  clearInterval(mapInterval);
  mapInterval = null;
  rootPrint('God View detenido');
}

// ---------- COMANDOS ROOT ----------
function execRootCommand(cmd) {
  if (!rootSecured) {
    if (cmd === ROOT.secondary) {
      rootSecured = true;
      rootPrint('🔓 ROOT SECURED — ACCESO TOTAL');
    } else {
      rootPrint('Clave secundaria incorrecta');
    }
    return;
  }

  rootPrint('> ' + cmd);

  if (cmd === '/map ultra') startGodView();
  else if (cmd === '/map stop') stopGodView();
  else if (cmd === '/freeze') toggleFreeze();
  else if (cmd === '/timeline') replayTimeline();
  else if (cmd === '/shutdown') shutdown();
  else if (cmd === '/help') {
    rootPrint('/map ultra | /map stop | /freeze | /timeline | /shutdown');
  } else {
    rootPrint('Comando desconocido');
  }
}

// ---------- SALAS ----------
function showRooms() {
  roomsList.innerHTML = '';
  rooms.forEach(room => {
    if (!usersByRoom[room]) usersByRoom[room] = [];
    if (!messagesByRoom[room]) messagesByRoom[room] = [];

    const div = document.createElement('div');
    div.innerHTML = `<strong>${room}</strong> (${usersByRoom[room].length})
      <button>Entrar</button>`;
    div.querySelector('button').onclick = () => enterRoom(room);
    roomsList.appendChild(div);
  });
}

// ---------- CHAT ----------
function enterRoom(room) {
  currentRoom = room;
  if (!usersByRoom[room].includes(currentUser))
    usersByRoom[room].push(currentUser);

  roomsScreen.style.display = 'none';
  chatScreen.style.display = 'block';
  document.getElementById('chat-room-name').textContent = room;
  renderChat();
  renderUsers();
}

sendBtn.onclick = () => {
  if (freezeGlobal) return;
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text);
  chatInput.value = '';
};

sendFileBtn.onclick = () => {
  if (!chatFile.files.length) return;
  const reader = new FileReader();
  reader.onload = e => addMessage('[archivo]', e.target.result);
  reader.readAsDataURL(chatFile.files[0]);
  chatFile.value = '';
};

exitRoomBtn.onclick = () => {
  chatScreen.style.display = 'none';
  roomsScreen.style.display = 'block';
  showRooms();
};

// ---------- MENSAJES ----------
function addMessage(text, file = null) {
  const msg = {
    user: currentUser,
    text,
    file,
    time: Date.now()
  };
  messagesByRoom[currentRoom].push(msg);
  renderChat();
}

function renderChat() {
  chatContainer.innerHTML = '';
  (messagesByRoom[currentRoom] || []).forEach(m => {
    const div = document.createElement('div');
    div.className = 'user';
    div.textContent = `${m.user}: ${m.text}`;
    if (m.file) {
      const el = document.createElement(
        m.file.startsWith('data:image') ? 'img' : 'video'
      );
      el.src = m.file;
      el.style.maxWidth = '200px';
      if (el.tagName === 'VIDEO') el.controls = true;
      div.appendChild(el);
    }
    chatContainer.appendChild(div);
  });
}

function renderUsers() {
  usersList.innerHTML = '';
  const users = usersByRoom[currentRoom] || [];
  userCount.textContent = users.length;
  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = u;
    usersList.appendChild(li);
  });
}

// ---------- SISTEMA ----------
function toggleFreeze() {
  freezeGlobal = !freezeGlobal;
  rootPrint(`Sistema ${freezeGlobal ? 'CONGELADO' : 'ACTIVO'}`);
}

function replayTimeline() {
  rootPrint('--- TIMELINE ---');
  Object.keys(messagesByRoom).forEach(room => {
    messagesByRoom[room].forEach(m => {
      rootPrint(`[${room}] ${m.user}: ${m.text}`);
    });
  });
}

function shutdown() {
  document.body.innerHTML = `
    <h1 style="color:#0ff;text-align:center;margin-top:40vh;">
      UMBRALA APAGADO
    </h1>`;
}
// ===============================
// SHADOWBAN REAL
// ===============================

// Objeto para almacenar los usuarios shadowbaneados
const shadowBannedUsers = {};

// Comando root: /shadowban nick
function shadowBanUser(nick) {
  shadowBannedUsers[nick] = true;
  rootPrint(`🕳️ Usuario ${nick} ahora está shadowbaneado`);
}

// Comando root: /unshadow nick
function unshadowUser(nick) {
  delete shadowBannedUsers[nick];
  rootPrint(`✅ Usuario ${nick} ya no está shadowbaneado`);
}

// Modificación de addMessage para shadowban
function addMessage(text, file = null) {
  const msg = {
    user: currentUser,
    text,
    file,
    time: Date.now()
  };

  // Si el usuario está shadowbaneado y no es root, el mensaje solo se guarda para él
  if (shadowBannedUsers[currentUser] && currentUser !== ROOT.nick) {
    // Crear un chat "fantasma" solo para el usuario
    if (!messagesByRoom[currentRoom + '_shadow']) messagesByRoom[currentRoom + '_shadow'] = [];
    messagesByRoom[currentRoom + '_shadow'].push(msg);
  } else {
    // Mensaje normal visible a todos
    if (!messagesByRoom[currentRoom]) messagesByRoom[currentRoom] = [];
    messagesByRoom[currentRoom].push(msg);
  }

  renderChat();
}

// Modificación de renderChat para shadowban
function renderChat() {
  chatContainer.innerHTML = '';
  const roomMsgs = messagesByRoom[currentRoom] || [];
  const shadowMsgs = messagesByRoom[currentRoom + '_shadow'] || [];

  // Todos los mensajes normales
  roomMsgs.forEach(m => {
    const div = document.createElement('div');
    div.className = 'user';
    div.textContent = `${m.user}: ${m.text}`;
    if (m.file) {
      const el = document.createElement(m.file.startsWith('data:image') ? 'img' : 'video');
      el.src = m.file;
      el.style.maxWidth = '200px';
      if (el.tagName === 'VIDEO') el.controls = true;
      div.appendChild(el);
    }
    chatContainer.appendChild(div);
  });

  // Mostrar shadow messages solo si el usuario es shadowbaneado
  if (shadowBannedUsers[currentUser] && currentUser !== ROOT.nick) {
    shadowMsgs.forEach(m => {
      const div = document.createElement('div');
      div.className = 'user';
      div.textContent = `${m.user}: ${m.text}`;
      if (m.file) {
        const el = document.createElement(m.file.startsWith('data:image') ? 'img' : 'video');
        el.src = m.file;
        el.style.maxWidth = '200px';
        if (el.tagName === 'VIDEO') el.controls = true;
        div.appendChild(el);
      }
      chatContainer.appendChild(div);
    });
  }

  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ---------- COMANDOS ROOT MODIFICADOS ----------
function execRootCommand(cmd) {
  if (!rootSecured) {
    if (cmd === ROOT.secondary) {
      rootSecured = true;
      rootPrint('🔓 ROOT SECURED — ACCESO TOTAL');
    } else {
      rootPrint('Clave secundaria incorrecta');
    }
    return;
  }

  rootPrint('> ' + cmd);

  if (cmd === '/map ultra') startGodView();
  else if (cmd === '/map stop') stopGodView();
  else if (cmd === '/freeze') toggleFreeze();
  else if (cmd === '/timeline') replayTimeline();
  else if (cmd === '/shutdown') shutdown();
  else if (cmd.startsWith('/shadowban ')) {
    const nick = cmd.split(' ')[1];
    shadowBanUser(nick);
  } else if (cmd.startsWith('/unshadow ')) {
    const nick = cmd.split(' ')[1];
    unshadowUser(nick);
  } else if (cmd === '/help') {
    rootPrint('/map ultra | /map stop | /freeze | /timeline | /shutdown | /shadowban nick | /unshadow nick');
  } else {
    rootPrint('Comando desconocido');
  }
}
