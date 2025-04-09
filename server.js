import express from 'express';
import http from 'http';
import { ExpressPeerServer } from 'peer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create and mount the PeerJS server
const peerServer = ExpressPeerServer(server, {
  path: '/',
  key: 'peerjs',
  proxied: false,
  corsOptions: {
    origin: '*',
  },
});

// Attach PeerJS server to /peer endpoint (or just '/')
app.use('/peerjs', peerServer);

// Start server
const PORT = 9000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
