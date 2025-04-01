// PeerServer 모듈을 가져옴
const { PeerServer } = require('peer');
// Express 모듈을 가져옴
const express = require('express');
// CORS 모듈을 가져옴
const cors = require('cors');

// Express 애플리케이션을 생성.
const app = express();
// 모든 출처에 대해 CORS를 허용.
app.use(cors());

// PeerServer를 설정.
const server = PeerServer({
    port: 3000, // 서버가 실행될 포트를 설정.
    path: '/peerjs', // PeerJS 서버의 경로를 설정.
    allow_discovery: true, // 피어 검색을 허용.
    proxied: true, // 프록시를 통한 연결을 허용.
    debug: true, // 디버그 모드를 활성화.
    corsOptions: { // CORS 설정을 정의.
        origin: '*', // 모든 출처를 허용.
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 허용할 HTTP 메서드를 정의.  
        allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더를 정의.
        credentials: true // 자격 증명을 허용.
    }
});

// 클라이언트가 연결될 때 이벤트를 처리.
server.on('connection', (client) => {
    console.log('Client connected:', client.id); // 연결된 클라이언트의 ID를 출력.
});

// 클라이언트가 연결 해제될 때 이벤트를 처리.
server.on('disconnect', (client) => {
    console.log('Client disconnected:', client.id); // 연결 해제된 클라이언트의 ID를 출력.
});

// 서버가 실행 중임을 콘솔에 출력.
console.log('PeerJS server running on port 3000');