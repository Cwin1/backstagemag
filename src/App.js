import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './page/login/Login';
import Admin from './page/admin/Admin'

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/' component={Admin}></Route>
      </Switch>
    </Router>
  );
}

export default App;
