document.addEventListener("DOMContentLoaded", () => {

  const boot = document.getElementById("boot");
  const rooms = document.getElementById("rooms");
  const chat = document.getElementById("chat");
  const initBtn = document.getElementById("initBtn");

  const roomName = document.getElementById("roomName");
  const messages = document.getElementById("messages");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("msgInput");
  const mediaInput = document.getElementById("mediaInput");
  const mediaBtn = document.getElementById("mediaBtn");

  initBtn.onclick = () => {
    boot.classList.add("hidden");
    rooms.classList.remove("hidden");
  };

  window.enterRoom = (name) => {
    rooms.classList.add("hidden");
    chat.classList.remove("hidden");
    roomName.textContent = name;
    messages.innerHTML = "";
  };

  window.backRooms = () => {
    chat.classList.add("hidden");
    rooms.classList.remove("hidden");
  };

  form.onsubmit = e => {
    e.preventDefault();
    if (!input.value) return;

    const div = document.createElement("div");
    div.className = "
