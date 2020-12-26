import React from 'react'
import {withAuthorization} from '../Session'

import * as ROLES from '../../constants/roles'

const HomePage =() =>{
    return(
        <div>
            <h1>Home Page</h1>
            <p> The Home Page is accessible by every signed-in user</p>
        </div>
    )
}

const condition = authUser => !!authUser

//!! authUser, this means authUser=> !=null, or authUser is not null

export default withAuthorization(condition)(HomePage)