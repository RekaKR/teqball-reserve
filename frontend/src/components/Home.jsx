import React from 'react'
import { Link } from 'react-router-dom'

function Home({ setUser, user }) {

  const logout = () => {
    localStorage.removeItem("token")
    setUser("")
  }

  const googleSignIn = async () => {
    const response = await fetch("http://localhost:5000/api/login")
    const serverResponse = await response.json()

    window.location.href = serverResponse.url
  }

  return (
    <div>

      {
        !user &&
        <button onClick={googleSignIn}>
          Login
        </button>
      }

      {
        user &&
        <button onClick={logout}>
          <Link to='/'>
            Logout
          </Link>
        </button>
      }

      {
        user &&
        <button>
          <Link to='/groups'>
            Groups
          </Link>
        </button>
      }

      {
        user &&
        <button>
          <Link to='/my-groups'>
            My groups
          </Link>
        </button>
      }

      {
        user &&
        <button>
          <Link to='/my-all-event'>
            My all event
          </Link>
        </button>
      }

      {
        user &&
        <span>Logged in as {user.name}</span>
      }
    </div>
  )
}

export default Home
