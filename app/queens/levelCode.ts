export function encodeLevel(colors: number[]): string {
  let code = 'a=';
  for (let i = 0; i < colors.length; i++) {
    code += colors[i].toString(36);
  }
  return code;
}

export function decodeLevel(code: string): number[] | null {
  const colors: number[] = [];
  if (!code.startsWith('a=')) {
    return null;
  }
  code = code.substring(2);
  if (code.length > 11 * 11 || code.length < 5 * 5) {
    return null;
  }
  const n = Math.sqrt(code.length);
  if (n !== Math.floor(n)) {
    return null;
  }
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    let v = 0;
    if (c >= '0' && c <= '9') {
      v = (c.charCodeAt(0) - '0'.charCodeAt(0));
    } else if (c >= 'a' && c <= 'z') {
      v = (c.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
    } else {
      return null;
    }
    if (v > n || v < 1) {
      return null;
    }
    colors.push(v);
  }
  return colors;
}
