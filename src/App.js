import React, { useState, Suspense, lazy } from 'react';
import './App.css';
import { AtlasProvider } from './context';

// Lazy load components
const ItemSearch = lazy(() => import('./components/ItemSearch'));
const RecipeList = lazy(() => import('./components/RecipeList'));

// Loading component
const LoadingFallback = () => (
  <div className="loading-fallback">
    <p>Loading...</p>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('search'); // 'search' or 'recipes'

  return (
    <AtlasProvider>
      <div className="App">
        <main className="app-container">
          <header className="app-header">
            <h1 className="wiki-title">Survival Reimagined Wiki</h1>
          </header>
          <div className="main-content">
            <div className="tab-navigation">
              <button
                className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
                onClick={() => setActiveTab('search')}
              >
                Item Search
              </button>
              <button
                className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
                onClick={() => setActiveTab('recipes')}
              >
                Crafting
              </button>
            </div>
            <div className="content-area">
              <Suspense fallback={<LoadingFallback />}>
                <div style={{ display: activeTab === 'search' ? 'block' : 'none' }}>
                  <ItemSearch />
                </div>
                <div style={{ display: activeTab === 'recipes' ? 'block' : 'none' }}>
                  <RecipeList />
                </div>
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </AtlasProvider>
  );
}

export default App;
