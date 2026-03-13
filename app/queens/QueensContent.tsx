'use client'

import { useState } from "react"
import QueensBoard from "./QueensBoard";
import { QueensSolutionView } from "./QueensSolutionView";
import Modal from "react-modal";
import { decodeLevel, encodeLevel } from "./levelCode";

export default function QueensContent() {
  const [n, setN] = useState(7);
  const [colors, setColors] = useState(Array(n * n).fill(1));
  const [pickColor, setPickColor] = useState(2);
  const [editing, setEditing] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [showLoadCode, setShowLoadCode] = useState(false);
  const [inputCode, setInputCode] = useState('');

  Modal.setAppElement('#root');

  const colorElts = [];
  for (let i = 1; i <= n; i++) {
    const colorClass = ' queens-color' + i;
    let pickBorder = ' border-1';
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
    const newC = colors.slice();
    newC[idx] = pickColor;
    setColors(newC);
  }

  function decreaseSize() {
    if (n <= 5) return;
    const newC = [];
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1; j++) {
        newC.push(Math.min(colors[i * n + j], n - 1));
      }
    }
    setN(n - 1);
    setColors(newC);
    if (pickColor >= n) {
      setPickColor(n - 1);
    }
  }

  function increaseSize() {
    if (n >= 11) return;
    const newC = Array((n + 1) ** 2).fill(1);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newC[i * (n + 1) + j] = colors[i * n + j];
      }
    }
    setN(n + 1);
    setColors(newC);
  }

  if (editing) {
    return (
      <main className="flex min-h-svh w-full max-w-[430px] flex-col items-center pt-12 px-8 bg-white gap-2 dark:bg-black">
        <p className="text-xl">Edit board</p>
        <QueensBoard
          n={n}
          colors={colors}
          onDraw={drawColor} />
        <div className="flex gap-6">
          Size:
          <button className="rounded-md bg-gray-200 active:bg-gray-300 p-1" onClick={decreaseSize}>➖</button>
          {n}x{n}
          <button className="rounded-md bg-gray-200 active:bg-gray-300 p-1" onClick={increaseSize}>➕</button>
        </div>
        <div>Select a color to draw:</div>
        <ul className="flex flex-row flex-wrap gap-3 place-content-center">
          {colorElts}
        </ul>
        <button
          className="rounded-md text-white bg-blue-500 active:bg-blue-600 pt-1 pb-1 pl-3 pr-3"
          type="button"
          onClick={() => setEditing(false)}
        >Solve</button>
        <div className="flex gap-2">
          <button
            className="rounded-md bg-gray-200 active:bg-gray-300 pt-1 pb-1 pl-3 pr-3"
            type="button"
            onClick={() => setShowCode(true)}
          >Show code</button>
          <button
            className="rounded-md bg-gray-200 active:bg-gray-300 pt-1 pb-1 pl-3 pr-3"
            type="button"
            onClick={() => {
              setInputCode('');
              setShowLoadCode(true);
            }}
          >Load code</button>
        </div>
        <Modal
          isOpen={showCode}
          onRequestClose={() => setShowCode(false)}
          overlayClassName="fixed inset-0 bg-black/50 flex flex-row justify-center"
          className="flex flex-col gap-2 top-[20%] absolute bg-white dark:bg-black p-6 rounded-md"
        >
          <div>Level code:</div>
          <textarea value={encodeLevel(colors)} rows={4} readOnly className="w-full border-1 border-gray-300 font-mono" />
          <button
            className="rounded-md bg-gray-200 active:bg-gray-300 p-1"
            type="button"
            onClick={() => setShowCode(false)}
          >Close</button>
        </Modal>
        <Modal
          isOpen={showLoadCode}
          onRequestClose={() => setShowLoadCode(false)}
          overlayClassName="fixed inset-0 bg-black/50 flex flex-row justify-center"
          className="flex flex-col gap-2 top-[20%] absolute bg-white dark:bg-black p-6 rounded-md"
        >
          <div>Enter level code:</div>
          <textarea value={inputCode} onChange={(e) => setInputCode(e.target.value)} rows={4} className="w-full border-1 border-gray-300 font-mono" />
          <button
            className="rounded-md bg-gray-200 active:bg-gray-300 p-1"
            type="button"
            onClick={() => {
              const colors = decodeLevel(inputCode);
              if (colors) {
                setColors(colors);
                setN(Math.sqrt(colors.length));
                setShowLoadCode(false);
              } else {
                alert('Invalid code');
              }
            }}
          >Load</button>
          <button
            className="rounded-md bg-gray-200 active:bg-gray-300 p-1"
            type="button"
            onClick={() => setShowLoadCode(false)}
          >Close</button>
        </Modal>
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