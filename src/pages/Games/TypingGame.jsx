import { useState, useEffect, useRef } from "react";
import "./TypingGame.css";

const typingTexts = [
  "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
  "Sphinx of black quartz, judge my vow. The five boxing wizards jump quickly.",
  "Jackdaws love my big sphinx of quartz. Fix problem quickly with galvanized jets.",
  "Crazy Fredrick bought many very exquisite opal jewels. We promptly judged antique ivory buckles.",
  "A wizard's job is to vex chumps quickly in fog. Watch Jeopardy! Alex Trebek's fun TV quiz game.",
  "Two driven jocks help fax my big quiz. Quick zephyrs blow, vexing daft Jim.",
];

const totalTime = 45;

function pickText() {
  return typingTexts[Math.floor(Math.random() * typingTexts.length)];
}

export default function TypingGame() {
  const [target, setTarget] = useState(() => pickText());
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const timerRef = useRef(null);

  const end = (didWin) => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setGameOver(true);
    setWon(didWin);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleInput = (e) => {
    if (gameOver) return;
    const val = e.target.value;
    setTyped(val);

    console.log("val: ", val);

    if (!started && val.length > 0) {
      setStarted(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            end(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    if (val === target) end(true);
  };

  const restart = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setTarget(pickText());
    setTyped("");
    setTimeLeft(totalTime);
    setStarted(false);
    setGameOver(false);
    setWon(false);
  };

  const chars = target.split("").map((ch, i) => {
    let cls = "char-pending";
    if (i < typed.length) {
      cls = typed[i] === ch ? "char-correct" : "char-wrong";
    }
    return (
      <span key={i} className={cls}>
        {ch === " " ? "\u00a0" : ch}
      </span>
    );
  });

  const timerClass = `typing-timer${timeLeft <= 10 ? " typing-timer-warning" : ""}`;

  return (
    <div className="typing-wrap">
      <div className="typing-stats">
        <span>
          <span className={timerClass}>{timeLeft}</span>s
        </span>
        {!started && (
          <span style={{ color: "#888", fontSize: "14px" }}>
            Start typing to begin the timer!
          </span>
        )}
      </div>

      <div className="typing-text-box">{chars}</div>

      <input
        className="typing-input"
        value={typed}
        onChange={handleInput}
        placeholder="Type here..."
        disabled={gameOver}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {gameOver && (
        <div className={`game-result${won ? " game-win" : " game-lose"}`}>
          <h2>{won ? "You Win!" : "Time's Up!"}</h2>
          <p>
            {won
              ? "Excellent typing skills!"
              : "Better luck next time. Keep practicing!"}
          </p>
        </div>
      )}

      <div style={{ marginTop: "16px" }}>
        <button className="btn btn-gray" onClick={restart}>
          New Game
        </button>
      </div>
    </div>
  );
}
