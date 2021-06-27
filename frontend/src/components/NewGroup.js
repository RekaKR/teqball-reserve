import React, { useState } from 'react'
import axios from 'axios'

function NewGroup({ setIsNewGroup, user }) {
    const [name, setName] = useState("")

    const createNewGroup = () => {
        const newGroup = {
            name: name,
            members: [
                {
                    googleId: user.google,
                    name: user.name,
                    groupRole: "member",
                    picture: user.picture
                }
            ]
        }

        axios
        .post("http://localhost:5000/api/groups", newGroup)
        .then((res) => {
            setIsNewGroup(false)
        })
        .catch(error => console.log(error))
    }

    return (
        <div>
            <div>
                <label htmlFor="name">Group name: </label>
                <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <button onClick={createNewGroup}>Create</button>
            </div>
        </div>
    )
}

export default NewGroup
