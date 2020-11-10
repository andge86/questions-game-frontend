import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import GamesPage from './GamesPage';
import GameFlowPage from './GameFlowPage';

import FinalStatisticsPage from './FinalStatisticsPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage}/>
        <Route path="/GamesPage" component={GamesPage}/>
        <Route path="/GameFlowPage" component={GameFlowPage}/>
        <Route path="/FinalStatisticsPage" component={FinalStatisticsPage}/>
      </Switch>
    </Router>
  );
}

export default App;
