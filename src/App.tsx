import { Layout } from './components/Layout';
import { GraphVisualization } from './components/GraphVisualization';

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
