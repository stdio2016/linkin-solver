'use client'

import { useState } from "react";
import Modal from "react-modal";
import TangoBoard, { Moon, Sun } from "./TangoBoard";
import { initBoard, TangoConfig } from "./TangoSolver";

export default function TangoContent() {
  const [board, setBoard] = useState<TangoConfig>(initBoard());
  const [editing, setEditing] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [showLoadCode, setShowLoadCode] = useState(false);

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
            onClick={() => setShowLoadCode(true)}
          >Load code</button>
        </div>
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