import React from "react";
import "./App.css";

import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Content from "./components/Content";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Content />
      <SideBar />
      <Footer />
    </div>
  );
}

export default App;
