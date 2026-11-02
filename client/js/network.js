// client/js/network.js
// Render sunucu URL'inizi buraya yazacaksınız:
const SERVER_URL = "https://zombiex-backend.onrender.com"; 
const socket = io(SERVER_URL);

let currentLobby = null;
let isHost = false;
let myPlayerId = null;
let remotePlayers = {};

socket.on('connect', () => {
  console.log("Sunucuya bağlandı:", socket.id);
});

socket.on('lobbyJoined', (data) => {
  currentLobby = data.code;
  myPlayerId = data.playerId;
  isHost = data.isHost;
  document.getElementById('lobby-code-display').innerText = currentLobby;
  showPanel('lobby-room');
});

socket.on('updateLobbyPlayers', (players) => {
  const list = document.getElementById('player-list');
  if (list) {
    list.innerHTML = players.map(p => `<li>${p.id}</li>`).join('');
  }
});

socket.on('gameStarted', () => {
  startGame();
});

socket.on('peerUpdate', (data) => {
  remotePlayers[data.id] = data;
});

socket.on('peerShoot', (b) => {
  // Arkadaştan gelen mermiyi ekrana ekle (PvP kapalı)
  bullets.push({
    x: b.x, y: b.y, vx: b.vx, vy: b.vy, life: b.life, isPeer: true
  });
});

function createRoom() { socket.emit('createLobby'); }
function joinRoom(code) { socket.emit('joinLobby', code); }
function startLobbyGame() { if(isHost) socket.emit('startGame'); }