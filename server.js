import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

console.log("Démarrage du serveur...")

// Pour pouvoir utiliser __dirname avec les modules ES :
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Creation d'un serveur http à partir d’Express
const server = http.createServer(app);

// Creation serveur WebSocket base sur le serv http
const wss = new WebSocketServer({ server });

const clients = new Map();
let admins = [];

function update_admins(){
		const arrClientsId = Array.from(clients.keys());
		const message = {
				pour : "admin",
				type: "clients",
				data : arrClientsId
		};
		admins.forEach(admin => {
				admin.send(JSON.stringify(message));
		});
}
// A la connection ws
wss.on('connection', ws => {
		console.log("Connection...");
		ws.on('message', message => { // à la recepetion d'un message
				// init d'un client
				if(message.toString() === "/"){
						const idC = randomUUID();
						clients.set(idC, ws);
						console.log('Nouveau client, uid :', idC);
						const message = {
								pour : "client",
								type : "id",
								data : idC
						}
						ws.send(JSON.stringify(message));
						update_admins();
						ws.on('close', () => {
								clients.delete(idC);
								console.log('client deco :', idC)
								update_admins();
						});
				} 
				// init d'un admin
				else if (message.toString() === "/admin") {
						console.log('Nouvel admin connecté');
						admins.push(ws);
				} 
				// tout autre message
				else {
						try {
								const receivedData = JSON.parse(message);
								console.log('Received JSON:', receivedData);
								wss.clients.forEach(client => {
										if(client.readyState === WebSocket.OPEN){
												client.send(JSON.stringify(receivedData));
										}
								});
						} catch (error) {
								console.log('Message pas prevu :', message.data.toString());
						}
				}

				/*wss.clients.forEach(client => {
						if(client.readyState === WebSocket.OPEN){
								client.send(message.toString());
						}
				});*/
		});
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

