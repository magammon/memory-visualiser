import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import type { MemoryGraph, Entity } from '../types/memoryTypes';
import { ApiError } from '../types/memoryTypes';

export class MemoryClient {
  private client: Client;
  private transport: StdioClientTransport | null = null;
  private connected = false;

  constructor() {
    this.client = new Client({
      name: "memory-visualizer",
      version: "1.0.0"
    }, {
      capabilities: {}
    });
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    
    try {
      // Configure transport for memory server
      this.transport = new StdioClientTransport({
        command: "node",
        args: ["memory-server.js"] // Adjust path as needed
      });

      await this.client.connect(this.transport);
      this.connected = true;
    } catch (error) {
      throw new ApiError(`Failed to connect to MCP server: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFullGraph(): Promise<MemoryGraph> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      const result = await this.client.callTool({
        name: "read_graph",
        arguments: {}
      });

      // Parse MCP response
      const content = (result.content as { type: string; text: string }[])[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format');
      }

      const graphData = JSON.parse(content.text);
      return {
        entities: graphData.entities || [],
        relations: graphData.relations || []
      };
    } catch (error) {
      throw new ApiError(`Failed to fetch graph data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getNodeDetails(nodeId: string): Promise<Entity> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      const result = await this.client.callTool({
        name: "open_nodes",
        arguments: { node_id: nodeId }
      });

      const content = (result.content as { type: string; text: string }[])[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format');
      }

      return JSON.parse(content.text);
    } catch (error) {
      throw new ApiError(`Failed to get node details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchNodes(query: string): Promise<Entity[]> {
    if (!this.connected) {
      await this.connect();
    }

    try {
      const result = await this.client.callTool({
        name: "search_nodes",
        arguments: { query }
      });

      const content = (result.content as { type: string; text: string }[])[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response format');
      }

      return JSON.parse(content.text);
    } catch (error) {
      throw new ApiError(`Failed to search nodes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.transport) {
      await this.client.close();
      this.transport = null;
      this.connected = false;
    }
  }
}

// Export singleton instance
export const memoryClient = new MemoryClient();