export interface BipartiteMatchingResult {
  /**
   * match from i to matchTo[i]
   * -1 if i is not matched
   */
  matchTo: number[];
  /**
   * match from matchFrom[i] to i
   * -1 if i is not matched
   */
  matchFrom: number[];

  /**
   * Number of matched edges
   */
  matchCount: number;
}

/**
 * 
 * @param graph graph[i] is the vertices that i can connect to
 * @returns 
 */
export function bipartiteMatching(graph: number[][]): BipartiteMatchingResult {
  const n = graph.length;
  const matchTo: number[] = new Array(n).fill(-1);
  const matchFrom: number[] = new Array(n).fill(-1);
  const visited: boolean[] = new Array(n).fill(false);

  function dfs(u: number) {
    for (const v of graph[u]) {
      if (visited[v]) {
        continue;
      }
      visited[v] = true;
      if (matchFrom[v] === -1 || dfs(matchFrom[v])) {
        matchFrom[v] = u;
        matchTo[u] = v;
        return true;
      }
    }
    return false;
  }

  for (let i = 0; i < n; i++) {
    if (matchTo[i] !== -1) {
      // already matched
      continue;
    }
    visited.fill(false);
    dfs(i);
  }

  return {
    matchTo: matchTo,
    matchFrom: matchFrom,
    matchCount: matchTo.filter(x => x !== -1).length
  };
}

export function allPairReachable(graph: number[][], matchFrom: number[]): number[][] {
  const n = graph.length;
  const reachable: number[][] = [];
  const visited: boolean[] = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    visited.fill(false);
    visited[i] = true;
    const queue = [i];
    let qp = 0;
    while (qp < queue.length) {
      const x = queue[qp];
      qp += 1;
      for (const y of graph[x]) {
        const x2 = matchFrom[y];
        if (x2 >= 0 && !visited[x2]) {
          visited[x2] = true;
          queue.push(x2);
        }
      }
    }
    reachable.push(queue);
  }
  return reachable;
}
