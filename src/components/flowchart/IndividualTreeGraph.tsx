import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useStoryStore } from '@/stores/storyStore';

interface IndividualTreeGraphProps {
  rootEntityId: string;
}

interface NodeData extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  radius: number;
  isRoot: boolean;
}

interface LinkData extends d3.SimulationLinkDatum<NodeData> {
  id: string;
  source: string | NodeData;
  target: string | NodeData;
  type: string;
  label: string;
}

export function IndividualTreeGraph({ rootEntityId }: IndividualTreeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { entities, relationships } = useStoryStore();

  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const { nodes, links } = useMemo(() => {
    // 1. Find all relationships connected to rootEntityId
    const directRels = relationships.filter(r => r.fromEntityId === rootEntityId || r.toEntityId === rootEntityId);
    
    // 2. Gather all unique node IDs
    const connectedIds = new Set<string>();
    connectedIds.add(rootEntityId);
    directRels.forEach(r => {
      connectedIds.add(r.fromEntityId);
      connectedIds.add(r.toEntityId);
    });

    // 3. Map to NodeData
    const nodes: NodeData[] = [];
    connectedIds.forEach(id => {
      const e = entities.find(ent => ent.id === id);
      if (e) {
        nodes.push({
          id: e.id,
          name: e.name,
          type: e.type,
          radius: id === rootEntityId ? 28 : 16, // Center node is larger
          isRoot: id === rootEntityId
        });
      }
    });

    // 4. Map to LinkData
    const links: LinkData[] = directRels.map(r => ({
      id: r.id,
      source: r.fromEntityId,
      target: r.toEntityId,
      type: r.type,
      label: r.type.replace(/_/g, ' ')
    }));

    return { nodes, links };
  }, [rootEntityId, entities, relationships]);

  const getColor = (type: string, isRoot: boolean) => {
    if (isRoot) return '#D4995A'; // Amber
    const t = type.toLowerCase();
    if (t === 'character') return '#8FA88A'; // Sage
    if (t === 'faction' || t === 'race' || t === 'varna') return '#C66B5E'; // Clay
    return '#3A3834'; // Default subtle
  };

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = dimensions.width;
    const height = dimensions.height;

    const simNodes = nodes.map(d => Object.create(d));
    const simLinks = links.map(d => Object.create(d));

    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(simLinks).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius((d: any) => d.radius + 20));

    const g = svg.append('g');

    // Zoom setup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (e) => {
        g.attr('transform', e.transform);
      });
    svg.call(zoom);
    // Initial slight zoom out if needed, but centering is usually fine
    svg.call(zoom.transform, d3.zoomIdentity.translate(width/2, height/2).scale(0.9).translate(-width/2, -height/2));

    // Edges
    const link = g.append('g')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', '#A89B8E')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Edge Labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(simLinks)
      .join('text')
      .attr('font-size', '9px')
      .attr('fill', '#A89B8E')
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .text((d: any) => d.label);

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .call(d3.drag<any, any>()
        .on('start', (e, d) => {
          if (!e.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (e, d) => {
          d.fx = e.x;
          d.fy = e.y;
        })
        .on('end', (e, d) => {
          if (!e.active) simulation.alphaTarget(0);
          if (!d.isRoot) { // Don't unpin the root!
            d.fx = null;
            d.fy = null;
          }
        })
      );

    // Root node stays in the center
    const rootNode = simNodes.find(n => n.isRoot);
    if (rootNode) {
      rootNode.fx = width / 2;
      rootNode.fy = height / 2;
    }

    node.each(function(d: any) {
      const el = d3.select(this);
      
      el.append('circle')
        .attr('r', d.radius)
        .attr('fill', getColor(d.type, d.isRoot))
        .attr('stroke', d.isRoot ? '#E8E2D5' : '#1A1814')
        .attr('stroke-width', d.isRoot ? 3 : 2);

      el.append('text')
        .text(d.name)
        .attr('y', d.radius + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#E8E2D5')
        .attr('font-size', d.isRoot ? '12px' : '10px')
        .attr('font-weight', d.isRoot ? 'bold' : 'normal')
        .attr('pointer-events', 'none');
    });

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 4);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, dimensions]);

  if (nodes.length <= 1) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-ghost p-8 text-center bg-surface rounded-xl border border-subtle">
        This entry has no direct relationships yet. Add connections in the Relationships tab to see the flowchart.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px] bg-surface rounded-xl border border-subtle relative overflow-hidden">
      <svg ref={svgRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-3 left-3 bg-base/80 backdrop-blur px-2 py-1 rounded text-xs text-ghost border border-subtle pointer-events-none">
        Scroll to zoom. Drag to pan/rearrange.
      </div>
    </div>
  );
}
