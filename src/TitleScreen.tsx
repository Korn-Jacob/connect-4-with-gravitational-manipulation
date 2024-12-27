import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TitleScreen() {
    const navigate = useNavigate();
    return (
        <>
            <h1>Connect 4 With Gravitational Manipulation</h1>
            <div className="center row">
                <button onClick={() => navigate("/play")}>Play game</button>
                <button onClick={() => navigate("/how-to-play")}>How to play</button>
            </div>
        </>
    )
}