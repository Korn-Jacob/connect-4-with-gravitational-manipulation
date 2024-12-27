import React from "react";
import { useNavigate } from "react-router-dom";

export default function Guide() {
    const navigate = useNavigate();
    return (
        <>
            <h1>How to play Connect 4 With Gravitational Manipulation:</h1>
            <p>It's just like <a href="https://www.unco.edu/hewit/pdf/giant-map/connect-4-instructions.pdf" title="click here if you somehow don't know the rules" style={{cursor: "help"}}>regular Connect 4</a>, but with a twist.</p>
            <p>On each turn, instead of dropping a tile, you may use the <b>Gravitational Control Panel</b>, shown below.</p>
            <img src="/images/gravitational-control-panel.png" alt="gravitational control panel"/>
            <p>By clicking on one of the arrows, you change the direction of the gravity to that direction.</p>
            <p>That's it!</p>
            <button onClick={() => navigate("/")}>Back to main page</button>
        </>
    )
}