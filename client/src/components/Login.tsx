import {Box, Button, TextField} from "@mui/material";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useWebSocket} from "../hooks/useWebSocket.ts";
import {useUserStore} from "../stores/stores.ts";

export default function Login() {
    const URL: string = 'ws://localhost:9999';

    const [input, setInput] = useState('');
    const navigate = useNavigate()
    const setUsername = useUserStore((state) => state.setUsername);
    const {connect} = useWebSocket()

    const handleConnect = () => {
        connect(input.trim(), URL)
        setUsername(input.trim());
        navigate("/tictactoe");
    }

    return (
        <>
            <h1>Login</h1>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="#fff"
                padding="35px"
                borderRadius="15px"
            >
                <TextField
                    label="username"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConnect}
                    sx={{mt: 3, width: 180}}
                    disabled={input.length < 1}
                >
                    Go to TicTacToe
                </Button>
            </Box>
        </>
    )
}