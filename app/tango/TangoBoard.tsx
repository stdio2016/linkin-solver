import { useState } from "react";

function Sun() {
  return <svg viewBox="0 0 50 50">
    <circle fill="rgba(255, 176, 74, 1)" stroke="#a96a1dff" strokeWidth="2" cx="25" cy="25" r="17" />
  </svg>;
}

function Moon() {
  return <svg viewBox="0 0 50 50">
    <path fill="#07f" stroke="rgba(6, 57, 116, 1)" strokeWidth="2" d="M9 30A17 17 0 1 0 30 9 16 16 0 0 1 9 30z" />
  </svg>
}

function Equal() {
  return <svg viewBox="0 0 40 40">
    <rect x="4" y="4" width="32" height="32" fill="white" />
    <path stroke="black" strokeWidth="2" d="M12 16h16M12 24h16" />
  </svg>
}

function Cross() {
  return <svg viewBox="0 0 40 40">
    <rect x="4" y="4" width="32" height="32" fill="white" />
    <path stroke="black" strokeWidth="2" d="M14 14l12 12M14 26l12-12" />
  </svg>
}

export default function TangoBoard() {
  const [sunMoon, setSunMoon] = useState<number[]>(Array(36).fill(0));
  const [hEqualCross, setHEqualCross] = useState<number[]>(Array(36).fill(0));
  const [vEqualCross, setVEqualCross] = useState<number[]>(Array(36).fill(0));

  const cells = [];
  for (let i = 0; i < 36; i++) {
    const bgColor = sunMoon[i] === 0 ? "" : "bg-gray-200";
    cells.push(
      <div key={i} className={`relative ${bgColor}`}>
        <div className="absolute size-[70%] top-[15%] left-[15%]">
          {sunMoon[i] === 1 ? <Sun /> : sunMoon[i] === 2 ? <Moon /> : null}
        </div>
        <div className={`absolute size-full border-[0.5px] border-gray-300`}
          onClick={() => {
            const arr = sunMoon.slice();
            arr[i] = (arr[i] + 1) % 3;
            setSunMoon(arr);
          }} />
        {i % 6 !== 0 && <>
          <div className="absolute left-[-20%] top-[30%] size-2/5">
            {hEqualCross[i] === 1 ? <Equal /> : hEqualCross[i] === 2 ? <Cross /> : ""}
          </div>
          <div className="absolute left-[-20%] top-[10%] w-2/5 h-4/5"
            onClick={() => {
              const arr = hEqualCross.slice();
              arr[i] = (arr[i] + 1) % 3;
              setHEqualCross(arr);
            }} />
        </>
        }
        {i >= 6 && <>
          <div className="absolute left-[30%] top-[-20%] size-2/5">
            {vEqualCross[i] === 1 ? <Equal /> : vEqualCross[i] === 2 ? <Cross /> : ""}
          </div>
          <div className="absolute left-[10%] top-[-20%] w-4/5 h-2/5"
            onClick={() => {
              const arr = vEqualCross.slice();
              arr[i] = (arr[i] + 1) % 3;
              setVEqualCross(arr);
            }} />
        </>
        }
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 aspect-square w-full border-[0.5px] border-gray-300">
      {cells}
    </div>
  );
}
