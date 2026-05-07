import { useState } from "react";
import "./DrawingGame.css";
import colors from "../../../colors.json";

const defaultColor = "rgb(240, 240, 240)";
const divArr = new Array(400).fill(defaultColor);

export default function DrawingGame() {
  const [selectedColor, setSelectedColor] = useState({
    id: colors[0].id,
    color: colors[0].color,
  });
  const [cells, setCells] = useState(divArr);
  const [savedDrawings, setSavedDrawings] = useState([]);
  const [isClicked, setIsClicked] = useState(false);

  function changeColor(cellId) {
    const newCells = [...cells];
    newCells[cellId] = selectedColor.color;
    setCells(newCells);
  }

  function reset() {
    setCells(divArr);
  }

  function save() {
    setSavedDrawings([...savedDrawings, [...cells]]);
  }

  return (
    <div className="drawing-container">
      <div className="color-palette">
        {colors.map((objColor) => (
          <button
            key={objColor.id}
            className="obj-color"
            style={{
              backgroundColor: objColor.color,
              border:
                selectedColor.id === objColor.id
                  ? "2px solid black"
                  : "2px solid transparent",
            }}
            onClick={() => setSelectedColor({ ...objColor })}
          />
        ))}
      </div>

      <div
        className="drawing-grid"
        onMouseLeave={() => setIsClicked(false)}
        onMouseUp={() => setIsClicked(false)}
      >
        {cells.map((cellColor, id) => (
          <div
            key={id}
            className="grid-cell"
            style={{ backgroundColor: cellColor }}
            onMouseDown={() => {
              changeColor(id);
              setIsClicked(true);
            }}
            onMouseEnter={() => {
              if (isClicked) changeColor(id);
            }}
          />
        ))}
      </div>

      <div className="controls">
        <button onClick={save}>Save</button>
        <button onClick={reset}>Reset</button>
      </div>

      <Gallery
        savedDrawings={savedDrawings}
        onSaveDrawings={setSavedDrawings}
        onChangeCells={setCells}
      />
    </div>
  );
}

function Gallery({ savedDrawings, onSaveDrawings, onChangeCells }) {
  return (
    <div className="gallery">
      <h2>Saved Drawings ({savedDrawings.length})</h2>
      {savedDrawings.map((drawing, index) => (
        <div key={index} className="gallery-item">
          <div
            className="gallery-thumbnail"
            onClick={() => onChangeCells([...drawing])}
          >
            {drawing.map((cellColor, id) => (
              <div
                key={id}
                className="grid-cell"
                style={{ backgroundColor: cellColor }}
              />
            ))}
          </div>
          <div>
            <button onClick={() => onChangeCells([...drawing])}>Load</button>
            <button
              onClick={() => {
                const newDrawings = savedDrawings.filter((_, i) => i !== index);
                onSaveDrawings(newDrawings);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
