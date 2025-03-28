import { WebSocketServer, WebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import http from 'http';
import redisClient from '../databases/Redis/pool';

interface ExtendedWebSocket extends WebSocket {
    id: string;
    loginTimeout: NodeJS.Timeout | null | Timer;
}

interface ClientInfo {
    connectedAt: string;
    listenTo: string[];
    status: 'connected' | 'logged';
    metadata?: Record<string, unknown>;
}

interface IncomingMessage {
    action: string;
    listenTo?: string[];
    metadata?: Record<string, unknown>;
}

export async function setupWebSocket(server: http.Server) {
    const wss = new WebSocketServer({ server });

    // Intervalo para enviar mensagens periódicas aos clientes
    setInterval(() => {
        const channels = ['A', 'B'];
        const messages = ['Olá pessoa do A', 'Olá pessoa do B'];

        channels.forEach((channel, index) => {
            handleSendWSMessage(channel, messages[index], wss);
        });
    }, 1000);

    wss.on('connection', async (ws: WebSocket) => {
        const extendedWs = ws as ExtendedWebSocket;
        extendedWs.id = uuidv4();
        extendedWs.loginTimeout = setTimeout(() => {
            console.log(`Cliente ${extendedWs.id} não forneceu o canal de interesse a tempo. Desconectando...`);
            extendedWs.send(JSON.stringify({
                action: 'error',
                message: 'Tempo limite excedido. Você não especificou um canal de interesse.',
                successfully: false
            }));
            extendedWs.terminate();
        }, 10000);

        const initialInfo: ClientInfo = {
            connectedAt: new Date().toISOString(),
            listenTo: [],
            status: 'connected',
        };

        await redisClient.hSet('clients', extendedWs.id, JSON.stringify(initialInfo));
        console.log(`Cliente ${extendedWs.id} conectado.`);

        extendedWs.send(JSON.stringify({ action: 'welcome', clientId: extendedWs.id }));

        extendedWs.on('message', (message: string) => {
            try {
                const incomingMessage: IncomingMessage = JSON.parse(message);
                console.log(`Mensagem recebida do cliente ${extendedWs.id}:`, incomingMessage);

                handleWSMessage(extendedWs, incomingMessage);
            } catch (error) {
                console.error('Erro ao processar a mensagem:', error);
            }
        });

        extendedWs.on('close', async () => {
            console.log(`Cliente ${extendedWs.id} desconectado.`);
            await redisClient.hDel('clients', extendedWs.id);
        });
    });
    return wss;
}

async function handleWSMessage(ws: ExtendedWebSocket, message: IncomingMessage) {
    const { action, listenTo, metadata } = message;
    const { token } = message.metadata || {};

    const clientInfoString = await redisClient.hGet('clients', ws.id);
    const clientInfo: ClientInfo = clientInfoString ? JSON.parse(clientInfoString) : {
        connectedAt: new Date().toISOString(),
        status: 'connected',
        listenTo: [],
        metadata: {}
    };

    // Verifica se o cliente não está logado antes de permitir qualquer ação
    if (clientInfo.status !== 'logged') {
        if (action !== 'login') {
            ws.send(JSON.stringify({
                action: 'login',
                successfully: false,
                message: 'Você precisa fazer login para executar essa ação.',
                clientId: ws.id
            }));
            return;
        }
    }

    // Lógica para o login
    if (action === 'login') {
        if (clientInfo.status === 'logged') {
            ws.send(JSON.stringify({
                action: 'login',
                successfully: false,
                message: 'Você já está logado!',
                clientId: ws.id
            }));
            return;
        }

        clientInfo.status = 'logged';
        clientInfo.listenTo = listenTo || [];
        clientInfo.metadata = metadata || {};
        await redisClient.hSet('clients', ws.id, JSON.stringify(clientInfo));

        // Limpar o timeout de login
        if (ws.loginTimeout) {
            clearTimeout(ws.loginTimeout);
            ws.loginTimeout = null;
        }

        ws.send(JSON.stringify({
            action: 'login',
            successfully: true,
            listenTo: clientInfo.listenTo,
            message: 'Login realizado com sucesso!',
            clientId: ws.id
        }));

        return;
    }
}

export async function handleSendWSMessage(channel: string, message: string, wss: WebSocketServer) {
    const clients = await redisClient.hGetAll('clients');
    const clientList = Object.keys(clients);

    const clientsInChannel = clientList.filter(clientId => {
        const clientInfo = JSON.parse(clients[clientId]);
        return clientInfo.listenTo.includes(channel);
    });

    clientsInChannel.forEach(clientId => {
        redisClient.hGet('clients', clientId).then(clientString => {
            if (clientString) {
                const clientInfo: ClientInfo = JSON.parse(clientString);

                const client = [...wss.clients].find(ws => (ws as ExtendedWebSocket).id === clientId);

                if (client) {
                    client.send(message);
                }
            }
        }).catch(error => {
            console.error('Erro ao buscar informações do cliente:', error);
        });
    });
}
