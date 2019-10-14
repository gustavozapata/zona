import React from 'react';
import './App.css';

import Header from './components/Header';
import SideBar from './components/SideBar';
import Content from './components/Content';

function App() {
  return (
    <div className="App">
      <Header />
      <div id="page">
        <SideBar />
        <Content />
      </div>
    </div>
  );
}

export default App;
