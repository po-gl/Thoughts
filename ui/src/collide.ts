import { quadtree } from 'd3-quadtree';
import { SimNode } from './useLayoutElements';

export function collide() {
  let nodes: SimNode[] = [];
  const force = (alpha: number) => {
    const tree = quadtree(
      nodes,
      (d) => d.x ?? 0,
      (d) => d.y ?? 0
    );

    for (const node of nodes) {
      node.width = node.width ?? 0;
      node.x = node.x ?? 0;
      node.y = node.y ?? 0;

      const r = node.width / 2;
      const nx1 = node.x - r;
      const nx2 = node.x + r;
      const ny1 = node.y - r;
      const ny2 = node.y + r;

      tree.visit((quad, x1, y1, x2, y2) => {
        if (!quad.length) {
          if ('data' in quad && quad.data !== node) {
            node.width = node.width ?? 0;
            node.x = node.x ?? 0;
            node.y = node.y ?? 0;
            quad.data.width = quad.data.width ?? 0;
            quad.data.x = quad.data.x ?? 0;
            quad.data.y = quad.data.y ?? 0;

            const r = node.width / 2 + quad.data.width / 2;
            let x = node.x - quad.data.x;
            let y = node.y - quad.data.y;
            let l = Math.hypot(x, y);

            if (l < r) {
              l = ((l - r) / l) * alpha;
              node.x -= x *= l;
              node.y -= y *= l;
              quad.data.x += x;
              quad.data.y += y;
            }
          }
        }

        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    }
  };

  force.initialize = (newNodes: SimNode[]) => (nodes = newNodes);

  return force;
}

export default collide;
