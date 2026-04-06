import { EqualCross, SunMoon, TangoConfig } from "./TangoSolver";

export function encodeLevel(board: TangoConfig): string {
  let code = 'b=';
  for (let i = 0; i < 36; i++) {
    code += board.sunMoon[i].toString();
  }
  for (let i = 0; i < 36; i++) {
    if (i % 6 !== 0) {
      code += board.hEqualCross[i].toString();
    }
  }
  for (let i = 0; i < 36; i++) {
    if (i >= 6) {
      code += board.vEqualCross[i].toString();
    }
  }
  return code;
}

export function decodeLevel(code: string): TangoConfig | null {
  if (!code.startsWith('b=')) {
    return null;
  }
  const data = code.substring(2);
  if (data.length !== 96) {
    return null;
  }
  for (const c of data) {
    if (c !== '0' && c !== '1' && c !== '2') {
      return null;
    }
  }

  const sunMoon: SunMoon[] = [];
  for (let i = 0; i < 36; i++) {
    sunMoon.push(parseInt(data[i]) as SunMoon);
  }

  const hEqualCross: EqualCross[] = Array(36).fill(EqualCross.EMPTY);
  let pos = 36;
  for (let i = 0; i < 36; i++) {
    if (i % 6 !== 0) {
      hEqualCross[i] = parseInt(data[pos]) as EqualCross;
      pos++;
    }
  }

  const vEqualCross: EqualCross[] = Array(36).fill(EqualCross.EMPTY);
  for (let i = 0; i < 36; i++) {
    if (i >= 6) {
      vEqualCross[i] = parseInt(data[pos]) as EqualCross;
      pos++;
    }
  }

  return { sunMoon, hEqualCross, vEqualCross };
}
