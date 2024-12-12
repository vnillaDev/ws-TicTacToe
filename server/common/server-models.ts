import type { WebSocket } from "ws";

export type Client = {
    id: number;
    username: string;
    socket: WebSocket;
    role: 'X' | 'O' | null;
    isConnected: boolean;
};

// Message from Client containing connection data
export type ConnectMsg = {
    type: "CONNECT"
    username: string;
};

export type MoveMessage = {
    type: "MAKE_MOVE",
    index: number,
    player: string
}

export type UserMsg = {
    type: "USER_LIST",
    usernames: string[]
}

export type ClientMessage = ConnectMsg | UserMsg | MoveMessage ;
// export type ServerResponse = ChatMessage;