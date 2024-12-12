import {create} from 'zustand';
import {combine} from 'zustand/middleware'
import {Role, Tile} from "../common/client-models.ts";

/*
  Type Definitions for Different Stores
  - SocketStore: Manages the WebSocket connection state.
  - UserListStore: Manages the list of connected usernames.
  - UserStore: Manages the local user's username.
*/
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
// #################################################################################################################################################################################


/*-------------------------------------------------------------------
  Creating Zustand Stores
  - useUserStore: Store for managing the local user's username.
  - useUserListStore: Store for managing the list of connected users.
  - useSocketStore: Store for managing the WebSocket connection.
--------------------------------------------------------------------*/

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

// #################################################################################################################################################################################

/**
 GameStore Definition and Creation
 - GameStore: Manages the game state, including the board, turn, player roles, and game reset functionality.
 */
type GameStore = {
    board: Tile[];
    isXNext: boolean;
    playerRole: Role;
    updateBoard: (
        newBoard: ((currentBoard: Tile[]) => Tile[]) | Tile[]
    ) => void;
    setTurn: (
        nextTurn: boolean
    ) => void;
    setPlayerRole: (role: Role) => void;
    resetGame: () => void;
};

/**
 * Creates the GameStore using Zustand combined with the combine middleware.
 * - Initializes the board with 9 empty tiles, isXNext to true, and playerRole to 'X'.
 * - Provides functions to update the board, set the turn, set the player role, and reset the game.
 */
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
                setTurn: (nextTurn) => {
                    set({isXNext: nextTurn})
                },
                setPlayerRole: (role) => {
                    set({playerRole: role});
                },
                resetGame: () => {
                    set((state) => ({
                        board: Array(9).fill(null),
                        isXNext: true,
                        playerRole: state.playerRole === 'X' ? 'O' : state.playerRole === 'O' ? 'X' : null
                    }))
                }
            };
        }),
);