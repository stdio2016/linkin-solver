import { EqualCross, SunMoon, TangoConfig } from "./TangoSolver";

export function Sun(props: { className?: string }) {
  return <svg viewBox="6 6 38 38" {...props}>
    <circle fill="rgba(255, 176, 74, 1)" stroke="#a96a1dff" strokeWidth="2" cx="25" cy="25" r="17" />
  </svg>;
}

export function Moon(props: { className?: string }) {
  return <svg viewBox="6 6 38 38" {...props}>
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

interface TangoBoardProps {
  board: TangoConfig;
  answer?: SunMoon[]; // TODO
  highlight?: number[]; // TODO
  setBoard: (board: TangoConfig) => void;
}

export default function TangoBoard({ board, setBoard }: TangoBoardProps) {
  const sunMoon = board.sunMoon;
  const hEqualCross = board.hEqualCross;
  const vEqualCross = board.vEqualCross;

  const cells = [];
  for (let i = 0; i < 36; i++) {
    const bgColor = sunMoon[i] === 0 ? "" : "bg-gray-200";
    cells.push(
      <div key={i} className={`relative ${bgColor}`}>
        <div className="absolute size-1/2 top-1/4 left-1/4">
          {sunMoon[i] === SunMoon.SUN ? <Sun /> : sunMoon[i] === SunMoon.MOON ? <Moon /> : null}
        </div>
        <div className={`absolute size-full border-[0.5px] border-gray-300`}
          onClick={() => {
            const arr = sunMoon.slice();
            arr[i] = (arr[i] + 1) % 3;
            setBoard({ ...board, sunMoon: arr });
          }} />
        {i % 6 !== 0 && <>
          <div className="absolute left-[-20%] top-[30%] size-2/5">
            {hEqualCross[i] === EqualCross.EQUAL ? <Equal /> : hEqualCross[i] === EqualCross.CROSS ? <Cross /> : ""}
          </div>
          <div className="absolute left-[-20%] top-[10%] w-2/5 h-4/5"
            onClick={() => {
              const arr = hEqualCross.slice();
              arr[i] = (arr[i] + 1) % 3;
              setBoard({ ...board, hEqualCross: arr });
            }} />
        </>
        }
        {i >= 6 && <>
          <div className="absolute left-[30%] top-[-20%] size-2/5">
            {vEqualCross[i] === EqualCross.EQUAL ? <Equal /> : vEqualCross[i] === EqualCross.CROSS ? <Cross /> : ""}
          </div>
          <div className="absolute left-[10%] top-[-20%] w-4/5 h-2/5"
            onClick={() => {
              const arr = vEqualCross.slice();
              arr[i] = (arr[i] + 1) % 3;
              setBoard({ ...board, vEqualCross: arr });
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
