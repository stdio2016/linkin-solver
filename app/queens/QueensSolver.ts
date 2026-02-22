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
  params: string[];
}

export class QueensSolver {
  private n: number;
  private colors: number[];
  private currentAnswer: Answer[];
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
    var hasProgress = true;
    while (hasProgress) {
      hasProgress = this.trySolveStep();
    }
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
            params: [(row + 1).toString(), (col + 1).toString()]
          });
          return true;
        }
      }
    }

    // 2. If a row/column/color has only one EMPTY cell and no QUEEN, place a QUEEN
    // Rows
    for (let r = 0; r < this.n; r++) {
      let emptyCells = [];
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
          params: [(r + 1).toString()]
        });
        return true;
      }
    }

    // Columns
    for (let c = 0; c < this.n; c++) {
      let emptyCells = [];
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
          params: [(c + 1).toString()]
        });
        return true;
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
          description: "Color area {0} has only one possible cell for a queen",
          params: [ColorNames[color]]
        });
        return true;
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
            description: "All possible cells for color {0} are in row {1}, so other cells in this row cannot have a queen",
            params: [ColorNames[color], (r + 1).toString()]
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
            description: "All possible cells for color {0} are in column {1}, so other cells in this column cannot have a queen",
            params: [ColorNames[color], (c + 1).toString()]
          });
          return true;
        }
      }
    }

    // 4. Region Exclusion: If all possible spots for a row/column are in one color, exclusion for other cells of that color
    // Rows
    for (let r = 0; r < this.n; r++) {
      let emptyCells = [];
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
              description: "All possible cells for row {0} are in color area {1}, so other cells in this color area cannot have a queen",
              params: [(r + 1).toString(), ColorNames[color]]
            });
            return true;
          }
        }
      }
    }

    // Columns
    for (let c = 0; c < this.n; c++) {
      let emptyCells = [];
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
              description: "All possible cells for column {0} are in color area {1}, so other cells in this color area cannot have a queen",
              params: [(c + 1).toString(), ColorNames[color]]
            });
            return true;
          }
        }
      }
    }

    return false;
  }
}
