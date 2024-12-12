import { Client, ClientMessage, ConnectMsg, MoveMessage, UserMsg } from "./common/server-models";

const clientList: Client[] = [];

// Server-side game state
let board = Array(9).fill(null);
let isXNext = true;

/**
 * Helper function to broadcast a message to all connected clients.
 */
function broadcast(message: object) {
    const data = JSON.stringify(message);
    clientList.forEach(c => c.socket.send(data));
}

export function handleClientRequest(client: Client, clientMsg: ClientMessage) {
    switch (clientMsg.type) {
        case "CONNECT":
            handleConnect(client, clientMsg as ConnectMsg);
            break;
        case "USER_LIST":
            // Currently not handled. Consider implementing if needed.
            break;
        case "MAKE_MOVE":
            handleMakeMove(client, clientMsg as MoveMessage);
            break;
        default:
            break;
    }
}

export function handleDisconnect(client: Client) {
    const indexToRemove = clientList.indexOf(client);
    if (indexToRemove > -1) {
        clientList.splice(indexToRemove, 1);
    }

    console.log(`${client.username} has disconnected!`);
}

function handleConnect(client: Client, message: ConnectMsg) {
    client.username = message.username;
    console.log(`${client.username} has connected!`);

    const xPlayer = clientList.find(p => p.role === 'X');
    const oPlayer = clientList.find(p => p.role === 'O');

    let assignedRole: 'X' | 'O' | null = null;

    if (!xPlayer) {
        assignedRole = 'X';
    } else if (!oPlayer) {
        assignedRole = 'O';
    } else {
        // Both 'X' and 'O' are taken.
        assignedRole = null;
    }

    client.role = assignedRole;
    clientList.push(client);

    if (assignedRole) {
        client.socket.send(JSON.stringify({ type: 'ASSIGN_ROLE', role: assignedRole }));
    } else {
        client.socket.send(JSON.stringify({ type: 'GAME_FULL' }));
    }

    // Broadcast all usernames to clients
    const usernames = clientList.map(c => c.username);
    broadcast({
        type: 'USER_LIST',
        usernames: usernames
    } as UserMsg);

    // Also send the current board state to the newly connected client
    client.socket.send(JSON.stringify({
        type: 'MAKE_MOVE',
        board,
        isXNext
    }));
}

function handleMakeMove(client: Client, message: MoveMessage) {
    const { index, player } = message;

    // Check if player matches the current turn
    const currentPlayer = isXNext ? 'X' : 'O';
    if (player !== currentPlayer) {
        // Ignore illegal move
        return;
    }

    // Check if the move is valid (tile not taken and game not ended)
    if (board[index] !== null) {
        return;
    }

    // Update the board state
    board = board.slice();
    board[index] = player;

    // Toggle turn
    isXNext = !isXNext;

    // Broadcast the updated board state to all clients
    broadcast({
        type: 'MAKE_MOVE',
        board: board,
        isXNext: isXNext
    });
}