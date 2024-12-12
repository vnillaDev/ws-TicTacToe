import Tile from "./Tile";
import {Box, Typography} from "@mui/material";
import {useGameStore} from "../stores/stores";
import {useEffect} from "react";
import {calculateStatus, calculateTurns, calculateWinner} from "../common/helper";
import {useWebSocket} from "../hooks/useWebSocket";

export default function Board() {
    const board = useGameStore((state) => state.board);
    const isXNext = useGameStore((state) => state.isXNext);
    const playerRole = useGameStore((state) => state.playerRole);

    const {makeMove} = useWebSocket();

    const winner = calculateWinner(board);
    const turns = calculateTurns(board);
    const status = calculateStatus(winner, turns, isXNext ? 'X' : 'O');

    const handleClick = (index: number) => {
        if (!playerRole) return;
        if (board[index] || winner) return;

        const currentPlayer = isXNext ? 'X' : 'O';

        // Only allow the player whose turn it is to make a move
        if (playerRole !== currentPlayer) return;

        // Send move to the server
        makeMove(index, playerRole);
    };

    useEffect(() => {
        console.log("Current Board State:", board);
    }, [board]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            // border="8px solid red"
            width={"fit-content"}
        >
            <Typography variant="h1">Tic Tac Toe</Typography>
            <Typography variant="h2">{status}</Typography>
            <Box
                display='grid'
                gridTemplateColumns='repeat(3, 1fr)'
                gridTemplateRows='repeat(3, 1fr)'
                width='calc(3 * 6rem)'
                height='calc(3 * 6rem)'
                border='1px solid #999'
            >
                {board.map((tile, tileIndex) => (
                    <Tile
                        key={`square-${tileIndex}`}
                        value={tile}
                        onTileClick={() => handleClick(tileIndex)}
                    />
                ))}
            </Box>
        </Box>
    );
}