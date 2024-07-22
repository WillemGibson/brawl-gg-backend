const { Server } = require("socket.io");
// const {
//   handleJoinTournament,
//   handleSendMessage,
//   handleDisconnect,
// } = require("./socketEvents.js");

function socketConnect(server) {
  // Initialize Socket.IO server with CORS configuration
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Allow connections from this origin
      methods: ["GET", "POST"], // Allow these HTTP methods
    },
  });
  console.log("socket running");

  // Handle new socket connections
  // io.on("connection", (socket) => {
  //   console.log(`User Connected: ${socket.id}`);

  //   // Handle user joining a Tournament
  //   socket.on("join_room", (tournamentId) => {
  //     handleJoinTournament(socket, tournamentId);
  //   });

  //   // Handle receiving and processing new messages
  //   socket.on("send_message", (data) => {
  //     handleSendMessage(io, data);
  //   });

  //   // Handle user disconnection
  //   socket.on("disconnect", () => {
  //     handleDisconnect(socket);
  //   });
  // });
}

module.exports = { socketConnect };
