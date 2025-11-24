// Local minimal instruction type to avoid cross-package compile-time dependency
export type AtomicInstruction = {
  id: string;
  programId: string;
  accounts: Array<{ pubkey: string; writable: boolean; signer?: boolean }>;
  data?: any;
};

export type GraphNode = { id: string; instr: AtomicInstruction };

export type TaskGraph = {
  nodes: GraphNode[];
  edges: Map<string, Set<string>>; // from -> set(to)
};

export function buildGraphFromInstructions(instructions: AtomicInstruction[]): TaskGraph {
  const nodes = instructions.map(i => ({ id: i.id, instr: i }));
  const idIndex = new Map(nodes.map(n => [n.id, n]));
  const edges = new Map<string, Set<string>>();

  // Build edges for writable conflicts: if instr A writes to account X and instr B writes to same X,
  // we create edges both ways to mark they cannot be in same parallel layer and require ordering.
  const writableMap = new Map<string, string[]>();
  for (const n of nodes) {
    for (const a of n.instr.accounts) {
      if (a.writable) {
        const arr = writableMap.get(a.pubkey) || [];
        arr.push(n.id);
        writableMap.set(a.pubkey, arr);
      }
    }
  }

  for (const [pubkey, ids] of writableMap.entries()) {
    if (ids.length <= 1) continue;
    // connect each pair
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (i === j) continue;
        const a = ids[i];
        const b = ids[j];
        const set = edges.get(a) || new Set<string>();
        set.add(b);
        edges.set(a, set);
      }
    }
  }

  // Ensure all nodes have an entry
  for (const n of nodes) {
    if (!edges.has(n.id)) edges.set(n.id, new Set<string>());
  }

  return { nodes, edges };
}

export function detectCycle(graph: TaskGraph): { hasCycle: boolean; cyclePath?: string[] } {
  const temp = new Set<string>();
  const perm = new Set<string>();
  const edges = graph.edges;
  const path: string[] = [];

  function visit(n: string): boolean {
    if (perm.has(n)) return false;
    if (temp.has(n)) {
      path.push(n);
      return true;
    }
    temp.add(n);
    const neighbors = edges.get(n) || new Set();
    for (const m of neighbors) {
      if (visit(m)) {
        path.push(n);
        return true;
      }
    }
    temp.delete(n);
    perm.add(n);
    return false;
  }

  for (const n of graph.nodes) {
    if (!perm.has(n.id)) {
      if (visit(n.id)) return { hasCycle: true, cyclePath: path.reverse() };
    }
  }
  return { hasCycle: false };
}

export function layersFromGraph(graph: TaskGraph): string[][] {
  // Kahn's algorithm variant to produce parallel layers
  const inDegree = new Map<string, number>();
  for (const n of graph.nodes) inDegree.set(n.id, 0);
  for (const [from, tos] of graph.edges.entries()) {
    for (const to of tos) inDegree.set(to, (inDegree.get(to) || 0) + 1);
  }

  const layers: string[][] = [];
  let zero = Array.from(inDegree.entries()).filter(([_, d]) => d === 0).map(([id]) => id);

  while (zero.length > 0) {
    layers.push(zero.slice());
    const next: string[] = [];
    for (const n of zero) {
      const outs = graph.edges.get(n) || new Set();
      for (const m of outs) {
        const d = (inDegree.get(m) || 0) - 1;
        inDegree.set(m, d);
        if (d === 0) next.push(m);
      }
    }
    zero = Array.from(new Set(next));
  }

  // If there are remaining nodes with inDegree > 0, it's a cycle
  const remaining = Array.from(inDegree.entries()).filter(([_, d]) => d > 0).map(([id]) => id);
  if (remaining.length > 0) {
    throw new Error('Cycle detected when building layers: ' + remaining.join(','));
  }

  return layers;
}
