import Board from "./Board.tsx";
import {useUserListStore} from "../stores/stores.ts";
import {Box} from "@mui/material";

export default function TicTacToe() {

    const usernames = useUserListStore(state => state.usernames)

    return (
        <>
            <Box>
                <h3>Connected Users</h3>
                <ul>
                    {usernames.map((username, index) => (
                        <li key={index}>{username}</li>
                    ))}
                </ul>
            </Box>
            <Board/>
        </>
    )
}