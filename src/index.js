const { app } = require("./server");
const { databaseConnect } = require("./utils/database");
const { socketConnect } = require("./utils/socket");
const http = require("http");

async function startServer() {
  try {
    // CONNECT TO THE DATABASE
    await databaseConnect();

    // DECLARE THE HTTP SERVER FOR SOCKETS.IO
    const server = http.createServer(app);

    // CREATE THE CONNECTION BETWEEN CLIENT AND SERVER START LISTENING FOR EMITIONS WITH SOCKET.IO
    socketConnect(server);

    // DECLARE THE PORT
    const PORT = process.env.PORT || 3001;

    // START LISTENING FOR HTTP REQUESTS
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
