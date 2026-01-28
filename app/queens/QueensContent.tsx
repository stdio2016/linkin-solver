'use client'

import { useState } from "react"
import QueensBoard from "./QueensBoard";
import { QueensSolutionView } from "./QueensSolutionView";

export default function QueensContent() {
  const [n, setN] = useState(7);
  const [colors, setColors] = useState(Array(n*n).fill(1));
  const [pickColor, setPickColor] = useState(1);
  const [editing, setEditing] = useState(true);

  const colorElts = [];
  for (let i = 1; i <= n; i++) {
    var colorClass = ' queens-color' + i;
    var pickBorder = ' border-1';
    if (pickColor === i) {
      pickBorder = ' border-3 border-red-500';
    }
    colorElts.push(<li
      key={i}
      className={'h-[2rem] w-[2rem] ' + pickBorder + colorClass}
      onClick={() => setPickColor(i)}
    />);
  }

  function drawColor(idx: number) {
    var newC = colors.slice();
    newC[idx] = pickColor;
    setColors(newC);
  }

  function decreaseSize() {
    if (n <= 5) return;
    var newC = [];
    for (var i = 0; i < n-1; i++) {
      for (var j = 0; j < n-1; j++) {
        newC.push(Math.min(colors[i*n+j], n-1));
      }
    }
    setN(n-1);
    setColors(newC);
    if (pickColor >= n) {
      setPickColor(n-1);
    }
  }

  function increaseSize() {
    if (n >= 11) return;
    var newC = Array((n+1)**2).fill(1);
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        newC[i*(n+1)+j] = colors[i*n+j];
      }
    }
    setN(n+1);
    setColors(newC);
  }

  if (editing) {
    return (
      <main className="flex min-h-svh w-full max-w-[430px] flex-col items-center pt-12 px-8 bg-white gap-2 dark:bg-black">
        <p className="text-xl">Edit board</p>
        <QueensBoard
          n={n}
          colors={colors}
          onDraw={drawColor}/>
        <div className="flex gap-6">
          Size:
          <button className="rounded-md bg-gray-200 active:bg-gray-300 p-1" onClick={decreaseSize}>➖</button>
          {n}x{n}
          <button className="rounded-md bg-gray-200 active:bg-gray-300 p-1" onClick={increaseSize}>➕</button>
        </div>
        <div>
          Select color:
          <ul className="flex flex-row flex-wrap gap-3">
            {colorElts}
          </ul>
        </div>
        <button
          className="rounded-md text-white bg-blue-500 active:bg-blue-600 pt-1 pb-1 pl-3 pr-3"
          type="button"
          onClick={() => setEditing(false)}
        >Solve</button>
      </main>
    );
  }
  return (
    <QueensSolutionView
      n={n}
      colors={colors}
      onEdit={() => setEditing(true)}
    />
  );
};