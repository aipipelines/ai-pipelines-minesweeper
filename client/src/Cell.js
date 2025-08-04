import React from "react";

const cellStyle = {
  width: 32,
  height: 32,
  textAlign: "center",
  verticalAlign: "middle",
  border: "1px solid #555",
  background: "#222",
  color: "#eee",
  fontSize: "1.1em",
  cursor: "pointer",
  userSelect: "none",
};

const revealedStyle = {
  ...cellStyle,
  background: "#444",
  cursor: "default",
};

const colorMap = {
  1: "#00f",
  2: "#080",
  3: "#f00",
  4: "#008",
  5: "#800",
  6: "#088",
  7: "#000",
  8: "#888",
};

function Cell({ cell, onClick }) {
  let content = "";
  if (cell.revealed) {
    if (cell.mine) content = "💣";
    else if (cell.adjacent > 0)
      content = (
        <span style={{ color: colorMap[cell.adjacent] }}>
          {cell.adjacent}
        </span>
      );
  } else if (cell.flagged) {
    content = "🚩";
  }

  return (
    <td
      style={cell.revealed ? revealedStyle : cellStyle}
      onClick={onClick}
      onContextMenu={onClick}
      tabIndex={0}
      aria-label={
        cell.revealed
          ? cell.mine
            ? "Mine"
            : cell.adjacent
            ? `${cell.adjacent} adjacent mines`
            : "Empty"
          : cell.flagged
          ? "Flagged"
          : "Hidden"
      }
    >
      {content}
    </td>
  );
}

export default Cell;
