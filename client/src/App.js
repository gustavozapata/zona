import React, { useState } from "react";

import "./App.css";

import Feed from "./components/Feed";

function App() {
  const [showFeed, setShowFeed] = useState(false);

  const handleShowFeed = toggle => {
    setShowFeed(toggle);
  };

  return (
    <div className="App">
      {!showFeed ? (
        <>
          <header>
            <h1>Zona</h1>
          </header>
          <main>
            <h1>
              Welcome
              <br />
              to Zona
            </h1>
            <h2>Who are you?</h2>
            <div>
              <button onClick={() => handleShowFeed(true)}>Sofia</button>
              <button>Andres</button>
              <button>Gustavo</button>
            </div>
          </main>
          <footer>Zanto &copy; 2020</footer>
        </>
      ) : (
        <Feed showFeed={handleShowFeed} />
      )}
    </div>
  );
}

export default App;
