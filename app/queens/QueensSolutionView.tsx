import { useMemo, useState } from "react";
import QueensBoard from "./QueensBoard";

interface QueensSolutionViewProps {
  n: number;
  colors: number[];
  onEdit?: () => void;
}

export function QueensSolutionView({n, colors, onEdit}: QueensSolutionViewProps) {
  const solution = useMemo(() => {
    return [{
      answer: Array(n*n).fill(0),
      highlight: [],
      description: 'This will show logic steps',
    }, {
      answer: Array(n*n).fill(0),
      highlight: [],
      description: 'step 1',
    }, {
      answer: Array(n*n).fill(0),
      highlight: [],
      description: 'step 2',
    }, {
      answer: Array(n*n).fill(0),
      highlight: [],
      description: 'step 3',
    }];
  }, [n, colors]);
  const [step, setStep] = useState(0);

  return (
    <main className="flex min-h-svh w-full max-w-[430px] flex-col items-center pt-12 px-8 bg-white gap-2 dark:bg-black">
      <p className="text-xl">Solve</p>
      <QueensBoard
        n={n}
        colors={colors}
        onDraw={() => {}}/>
      <div className="flex w-full justify-stretch gap-5">
        <button
          className="border-1 border-black-400 active:bg-gray-200 flex-1 p-1 rounded-lg"
          onClick={() => setStep(Math.max(0, step-1))}>◀️ Prev step</button>
        <button
          className="text-white bg-blue-500 active:bg-blue-600 flex-1 p-1 rounded-lg"
          onClick={() => setStep(Math.min(step+1, solution.length-1))}>Next step ▶️</button>
      </div>
      <div className="w-full bg-gray-200 h-[6rem] p-1">
        {solution[step].description}
      </div>
      <button
        className="text-white bg-red-600 active:bg-red-700 p-1 pl-2 pr-2 rounded-md"
        onClick={onEdit}>✏️ Edit</button>
    </main>
  );
}
