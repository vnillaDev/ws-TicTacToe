import {WebSocketServer, WebSocket} from "ws";
import {Client, ClientMessage} from "./common/server-models";
import {handleClientRequest, handleDisconnect} from "./handler";

const PORT: number = 9999;

const wss = new WebSocketServer({ port: PORT })
let clientCount: number = 0;

wss.on('connection', (socket: WebSocket) => {

    const client: Client = {
        id: ++clientCount,
        username: "",
        socket: socket,
        isConnected: false,
        role: null,
    }

    socket.on('message', (message: string) => {
        const clientMsg: ClientMessage = JSON.parse(message)

        console.log(`Message from client: ${message}`)

        handleClientRequest(client, clientMsg);
    });

    socket.on('close', () => {
        handleDisconnect(client);
    })

    socket.on('error', (err) => {
        console.log(`An error has occurred: ${err}`);
        return;
    });
});