import { useState } from "react";
import DrawingGame from "./DrawingGame";
import TypingGame from "./TypingGame";
import drawIcon from "../../assets/icons/paint-palette-artist-svgrepo-com.svg";
import keyboardIcon from "../../assets/icons/keyboard-svgrepo-com.svg";
import catIcon from "../../assets/icons/cat-svgrepo-com.svg";
import gameIcon from "../../assets/icons/game-svgrepo-com.svg";
import "./Games.css";

const games = [
  {
    id: "drawing",
    icon: drawIcon,
    title: "Drawing Game",
    desc: "Paint on a pixel grid. Save your masterpieces to the gallery!",
  },
  {
    id: "typing",
    icon: keyboardIcon,
    title: "Keyboard Challenge",
    desc: "Type a text as fast as you can. You have 45 seconds!",
  },
  {
    id: "cat",
    icon: catIcon,
    title: "Cat Bounce",
    desc: "An interactive cat-bouncing simulation. Pure chaos.",
  },
];

export default function Games() {
  const [activeGame, setActiveGame] = useState(null);

  return (
    <div className="page-wrap">
      <div className="page-header">
        <h1>
          <img
            src={gameIcon}
            style={{
              width: 32,
              height: 32,
              verticalAlign: "middle",
              marginRight: 8,
            }}
            alt=""
          />
          Games
        </h1>
      </div>

      {!activeGame ? (
        <div className="games-grid">
          {games.map((g) => (
            <div
              key={g.id}
              className="game-card"
              onClick={() => setActiveGame(g.id)}
            >
              <img src={g.icon} className="game-icon-img" alt={g.title} />
              <h3>{g.title}</h3>
              <p>{g.desc}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="btn btn-gray"
            onClick={() => setActiveGame(null)}
            style={{ marginBottom: "22px" }}
          >
            Back to Games
          </button>
          {activeGame === "drawing" && <DrawingGame />}
          {activeGame === "typing" && <TypingGame key={activeGame} />}
          {activeGame === "cat" && (
            <iframe
              src="https://cat-bounce.com/"
              className="cat-frame"
              allowFullScreen
              title="Cat Bounce"
            />
          )}
        </div>
      )}
    </div>
  );
}
