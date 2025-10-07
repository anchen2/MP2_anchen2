import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';  
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <h1>Who's That Pink-e-mon!</h1>
      <h3 className="subheading">Discover the world of pink Pokémon!</h3>
      <div className="App">
        <nav className="navbar">
          <Link to="/">List</Link> |{""}
          <Link to="/gallery">Gallery</Link>{""}
        </nav>

        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:id" element={<DetailView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
