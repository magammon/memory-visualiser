import express from 'express';
import cors from 'cors';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MCP Client instance
let mcpClient = null;
let mcpTransport = null;
let connected = false;

// Configuration - Updated to match your Docker MCP server from Claude Desktop
const MCP_SERVER_CONFIG = {
  command: 'docker',
  args: [
    'run', 
    '-i', 
    '-v', 
    '/Users/michaelgumn/Docker/Memory:/app/dist', 
    '--rm', 
    'mcp/memory'
  ]
};

// Initialize MCP connection
async function initializeMCP() {
  try {
    mcpClient = new Client({
      name: "memory-visualizer-backend",
      version: "1.0.0"
    }, {
      capabilities: {}
    });

    mcpTransport = new StdioClientTransport(MCP_SERVER_CONFIG);
    
    await mcpClient.connect(mcpTransport);
    connected = true;
    
    console.log('✅ Connected to MCP server');
  } catch (error) {
    console.error('❌ Failed to connect to MCP server:', error.message);
    console.error('Make sure your MCP server is running and the configuration is correct');
  }
}

// API Routes
app.get('/api/memory/graph', async (req, res) => {
  if (!connected) {
    return res.status(503).json({
      error: 'MCP server not connected',
      message: 'The memory server is not available. Please check if it\'s running.'
    });
  }

  try {
    const result = await mcpClient.callTool({
      name: "read_graph",
      arguments: {}
    });

    const content = result.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from MCP server');
    }

    const graphData = JSON.parse(content.text);
    res.json(graphData);
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({
      error: 'Failed to fetch graph data',
      message: error.message
    });
  }
});

app.get('/api/memory/node/:nodeId', async (req, res) => {
  if (!connected) {
    return res.status(503).json({
      error: 'MCP server not connected'
    });
  }

  try {
    const result = await mcpClient.callTool({
      name: "open_nodes",
      arguments: { node_id: req.params.nodeId }
    });

    const content = result.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from MCP server');
    }

    const nodeData = JSON.parse(content.text);
    res.json(nodeData);
  } catch (error) {
    console.error('Error fetching node details:', error);
    res.status(500).json({
      error: 'Failed to fetch node details',
      message: error.message
    });
  }
});

app.get('/api/memory/search', async (req, res) => {
  if (!connected) {
    return res.status(503).json({
      error: 'MCP server not connected'
    });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({
      error: 'Query parameter is required'
    });
  }

  try {
    const result = await mcpClient.callTool({
      name: "search_nodes",
      arguments: { query }
    });

    const content = result.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from MCP server');
    }

    const searchResults = JSON.parse(content.text);
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching nodes:', error);
    res.status(500).json({
      error: 'Failed to search nodes',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mcpConnected: connected,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  if (mcpClient && connected) {
    await mcpClient.close();
  }
  process.exit(0);
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('Initializing MCP connection...');
  
  await initializeMCP();
});