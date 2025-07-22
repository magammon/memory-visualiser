import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text">
      <header className="bg-obsidian-surface border-b border-obsidian-border p-4">
        <h1 className="text-xs font-bold">Memory Graph Visualizer</h1>
      </header>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};