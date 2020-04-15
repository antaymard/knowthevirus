import React from 'react';
import './App.css';

import { Switch, Route } from "react-router-dom"
import MainPage from './pages/MainPage';
import Header from './components/header/Header';
import SimulationPage from './pages/SimulationPage';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Switch>
          <Route exact path='/'>
            <MainPage />
          </Route>
          <Route exact path='/simulation'>
            <SimulationPage />
          </Route>
          <Route path='/:country'>
            <h1>Country</h1>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
