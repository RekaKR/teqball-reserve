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
    <div className="header">
      {
        user
          ? <>
            <button onClick={logout}>
              <Link to='/'>
                Logout
              </Link>
            </button>

            <button>
              <Link to='/groups'>
                Groups
              </Link>
            </button>

            <button>
              <Link to='/my-groups'>
                My groups
              </Link>
            </button>

            <button>
              <Link to='/my-all-event'>
                My all event
              </Link>
            </button>

            <span>Logged in as {user.name}</span>
          </>

          : <button onClick={googleSignIn}>
            Login
          </button>
      }
    </div>
  )
}

export default Home
