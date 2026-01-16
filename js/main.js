/* ===============================
   PARTICULAS
================================ */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
const PARTICLE_COUNT = 120;
function resizeCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
class Particle{constructor(){this.reset();}
reset(){this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.radius=Math.random()*1.8+0.6;this.speedY=Math.random()*0.25+0.05;this.alpha=Math.random()*0.6+0.3;this.color="120,180,255";}
update(){this.y-=this.speedY;if(this.y<-10){this.y=canvas.height+10;this.x=Math.random()*canvas.width;}}
draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fillStyle=`rgba(${this.color},${this.alpha})`;ctx.fill();}}
function initParticles(){particles=[];for(let i=0;i<PARTICLE_COUNT;i++){particles.push(new Particle());}}
function animate(){ctx.clearRect(0,0,canvas.width,canvas.height);particles.forEach(p=>{p.update();p.draw();});requestAnimationFrame(animate);}
initParticles();animate();

/* ===============================
   VARIABLES GLOBALES
================================ */
let isStalkerless=false,currentRoom=null,activePrivateChat=null;
let users=[],timeline=[],privateTimeline=[],globalFreeze=false;
let rooms=[{name:"Norte de Chile 🌵",users:[]},{name:"Sur de Chile 🗻",users:[]},{name:"Centro 🌃",users:[]},{name:"Global 🌎",users:[]},{name:"Curiosidades 🧠",users:[]},{name:"Directo al 🕳️",users:[],hidden:true}];

const landingScreen=document.getElementById('landingScreen');
const roomsListScreen=document.getElementById('roomsListScreen');
const chatScreen=document.getElementById('chatScreen');

const terminalText=document.getElementById('terminalText');
const initializeBtn=document.getElementById('initializeBtn');
const rootLoginBtn=document.getElementById('rootLoginBtn');

const chatInput=document.getElementById('chatInput');
const chatMessages=document.getElementById('chatMessages');
const sendBtn=document.getElementById('sendBtn');
const roomsList=document.getElementById('roomsList');
const backToStartBtn=document.getElementById('backToStartBtn');
const backToRoomsBtn=document.getElementById('backToRoomsBtn');
const totalUsersCounter=document.getElementById('totalUsersCounter');

const rootBar=document.getElementById('rootBar');
const shadowBtn=document.getElementById('shadowBtn');
const viewMapBtn=document.getElementById('viewMapBtn');
const freezeBtn=document.getElementById('freezeBtn');
const godViewBtn=document.getElementById('godViewBtn');
const vanishBtn=document.getElementById('vanishBtn');

const connectedUsersList=document.getElementById('connectedUsers');

/* ===============================
   FUNCIONES
================================ */
function showScreen(screen){
  document.querySelectorAll('.screen').forEach(s=>{s.classList.remove('active');s.classList.add('inactive');});
  screen.classList.add('active'); screen.classList.remove('inactive');
}

function typeWriterEffect(lines,callback){
  let i=0;
  function nextLine(){
    if(i>=lines.length){initializeBtn.style.display='inline-block';if(callback)callback();return;}
    let line=lines[i],j=0;
    let interval=setInterval(()=>{
      terminalText.textContent=line.slice(0,j+1);
      j++;
      if(j>=line.length){clearInterval(interval);i++;setTimeout(nextLine,600);}
    },30);
  }
  nextLine();
}

/* ===============================
   PANTALLA INICIAL
================================ */
const introLines=[
  "Chat efímero...",
  "Conversaciones anónimas...",
  "Sin registro, sin rastros...",
  "Solo tú y tu mensaje..."
];
typeWriterEffect(introLines);

/* ===============================
   BOTONES
================================ */
initializeBtn.onclick=()=>{renderRooms();showScreen(roomsListScreen);}
rootLoginBtn.onclick=()=>{
  const nick=prompt("Usuario Root:");
  const pass=prompt("Clave Root:");
  if(nick==='stalkerless' && pass==='stalkerless1234'){isStalkerless=true;rootBar.style.display='flex';alert("Bienvenido Stalkerless");}
  else alert("Credenciales incorrectas");
};
backToStartBtn.onclick=()=>{showScreen(landingScreen);currentRoom=null;}
backToRoomsBtn.onclick=()=>{showScreen(roomsListScreen);activePrivateChat=null;renderRooms();}

/* ===============================
   SALAS
================================ */
function updateTotalUsers(){let all=[];rooms.forEach(r=>all.push(...r.users));totalUsersCounter.textContent=`Usuarios conectados: ${[...new Set(all)].length}`;}
function renderRooms(){roomsList.innerHTML='';rooms.forEach((r,i)=>{if(r.hidden&&!isStalkerless)return;const btn=document.createElement('button');btn.className='portal-btn';btn.textContent=`${r.name} (${r.users.length})`;btn.onclick=()=>enterRoom(i);roomsList.appendChild(btn);});updateTotalUsers();}
function enterRoom(i){currentRoom=i;chatMessages.innerHTML='';const u=isStalkerless?'Stalkerless':'User'+Math.floor(Math.random()*1000);rooms[i].users.push(u);renderRooms();showScreen(chatScreen);renderConnectedUsers();document.getElementById('currentRoomName').textContent=rooms[i].name;}

/* ===============================
   CHAT PÚBLICO Y PRIVADO
================================ */
sendBtn.onclick=()=>{
  if(globalFreeze)return alert("Chat congelado"); if(currentRoom===null && !activePrivateChat)return;
  const msg=chatInput.value.trim(); if(!msg)return;
  const user=isStalkerless?'Stalkerless':'User'+Math.floor(Math.random()*1000);
  if(activePrivateChat){
    const data={user,msg,privateWith:activePrivateChat,time:new Date()};privateTimeline.push(data);appendPrivateMessage(data);
    setTimeout(()=>{const idx=privateTimeline.indexOf(data);if(idx!==-1){privateTimeline.splice(idx,1);removePrivateMessageFromDOM(data);}},60000);
  }else{
    const data={user,msg,room:rooms[currentRoom].name,time:new Date()};timeline.push(data);appendMessage(data);
    setTimeout(()=>{const idx=timeline.indexOf(data);if(idx!==-1){timeline.splice(idx,1);removeMessageFromDOM(data);}},30000);
  }
  chatInput.value='';
}
function appendMessage(d){const div=document.createElement('div');div.textContent=`[${d.room}] ${d.user}: ${d.msg}`;div.className='glow';chatMessages.appendChild(div);chatMessages.scrollTop=chatMessages.scrollHeight;}
function appendPrivateMessage(d){const div=document.createElement('div');div.textContent=`${d.user}: ${d.msg}`;div.className='glow';const cont=document.getElementById('privateChatMessages');cont.appendChild(div);cont.scrollTop=cont.scrollHeight;}
function removeMessageFromDOM(d){document.querySelectorAll('#chatMessages div').forEach(div=>{if(div.textContent.includes(`[${d.room}] ${d.user}: ${d.msg}`)) div.remove();});}
function removePrivateMessageFromDOM(d){document.querySelectorAll('#privateChatMessages div').forEach(div=>{if(div.textContent.includes(`${d.user}: ${d.msg}`)) div.remove();});}

/* ===============================
   USUARIOS
================================ */
function renderConnectedUsers(){connectedUsersList.innerHTML='';rooms[currentRoom].users.forEach(u=>{const li=document.createElement('li');li.textContent=u;li.onclick=()=>openPrivateChat(u);connectedUsersList.appendChild(li);});}
function openPrivateChat(u){if(u=== (isStalkerless?'Stalkerless':null)) return;activePrivateChat=u;document.getElementById('privateChatContainer').style.display='flex';}

/* ===============================
   ROOT
================================ */
shadowBtn.onclick=()=>alert("ShadowBan aplicado");
viewMapBtn.onclick=()=>alert("Mapa activado");
freezeBtn.onclick=()=>{globalFreeze=!globalFreeze;alert(`Freeze global: ${globalFreeze}`);};
godViewBtn.onclick=()=>alert("GodView activado");
vanishBtn.onclick=()=>alert("Modo invisible activado");

/* ===============================
   INICIALIZACIÓN
================================ */
renderRooms();
showScreen(landingScreen);
