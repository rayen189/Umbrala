function goRooms() {
  document.getElementById('landing').classList.remove('active');
  document.getElementById('rooms').classList.add('active');
}

function goLanding() {
  document.getElementById('rooms').classList.remove('active');
  document.getElementById('landing').classList.add('active');
}

function enterRoom(room) {
  alert("Entrando a sala: " + room);
}
