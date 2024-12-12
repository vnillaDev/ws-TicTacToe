import {Box} from "@mui/material";

interface TileProps {
    value: 'X' | 'O' | null;
    onTileClick: () => void;
}

export default function Tile({value, onTileClick}: TileProps) {
    return (
        <>
            <Box
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                padding={0}
                bgcolor="#fff"
                border="1px solid #999"
                borderRadius={0}
                fontSize="1rem"
                fontWeight="bold"
                onClick={onTileClick}
                color="#000"
            >
                {value}
            </Box>
        </>
    )
}