'use client'

import { useState } from "react";
import Modal from "react-modal";
import TangoBoard, { Moon, Sun } from "./TangoBoard";
import { initBoard, TangoConfig } from "./TangoSolver";
import { decodeLevel, encodeLevel } from "./levelCode";

export default function TangoContent() {
  const [board, setBoard] = useState<TangoConfig>(initBoard());
  const [editing, setEditing] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [showLoadCode, setShowLoadCode] = useState(false);
  const [inputCode, setInputCode] = useState('');

  Modal.setAppElement('#root');

  if (editing) {
    return (
      <main className="flex min-h-svh w-full max-w-[430px] flex-col items-center pt-12 px-8 bg-white gap-2 dark:bg-black">
        <p className="text-xl">Edit board</p>
        <TangoBoard board={board} setBoard={setBoard} />
        <div>
          <div>Click a cell to toggle <Sun className="size-4 inline" /> / <Moon className="size-4 inline" /> / empty.</div>
          <div>Click an edge to toggle = / × / no symbol.</div>
        </div>
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
          <textarea value={encodeLevel(board)} rows={4} cols={22} readOnly className="w-full border-1 border-gray-300 font-mono" />
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
              const loaded = decodeLevel(inputCode);
              if (loaded) {
                setBoard(loaded);
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
    <div>TODO: TangoSolutionView
      <button
        className="rounded-md text-white bg-blue-500 active:bg-blue-600 pt-1 pb-1 pl-3 pr-3"
        type="button"
        onClick={() => setEditing(true)}
      >Edit</button>
    </div>
  );
};
