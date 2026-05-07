import { useState } from "react";
import "./Toast.css";

let show = null;

export function useToast() {
  const show = (msg) => {
    if (show) show(msg);
  };
  return show;
}

export function Toast() {
  const [msg, setMsg] = useState("");
  const [visible, setVisible] = useState(false);

  show = (m) => {
    setMsg(m);
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
  };

  if (!visible) return null;
  return <div className="toast">{msg}</div>;
}
