import { decodeLevel } from "@/app/queens/levelCode";
import { QueensSolver } from "@/app/queens/QueensSolver";
import * as fs from "fs";

const da = fs.readFileSync('test/queens/levels.txt', {
  encoding: 'utf8'
});
const lines = da.split('\n');

const testCases = [];
for (const line of lines) {
  const id = line.split(' ')[1];
  const code = line.split(' ')[2];
  const colors = decodeLevel(code);
  if (colors === null) {
    console.log('invalid code', id);
    continue;
  }
  testCases.push([id, code]);
}

test.each(testCases)('solve problem %s', (id, code) => {
  const colors = decodeLevel(code);
  if (colors === null) {
    throw new Error('code not found');
  }
  const n = Math.sqrt(colors.length);
  const solver = new QueensSolver(n, colors);
  solver.solve();
  const last = solver.steps[solver.steps.length - 1].description;
  expect(last).toBe('Solved 🎉');
});
