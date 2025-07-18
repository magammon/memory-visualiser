import React, { useRef, useCallback, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useMemoryData } from '../hooks/useMemoryData';
import type { GraphNode, GraphLink } from '../types/memoryTypes';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { EntityDetailPanel } from './EntityDetailPanel';

export const GraphVisualization: React.FC = () => {
  const { data, loading, error, refetch } = useMemoryData();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const graphRef = useRef<any>();

  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(node);
  }, []);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoveredNode(node);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const getNodeLabel = useCallback((node: GraphNode) => {
    return `${node.name} (${node.type})`;
  }, []);

  const getLinkLabel = useCallback((link: GraphLink) => {
    return link.type;
  }, []);

  // Custom node rendering
  const nodeCanvasObject = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    
    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, node.val! * 0.5, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color || '#58a6ff';
    ctx.fill();
    
    // Add border for selected/hovered nodes
    if (selectedNode?.id === node.id || hoveredNode?.id === node.id) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 / globalScale;
      ctx.stroke();
    }
    
    // Draw label
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(label, node.x!, node.y! + (node.val! * 0.5) + fontSize + 2);
  }, [selectedNode, hoveredNode]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-obsidian-text">No graph data available</p>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main graph area */}
      <div className="flex-1 relative">
        <ForceGraph2D
          ref={graphRef}
          graphData={data}
          nodeId="id"
          nodeLabel={getNodeLabel}
          nodeColor={(node: GraphNode) => node.color || '#58a6ff'}
          nodeVal={(node: GraphNode) => node.val || 5}
          linkLabel={getLinkLabel}
          linkColor={() => '#404040'}
          linkWidth={1}
          backgroundColor="#0d1117"
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          onBackgroundClick={handleBackgroundClick}
          nodeCanvasObject={nodeCanvasObject}
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          enableNodeDrag={true}
          width={undefined} // Auto-size
          height={undefined} // Auto-size
        />
        
        {/* Graph info overlay */}
        <div className="absolute top-4 left-4 bg-obsidian-surface border border-obsidian-border rounded-lg p-3">
          <div className="text-sm text-obsidian-text">
            <p>Nodes: {data.nodes.length}</p>
            <p>Links: {data.links.length}</p>
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selectedNode && (
        <EntityDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
};