import React from "react";
import { Direction, GameInstance } from "../Game.tsx";

type Props = {
    gameState: GameInstance,
    position: number
}

export default function MouseTile({ gameState, position }: Props) {
    let x = 0;
    let y = 0;
    switch (gameState.gravitationalDirection) {
        case Direction.DOWN:
            x = position * 60 - 180;
            y = -225;
            break;
        case Direction.UP:
            x = position * 60 - 180;
            y = 225;
            break;
        case Direction.LEFT:
            y = position * 60 - 150;
            x = 250;
            break;
        case Direction.RIGHT:
            y = position * 60 - 150;
            x = -250;
    }
    console.log(`translate(${x}px, ${y}px)`)
    return (
        <> 
            <div className="tile mouse-tile" style={{backgroundColor: gameState.turn, transform: `translate(${x}px, ${y}px)`}}></div>
        </>
    )
}