import WebSocket from 'ws';
import { EventEmitter } from 'events';

class GatewayMiddleware extends EventEmitter {
    constructor() {
        super();
        this.connections = new Map();
        this.externalSystems = new Map();
    }

    // Initialize the gateway with a WebSocket server
    initialize(server) {
        this.wss = new WebSocket.Server({ server });
        
        this.wss.on('connection', (ws, req) => {
            const connectionId = this.generateConnectionId();
            this.connections.set(connectionId, ws);
            
            // Handle incoming messages from iframe
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleIncomingMessage(connectionId, data);
                } catch (error) {
                    console.error('Error processing message:', error);
                    this.sendError(ws, 'Invalid message format');
                }
            });

            // Handle connection close
            ws.on('close', () => {
                this.connections.delete(connectionId);
            });

            // Send connection ID back to client
            ws.send(JSON.stringify({
                type: 'CONNECTION_ESTABLISHED',
                connectionId
            }));
        });
    }

    // Handle incoming messages from iframe
    async handleIncomingMessage(connectionId, data) {
        const ws = this.connections.get(connectionId);
        if (!ws) return;

        try {
            // Validate message format
            if (!this.validateMessage(data)) {
                this.sendError(ws, 'Invalid message format');
                return;
            }

            // Process the message based on type
            switch (data.type) {
                case 'CONTRACT_DATA':
                    await this.handleContractData(ws, data);
                    break;
                case 'FORM_DATA':
                    await this.handleFormData(ws, data);
                    break;
                case 'USER_ACTION':
                    await this.handleUserAction(ws, data);
                    break;
                default:
                    this.sendError(ws, 'Unknown message type');
            }
        } catch (error) {
            console.error('Error handling message:', error);
            this.sendError(ws, 'Internal server error');
        }
    }

    // Register an external system
    registerExternalSystem(systemId, config) {
        this.externalSystems.set(systemId, {
            config,
            status: 'connected'
        });
    }

    // Send data to external system
    async sendToExternalSystem(sws, data) {
        const { systemId, payload } = data;
        const system = this.externalSystems.get(systemId);
        
        if (!system) {
            this.sendError(sws, 'External system not found');
            return;
        }

        try {
            // Here you would implement the actual communication with the external system
            // This could be HTTP requests, WebSocket connections, etc.
            const response = await this.forwardToExternalSystem(system, payload);
            
            // Send response back to iframe
            sws.send(JSON.stringify({
                type: 'RESPONSE',
                requestId: data.requestId,
                data: response
            }));
        } catch (error) {
            console.error('Error communicating with external system:', error);
            this.sendError(sws, 'Failed to communicate with external system');
        }
    }

    // Helper methods
    generateConnectionId() {
        return Math.random().toString(36).substr(2, 9);
    }

    validateMessage(data) {
        return data && 
               typeof data === 'object' && 
               typeof data.type === 'string' &&
               typeof data.action === 'string';
    }

    sendError(ws, message) {
        ws.send(JSON.stringify({
            type: 'ERROR',
            message
        }));
    }

    // Placeholder for external system communication
    async forwardToExternalSystem(system, payload) {
        // Implement actual communication logic here
        // This could be HTTP requests, WebSocket connections, etc.
        return { status: 'success', data: payload };
    }
}

export default new GatewayMiddleware(); 