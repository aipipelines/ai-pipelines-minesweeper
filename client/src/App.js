import React, { useState } from "react";
import Board from "./Board";

function App() {
  const [key, setKey] = useState(0);

  // Standard beginner config
  const rows = 9;
  const cols = 9;
  const mines = 10;

  return (
    <div style={{ textAlign: "center", marginTop: "2em", fontFamily: "sans-serif" }}>
      <h1>Minesweeper</h1>
      <button onClick={() => setKey((k) => k + 1)}>New Game</button>
      <Board key={key} rows={rows} cols={cols} mines={mines} />
      <p style={{ marginTop: "2em", color: "#888" }}>
        Refresh or open in a new browser to start a fresh game.
      </p>
    </div>
  );
}

export default App;