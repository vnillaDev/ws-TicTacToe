import {useGameStore, useSocketStore, useUserListStore} from "../stores/stores";
import {useState} from "react";
import {ConnectMsg, MoveMessage, ServerResponse, Tile} from "../common/client-models";

export const useWebSocket = () => {
    const ws = useSocketStore(state => state.ws);
    const setWs = useSocketStore(state => state.setWs);
    const [, setIsConnected] = useState(false);

    const setPlayerRole = useGameStore(state => state.setPlayerRole);
    const updateBoard = useGameStore(state => state.updateBoard);
    const setTurn = useGameStore(state => state.setTurn);

    const send = (message: object) => {
        if (ws?.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected...");
            return;
        }

        ws.send(JSON.stringify(message));
    };

    const connect = (username: string, url: string) => {
        if (ws) {
            console.warn('WebSocket already initialized...');
            return;
        }

        const webSocket = new WebSocket(url);
        setWs(webSocket);

        webSocket.onopen = () => {
            console.log("Opened connection to WebSocket...");
            setIsConnected(true);

            const connectMessage: ConnectMsg = {
                type: "CONNECT",
                username: username,
            };

            webSocket.send(JSON.stringify(connectMessage));
        };

        webSocket.onmessage = (evt) => {
            const serverMsg: ServerResponse = JSON.parse(evt.data);

            switch (serverMsg.type) {
                case "ASSIGN_ROLE":
                    setPlayerRole(serverMsg.role);
                    break;
                case "USER_LIST":
                    useUserListStore.getState().setUsernames(serverMsg.usernames);
                    break;
                case "MAKE_MOVE":
                    if (Array.isArray(serverMsg.board)) {
                        updateBoard(serverMsg.board as Tile[]);
                    }
                    setTurn(serverMsg.isXNext);
                    break;
                case "RESET_GAME":
                    useGameStore.getState().resetGame()
                    break;
                case "GAME_FULL":
                    useGameStore.getState().setPlayerRole(null);
                    break;
                default:
                    console.log("Unknown message:", serverMsg);
            }
        };

        webSocket.onclose = () => {
            console.log("WebSocket connection closed.");
        };

        webSocket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    };

    const makeMove = (index: number, player: 'X' | 'O') => {
        // Send MOVE request to server
        const moveMessage: MoveMessage = {
            type: "MAKE_MOVE",
            index,
            player
        };
        send(moveMessage);
    };

    const resetGame = () => {
        send({type: "RESET_GAME"});
    }

    const disconnect = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    };

    return {send, connect, makeMove, disconnect, resetGame};
};