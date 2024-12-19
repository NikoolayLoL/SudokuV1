import React, { useState } from "react";

type Coordinate = {
  sudokuValue: string;
  isInvalid?: boolean;
};

const Sudoku: React.FC = () => {
  const [sudokuGrid, setSudokuGrid] = useState<Coordinate[]>(
    Array.from({ length: 81 }, () => ({ sudokuValue: "" }))
  );
  const [invalidCells, setInvalidCells] = useState<Set<number>>(new Set());

  const validateInput = (value: string): boolean => {
    return /^[1-9]?$/.test(value); // Allow only single-digit numbers or empty string
  };

  const validMove = (position: number, value: string): boolean => {
    const row = Math.floor(position / 9);
    const col = position % 9;

    // Check row for duplicates
    for (let i = 0; i < 9; i++) {
      const index = row * 9 + i;
      if (index !== position && sudokuGrid[index].sudokuValue === value) {
        return false;
      }
    }

    // Check column for duplicates
    for (let i = 0; i < 9; i++) {
      const index = col + i * 9;
      if (index !== position && sudokuGrid[index].sudokuValue === value) {
        return false;
      }
    }

    // Check 3x3 subgrid for duplicates
    const subgridRowStart = Math.floor(row / 3) * 3;
    const subgridColStart = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const index = (subgridRowStart + r) * 9 + subgridColStart + c;
        if (index !== position && sudokuGrid[index].sudokuValue === value) {
          return false;
        }
      }
    }

    return true;
  };

  const revalidateConflicts = (indexToRemove: number) => {
    const newInvalidCells = new Set(invalidCells);
    newInvalidCells.delete(indexToRemove); // Remove the fixed cell from invalidCells

    for (const cellIndex of newInvalidCells) {
      const cell = sudokuGrid[cellIndex];
      if (validMove(cellIndex, cell.sudokuValue)) {
        sudokuGrid[cellIndex].isInvalid = false;
        newInvalidCells.delete(cellIndex);
      }
    }

    setInvalidCells(newInvalidCells);
  };

  const handleInputChange = (index: number, value: string) => {
    if (!validateInput(value)) return;

    const newGrid = [...sudokuGrid];

    if (value === "") {
      // If the value is cleared, remove conflicts
      newGrid[index].sudokuValue = value;
      newGrid[index].isInvalid = false;
      revalidateConflicts(index);
    } else if (validMove(index, value)) {
      // Valid move
      newGrid[index] = { sudokuValue: value, isInvalid: false };
      revalidateConflicts(index);
    } else {
      // Invalid move
      newGrid[index] = { sudokuValue: value, isInvalid: true };
      setInvalidCells(new Set([...invalidCells, index]));
    }

    setSudokuGrid(newGrid);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h3 style={{ margin: "10px 0" }}>Sudoku</h3>
      <div
        className="sudoku-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(9, 40px)",
          gridTemplateRows: "repeat(9, 40px)",
          gap: "2px",
          border: "2px solid black",
        }}
      >
        {sudokuGrid.map(({ sudokuValue, isInvalid }, index) => {
          const styleBox: React.CSSProperties = {
            width: "40px",
            height: "40px",
            textAlign: "center",
            border: isInvalid ? "2px solid red" : "2px solid #ccc",
            boxSizing: "border-box",
          };

          return (
            <div key={index} className="sudoku-cell">
              <input
                type="text"
                maxLength={1}
                style={styleBox}
                value={sudokuValue}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sudoku;
