import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StickerGrid from './components/StickerGrid';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Rubik Sticker Collection</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<StickerGrid />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 