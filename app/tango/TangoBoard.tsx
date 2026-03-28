import { useState } from "react";

function Sun() {
  return <svg viewBox="0 0 50 50">
    <circle fill="rgba(255, 176, 74, 1)" stroke="#a96a1dff" strokeWidth="2" cx="25" cy="25" r="17" />
  </svg>;
}

function Moon() {
  return <svg viewBox="0 0 50 50">
    <path fill="#07f" stroke="rgba(6, 57, 116, 1)" strokeWidth="2" d="M16 40A17 17 0 1 0 16 10 16 16 0 0 1 16 40z" />
  </svg>
}

export default function TangoBoard() {
  const [sunMoon, setSunMoon] = useState<number[]>([]);
  const [hEqualCross, setHEqualCross] = useState<number[]>([]);
  const [vEqualCross, setVEqualCross] = useState<number[]>([]);

  const cells = [];
  for (let i = 0; i < 36; i++) {
    cells.push(
      <div key={i} className="relative bg-gray-200">
        <div className="absolute size-4/5 top-[10%] left-[10%]">
          {(i + (i / 6 | 0)) % 2 === 0 ? <Sun /> : <Moon />}
        </div>
        <div className="absolute size-full border border-gray-300" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 aspect-square w-full">
      {cells}
    </div>
  );
}
