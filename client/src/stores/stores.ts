import {create} from 'zustand';
import {combine} from 'zustand/middleware'
import {Role, Tile} from "../common/client-models.ts";

type SocketStore = {
    ws: WebSocket | null,
    setWs: (ws: WebSocket | null) => void;
}

type UserListStore = {
    usernames: string[],
    setUsernames: (usernames: string[]) => void
}

type UserStore = {
    username: string,
    setUsername: (username: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    username: "",
    setUsername: (username: string) => set({username})
}));


export const useUserListStore = create<UserListStore>((set) => ({
    usernames: [],
    setUsernames: (usernames: string[]) => set({usernames})
}));

export const useSocketStore = create<SocketStore>((set) => ({
    ws: null,
    setWs: (ws: WebSocket | null) => set({ws})
}));


type GameStore = {
    board: Tile[]; // Represents the game board with 9 tiles: 'X', 'O', or null
    isXNext: boolean; // Indicates if it's X's turn
    playerRole: Role;
    updateBoard: (
        newBoard: ((currentBoard: Tile[]) => Tile[]) | Tile[]
    ) => void; // Function to update the board, accepts a new array or a function
    toggleTurn: (
        nextTurn: ((isXNext: boolean) => boolean) | boolean
    ) => void; // Function to toggle the turn, accepts a boolean or a function
    setPlayerRole: (role: Role) => void;
};

export const useGameStore = create<GameStore>(
    combine(
        {
            board: Array(9).fill(null),
            isXNext: true,
            playerRole: 'X' as Role
        }, (set) => {
            return {
                updateBoard: (newBoard) => {
                    set((state) => ({
                        board:
                            typeof newBoard === 'function'
                                ? newBoard(state.board) // Functional update
                                : newBoard, // Direct update
                    }));
                },
                toggleTurn: (nextTurn) => {
                    set((state) => ({
                        isXNext:
                            typeof nextTurn === 'function'
                                ? nextTurn(state.isXNext) // Functional update
                                : nextTurn, // Direct update
                    }));
                },
                setPlayerRole: (role) => {
                    set({playerRole: role});
                }
            };
        }),
);