import React, { useState, useEffect } from 'react'
import axios from 'axios'

function MyGroup({ user, group, setNewRoleResponse }) {
    const [isAdmin, setIsAdmin] = useState()

    useEffect(() => {
        group.members.find(mem => mem.googleId === user.google).groupRole === "admin"
            ? setIsAdmin(true)
            : setIsAdmin(false)
    }, [])

    const changeRole = (e, googleId) => {
        const newRole = e.target.checked ? "admin" : "member"
        axios
            .post("http://localhost:5000/api/groups/update-member", {
                groupId: group._id,
                googleId: googleId,
                groupRole: newRole
            })
            .then(res => setNewRoleResponse(res.data))
    }

    return (
        <div className="group">
            <p>{group.name}</p>
            <p>Members:</p>
            <div>
                {group.members.map((member, index) =>
                    <div key="index" className="member">
                        <img src={member.picture} alt="profile" className="profile-picture" />
                        <p>{member.name}</p>
                        <p>{member.groupRole}</p>
                        {
                            isAdmin &&
                            <div>
                                <label htmlFor="admin">Admin role: </label>
                                <input type="checkbox" name="admin" id="admin"
                                    defaultChecked={member.groupRole === "admin" ? true : false}
                                    onChange={(e) => changeRole(e, member.googleId)}
                                    disabled={group.creator === user.google &&
                                        member.googleId === user.google
                                        ? true : false}
                                />
                            </div>
                        }
                    </div>
                )}
            </div>
            {
                isAdmin && <button>Create new event</button>
            }
        </div>


    )
}

export default MyGroup
