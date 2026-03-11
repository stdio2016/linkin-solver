import { allPairReachable, bipartiteMatching } from "@/utils/graph";
import { ColorNames } from "./colorNames";

export enum Answer {
  EMPTY = 0,
  X = 1, // mark impossible places
  QUEEN = 2, // place queen on each row, each column
}

export interface DeductionStep {
  /**
   * Answer as a flattened 2d array
   */
  answer: Answer[];

  /**
   * Cell numbers that need to add red border as highlight
   */
  highlight: number[];

  /**
   * Description for this step.
   * To make localization more convenient, description is a format string like:
   * "Color {1} has only 1 cell, so place a queen in this cell"
   */
  description: string;

  /**
   * For string replacement of description format string
   */
  params: Param[];
}

export type Param = number | number[] | string;

export class QueensSolver {
  private n: number;
  private colors: number[];
  private currentAnswer: Answer[];
  private noSolution: boolean = false;
  public steps: DeductionStep[] = [];

  /**
   * Create a Solver for a board
   * @param n The size of the board
   * @param colors The colors of the board as a flattened 2d array
   * note: color is 1 to n, 0 is reserved and currently invalid
   */
  public constructor(n: number, colors: number[]) {
    this.n = n;
    this.colors = colors;
    this.currentAnswer = new Array(n * n).fill(Answer.EMPTY);
  }

  /**
   * Your target is to place exactly one queen on each row, each column, and each color area of nxn array
   * Output deduction steps as you place queens and mark crosses.
   * Two queens must not touch each other, not even diagonally.
   */
  public solve() {
    let hasProgress = true;
    while (hasProgress) {
      hasProgress = this.trySolveStep();
    }
    if (this.currentAnswer.filter(x => x === Answer.QUEEN).length === this.n) {
      this.pushLastStep("Solved 🎉", []);
    } else if (this.noSolution) {
      // The reason that there is no solution should have been pushed to steps already
    } else {
      this.pushLastStep("I am not smart enough to solve this puzzle 😭", []);
    }
  }

  private pushLastStep(description: string, params: Param[]) {
    this.steps.push({
      answer: [...this.currentAnswer],
      highlight: [],
      description: description,
      params: params
    });
  }

  public trySolveStep(): boolean {
    // 1. If a queen exists, mark its row, column, neighbors, and color cells as X
    for (let i = 0; i < this.n * this.n; i++) {
      if (this.currentAnswer[i] === Answer.QUEEN) {
        const row = Math.floor(i / this.n);
        const col = i % this.n;
        const color = this.colors[i];

        const cellsToX: number[] = [];

        // Row and Column
        for (let j = 0; j < this.n; j++) {
          const rCell = row * this.n + j;
          if (this.currentAnswer[rCell] === Answer.EMPTY) cellsToX.push(rCell);
          const cCell = j * this.n + col;
          if (this.currentAnswer[cCell] === Answer.EMPTY) cellsToX.push(cCell);
        }

        // Color
        for (let j = 0; j < this.n * this.n; j++) {
          if (this.colors[j] === color && this.currentAnswer[j] === Answer.EMPTY) {
            cellsToX.push(j);
          }
        }

        // Neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < this.n && nc >= 0 && nc < this.n) {
              const nIdx = nr * this.n + nc;
              if (this.currentAnswer[nIdx] === Answer.EMPTY) {
                cellsToX.push(nIdx);
              }
            }
          }
        }

        if (cellsToX.length > 0) {
          const uniqueCells = Array.from(new Set(cellsToX));
          uniqueCells.forEach(idx => this.currentAnswer[idx] = Answer.X);
          this.steps.push({
            answer: [...this.currentAnswer],
            highlight: [i],
            description: "Queen at row {0} column {1} excludes other possible cells",
            params: [row + 1, col + 1]
          });
          return true;
        }
      }
    }

    // 2. If a row/column/color has only one EMPTY cell and no QUEEN, place a QUEEN
    // Rows
    for (let r = 0; r < this.n; r++) {
      const emptyCells = [];
      let hasQueen = false;
      for (let c = 0; c < this.n; c++) {
        const idx = r * this.n + c;
        if (this.currentAnswer[idx] === Answer.QUEEN) hasQueen = true;
        if (this.currentAnswer[idx] === Answer.EMPTY) emptyCells.push(idx);
      }
      if (!hasQueen && emptyCells.length === 1) {
        this.currentAnswer[emptyCells[0]] = Answer.QUEEN;
        this.steps.push({
          answer: [...this.currentAnswer],
          highlight: [emptyCells[0]],
          description: "Row {0} has only one possible cell for a queen",
          params: [r + 1]
        });
        return true;
      }
      if (!hasQueen && emptyCells.length === 0) {
        this.noSolution = true;
        this.steps.push({
          answer: [...this.currentAnswer],
          highlight: [],
          description: "Row {0} has no possible cell for a queen. No solution 🚫",
          params: [r + 1]
        });
        return false;
      }
    }

    // Columns
    for (let c = 0; c < this.n; c++) {
      const emptyCells = [];
      let hasQueen = false;
      for (let r = 0; r < this.n; r++) {
        const idx = r * this.n + c;
        if (this.currentAnswer[idx] === Answer.QUEEN) hasQueen = true;
        if (this.currentAnswer[idx] === Answer.EMPTY) emptyCells.push(idx);
      }
      if (!hasQueen && emptyCells.length === 1) {
        this.currentAnswer[emptyCells[0]] = Answer.QUEEN;
        this.steps.push({
          answer: [...this.currentAnswer],
          highlight: [emptyCells[0]],
          description: "Column {0} has only one possible cell for a queen",
          params: [c + 1]
        });
        return true;
      }
      if (!hasQueen && emptyCells.length === 0) {
        this.noSolution = true;
        this.steps.push({
          answer: [...this.currentAnswer],
          highlight: [],
          description: "Column {0} has no possible cell for a queen. No solution 🚫",
          params: [c + 1]
        });
        return false;
      }
    }

    // Colors
    const colorMap = new Map<number, { empty: number[], hasQueen: boolean }>();
    for (let i = 0; i < this.n * this.n; i++) {
      const color = this.colors[i];
      if (!colorMap.has(color)) colorMap.set(color, { empty: [], hasQueen: false });
      const entry = colorMap.get(color)!;
      if (this.currentAnswer[i] === Answer.QUEEN) entry.hasQueen = true;
      if (this.currentAnswer[i] === Answer.EMPTY) entry.empty.push(i);
    }
    for (const [color, data] of colorMap.entries()) {
      if (!data.hasQueen && data.empty.length === 1) {
        this.currentAnswer[data.empty[0]] = Answer.QUEEN;
        this.steps.push({
          answer: [...this.currentAnswer],
          highlight: [data.empty[0]],
          description: "Color area {c0} has only one possible cell for a queen",
          params: [color]
        });
        return true;
      }
      if (!data.hasQueen && data.empty.length === 0) {
        this.noSolution = true;
        this.steps.push({
          answer: [...this.currentAnswer],
          highlight: [],
          description: "Color area {c0} has no possible cell for a queen. No solution 🚫",
          params: [color]
        });
        return false;
      }
    }

    // 3. Line Exclusion: If a color's empty cells are all in one row/column, exclusion for others
    for (const [color, data] of colorMap.entries()) {
      if (data.hasQueen || data.empty.length < 2) continue;

      const rows = new Set(data.empty.map(idx => Math.floor(idx / this.n)));
      const cols = new Set(data.empty.map(idx => idx % this.n));

      if (rows.size === 1) {
        const r = Array.from(rows)[0];
        const cellsToX = [];
        for (let c = 0; c < this.n; c++) {
          const idx = r * this.n + c;
          if (this.currentAnswer[idx] === Answer.EMPTY && this.colors[idx] !== color) {
            cellsToX.push(idx);
          }
        }
        if (cellsToX.length > 0) {
          cellsToX.forEach(idx => this.currentAnswer[idx] = Answer.X);
          this.steps.push({
            answer: [...this.currentAnswer],
            highlight: data.empty,
            description: "All possible cells for color {c0} are in row {1}, so other cells in this row cannot have a queen",
            params: [color, r + 1]
          });
          return true;
        }
      }

      if (cols.size === 1) {
        const c = Array.from(cols)[0];
        const cellsToX = [];
        for (let r = 0; r < this.n; r++) {
          const idx = r * this.n + c;
          if (this.currentAnswer[idx] === Answer.EMPTY && this.colors[idx] !== color) {
            cellsToX.push(idx);
          }
        }
        if (cellsToX.length > 0) {
          cellsToX.forEach(idx => this.currentAnswer[idx] = Answer.X);
          this.steps.push({
            answer: [...this.currentAnswer],
            highlight: data.empty,
            description: "All possible cells for color {c0} are in column {1}, so other cells in this column cannot have a queen",
            params: [color, c + 1]
          });
          return true;
        }
      }
    }

    // 4. Region Exclusion: If all possible spots for a row/column are in one color, exclusion for other cells of that color
    // Rows
    for (let r = 0; r < this.n; r++) {
      const emptyCells = [];
      let hasQueen = false;
      for (let c = 0; c < this.n; c++) {
        const idx = r * this.n + c;
        if (this.currentAnswer[idx] === Answer.QUEEN) hasQueen = true;
        if (this.currentAnswer[idx] === Answer.EMPTY) emptyCells.push(idx);
      }
      if (!hasQueen && emptyCells.length > 1) {
        const colors = new Set(emptyCells.map(idx => this.colors[idx]));
        if (colors.size === 1) {
          const color = Array.from(colors)[0];
          const cellsToX = [];
          for (let i = 0; i < this.n * this.n; i++) {
            if (this.colors[i] === color && this.currentAnswer[i] === Answer.EMPTY && Math.floor(i / this.n) !== r) {
              cellsToX.push(i);
            }
          }
          if (cellsToX.length > 0) {
            cellsToX.forEach(idx => this.currentAnswer[idx] = Answer.X);
            this.steps.push({
              answer: [...this.currentAnswer],
              highlight: emptyCells,
              description: "All possible cells for row {0} are in color area {c1}, so other cells in this color area cannot have a queen",
              params: [r + 1, color]
            });
            return true;
          }
        }
      }
    }

    // Columns
    for (let c = 0; c < this.n; c++) {
      const emptyCells = [];
      let hasQueen = false;
      for (let r = 0; r < this.n; r++) {
        const idx = r * this.n + c;
        if (this.currentAnswer[idx] === Answer.QUEEN) hasQueen = true;
        if (this.currentAnswer[idx] === Answer.EMPTY) emptyCells.push(idx);
      }
      if (!hasQueen && emptyCells.length > 1) {
        const colors = new Set(emptyCells.map(idx => this.colors[idx]));
        if (colors.size === 1) {
          const color = Array.from(colors)[0];
          const cellsToX = [];
          for (let i = 0; i < this.n * this.n; i++) {
            if (this.colors[i] === color && this.currentAnswer[i] === Answer.EMPTY && (i % this.n) !== c) {
              cellsToX.push(i);
            }
          }
          if (cellsToX.length > 0) {
            cellsToX.forEach(idx => this.currentAnswer[idx] = Answer.X);
            this.steps.push({
              answer: [...this.currentAnswer],
              highlight: emptyCells,
              description: "All possible cells for column {0} are in color area {c1}, so other cells in this color area cannot have a queen",
              params: [c + 1, color]
            });
            return true;
          }
        }
      }
    }

    const step5 = this.trySolveExcludeNeighbors();
    if (step5 !== null) return step5;

    const step6 = this.trySolveNColors(false);
    if (step6 !== null) return step6;

    const step7 = this.trySolveNColors(true);
    if (step7 !== null) return step7;

    return false;
  }

  private trySolveExcludeNeighbors(): boolean | null {
    const colorHasQueen = Array(this.n + 1).fill(false);
    const colorMapRow: number[][] = [];
    const colorMapCol: number[][] = [];
    for (let i = 0; i <= this.n; i++) {
      colorMapRow.push([]);
      colorMapCol.push([]);
    }
    for (let i = 0; i < this.n * this.n; i++) {
      const color = this.colors[i];
      if (this.currentAnswer[i] === Answer.QUEEN) {
        colorHasQueen[color] = true;
      } else if (this.currentAnswer[i] === Answer.EMPTY) {
        colorMapRow[color].push(Math.floor(i / this.n));
        colorMapCol[color].push(i % this.n);
      }
    }
    for (let i = 1; i <= this.n; i++) {
      if (colorHasQueen[i]) {
        continue;
      }
      const cellsRow = colorMapRow[i];
      const cellsCol = colorMapCol[i];
      if (cellsRow.length === 0 || cellsCol.length === 0) {
        this.noSolution = true;
        this.pushLastStep("Color area {c0} has no possible cell for a queen. No solution 🚫", [i]);
        return false;
      }
      let conflictCells = new Set<number>();
      // intersection of all conflict cells
      for (let j = 0; j < cellsRow.length; j++) {
        const currentConflictCells = new Set<number>();
        // same column
        for (let r = 0; r < this.n; r++) {
          const idx = r * this.n + cellsCol[j];
          if (this.colors[idx] !== i && this.currentAnswer[idx] === Answer.EMPTY) {
            currentConflictCells.add(idx);
          }
        }
        // same row
        for (let c = 0; c < this.n; c++) {
          const idx = cellsRow[j] * this.n + c;
          if (this.colors[idx] !== i && this.currentAnswer[idx] === Answer.EMPTY) {
            currentConflictCells.add(idx);
          }
        }
        // neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nr = cellsRow[j] + dr;
            const nc = cellsCol[j] + dc;
            if (nr >= 0 && nr < this.n && nc >= 0 && nc < this.n) {
              const nIdx = nr * this.n + nc;
              if (this.colors[nIdx] !== i && this.currentAnswer[nIdx] === Answer.EMPTY) {
                currentConflictCells.add(nIdx);
              }
            }
          }
        }
        if (j === 0) {
          conflictCells = currentConflictCells;
        } else {
          conflictCells = conflictCells.intersection(currentConflictCells);
        }
      }
      // check if we can actually mark X because maybe we have marked before
      const cellsToX = Array.from(conflictCells).filter(idx => this.currentAnswer[idx] === Answer.EMPTY);
      if (cellsToX.length > 0) {
        cellsToX.forEach(idx => this.currentAnswer[idx] = Answer.X);
        this.steps.push({
          answer: [...this.currentAnswer],
          highlight: cellsToX,
          description: "Highlighted cells are in conflict with every cell in color {c0}, so they are marked as X",
          params: [i]
        });
        return true;
      }
    }
    return null;
  }

  private trySolveNColors(isColumn: boolean): boolean | null {
    const colorRowMap: number[][] = [];
    let queens = 0;
    for (let i = 0; i < this.n; i++) {
      colorRowMap.push([]);
    }
    for (let r = 0; r < this.n; r++) {
      for (let c = 0; c < this.n; c++) {
        let i = r * this.n + c;
        if (isColumn) i = c * this.n + r;
        const color = this.colors[i];
        if (this.currentAnswer[i] === Answer.QUEEN) {
          queens += 1;
        }
        if (color >= 1 && color <= this.n && this.currentAnswer[i] === Answer.EMPTY) {
          const bucket = colorRowMap[color - 1];
          // note: out of bound index in javascript will return undefined, which is not equal to r
          // in other languages, need to check length first
          if (bucket[bucket.length - 1] !== r) {
            bucket.push(r);
          }
        }
      }
    }

    const match = bipartiteMatching(colorRowMap);
    if (match.matchCount < this.n - queens) {
      this.noSolution = true;
      // TODO: add more explanation
      this.pushLastStep("No solution 🚫", []);
      return false;
    }
    const reachable = allPairReachable(colorRowMap, match.matchFrom);
    reachable.sort((a, b) => a.length - b.length);
    for (let cover of reachable) {
      if (cover.length < 2 || cover.length >= this.n - queens) {
        continue;
      }
      const rows = cover.map(x => match.matchTo[x]);
      rows.sort((a, b) => a - b);
      const cellsToX = [];
      for (let r of rows) {
        for (let c = 0; c < this.n; c++) {
          let idx = r * this.n + c;
          if (isColumn) idx = c * this.n + r;
          if (this.currentAnswer[idx] === Answer.EMPTY && !cover.includes(this.colors[idx] - 1)) {
            cellsToX.push(idx);
          }
        }
      }
      const rsOrCs = isColumn ? 'columns' : 'rows';
      if (cellsToX.length > 0) {
        cellsToX.forEach(idx => this.currentAnswer[idx] = Answer.X);
        this.steps.push({
          answer: [...this.currentAnswer],
          highlight: cellsToX,
          description: `Colors {c0} only exist in ${rsOrCs} {1}, so other cells in these ${rsOrCs} cannot have a queen`,
          params: [cover.map(x => x + 1), rows.map(x => x + 1)]
        });
        return true;
      }
    }

    return null;
  }
}
