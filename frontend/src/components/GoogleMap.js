import React from 'react'

function GoogleMap({setShowMap, venue}) {
    return (
        <div>
            Itt a térkép
            <button onClick={() => setShowMap(false)}>Bezár</button>
        </div>
    )
}

export default GoogleMap
