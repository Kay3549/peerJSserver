import express from 'express';
import http from 'http';
import { PeerServer } from 'peerjs-server';

const app = express();
const server = http.createServer(app);

// Create PeerServer instance with the existing server
const peerServer = PeerServer({
    server: server,
    path: '/',
    key: 'peerjs',
    proxied: false,
    corsOptions: {
        origin: true
    },
    port: 9000,
    host: 'localhost'
});

// Start the server
server.listen(9000, () => {
    console.log('PeerJS server is running on port 9000');
}); 