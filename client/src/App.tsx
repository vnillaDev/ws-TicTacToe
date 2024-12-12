import './App.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Login from "./components/Login.tsx";
import TicTacToe from "./components/TicTacToe.tsx";

function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/tictactoe" element={<TicTacToe/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
