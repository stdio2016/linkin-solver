export enum SunMoon {
  EMPTY = 0,
  SUN = 1,
  MOON = 2,
}

export enum EqualCross {
  EMPTY = 0,
  EQUAL = 1,
  CROSS = 2,
}

export interface TangoConfig {
  sunMoon: SunMoon[];
  hEqualCross: EqualCross[];
  vEqualCross: EqualCross[];
}

export function initBoard() {
  return {
    sunMoon: Array(36).fill(SunMoon.EMPTY),
    hEqualCross: Array(36).fill(EqualCross.EMPTY),
    vEqualCross: Array(36).fill(EqualCross.EMPTY),
  };
}

export interface DeductionStep {
  /**
   * Answer as a flattened 2d array
   */
  answer: SunMoon[];

  /**
   * Cell numbers that need to add red border as highlight
   */
  highlight: number[];

  /**
   * Description for this step.
   * To make localization more convenient, description is a format string like:
   * "Row {0} has 2 consecutive {s1s}, so highlighted cell must place a {s2}"
   */
  description: string;

  /**
   * For string replacement of description format string
   */
  params: Param[];
}

export type Param = number | number[] | string;

export class TangoSolver {
  private sunMoon: SunMoon[];
  private hEqualCross: EqualCross[];
  private vEqualCross: EqualCross[];
  private currentAnswer: SunMoon[];
  private noSolution: boolean = false;
  public steps: DeductionStep[] = [];

  public constructor(board: TangoConfig) {
    this.sunMoon = board.sunMoon.slice();
    this.hEqualCross = board.hEqualCross.slice();
    this.vEqualCross = board.vEqualCross.slice();
    this.currentAnswer = this.sunMoon.slice();
  }

  public solve() {
    let hasProgress = true;
    while (hasProgress) {
      hasProgress = this.trySolveStep();
    }
    if (this.currentAnswer.filter(x => x === SunMoon.EMPTY).length === 0) {
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

  private trySolveStep(): boolean {
    // TODO
    return false;
  }
}
