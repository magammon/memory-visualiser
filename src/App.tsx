import React from 'react';
import { Layout } from './components/Layout';
import { GraphVisualization } from './components/GraphVisualization';
import './styles/globals.css';

function App() {
  return (
    <Layout>
      <div className="h-full">
        <GraphVisualization />
      </div>
    </Layout>
  );
}

export default App
