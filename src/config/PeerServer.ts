const { PeerServer } = require("peer");

const peerServer = PeerServer({
  port: 9000,
  path: "/peerjs",
});

peerServer.on("connection", (client) => {
  console.log(`Peer connected: ${client.getId()}`);
});

peerServer.on("disconnect", (client) => {
  console.log(`Peer disconnected: ${client.getId()}`);
});

console.log("PeerJS server running on port 9000");
