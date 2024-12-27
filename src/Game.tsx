import React, { useState } from "react";
import MouseTile from "./components/MouseTile.tsx";

const ROWS = 6;
const COLUMNS = 7;

enum Player {
    YELLOW = "yellow",
    RED = "red"
}

export enum Direction {
    DOWN,
    UP, 
    LEFT,
    RIGHT
}

export function dirval(direction: Direction): number[] {
    switch (direction) {
        case Direction.DOWN:
            return [1,0];
        case Direction.UP:
            return [-1,0];
        case Direction.LEFT:
            return [0,-1];
        case Direction.RIGHT:
            return [0,1];
    }
}

type Winner = {
    winner: Player | "Draw",
    tiles: number[][]
}

type BoardData = (Player | null)[][];

export class GameInstance {
    turn: Player;
    boardData: BoardData;
    gravitationalDirection: Direction;
    winner: Winner | null;
    private constructor(turn: Player, boardData: BoardData, gravitationalDirection: Direction) {
        this.turn = turn;
        this.boardData = boardData;
        this.gravitationalDirection = gravitationalDirection;
        this.winner = this.checkWinner();
    }
    static instantiate(): GameInstance {
        const turn = Math.random() < 0.5 ? Player.RED : Player.YELLOW;
        const boardData: BoardData = [];
        for (let i = 0; i < ROWS; i++) {
            let t: (Player | null)[] = [];
            for (let j = 0; j < COLUMNS; j++) {
                t.push(null);
            }
            boardData.push(t);
        }
        return new GameInstance(turn, boardData, Direction.DOWN);
    }
    copy(): GameInstance {
        return new GameInstance(this.turn, this.boardData, this.gravitationalDirection);
    }
    canDrop(index: number): boolean {
        switch (this.gravitationalDirection) {
            case Direction.DOWN:
            case Direction.UP:
                for (let i = 0; i < ROWS; i++) {
                    if (!this.boardData[i][index]) {
                        return true;
                    }
                }
                return false;
            case Direction.LEFT:
            case Direction.RIGHT:
                for (let i = 0; i < COLUMNS; i++) {
                    if (!this.boardData[index][i]) {
                        return true;
                    }
                }
                return false;
        }
    }

    dropTile(index: number): GameInstance {
        if (!this.canDrop(index)) return this;

        switch (this.gravitationalDirection) {
            case Direction.DOWN:
                for (let i = ROWS-1; i >= 0; i--) {
                    if (!this.boardData[i][index]) {
                        this.boardData[i][index] = this.turn;
                        break;
                    }
                }
                break;
            case Direction.UP:
                for (let i = 0; i < ROWS; i++) {
                    if (!this.boardData[i][index]) {
                        this.boardData[i][index] = this.turn;
                        break;
                    }
                }
                break;
            case Direction.LEFT:
                for (let i = 0; i < COLUMNS; i++) {
                    if (!this.boardData[index][i]) {
                        this.boardData[index][i] = this.turn;
                        break;
                    }
                }
                break;
            case Direction.RIGHT:
                for (let i = COLUMNS-1; i >= 0; i--) {
                    if (!this.boardData[index][i]) {
                        this.boardData[index][i] = this.turn;
                        break;
                    }
                }
        }
        this.turn = this.turn === Player.RED ? Player.YELLOW : Player.RED;
        return this.copy();
    }

    addTile(row: number, col: number): GameInstance {
        return this.gravitationalDirection === Direction.DOWN || this.gravitationalDirection === Direction.UP ? this.dropTile(col) : this.dropTile(row);
    }

    checkWinner(): Winner | null {
        let out = {winner: [] as Player[], tiles: [] as number[][]};
        // rows:
        for (let i = 0; i < COLUMNS; i++) {
            for (let j = 0; j < ROWS-3; j++) {
                if (this.boardData[j][i] && this.boardData[j][i] === this.boardData[j+1][i] && this.boardData[j+1][i] === this.boardData[j+2][i] && this.boardData[j+2][i] === this.boardData[j+3][i]) {
                    out.winner.push(this.boardData[j][i]!);
                    out.tiles.push([j,i], [j+1,i], [j+2,i], [j+3,i]);
                }
            }
        }
        // columns:
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS-3; j++) {
                if (this.boardData[i][j] && this.boardData[i][j] === this.boardData[i][j+1] && this.boardData[i][j+1] === this.boardData[i][j+2] && this.boardData[i][j+2] === this.boardData[i][j+3]) {
                    out.winner.push(this.boardData[i][j]!);
                    out.tiles.push([i,j], [i,j+1], [i,j+2], [i,j+3]);
                }
            }
        }
        // diagonal (right)
        for (let i = 0; i < ROWS-3; i++) {
            for (let j = 0; j < COLUMNS-3; j++) {
                if (this.boardData[i][j] && this.boardData[i][j] === this.boardData[i+1][j+1] && this.boardData[i][j] === this.boardData[i+2][j+2] && this.boardData[i][j] === this.boardData[i+3][j+3]) {
                    out.winner.push(this.boardData[i][j]!);
                    out.tiles.push([i,j], [i+1,j+1], [i+2,j+2], [i+3,j+3])
                }
            }
        }
        // diagonal (left)
        for (let i = 0; i < ROWS-3; i++) {
            for (let j = 3; j < COLUMNS; j++) {
                if (this.boardData[i][j] && this.boardData[i][j] === this.boardData[i+1][j-1] && this.boardData[i][j] === this.boardData[i+2][j-2] && this.boardData[i][j] === this.boardData[i+3][j-3]) {
                    out.winner.push(this.boardData[i][j]!);
                    out.tiles.push([i,j], [i+1,j-1], [i+2,j-2], [i+3,j-3])
                }
            }
        }

        if (!out.winner.length) 
            return null;

        if (out.winner.includes(Player.RED) && out.winner.includes(Player.YELLOW))
            return {
                winner: "Draw",
                tiles: out.tiles
            };
        
        if (out.winner.includes(Player.RED))
            return {
                winner: Player.RED,
                tiles: out.tiles
            }

        let droppable = 0;
        for (let i = 0; i < (this.gravitationalDirection === Direction.DOWN || this.gravitationalDirection === Direction.UP ? COLUMNS : ROWS); i++) {
            if (this.canDrop(i)) droppable++;
        }
        if (!droppable)
            return {
                winner: "Draw",
                tiles: []
            }

        return {
            winner: Player.YELLOW,
            tiles: out.tiles
        }
    }

    changeGravity(direction: Direction): GameInstance {
        if (this.gravitationalDirection === direction) return this;

        this.gravitationalDirection = direction;
        let hasChanged = true;
        
        while (hasChanged) {
            hasChanged = false;
            for (let i = 0; i < ROWS; i++) {
                for (let j = 0; j < COLUMNS; j++) {
                    if (this.boardData[i][j]) {
                        let x = i;
                        let y = j;
                        while (x+dirval(direction)[0] >= 0 && x+dirval(direction)[0] < ROWS && y+dirval(direction)[1] >= 0 && y+dirval(direction)[1] < COLUMNS && !this.boardData[x+dirval(direction)[0]][y+dirval(direction)[1]]) {
                            this.boardData[x+dirval(direction)[0]][y+dirval(direction)[1]] = this.boardData[x][y];
                            this.boardData[x][y] = null;
                            x += dirval(direction)[0];
                            y += dirval(direction)[1];
                            hasChanged = true;
                        }
                    }
                }
            }
        }

        this.turn = this.turn === Player.RED ? Player.YELLOW : Player.RED;
        return this.copy();
    }
}

export default function Game() {
    const [gameState, setGameState] = useState(GameInstance.instantiate());
    const [hoveredOver, setHoveredOver] = useState<number[] | null>(null);

    let key = 0;
    const board: React.JSX.Element[][] = [];
    for (let i = 0; i < ROWS; i++) {
        const t: React.JSX.Element[] = [];
        for (let j = 0; j < COLUMNS; j++) {
            t.push(
                <div className={gameState.winner && gameState.winner?.tiles.findIndex((pos) => pos[0] === i && pos[1] === j) !== -1 ? "highlighted tile" : "tile"} onClick={gameState.winner ? () => {} : () => setGameState(gameState.addTile(i, j))} style={{backgroundColor: gameState.boardData[i][j] || "white", gridRow: i+1, gridColumn: j+1}} onMouseEnter={() => setHoveredOver([i,j])} onMouseLeave={() => setHoveredOver(null)} key={key++}/>
            )
        }
        board.push(t);
    }
    return (
        <>
            {gameState.winner ?
                <>
                    <div className="winscreen" style={{color: gameState.winner.winner === "Draw" ? "white" : gameState.winner.winner}}>{gameState.winner.winner.toUpperCase()} {gameState.winner.winner !== "Draw" ? "WINS!" : <></>}</div>
                    <button onClick={() => window.location.reload()} className="play-again">Play again</button>
                </>
            : <>
                <div className="turn" style={{color: gameState.turn}}><b>It is {gameState.turn}'s turn!</b></div>
                <div className="gravity-control-panel center">
                    <h3>Change Gravity:</h3>
                    <div className="row center">
                        <button className={gameState.gravitationalDirection === Direction.LEFT ? "selected" : ""} onClick={() => setGameState(gameState.changeGravity(Direction.LEFT))}>{"<"}</button>
                        <button className={gameState.gravitationalDirection === Direction.UP ? "selected" : ""} onClick={() => setGameState(gameState.changeGravity(Direction.UP))}>{"^"}</button>
                        <button className={gameState.gravitationalDirection === Direction.DOWN ? "selected" : ""} onClick={() => setGameState(gameState.changeGravity(Direction.DOWN))}>{"V"}</button>
                        <button className={gameState.gravitationalDirection === Direction.RIGHT ? "selected" : ""} onClick={() => setGameState(gameState.changeGravity(Direction.RIGHT))}>{">"}</button>
                    </div>
                </div>
                {hoveredOver ? 
                    <MouseTile gameState={gameState} position={dirval(gameState.gravitationalDirection)[0] ? hoveredOver[1] : hoveredOver[0]}/>
                : <></>}
            </>}
            <div className="background" />
            <div className="board">{board}</div>
        </>
    )
}