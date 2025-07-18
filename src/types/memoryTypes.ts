// MCP Memory Server Response Types
export interface Entity {
  id?: string;
  name: string;
  type?: string;
  entityType?: string;
  observations: string[];
}

export interface Relation {
  from: string;
  to: string;
  relationType: string;
}

export interface MemoryGraph {
  entities: Entity[];
  relations: Relation[];
}

// React Force Graph Compatible Types
export interface GraphNode {
  id: string;
  name: string;
  type: string;
  observations: string[];
  val?: number; // Node size
  color?: string; // Node color
  x?: number; // Node position
  y?: number; // Node position
}

export interface GraphLink {
  source: string;
  target: string;
  type: string;
  value?: number; // Link thickness
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Error Types
export class ApiError extends Error {
  code?: string;
  timestamp: number;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.timestamp = Date.now();
  }
}