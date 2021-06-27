import React from 'react'
import { Link } from 'react-router-dom'



function Home({ setUser, user }) {
    
    const logout = () => {
        localStorage.removeItem("token")
        setUser("")
    }

     const googleSignIn = () => {
        window.location.href =
          "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&prompt=select_account&client_id=645622545318-54bkra0rued7ajsn83sj3rdh0nik2fk9.apps.googleusercontent.com&scope=openid%20profile email&redirect_uri=http%3A//localhost:3000/login"
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
                <span>Logged in as {user.name}</span>
            }
        </div>
    )
}

export default Home
