import { useMemo, useState } from "react";
import QueensBoard from "./QueensBoard";
import { QueensSolver, Param } from "./QueensSolver";
import { ColorNames } from "./colorNames";

interface QueensSolutionViewProps {
  n: number;
  colors: number[];
  onEdit?: () => void;
}

function formatDescription(description: string, params: Param[]): string {
  description = description.replace(/\{(c?)(\d)\}/g, function (match, typeCode, p1) {
    const idx = parseInt(p1);
    const val = params[idx];
    if (typeCode === 'c') {
      if (Array.isArray(val)) {
        return val.map(v => ColorNames[v]).join(', ');
      }
      if (typeof val === 'string') {
        return val;
      }
      return ColorNames[val];
    }
    const strVal = Array.isArray(val) ? val.join(', ') : val.toString();
    return strVal;
  });
  return description;
}

export function QueensSolutionView({ n, colors, onEdit }: QueensSolutionViewProps) {
  const solution = useMemo(() => {
    const solver = new QueensSolver(n, colors);
    solver.solve();
    if (solver.steps) {
      return solver.steps;
    }
    return [{
      answer: [],
      highlight: [],
      description: "I am not smart enough to solve this puzzle",
      params: []
    }];
  }, [n, colors]);
  const [step, setStep] = useState(0);

  if (step >= solution.length) {
    // just to be safe
    setStep(solution.length - 1);
  }

  return (
    <main className="flex min-h-svh w-full max-w-[430px] flex-col items-center pt-12 px-8 bg-white gap-2 dark:bg-black">
      <p className="text-xl">Solve</p>
      <QueensBoard
        n={n}
        colors={colors}
        answer={solution[step].answer}
        highlight={solution[step].highlight}
        onDraw={() => { }} />
      <div className="flex w-full justify-stretch gap-5 items-center">
        <button
          disabled={step === 0}
          className="border-1 border-black-400 active:bg-gray-200 flex-1 p-1 rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
          onClick={() => setStep(Math.max(0, step - 1))}>◀️ Prev</button>
        <span className="flex-1 text-center">{step + 1}/{solution.length}</span>
        <button
          disabled={step === solution.length - 1}
          className="text-white bg-blue-500 active:bg-blue-600 flex-1 p-1 rounded-lg disabled:bg-gray-200 disabled:text-gray-400"
          onClick={() => setStep(Math.min(step + 1, solution.length - 1))}>Next ▶️</button>
      </div>
      <div className="w-full bg-gray-200 h-[6rem] p-1">
        {formatDescription(solution[step].description, solution[step].params)}
      </div>
      <button
        className="text-white bg-red-600 active:bg-red-700 p-1 pl-2 pr-2 rounded-md"
        onClick={onEdit}>✏️ Edit</button>
    </main>
  );
}
