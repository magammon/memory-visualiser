import type { MemoryGraph, GraphData, GraphNode, GraphLink, Entity, Relation } from '../types/memoryTypes';

export class DataTransformer {
  static transformToGraphData(memoryGraph: MemoryGraph): GraphData {
    const nodes = this.createNodes(memoryGraph.entities);
    const links = this.createLinks(memoryGraph.relations);
    
    return { nodes, links };
  }

  private static createNodes(entities: Entity[]): GraphNode[] {
    const nodeColors: Record<string, string> = {
      'person': '#58a6ff',
      'place': '#7c3aed',
      'concept': '#f59e0b',
      'event': '#10b981',
      'default': '#6b7280'
    };

    return entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      observations: entity.observations,
      val: Math.max(5, entity.observations.length), // Node size based on observations
      color: nodeColors[entity.type] || nodeColors.default
    }));
  }

  private static createLinks(relations: Relation[]): GraphLink[] {
    return relations.map(relation => ({
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
    const filteredLinks = data.links.filter(link => 
      nodeIds.has(link.source.toString()) && nodeIds.has(link.target.toString())
    );

    return {
      nodes: topNodes,
      links: filteredLinks
    };
  }
}