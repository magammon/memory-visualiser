import type { MemoryGraph, GraphData, GraphNode, GraphLink, Entity, Relation } from '../types/memoryTypes';

export class DataTransformer {
  static transformToGraphData(memoryGraph: MemoryGraph): GraphData {
    const nodes = this.createNodes(memoryGraph.entities);
    const nodeIds = new Set(nodes.map(n => n.id));
    const links = this.createLinks(memoryGraph.relations, nodeIds);
    
    
    return { nodes, links };
  }

  private static createNodes(entities: Entity[]): GraphNode[] {
    const nodeColors: Record<string, string> = {
      'person': '#58a6ff',
      'place': '#7c3aed',
      'concept': '#f59e0b',
      'event': '#10b981',
      'project': '#e74c3c',
      'preference': '#9b59b6',
      'Reference Guide': '#f39c12',
      'Workflow Guide': '#2ecc71',
      'schema': '#95a5a6',
      'default': '#6b7280'
    };

    return entities.map(entity => {
      // Handle different entity formats from MCP server
      const entityType = (entity as any).entityType || entity.type || 'default';
      const entityId = entity.id || entity.name; // Use name as ID if no ID present
      
      return {
        id: entityId,
        name: entity.name,
        type: entityType,
        observations: entity.observations,
        val: Math.max(5, entity.observations.length), // Node size based on observations
        color: nodeColors[entityType] || nodeColors.default
      };
    });
  }

  private static createLinks(relations: Relation[], nodeIds: Set<string>): GraphLink[] {
    return relations
      .filter(relation => {
        const hasValidNodes = nodeIds.has(relation.from) && nodeIds.has(relation.to);
        return hasValidNodes;
      })
      .map(relation => ({
        source: relation.from,
        target: relation.to,
        type: relation.relationType,
        value: 1 // Default link thickness
      }));
  }

  static optimizeForVisualization(data: GraphData, maxNodes = 100): GraphData {
    if (data.nodes.length <= maxNodes) {
      return data;
    }

    // Sort nodes by importance (number of observations)
    const sortedNodes = [...data.nodes].sort((a, b) => 
      (b.observations?.length || 0) - (a.observations?.length || 0)
    );

    // Keep top N nodes
    const topNodes = sortedNodes.slice(0, maxNodes);
    const nodeIds = new Set(topNodes.map(n => n.id));

    // Filter links to only include those between kept nodes
    const filteredLinks = data.links.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : String(link.source);
      const targetId = typeof link.target === 'string' ? link.target : String(link.target);
      const hasValidNodes = nodeIds.has(sourceId) && nodeIds.has(targetId);
      
      if (!hasValidNodes) {
        console.warn(`Filtered out link: ${sourceId} -> ${targetId} (missing node)`);
      }
      
      return hasValidNodes;
    });

    return {
      nodes: topNodes,
      links: filteredLinks
    };
  }
}