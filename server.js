import express from 'express';
import { PeerServer } from 'peer';
import cors from 'cors';

const app = express();
app.use(cors());

const peerServer = PeerServer({
    port: 9000,
    path: '/peerjs',
    allow_discovery: true
});

app.use('/peerjs', peerServer);

app.listen(9000, () => {
    console.log('PeerJS server running on port 9000');
});
