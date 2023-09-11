import { SimulationNodeDatum, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';
import { Node, useReactFlow, useStore } from 'reactflow';
import { ThoughtData, WidgetType } from '../components/ThoughtNode';
import collide from './helpers/collide.ts';
import { useMemo } from 'react';

const simulation_duration_ms = 4000;
const view_fit_padding = 0.1;

export type SimNode = Node<ThoughtData, WidgetType> & SimulationNodeDatum;

const simulation = forceSimulation()
  .force('charge', forceManyBody().strength(-1300))
  // .force('link', forceLink().distance(10))
  .force('x', forceX().x(0).strength(0.04))
  .force('y', forceY().y(0).strength(0.04))
  .force('collide', collide())
  .alphaTarget(0.05)
  .stop();

type Props = {
  shouldUpdateLayout: boolean
  setShouldUpdateLayout: React.Dispatch<React.SetStateAction<boolean>>
  updateMemo: () => void
}
function useLayoutElements({ shouldUpdateLayout, setShouldUpdateLayout, updateMemo }: Props): [boolean, { startForceSim: () => void }] {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const initialized = useStore((store) =>
    [...store.nodeInternals.values()].every((node) => node.width && node.height)
  );

  return useMemo(() => {
    const nodes = getNodes().map((node) => ({ ...node, x: node.position.x, y: node.position.y }));
    const edges = getEdges().map((edge) => edge);
    let running = false;

    // If React Flow hasn't initialized our nodes with a width and height yet, or
    // if there are no nodes in the flow, then we can't run the simulation!
    if (!initialized || nodes.length === 0) return [false, { startForceSim: () => undefined }];

    simulation.nodes(nodes).force(
      'link',
      forceLink(edges)
        .id((d) => {
          if ('id' in d) {
            return d.id as string;
          }
          return '';
        })
        .strength(0.05)
        .distance(100)
    );

    let shouldFitView = true

    // The tick function is called every animation frame while the simulation is
    // running and progresses the simulation one step forward each time.
    const tick = () => {

      document.addEventListener('mousedown', () => {
        shouldFitView = false;
      }, { capture: true, once: true });

      getNodes().forEach((node, i) => {
        const dragging = Boolean(document.querySelector(`[data-id="${node.id}"].dragging`));

        // Setting the fx/fy properties of a node tells the simulation to "fix"
        // the node at that position and ignore any forces that would normally
        // cause it to move.
        nodes[i] = Object.assign(nodes[i], {
          fx: dragging ? node.position.x : null,
          fy: dragging ? node.position.y : null,
        });
      });

      simulation.tick();
      setNodes(nodes.map((node) => ({ ...node, position: { x: node.x, y: node.y } })));

      window.requestAnimationFrame(() => {
        // Give React and React Flow a chance to update and render the new node
        // positions before we fit the viewport to the new layout.
        if (shouldFitView) {
          fitView({ padding: view_fit_padding });
        }

        // If the simulation hasn't be stopped, schedule another tick.
        if (running) tick();
      });
    };

    const startForceSim = () => {
      running = true;
      window.requestAnimationFrame(tick);

      setTimeout(() => {
        running = false;
      }, simulation_duration_ms);
    };

    if (shouldUpdateLayout) {
      startForceSim();
      setTimeout(() => {
        setShouldUpdateLayout(false);
      }, simulation_duration_ms + 1);
    }

    return [true, { startForceSim }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateMemo, getNodes, getEdges, initialized, setNodes, fitView, shouldUpdateLayout, setShouldUpdateLayout]);
}

export default useLayoutElements;