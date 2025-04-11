import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import gatewayMiddleware from './src/middleware/gateway.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize gateway middleware
gatewayMiddleware.initialize(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start server
const PORT = 9000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
