// 필요한 모듈들을 가져옵니다
import express from 'express';  // Express 웹 서버 프레임워크
import http from 'http';        // HTTP 서버 기능
import { PeerServer } from 'peerjs-server';  // PeerJS 서버 기능
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express 애플리케이션과 HTTP 서버를 생성합니다
const app = express();
const server = http.createServer(app);

// public 디렉토리에서 정적 파일을 제공.
app.use(express.static(path.join(__dirname, 'public')));

// PeerServer 인스턴스를 생성하고 설정합니다
const peerServer = PeerServer({
    server: server,        // 기존 HTTP 서버를 사용
    path: '/',            // WebSocket 연결을 위한 경로
    key: 'peerjs',        // 서버 인증 키
    proxied: false,       // 프록시 사용 여부
    corsOptions: {
        origin: true      // 모든 도메인에서의 접근 허용
    },
    port: 9000,           // 서버 포트
    host: 'localhost'     // 서버 호스트
});

// 서버를 9000번 포트에서 시작합니다
server.listen(9000, () => {
    console.log('PeerJS server is running on port 9000');
}); 