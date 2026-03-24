import { decodeLevel, encodeLevel } from "@/app/queens/levelCode";

test('encode level', () => {
  const colors = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5];
  const code = encodeLevel(colors);
  expect(code).toBe('a=1111122222333334444455555');
});

test('decode level', () => {
  const code = 'a=1111122222333334444455555';
  const colors = decodeLevel(code);
  expect(colors).toEqual([1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5]);
});
