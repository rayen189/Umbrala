
// --------------------- Variables ---------------------
const chatContainer = document.getElementById('chat-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const alertContainer = document.getElementById('alert-container');
const roomSelect = document.getElementById('room-select');

const adminNickInput = document.getElementById('admin-nick');
const adminPassInput = document.getElementById('admin-pass');
const adminLoginBtn = document.getElementById('admin-login');
const adminLogoutBtn = document.getElementById('admin-logout');

const adminPanel = document.getElementById('admin-panel');
const targetUserInput = document.getElementById('target-user');
const banBtn = document.getElementById('ban-user');
const shadowbanBtn = document.getElementById('shadowban-user');
const clearRoomBtn = document.getElementById('clear-room');
const shutdownBtn = document.getElementById('shutdown-btn');
const shutdownTimerDiv = document.getElementById('shutdown-timer');
const adminLogDiv = document.getElementById('admin-log');

const ADMIN_NICK = 'root'; // Cambiar nick root
const ADMIN_PASS = '1234'; // Cambiar clave root
const ADMIN_STORAGE_KEY = 'umbrala_admin_logged';

let messages = [];
let shadowbannedUsers = JSON.parse(localStorage.getItem('umbrala_shadowbans')) || [];
let bannedUsers = JSON.parse(localStorage.getItem('umbrala_bans')) || [];
let adminLog = JSON.parse(localStorage.getItem('umbrala_admin_log')) || [];

let isAdmin = localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';

// --------------------- Funciones ---------------------
function renderMessages() {
  chatContainer.innerHTML = '';
  messages
    .filter(m => m.room === roomSelect.value)
    .forEach(msg => {
      if(shadowbannedUsers.includes(msg.user) || bannedUsers.includes(msg.user)) return;
      const div = document.createElement('div');
      div.classList.add('line');
      div.textContent = `${msg.user}: ${msg.text}`;
      if(isAdmin && msg.user === ADMIN_NICK) div.style.color = '#00ff00';
      chatContainer.appendChild(div);
    });
  chatContainer.scrollTop = chatContainer.scrollHeight;
  adminPanel.style.display = isAdmin ? 'block' : 'none';
  renderAdminLog();
}

function showAlert(text) {
  alertContainer.textContent = text;
  setTimeout(() => { alertContainer.textContent = ''; }, 3000);
}

function addAdminLog(event) {
  const timestamp = new Date().toLocaleString();
  adminLog.push(`[${timestamp}] ${event}`);
  localStorage.setItem('umbrala_admin_log', JSON.stringify(adminLog));
}

function renderAdminLog() {
  adminLogDiv.innerHTML = '';
  adminLog.forEach(l => {
    const div = document.createElement('div');
    div.textContent = l;
    adminLogDiv.appendChild(div);
  });
}

// --------------------- Eventos ---------------------
sendBtn.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if(!text) return;
  let user = isAdmin ? ADMIN_NICK : prompt("Escribe tu nick:") || 'Anon';

  // Comandos root
  if(isAdmin && text.startsWith('/')) {
    const parts = text.split(' ');
    const cmd = parts[0];
    const target = parts[1];

    switch(cmd){
      case '/ban':
        if(target){
          bannedUsers.push(target);
          localStorage.setItem('umbrala_bans', JSON.stringify(bannedUsers));
          messages = messages.filter(m=>m.user!==target);
          showAlert(`Usuario ${target} baneado via comando`);
          addAdminLog(`Usuario ${target} baneado`);
          renderMessages();
        }
        return;
      case '/shadowban':
        if(target){
          shadowbannedUsers.push(target);
          localStorage.setItem('umbrala_shadowbans', JSON.stringify(shadowbannedUsers));
          showAlert(`Usuario ${target} shadowbaneado via comando`);
          addAdminLog(`Usuario ${target} shadowbaneado`);
          renderMessages();
        }
        return;
      case '/clearsala':
        const room = roomSelect.value;
        messages = messages.filter(m=>m.room!==room);
        showAlert(`Sala ${room} limpiada via comando`);
        addAdminLog(`Sala ${room} limpiada`);
        renderMessages();
        return;
      default:
        showAlert(`Comando desconocido: ${cmd}`);
        return;
    }
  }

  messages.push({user,text,room:roomSelect.value});
  if(!isAdmin) messages.push({user:'Umbrala',text:`Eco -> ${text}`,room:roomSelect.value});
  renderMessages();
  chatInput.value='';
});

chatInput.addEventListener('keypress', e=>{ if(e.key==='Enter') sendBtn.click(); });
roomSelect.addEventListener('change', renderMessages);

// --------------------- Admin Login/Logout ---------------------
adminLoginBtn.addEventListener('click', ()=>{
  const nick = adminNickInput.value.trim();
  const pass = adminPassInput.value.trim();

  if(nick===ADMIN_NICK && pass===ADMIN_PASS){
    isAdmin=true;
    localStorage.setItem(ADMIN_STORAGE_KEY,'true');
    showAlert('ROOT conectado');
    renderMessages();
  } else showAlert('Acceso denegado');
});

adminLogoutBtn.addEventListener('click', ()=>{
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  isAdmin=false;
  showAlert('Sesión root cerrada');
  renderMessages();
});

// --------------------- Panel Admin ---------------------
banBtn.addEventListener('click', ()=>{
  const user = targetUserInput.value.trim();
  if(!user) return;
  bannedUsers.push(user);
  localStorage.setItem('umbrala_bans',JSON.stringify(bannedUsers));
  messages=messages.filter(m=>m.user!==user);
  showAlert(`Usuario ${user} baneado`);
  addAdminLog(`Usuario ${user} baneado`);
  renderMessages();
});

shadowbanBtn.addEventListener('click', ()=>{
  const user = targetUserInput.value.trim();
  if(!user) return;
  shadowbannedUsers.push(user);
  localStorage.setItem('umbrala_shadowbans',JSON.stringify(shadowbannedUsers));
  showAlert(`Usuario ${user} shadowbaneado`);
  addAdminLog(`Usuario ${user} shadowbaneado`);
  renderMessages();
});

clearRoomBtn.addEventListener('click', ()=>{
  const room = roomSelect.value;
  messages = messages.filter(m=>m.room!==room);
  showAlert(`Sala ${room} limpiada`);
  addAdminLog(`Sala ${room} limpiada`);
  renderMessages();
});

// --------------------- Apagar Umbrala ---------------------
shutdownBtn.addEventListener('click', ()=>{
  let count = 5;
  shutdownTimerDiv.textContent=`Apagando Umbrala en ${count}...`;
  const interval=setInterval(()=>{
    count--;
    shutdownTimerDiv.textContent=`Apagando Umbrala en ${count}...`;
    if(count<=0){
      clearInterval(interval);
      shutdownTimerDiv.textContent='Umbrala apagado.';
      chatContainer.innerHTML='';
    }
  },1000);
});

// --------------------- Inicializar ---------------------
messages.push({user:'Sistema',text:'Bienvenido a Umbrala Demo Completa.',room:'general'});
renderMessages();
