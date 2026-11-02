// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const LOBBIES = {};

function generateLobbyCode() {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
}

io.on('connection', (socket) => {
  // Rastgele Oyuncu ID
  socket.playerId = 'P-' + Math.floor(1000 + Math.random() * 9000);

  // Lobi Oluşturma
  socket.on('createLobby', () => {
    const code = generateLobbyCode();
    LOBBIES[code] = {
      code,
      host: socket.id,
      players: {},
      wave: 1,
      inGame: false
    };
    joinLobby(socket, code);
  });

  // Lobiye Katılma
  socket.on('joinLobby', (code) => {
    code = code.toUpperCase();
    if (LOBBIES[code]) {
      joinLobby(socket, code);
    } else {
      socket.emit('errorMsg', 'Lobi bulunamadı!');
    }
  });

  function joinLobby(sock, code) {
    const room = LOBBIES[code];
    sock.join(code);
    sock.currentRoom = code;
    
    room.players[sock.id] = {
      id: sock.playerId,
      x: 160,
      y: 90,
      hp: 5,
      face: 1,
      weapon: 'glock',
      walking: false
    };

    sock.emit('lobbyJoined', { code, playerId: sock.playerId, isHost: room.host === sock.id });
    io.to(code).emit('updateLobbyPlayers', Object.values(room.players));
  }

  // Oyunu Başlatma (Sadece Host)
  socket.on('startGame', () => {
    const room = LOBBIES[socket.currentRoom];
    if (room && room.host === socket.id) {
      room.inGame = true;
      io.to(room.code).emit('gameStarted');
    }
  });

  // Karakter Hareket & Ateş Senkronizasyonu
  socket.on('playerUpdate', (data) => {
    const room = LOBBIES[socket.currentRoom];
    if (room && room.players[socket.id]) {
      Object.assign(room.players[socket.id], data);
      socket.to(room.code).emit('peerUpdate', { id: socket.id, ...data });
    }
  });

  // Mermi Atışı (PvP Kapalı - Sadece Zombilere Vurur)
  socket.on('shoot', (bulletData) => {
    socket.to(socket.currentRoom).emit('peerShoot', { owner: socket.id, ...bulletData });
  });

  socket.on('disconnect', () => {
    const code = socket.currentRoom;
    if (code && LOBBIES[code]) {
      delete LOBBIES[code].players[socket.id];
      if (Object.keys(LOBBIES[code].players).length === 0) {
        delete LOBBIES[code];
      } else {
        io.to(code).emit('updateLobbyPlayers', Object.values(LOBBIES[code].players));
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Sunucu ${PORT} üzerinde aktif.`));