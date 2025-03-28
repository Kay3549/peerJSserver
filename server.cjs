const { PeerServer } = require('peer');

const server = PeerServer({
    port: 9000,
    path: '/peerjs',
    corsOptions: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

console.log('PeerJS server running on port 9000');

server.on('connection', (client) => {
    console.log('Client connected:', client.id);
});

server.on('disconnect', (client) => {
    console.log('Client disconnected:', client.id);
}); 