export type Player = 'X' | 'O';

export type Role = Player;

export type Tile = 'X' | 'O' | null;

export type ConnectMsg = {
    type: "CONNECT",
    username: string,
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
export type AssignRoleMessage = {
    type: "ASSIGN_ROLE",
    role: Role
}

export type ClientMessage = ConnectMsg | UserMsg | MoveMessage ;
export type ServerResponse = ConnectMsg | UserMsg | MoveMessage | AssignRoleMessage;