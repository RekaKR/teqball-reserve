import React, { useState, useEffect } from 'react'
import './App.scss';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import MyGroups from './components/MyGroups'
import Groups from './components/Groups'
import MyAllEvent from './components/MyAllEvent'
import jwt_decode from 'jwt-decode'

function App() {
  const [user, setUser] = useState("")

  const checkToken = () => {
    const token = localStorage.getItem("token")
    if (token) {
      setUser(jwt_decode(token))
    }
  }

  useEffect(() => {
    checkToken()
  }, [])


  return (
    <div >
      <Router>

        <Route path='/' >
          <Home setUser={setUser} user={user} />
        </Route>

        <Switch>

          <Route path='/login'>
            <Login checkToken={checkToken} />
          </Route>


          <Route path='/groups'>
            <Groups user={user} />
          </Route>

          <Route path='/my-groups'>
            <MyGroups user={user} />
          </Route>

          <Route path='/my-all-event'>
            <MyAllEvent user={user} />
          </Route>

        </Switch>

      </Router >
    </div>
  );
}

export default App;
