import React, { useState, useEffect } from 'react'
import './style/style.scss';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import MyGroups from './components/MyGroups'
import Groups from './components/Groups'
import MyAllEvent from './components/MyAllEvent'
import jwt_decode from 'jwt-decode'

function App() {
  const [user, setUser] = useState("")

  const getToken = () => {
    return {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  }

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
    <div className="app">
      <Router>

        <Route path='/' >
          <Home setUser={setUser} user={user} />
        </Route>

        <Switch>

          <Route path='/login'>
            <Login checkToken={checkToken} />
          </Route>


          <Route path='/groups'>
            {
              user
                ? <Groups user={user} getToken={getToken} />
                : <Redirect to='/' />
            }
          </Route>

          <Route path='/my-groups'>
            {
              user
                ? <MyGroups user={user} getToken={getToken} />
                : <Redirect to='/' />
            }
          </Route>

          <Route path='/my-all-event'>
            {
              user
                ? <MyAllEvent user={user} getToken={getToken} />
                : <Redirect to='/' />
            }
          </Route>

        </Switch>

      </Router >
    </div>
  );
}

export default App;
