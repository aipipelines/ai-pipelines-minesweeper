import React, { useState, useEffect } from "react";
import Cell from "./Cell";

function createEmptyBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

function plantMines(board, rows, cols, mines) {
  let planted = 0;
  while (planted < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine) {
      board[r][c].mine = true;
      planted++;
    }
  }
}

function countAdjacents(board, rows, cols) {
  const directions = [
    [1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1],
  ];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let [dr, dc] of directions) {
        const nr = r + dr, nc = c + dc;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          board[nr][nc].mine
        ) {
          count++;
        }
      }
      board[r][c].adjacent = count;
    }
  }
}

function revealSafeCells(board, r, c, rows, cols) {
  const stack = [[r, c]];
  const directions = [
    [1, 0], [0, 1], [-1, 0], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1],
  ];

  while (stack.length) {
    const [cr, cc] = stack.pop();
    if (
      cr < 0 ||
      cr >= rows ||
      cc < 0 ||
      cc >= cols ||
      board[cr][cc].revealed ||
      board[cr][cc].flagged
    )
      continue;
    board[cr][cc].revealed = true;
    if (board[cr][cc].adjacent === 0) {
      for (let [dr, dc] of directions) {
        stack.push([cr + dr, cc + dc]);
      }
    }
  }
}

function cloneBoard(board) {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

function checkWin(board, rows, cols, mines) {
  let unrevealed = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!board[r][c].revealed) unrevealed++;
  return unrevealed === mines;
}

function Board({ rows, cols, mines }) {
  const [board, setBoard] = useState(() => {
    const b = createEmptyBoard(rows, cols);
    plantMines(b, rows, cols, mines);
    countAdjacents(b, rows, cols);
    return b;
  });
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    setGameOver(false);
    setWin(false);
    const b = createEmptyBoard(rows, cols);
    plantMines(b, rows, cols, mines);
    countAdjacents(b, rows, cols);
    setBoard(b);
  }, [rows, cols, mines]);

  const onCellClick = (r, c, e) => {
    if (gameOver || win) return;
    let newBoard = cloneBoard(board);

    if (e.type === "contextmenu" || e.button === 2) {
      // Right click: flag cell
      e.preventDefault();
      if (!newBoard[r][c].revealed) {
        newBoard[r][c].flagged = !newBoard[r][c].flagged;
        setBoard(newBoard);
      }
      return;
    }

    if (newBoard[r][c].flagged || newBoard[r][c].revealed) return;

    if (newBoard[r][c].mine) {
      // reveal all mines
      for (let rr = 0; rr < rows; rr++)
        for (let cc = 0; cc < cols; cc++)
          if (newBoard[rr][cc].mine) newBoard[rr][cc].revealed = true;
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    revealSafeCells(newBoard, r, c, rows, cols);
    setBoard(newBoard);
    if (checkWin(newBoard, rows, cols, mines)) setWin(true);
  };

  return (
    <div style={{ display: "inline-block", margin: "1em" }}>
      <div style={{ marginBottom: "1em", fontSize: "1.2em" }}>
        {gameOver
          ? "💥 Game Over!"
          : win
          ? "🎉 You Win!"
          : "Left click: Reveal | Right click: Flag"}
      </div>
      <table
        style={{
          borderCollapse: "collapse",
          margin: "0 auto",
          background: "#111",
        }}
      >
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <Cell
                  key={c}
                  cell={board[r][c]}
                  onClick={(e) => onCellClick(r, c, e)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Board;
