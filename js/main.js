const screens = {
  boot: bootScreen,
  rooms: roomsScreen,
  join: joinScreen,
  chat: chatScreen
}

let currentRoom = ""
let isRoot = false

const terminalLines = [
  "> UMBRALA",
  "> Inicializando núcleo…",
  "> Encriptación activa",
  "> Identidad efímera",
  "> Sistema listo"
]

let i = 0
function boot(){
  if(i < terminalLines.length){
    terminalOutput.textContent += terminalLines[i++] + "\n"
    setTimeout(boot, 400)
  }else{
    setTimeout(()=>switchTo("rooms"), 1000)
  }
}
boot()

function switchTo(name){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"))
  screens[name].classList.add("active")
}

document.querySelectorAll(".room").forEach(btn=>{
  btn.onclick = ()=>{
    currentRoom = btn.dataset.room
    joinRoomName.textContent = currentRoom
    switchTo("join")
  }
})

enterChat.onclick = ()=>{
  roomTitle.textContent = currentRoom
  switchTo("chat")
}

backRooms.onclick = ()=>switchTo("rooms")

rootBtn.onclick = ()=>{
  const pass = prompt("Root password")
  if(pass === "1234"){
    isRoot = true
    rootPanel.classList.remove("hidden")
    alert("ROOT ACTIVADO")
  }
}

sendMsg.onclick = ()=>{
  if(!msgInput.value) return
  const d = document.createElement("div")
  d.textContent = msgInput.value
  messages.appendChild(d)
  msgInput.value=""
}

imgInput.onchange = ()=>{
  const file = imgInput.files[0]
  if(!file) return
  const img = document.createElement("img")
  img.src = URL.createObjectURL(file)
  img.style.maxWidth="120px"
  messages.appendChild(img)
}
