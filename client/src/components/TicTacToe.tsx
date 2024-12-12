import Board from "./Board.tsx";
import UserList from "./UserList.tsx";
import {Box, Button} from "@mui/material";
import {useWebSocket} from "../hooks/useWebSocket.ts";
import {useGameStore} from "../stores/stores.ts";

export default function TicTacToe() {
    const {resetGame} = useWebSocket();
    const playerRole = useGameStore(state => state.playerRole)

    return (
        <>
            <Box display="flex" gap={3}>
                {/* Left side: UserList */}
                <Box
                    sx={{
                        padding: 3,
                        border: "1px solid white",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <UserList/>
                </Box>

                {/* Right side: Game Board and Reset Button */}
                <Box
                    display="flex"
                    flexDirection="column"
                    gap={3}
                    flexGrow={1}
                >
                    {/* Game Board */}
                    <Box
                        sx={{
                            padding: 3,
                            border: "1px solid white",
                            borderRadius: 2,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexGrow: 1,
                        }}
                    >
                        <Board/>
                    </Box>

                    {/* Reset Button */}
                    <Box
                        sx={{
                            padding: 3,
                            border: "1px solid white",
                            borderRadius: 2,
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{width: 290}}
                            onClick={resetGame}
                            disabled={playerRole === null}
                        >
                            Reset
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}