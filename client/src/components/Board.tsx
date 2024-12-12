import Tile from "./Tile.tsx";
import {Box, Typography} from "@mui/material";
import {useGameStore} from "../stores/stores.ts";
import {useEffect} from "react";
import {calculateStatus, calculateTurns, calculateWinner} from "../common/helper.ts";
import {Player} from "../common/client-models.ts";
import {useWebSocket} from "../hooks/useWebSocket.ts";

export default function Board() {
    const tiles = useGameStore(state => state.board);
    const setTiles = useGameStore(state => state.updateBoard);
    const isXNext = useGameStore(state => state.isXNext);
    const setXIsNext = useGameStore(state => state.toggleTurn);
    const {send} = useWebSocket()

    const player: Player = isXNext ? 'X' : 'O';

    const winner = calculateWinner(tiles)
    const turns = calculateTurns(tiles)
    const status = calculateStatus(winner, turns, player)


    const handleClick = (index: number) => {
        if (tiles[index] || winner) return
        const nextTiles = tiles.slice()
        nextTiles[index] = player;

        setTiles(nextTiles);
        setXIsNext(!isXNext);

        sendToServer(index, player);
    }

    const sendToServer = (index: number, player: string) => {
        const moveMessage = {
            type: "MAKE_MOVE",
            index: index,
            player: player
        }

        send(JSON.stringify(moveMessage))
    };

    useEffect(() => {
        console.log(tiles)
    }, [tiles])

    return (
        <>
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
                    {
                        tiles.map((tile, tileIndex) => (
                            <Tile
                                key={`square-${tileIndex}`}
                                value={tile}
                                onTileClick={() => handleClick(tileIndex)}
                            />
                        ))
                    }
                </Box>
            </Box>
        </>
    )
}