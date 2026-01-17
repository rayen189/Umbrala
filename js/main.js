const bootScreen = document.getElementById("bootScreen");
const roomsScreen = document.getElementById("roomsScreen");
const output = document.getElementById("terminalOutput");

const bootLines = [
  "> UMBRALA SYSTEM v2.4.1",
  "> Initializing secure connection...",
  "> [OK] Encryption module loaded",
  "> [OK] Anonymous routing enabled",
  "> [OK] No logs policy active",
  "> Loading chat nodes...",
  "",
  "> System ready."
];

let currentLine = 0;

function typeTerminal() {
  if (currentLine < bootLines.length) {
    output.textContent += bootLines[currentLine] + "\n";
    currentLine++;
    setTimeout(typeTerminal, 420);
  } else {
    setTimeout(openRooms, 1200);
  }
}

function openRooms() {
  bootScreen.classList.remove("active");
  roomsScreen.classList.add("active");
}

typeTerminal();
