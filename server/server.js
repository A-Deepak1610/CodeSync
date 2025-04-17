const app = require('./app');
const PORT = process.env.PORT || 8080;

const { setupSocket } = require("./src/sockets");
const http = require("http");
const server = http.createServer(app); 
setupSocket(server); 

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
