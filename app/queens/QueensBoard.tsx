import { Answer } from "./QueensSolver";

interface QueensBoardProps {
  n: number;
  colors: number[];
  onDraw?: (idx: number) => void;
  answer?: Answer[];
  highlight?: number[];
}

export default function QueensBoard({ n, colors, onDraw, answer, highlight }: QueensBoardProps) {
  const out = [];
  if (highlight) {
    console.log('Sorry to tell you but highlight is not implemented yet' + highlight);
  }
  for (let i = 0; i < n * n; i++) {
    const colorClass = `queens-color` + colors[i];
    let borderLeft = '';
    if (i % n > 0 && colors[i] !== colors[i - 1]) {
      borderLeft = '1px solid black';
    }
    let borderRight = '';
    if (i % n < n - 1 && colors[i] !== colors[i + 1]) {
      borderRight = '1px solid black';
    }
    let borderTop = '';
    if (i >= n && colors[i] !== colors[i - n]) {
      borderTop = '1px solid black';
    }
    let borderBottom = '';
    if (i < (n - 1) * n && colors[i] !== colors[i + n]) {
      borderBottom = '1px solid black';
    }
    out.push(<div
      key={'cell' + i}
      className={"touch-pinch-zoom relative w-full h-full border-t-1 border-r-1 justify-center items-center " + colorClass}
      onPointerMove={e => e.buttons && onDraw && onDraw(i)}
      onPointerOver={e => e.buttons && onDraw && onDraw(i)}
      onPointerDown={e => {
        e.preventDefault();
        e.currentTarget.releasePointerCapture(e.pointerId);
        onDraw?.(i);
      }}
    >
      <div style={{ borderLeft, borderRight, borderTop, borderBottom }}
        onPointerDown={e => e.currentTarget.releasePointerCapture(e.pointerId)}
        className="absolute w-full h-full select-none">
        {answer?.[i] === Answer.QUEEN ? 'Q' : answer?.[i] === Answer.X ? 'X' : ''}
      </div>
    </div>);
  }
  return <div
    style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
    className={"grid w-full justify-center items-center aspect-square border-4"}
  >
    {out}
  </div>;
}
