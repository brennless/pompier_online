import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour pouvoir utiliser __dirname avec les modules ES :
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Creation d'un serveur http à partir d’Express
const server = http.createServer(app);

// Creation serveur WebSocket base sur le serv http
const wss = new WebSocketServer({ server });

// A la connection ws
wss.on('connection', ws => {
		console.log('WebSocket client connected');
		ws.on('message', message => {
				
				try {
						const receivedData = JSON.parse(message);
						console.log('Received JSON:', receivedData);
						wss.clients.forEach(client => {
								if(client.readyState === WebSocket.OPEN){
										client.send(JSON.stringify(receivedData));
								}
						});
				} catch (error) {
						console.error('Received a non-JSON');
						console.log('Message : ', message.toString());
				}


				/*wss.clients.forEach(client => {
						if(client.readyState === WebSocket.OPEN){
								client.send(message.toString());
						}
				});*/
		});

		ws.send('Check');
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Page de base
app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Page admin
app.get('/admin', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// On lance le serv
server.listen(PORT, () => {
		console.log(`Serveur lancé sur http://localhost:${PORT}`);
});

