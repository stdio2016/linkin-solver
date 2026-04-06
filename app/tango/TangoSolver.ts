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
