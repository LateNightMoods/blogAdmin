import React from 'react';
import {
  BrowserRouter as Router
} from 'react-router-dom';
import 'reset-css';
import './App.css';
import Home from './layout/Home/index';


function App() {
  return (
    <Router>
      <Home />
    </Router>
  )
}

export default App
