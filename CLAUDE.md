# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive memory visualizer that displays Claude's memory system as a force-directed graph, similar to Obsidian's graph view. The project consists of a React frontend with TypeScript and an Express.js backend that connects to the MCP memory server via Docker.

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Graph Visualization**: react-force-graph-2d (simplified D3.js wrapper)  
- **Backend**: Express.js server acting as MCP proxy
- **Memory Source**: Docker MCP server (`mcp/memory`) connected via stdio transport

### Data Flow
```
Docker MCP Memory Server → Express Proxy (port 3001) → React Frontend (port 3000) → Force Graph Display
```

### Key Architecture Components
- **Server (`server.js`)**: Express proxy connecting to Docker MCP server at `/Users/michaelgumn/Docker/Memory:/app/dist`
- **GraphVisualization**: Main React component using react-force-graph-2d
- **useMemoryData**: Custom hook for data fetching with 5-minute localStorage caching
- **DataTransformer**: Converts MCP entities/relations to graph nodes/links format
- **EntityDetailPanel**: Shows observations and metadata for selected nodes

## Development Commands

```bash
# Development (runs both frontend and backend)
npm run dev:full

# Individual servers
npm run dev        # Frontend only (port 3000)
npm run dev:server # Backend only (port 3001)

# Code Quality
npm run lint       # ESLint
npm run build      # TypeScript compile + Vite build

# Testing
npm run test             # Run Jest test suite
npm run test:watch       # Jest in watch mode  
npm run test:coverage    # Generate coverage report
```

## Testing Strategy

The codebase has comprehensive test coverage:
- **Unit Tests**: All services, hooks, and utilities in `__tests__/` folders
- **Integration Tests**: GraphVisualization component testing
- **Test Setup**: Jest + React Testing Library + jsdom environment
- **Coverage**: Available via `npm run test:coverage`

## Key File Locations

### Core Application
- `src/components/GraphVisualization.tsx` - Main graph display component
- `src/hooks/useMemoryData.ts` - Data fetching and caching logic
- `src/services/dataTransformer.ts` - MCP to graph data conversion
- `src/types/memoryTypes.ts` - TypeScript definitions

### Configuration
- `server.js` - Express server with MCP Docker connection
- `vite.config.ts` - Frontend build config with API proxy setup
- `tailwind.config.js` - Obsidian-inspired dark theme

### Documentation
- `memory-graph-requirements.md` - Complete project requirements
- `mvp-implementation-plan.md` - Detailed implementation guide
- `engineering_principles.md` - KISS/YAGNI/SOLID principles

## MCP Server Integration

The Docker MCP server configuration in `server.js` connects to:
- **Command**: `docker run -i -v /Users/michaelgumn/Docker/Memory:/app/dist --rm mcp/memory`
- **API Endpoints**: `/api/memory/graph`, `/api/memory/node/:id`, `/api/memory/search`
- **Error Handling**: Graceful fallback to sample data when MCP unavailable

## Engineering Principles
- Follow engineering principles in `engineering_principles.md` (KISS/YAGNI/SOLID)
- Prefer editing existing files over creating new ones
- Run `npm run lint` and `npm run build` before committing changes
- All components handle loading/error/success states

