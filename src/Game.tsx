import React, { useState } from 'react';
import './Game.css';

type TileColor = 'red' | 'green' | 'blue' | 'yellow' | 'white';

interface TileProps {
  color: TileColor;
  onClick: () => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
}

const Tile: React.FC<TileProps> = ({ color, onClick, onDragStart }) => {
  const tileStyle = {
    backgroundColor: color,
  };

  return (
    <div
      className="tile"
      style={tileStyle}
      onClick={onClick}
      draggable={true}
      onDragStart={onDragStart}
    ></div>
  );
};

const Game: React.FC = () => {
  const [gameData, setGameData] = useState<TileColor[][] | null>(null);
  const [movesLeft, setMovesLeft] = useState<number>(10);

  const initializeGame = () => {
    const initialTiles: TileColor[][] = [
      ['red', 'red', 'red'],
      ['green', 'green', 'green'],
      ['blue', 'blue', 'blue'],
    ];

    setGameData(initialTiles);
    setMovesLeft(10);
  };

  const handleTileClick = (rowIndex: number, columnIndex: number) => {
    if (gameData && movesLeft > 0) {
      const updatedTiles: TileColor[][] = gameData.map((row, rowIdx) =>
        row.map((tileColor, colIdx) => {
          if (rowIdx === rowIndex || colIdx === columnIndex) {
            return 'white' as TileColor; // Replace with your color mixing logic
          }
          return tileColor;
        })
      );

      setGameData(updatedTiles);
      setMovesLeft(movesLeft - 1);
    }
  };

  const handleSourceClick = (color: TileColor) => {
    if (gameData && movesLeft > 0) {
      const updatedTiles: TileColor[][] = gameData.map((row) =>
        row.map(() => color)
      );

      setGameData(updatedTiles);
      setMovesLeft(movesLeft - 1);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    if (gameData && movesLeft > 0) {
      const rowIndex = event.currentTarget.getAttribute('data-row');
      const colIndex = event.currentTarget.getAttribute('data-col');
      event.dataTransfer.setData('text/plain', `${rowIndex},${colIndex}`);
    }
  };
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent the default behavior of the drop event
  
    if (gameData && movesLeft > 0) {
      const data = event.dataTransfer.getData('text/plain');
      const [sourceRowIndex, sourceColIndex] = data.split(',');
      const targetRowIndex = event.currentTarget.getAttribute('data-row');
      const targetColIndex = event.currentTarget.getAttribute('data-col');
  
      if (sourceRowIndex && sourceColIndex && targetRowIndex && targetColIndex) {
        const sourceColor = gameData[Number(sourceRowIndex)][Number(sourceColIndex)];
        const targetColor = gameData[Number(targetRowIndex)][Number(targetColIndex)];
  
        const mixedColor = mixColors(sourceColor, targetColor);
        handleSourceClick(mixedColor);
      }
    }
  };
  

  const mixColors = (color1: TileColor, color2: TileColor): TileColor => {
    if ((color1 === 'red' && color2 === 'green') || (color1 === 'green' && color2 === 'red')) {
      return 'yellow' as TileColor;
    } else {
      return 'white' as TileColor; // Default color if no mixing is defined
    }
  };

  const renderTiles = () => {
    if (gameData) {
      return gameData.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((color, colIndex) => (
            <Tile
              key={colIndex}
              color={color}
              onClick={() => handleTileClick(rowIndex, colIndex)}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="game-container">
      <h1>Color Mixing Game</h1>
      <button onClick={initializeGame}>Start Game</button>
      <div className="grid" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
        {renderTiles()}
      </div>
      <div className="moves-left">Moves Left: {movesLeft}</div>
    </div>
  );
};

export default Game;
