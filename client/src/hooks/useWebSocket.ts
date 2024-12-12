import {useGameStore, useSocketStore, useUserListStore} from "../stores/stores.ts";
import {useState} from "react";
import {ConnectMsg, ServerResponse, Tile} from "../common/client-models.ts";

export const useWebSocket = () => {
    const ws = useSocketStore(state => state.ws);
    const setWs = useSocketStore(state => state.setWs);
    const setPlayerRole = useGameStore(state => state.setPlayerRole);
    const [, setIsConnected] = useState(false);

    const send = (message: string) => {
        console.log(`Sending message to socket: ${message}`)

        if (ws?.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected...");
            return;
        }

        ws.send(JSON.stringify(message));
    };

    const connect = (username: string, url: string) => {
        console.log(`Connecting to URL: '${url}'`);

        if (ws) {
            console.warn('WebSocket already initialized...');
            return;
        }

        const webSocket: WebSocket = new WebSocket(url);
        setWs(webSocket);

        webSocket.onopen = () => {
            console.log("Opened connection to WebSocket...")
            setIsConnected(true);

            const connectMessage: ConnectMsg = {
                type: "CONNECT",
                username: username,
            };

            // sending 'connectMessage' to server
            webSocket.send(JSON.stringify(connectMessage))
        };

        webSocket.onmessage = (evt) => {
            const serverMsg: ServerResponse = JSON.parse(evt.data);

            switch (serverMsg.type) {
                case "ASSIGN_ROLE":
                    setPlayerRole(serverMsg.role)
                    break;
                case "USER_LIST":
                    useUserListStore.getState().setUsernames(serverMsg.usernames);
                    break;
                case "MAKE_MOVE":
                    useGameStore.getState().updateBoard((currentBoard) => {
                        const newBoard = currentBoard.slice();
                        newBoard[serverMsg.index] = serverMsg.player as Tile;
                        return newBoard
                    })
                    break;
                default:
                    console.log(`Unknown message: ${serverMsg}`);
            }
        };

        webSocket.onclose = () => {
            console.log("WebSocket disconnected");
            setIsConnected(false);
        };

        webSocket.onerror = (error) => {
            console.error(`An error has occurred: ${error}`);
            setIsConnected(false);
        };
    };

    const disconnect = () => {
        console.log("WebSocket disconnected.");
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
            setWs(null);
        }
    }

    return {send, connect, disconnect}
}