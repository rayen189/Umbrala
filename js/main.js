document.addEventListener("DOMContentLoaded", () => {

  const bootScreen = document.getElementById("bootScreen");
  const roomsScreen = document.getElementById("roomsScreen");
  const identityScreen = document.getElementById("identityScreen");
  const chatScreen = document.getElementById("chatScreen");

  const rooms = document.querySelectorAll(".room");
  const joiningRoomTitle = document.getElementById("joiningRoomTitle");
  const nicknameInput = document.getElementById("nicknameInput");
  const randomNick = document.getElementById("randomNick");
  const enterChatBtn = document.getElementById("enterChatBtn");
  const backToRooms = document.getElementById("backToRooms");

  const messagesBox = document.getElementById("messages");
  const msgInput = document.getElementById("msgInput");
  const sendBtn = document.getElementById("sendBtn");
  const imgInput = document.getElementById("imgInput");

  const chatTabs = document.getElementById("chatTabs");
  const users = document.querySelectorAll(".user-item");
  const backRooms = document.getElementById("backRooms");

  let nickname = "";
  let currentChat = "public";

  function show(screen){
    [bootScreen,roomsScreen,identityScreen,chatScreen]
      .forEach(s=>s.classList.remove("active"));
    screen.classList.add("active");
  }

  setTimeout(()=>show(roomsScreen),2000);

  rooms.forEach(r=>{
    r.onclick=()=>{
      joiningRoomTitle.textContent=`JOINING ROOM: ${r.textContent}`;
      show(identityScreen);
    }
  });

  randomNick.onclick=()=>{
    nicknameInput.value="anon_"+Math.floor(Math.random()*9000+1000);
  };

  enterChatBtn.onclick=()=>{
    nickname=nicknameInput.value.trim();
    if(!nickname) return alert("Elige un nickname");
    show(chatScreen);
    systemMsg("Has entrado a la sala");
  };

  function systemMsg(t){
    const d=document.createElement("div");
    d.className="message";
    d.textContent=t;
    messagesBox.appendChild(d);
  }

  function userMsg(t){
    const d=document.createElement("div");
    d.className="message";
    d.innerHTML=`<b>${nickname}:</b> ${t}`;
    messagesBox.appendChild(d);
  }

  sendBtn.onclick=()=>{
    if(!msgInput.value.trim())return;
    userMsg(msgInput.value);
    msgInput.value="";
  };

  imgInput.onchange=()=>{
    const f=imgInput.files[0];
    if(!f)return;
    const r=new FileReader();
    r.onload=()=>{
      const d=document.createElement("div");
      d.className="message";
      d.innerHTML=`<b>${nickname}:</b><br><img src="${r.result}">`;
      messagesBox.appendChild(d);
    };
    r.readAsDataURL(f);
  };

  users.forEach(u=>{
    u.onclick=()=>{
      const name=u.textContent;
      if(document.querySelector(`[data-chat="${name}"]`))return;

      const tab=document.createElement("span");
      tab.className="chat-tab";
      tab.dataset.chat=name;
      tab.textContent="🔒 "+name;
      chatTabs.appendChild(tab);

      tab.onclick=()=>{
        document.querySelectorAll(".chat-tab").forEach(t=>t.classList.remove("active"));
        tab.classList.add("active");
        messagesBox.innerHTML="";
        systemMsg("Chat privado con "+name);
      };
    };
  });

  backRooms.onclick=()=>show(roomsScreen);

});
