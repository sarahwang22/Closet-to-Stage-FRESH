import React from 'react'
import {withFirebase} from '../Firebase'

const SignOutButton = (props) =>{ //can also put ({firebase})

    return(
        <div>
            <button onClick={()=>{props.firebase.doSignOut(); console.log("hi")}}> 
                SignOut
            </button>
        </div>
    )
}

export default withFirebase(SignOutButton)